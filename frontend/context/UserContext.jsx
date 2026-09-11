"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import AuthPromptModal from "@/components/common/AuthPromptModal";

const USER_STORAGE_KEY = "routine_user_v1";
const ADDRESS_STORAGE_KEY = "routine_saved_address_v1";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [savedAddress, setSavedAddressState] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Trạng thái modal yêu cầu đăng nhập
  const [authPrompt, setAuthPrompt] = useState({
    isOpen: false,
    title: "",
    message: "",
    redirectUrl: "/login",
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(USER_STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
      const rawAddress = window.localStorage.getItem(ADDRESS_STORAGE_KEY);
      if (rawAddress) setSavedAddressState(JSON.parse(rawAddress));
    } catch (err) {
      console.error("Failed to load user from storage", err);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (user) {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (err) {
      console.error("Failed to save user to storage", err);
    }
  }, [user, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (savedAddress) {
        window.localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(savedAddress));
      } else {
        window.localStorage.removeItem(ADDRESS_STORAGE_KEY);
      }
    } catch (err) {
      console.error("Failed to save address to storage", err);
    }
  }, [savedAddress, hydrated]);

  const login = useCallback((userData = "Khách hàng", stylePreference = "minimal", token = null) => {
    if (typeof userData === "string") {
      setUser({
        name: userData,
        role: "CUSTOMER",
        stylePreference,
      });
    } else if (userData && typeof userData === "object") {
      setUser({
        ...userData,
        name: userData.fullName || userData.name || "Khách hàng",
        role: userData.role || "CUSTOMER",
        stylePreference: userData.stylePreference || stylePreference || "minimal",
      });
    }
    if (token && typeof window !== "undefined") {
      window.localStorage.setItem("routine_token", token);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("routine_token");
      window.localStorage.removeItem("token");
    }
  }, []);

  const setStylePreference = useCallback((stylePreference) => {
    setUser((prev) => (prev ? { ...prev, stylePreference } : prev));
  }, []);

  const setSavedAddress = useCallback((address) => {
    setSavedAddressState(address);
  }, []);

  // Mở modal yêu cầu đăng nhập ở giữa màn hình
  const openAuthPrompt = useCallback(({ title, message, redirectUrl = "/login" } = {}) => {
    setAuthPrompt({
      isOpen: true,
      title: title || "Đăng nhập để tiếp tục",
      message: message || "Vui lòng đăng nhập hoặc tạo tài khoản để thực hiện thao tác này.",
      redirectUrl,
    });
  }, []);

  const closeAuthPrompt = useCallback(() => {
    setAuthPrompt((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Kiểm tra đăng nhập, nếu chưa đăng nhập thì tự động mở modal và trả về false
  const requireAuth = useCallback(
    ({ title, message, redirectUrl } = {}) => {
      if (user) return true;
      openAuthPrompt({ title, message, redirectUrl });
      return false;
    },
    [user, openAuthPrompt]
  );

  const value = useMemo(
    () => ({
      user,
      hydrated,
      isLoggedIn: Boolean(user),
      login,
      logout,
      setStylePreference,
      savedAddress,
      setSavedAddress,
      openAuthPrompt,
      closeAuthPrompt,
      requireAuth,
    }),
    [
      user,
      hydrated,
      login,
      logout,
      setStylePreference,
      savedAddress,
      setSavedAddress,
      openAuthPrompt,
      closeAuthPrompt,
      requireAuth,
    ]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
      <AuthPromptModal
        isOpen={authPrompt.isOpen}
        onClose={closeAuthPrompt}
        title={authPrompt.title}
        message={authPrompt.message}
        redirectUrl={authPrompt.redirectUrl}
      />
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
