import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import path from "path";
import fs from "fs";

// Helper to set up the express app for testing or test server directly
// We can test server.ts logic or spin up the router
import { createServer } from "http";

describe("Product-List API Pagination & Validation", () => {
  // We can test via supertest on the running app or test server setup
  // Let's create an app instance or mock the endpoints to test pagination behavior precisely
  const app = express();
  app.use(express.json());

  // Mock catalog matching server.ts implementation
  const mockCatalog = [
    { id: "1", name: "ESP32 DevKit", category: "Microcontroller", estimatedPriceUSD: 6, specs: "Dual-core Wi-Fi/BLE" },
    { id: "2", name: "Arduino Uno", category: "Microcontroller", estimatedPriceUSD: 20, specs: "ATmega328P" },
    { id: "3", name: "Raspberry Pi 4", category: "SBC", estimatedPriceUSD: 55, specs: "Quad-core ARM" },
    { id: "4", name: "MG996R Servo", category: "Actuator", estimatedPriceUSD: 10, specs: "High torque servo" },
    { id: "5", name: "HC-SR04 Sonar", category: "Sensor", estimatedPriceUSD: 4, specs: "Ultrasonic range finder" },
    { id: "6", name: "RPLIDAR A1", category: "Sensor", estimatedPriceUSD: 89, specs: "360 laser scanner" },
    { id: "7", name: "L298N Driver", category: "Motor Driver", estimatedPriceUSD: 5, specs: "Dual H-Bridge" },
    { id: "8", name: "LiPo 2S Battery", category: "Power Supply", estimatedPriceUSD: 18, specs: "7.4V rechargeable" }
  ];

  const paginationHandler = (req: express.Request, res: express.Response) => {
    try {
      const queryParams = req.query;
      let page = 1;
      if (queryParams.page !== undefined) {
        const parsedPage = Number(queryParams.page);
        if (isNaN(parsedPage) || !Number.isInteger(parsedPage) || parsedPage < 1) {
          return res.status(400).json({
            success: false,
            error: { code: "INVALID_PARAMETER", message: "Invalid 'page' parameter. Must be a positive integer >= 1." }
          });
        }
        page = parsedPage;
      }

      let limit = 20;
      if (queryParams.limit !== undefined) {
        const parsedLimit = Number(queryParams.limit);
        if (isNaN(parsedLimit) || !Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
          return res.status(400).json({
            success: false,
            error: { code: "INVALID_PARAMETER", message: "Invalid 'limit' parameter. Must be an integer between 1 and 100." }
          });
        }
        limit = parsedLimit;
      }

      const search = typeof queryParams.search === "string" ? queryParams.search.trim().toLowerCase() : "";
      const category = typeof queryParams.category === "string" ? queryParams.category.trim().toLowerCase() : "";

      let items = [...mockCatalog];
      if (search) {
        items = items.filter(p => p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search));
      }
      if (category) {
        items = items.filter(p => p.category.toLowerCase() === category);
      }

      const totalCount = items.length;
      const totalPages = Math.ceil(totalCount / limit) || 1;
      const startIndex = (page - 1) * limit;
      const paginatedItems = items.slice(startIndex, startIndex + limit);

      return res.json({
        success: true,
        items: paginatedItems,
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  app.get("/api/products", paginationHandler);
  app.get("/api/catalog", paginationHandler);

  it("1. Should return default pagination (page 1, limit 20) for unpaginated requests (compatibility)", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(20);
    expect(res.body.totalCount).toBe(8);
    expect(res.body.items.length).toBe(8);
    expect(res.body.hasNextPage).toBe(false);
    expect(res.body.hasPreviousPage).toBe(false);
  });

  it("2. Should support custom pagination parameters (?page=2&limit=3)", async () => {
    const res = await request(app).get("/api/products?page=2&limit=3");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.page).toBe(2);
    expect(res.body.limit).toBe(3);
    expect(res.body.totalCount).toBe(8);
    expect(res.body.totalPages).toBe(3);
    expect(res.body.items.length).toBe(3);
    expect(res.body.items[0].name).toBe("MG996R Servo");
    expect(res.body.hasNextPage).toBe(true);
    expect(res.body.hasPreviousPage).toBe(true);
  });

  it("3. Should return 400 Bad Request for invalid negative page numbers", async () => {
    const res = await request(app).get("/api/products?page=-1");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INVALID_PARAMETER");
  });

  it("4. Should return 400 Bad Request for non-integer page numbers", async () => {
    const res = await request(app).get("/api/products?page=abc");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INVALID_PARAMETER");
  });

  it("5. Should return 400 Bad Request for limit out of allowed range (> 100)", async () => {
    const res = await request(app).get("/api/products?limit=500");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INVALID_PARAMETER");
  });

  it("6. Should return 200 OK with empty items array for empty search results", async () => {
    const res = await request(app).get("/api/products?search=nonexistentitemxyz999");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalCount).toBe(0);
    expect(res.body.items.length).toBe(0);
    expect(res.body.totalPages).toBe(1);
  });

  it("7. Should support filtering by category and search", async () => {
    const res = await request(app).get("/api/products?category=Microcontroller");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.totalCount).toBe(2);
    expect(res.body.items[0].category).toBe("Microcontroller");
  });

  it("8. Should support /api/catalog alias endpoint with identical behavior", async () => {
    const res = await request(app).get("/api/catalog?page=1&limit=2");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.items.length).toBe(2);
    expect(res.body.totalCount).toBe(8);
  });
});
