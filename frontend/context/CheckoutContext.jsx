"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { DEFAULT_SHIPPING_METHOD } from "@/lib/checkoutConstants";

// Holds the in-progress checkout state (contact info, shipping
// address, delivery method, applied voucher) as the person moves
// from Cart → Checkout → Payment. This is intentionally separate
// from CartContext (which only owns cart line items) and from
// OrderContext (which only owns completed orders).
//
// Persisted to sessionStorage (not localStorage) so a page refresh
// mid-checkout doesn't lose progress, but it doesn't linger forever
// like cart/wishlist data. Payment details (card number, CVV) are
// NEVER stored here or anywhere else.

const STORAGE_KEY = "routine_checkout_v1";

const defaultState = {
  contact: { phone: "", email: "" },
  address: null,
  note: "",
  shippingMethod: DEFAULT_SHIPPING_METHOD,
  voucherCode: "",
  discount: 0
};

const CheckoutContext = createContext(null);

export function CheckoutProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...defaultState, ...JSON.parse(raw) });
    } catch (err) {
      console.error("Failed to load checkout state from storage", err);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Failed to save checkout state to storage", err);
    }
  }, [state, hydrated]);

  const setContact = useCallback((contact) => {
    setState((prev) => ({ ...prev, contact: { ...prev.contact, ...contact } }));
  }, []);

  const setAddress = useCallback((address) => {
    setState((prev) => ({ ...prev, address }));
  }, []);

  const setNote = useCallback((note) => {
    setState((prev) => ({ ...prev, note }));
  }, []);

  const setShippingMethod = useCallback((shippingMethod) => {
    setState((prev) => ({ ...prev, shippingMethod }));
  }, []);

  const applyVoucher = useCallback((voucherCode, discount) => {
    setState((prev) => ({ ...prev, voucherCode, discount }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultState);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      hydrated,
      setContact,
      setAddress,
      setNote,
      setShippingMethod,
      applyVoucher,
      reset
    }),
    [state, hydrated, setContact, setAddress, setNote, setShippingMethod, applyVoucher, reset]
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within a CheckoutProvider");
  return ctx;
}
