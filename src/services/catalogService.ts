import {
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot,
  query,
  limit
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { HardwareComponent } from "../types";
import { SUPPLIER_CATALOG } from "../data";

export const CURRENT_CATALOG_VERSION = "2.4.0";

export interface ManagedCatalogItem extends HardwareComponent {
  version?: string;
  inStock?: boolean;
  leadTimeDays?: number;
  lastVerifiedAt?: string;
}

let memoryCatalogCache: HardwareComponent[] = [...SUPPLIER_CATALOG];
let isCatalogSeeded = false;

/**
 * Retrieves the hardware catalog with live Firestore synchronization and local fallback
 */
export async function fetchManagedCatalog(): Promise<HardwareComponent[]> {
  try {
    const catalogColl = collection(db, "hardwareCatalog");
    const snapshot = await getDocs(query(catalogColl, limit(200)));

    if (!snapshot.empty) {
      const items: HardwareComponent[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as HardwareComponent);
      });
      if (items.length > 0) {
        memoryCatalogCache = items;
        return items;
      }
    }
  } catch (error) {
    console.info("Firestore catalog fetch fallback to local seed:", error);
  }

  return memoryCatalogCache;
}

/**
 * Subscribes to live catalog changes from Firestore
 */
export function subscribeToManagedCatalog(
  callback: (items: HardwareComponent[]) => void
): () => void {
  try {
    const catalogColl = collection(db, "hardwareCatalog");
    const unsubscribe = onSnapshot(
      catalogColl,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: HardwareComponent[] = [];
          snapshot.forEach((d) => {
            items.push(d.data() as HardwareComponent);
          });
          if (items.length > 0) {
            memoryCatalogCache = items;
            callback(items);
            return;
          }
        }
        callback(memoryCatalogCache);
      },
      (error) => {
        console.warn("Catalog subscription error, serving local cache:", error);
        callback(memoryCatalogCache);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn("Failed to attach catalog snapshot listener:", err);
    callback(memoryCatalogCache);
    return () => {};
  }
}

/**
 * Seeds or updates seed hardware items into Firestore with version tag
 */
export async function seedCatalogToFirestore(): Promise<void> {
  if (isCatalogSeeded) return;
  try {
    const catalogColl = collection(db, "hardwareCatalog");
    const snapshot = await getDocs(query(catalogColl, limit(5)));
    
    // Only seed if collection is unpopulated
    if (snapshot.size === 0) {
      const batchPromises = SUPPLIER_CATALOG.map((item) => {
        const itemDoc = doc(catalogColl, item.id);
        const payload: ManagedCatalogItem = {
          ...item,
          version: CURRENT_CATALOG_VERSION,
          inStock: true,
          leadTimeDays: item.isNatoAligned ? 3 : 7,
          lastVerifiedAt: new Date().toISOString()
        };
        return setDoc(itemDoc, payload, { merge: true });
      });

      await Promise.all(batchPromises);
      isCatalogSeeded = true;
      console.log(`Successfully seeded ${SUPPLIER_CATALOG.length} hardware components to Firestore catalog (v${CURRENT_CATALOG_VERSION})`);
    } else {
      isCatalogSeeded = true;
    }
  } catch (err) {
    console.warn("Error checking or seeding Firestore catalog:", err);
  }
}

/**
 * Updates supplier metadata for an existing catalog item (e.g. price change, stock status)
 */
export async function updateCatalogItemSupplierMeta(
  itemId: string,
  updates: Partial<ManagedCatalogItem>
): Promise<boolean> {
  try {
    const itemDoc = doc(db, "hardwareCatalog", itemId);
    await setDoc(
      itemDoc,
      {
        ...updates,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error("Failed to update catalog item metadata:", err);
    return false;
  }
}
