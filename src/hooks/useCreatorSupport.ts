import React, { useState, useCallback } from "react";

export interface UseCreatorSupportReturn {
  paypalLink: string;
  tempPaypalLink: string;
  setTempPaypalLink: (link: string) => void;
  isEditingPaypalLink: boolean;
  setIsEditingPaypalLink: (editing: boolean) => void;
  copiedPaypalLink: boolean;
  copyPaypalLink: (onNotify?: (msg: string) => void) => void;
  handleSavePaypalLink: (e: React.FormEvent, onNotify?: (msg: string) => void) => void;
  savePaypalLink: (newLink: string, onNotify?: (msg: string) => void) => void;
}

const DEFAULT_PAYPAL_URL = "https://www.paypal.com/ncp/payment/LGMWY6D9AAFDW";
const STORAGE_KEY = "robo_paypal_link";

export function useCreatorSupport(): UseCreatorSupportReturn {
  const [paypalLink, setPaypalLink] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_PAYPAL_URL;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved !== "https://www.paypal.me" && saved !== "https://www.paypal.me/") {
      return saved;
    }
    return DEFAULT_PAYPAL_URL;
  });

  const [isEditingPaypalLink, setIsEditingPaypalLink] = useState(false);
  const [tempPaypalLink, setTempPaypalLink] = useState(paypalLink);
  const [copiedPaypalLink, setCopiedPaypalLink] = useState(false);

  const copyPaypalLink = useCallback(
    (onNotify?: (msg: string) => void) => {
      void navigator.clipboard.writeText(paypalLink);
      setCopiedPaypalLink(true);
      onNotify?.("Copied PayPal link to clipboard!");
      setTimeout(() => { setCopiedPaypalLink(false); }, 2000);
    },
    [paypalLink]
  );

  const handleSavePaypalLink = useCallback(
    (e: React.FormEvent, onNotify?: (msg: string) => void) => {
      e.preventDefault();
      let clean = tempPaypalLink.trim();
      if (!clean) clean = DEFAULT_PAYPAL_URL;
      if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
        clean = `https://${clean}`;
      }
      setPaypalLink(clean);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, clean);
      }
      setIsEditingPaypalLink(false);
      onNotify?.("Updated PayPal link!");
    },
    [tempPaypalLink]
  );

  const savePaypalLink = useCallback(
    (newLink: string, onNotify?: (msg: string) => void) => {
      let clean = newLink.trim();
      if (!clean) clean = DEFAULT_PAYPAL_URL;
      if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
        clean = `https://${clean}`;
      }
      setPaypalLink(clean);
      setTempPaypalLink(clean);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, clean);
      }
      setIsEditingPaypalLink(false);
      onNotify?.("Updated PayPal link!");
    },
    []
  );

  return {
    paypalLink,
    tempPaypalLink,
    setTempPaypalLink,
    isEditingPaypalLink,
    setIsEditingPaypalLink,
    copiedPaypalLink,
    copyPaypalLink,
    handleSavePaypalLink,
    savePaypalLink
  };
}
