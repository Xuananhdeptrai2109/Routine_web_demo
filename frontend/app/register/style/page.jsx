"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import StepIndicator from "@/components/auth/StepIndicator";
import StyleGrid from "@/components/auth/StyleGrid";
import PrimaryButton from "@/components/auth/PrimaryButton";
import { useRegistration } from "@/context/RegistrationContext";
import styles from "./page.module.css";
import styleList from "@/data/styles";
import { getStyles } from "@/lib/styleService";

const MAX_STYLES = 3;

export default function RegisterStylePage() {
  const router = useRouter();
  const { data, isHydrated, saveSelectedStyles } = useRegistration();
  const [selectedIds, setSelectedIds] = useState([]);
  const [availableStyles, setAvailableStyles] = useState(styleList);

  useEffect(() => {
    let isMounted = true;
    getStyles()
      .then((res) => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          const activeList = res.filter((item) => item.status !== "INACTIVE");
          if (activeList.length > 0) {
            setAvailableStyles(activeList);
          }
        }
      })
      .catch((err) => {
        console.warn("Lỗi tải phong cách từ API, sử dụng danh sách mặc định:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Nếu chưa hoàn thành /register (không có sđt trong dữ liệu tạm), quay
  // người dùng lại bước nhập thông tin tài khoản. Đợi context hydrate xong
  // từ sessionStorage trước khi kiểm tra, để tránh redirect nhầm khi user
  // tải lại trang /register/style trực tiếp.
  useEffect(() => {
    if (isHydrated && !data.phone) {
      router.replace("/register");
    }
  }, [isHydrated, data.phone, router]);

  const maxReached = selectedIds.length >= MAX_STYLES;

  function toggleStyle(id) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= MAX_STYLES) {
        return prev;
      }
      return [...prev, id];
    });
  }

  function goToVerify() {
    router.push(
      `/verify-otp?flow=register&email=${encodeURIComponent(data.email || "")}&phone=${encodeURIComponent(data.phone || "")}`
    );
  }

  function handleContinue() {
    saveSelectedStyles(selectedIds);
    goToVerify();
  }

  function handleSkip() {
    saveSelectedStyles([]);
    goToVerify();
  }

  return (
    <AuthLayout contentMaxWidth="640px">
      <AuthHeader
        title="Bạn yêu thích phong cách nào?"
        subtitle="Chọn tối đa 3 phong cách để chúng tôi cá nhân hóa trải nghiệm và gợi ý outfit phù hợp với bạn."
      />

      <StepIndicator currentStep={2} />

      <div className={styles.counterRow}>
        <span className={`${styles.counter} ${selectedIds.length > 0 ? styles.counterActive : ""}`}>
          {selectedIds.length}/{MAX_STYLES} phong cách đã chọn
        </span>
      </div>

      <div className={styles.grid}>
        <StyleGrid
          styleList={availableStyles}
          selectedIds={selectedIds}
          maxReached={maxReached}
          onToggle={toggleStyle}
        />
      </div>

      {maxReached && (
        <p className={styles.maxHint}>Bạn đã chọn tối đa 3 phong cách.</p>
      )}

      <div className={styles.actions}>
        <PrimaryButton type="button" onClick={handleContinue}>
          Tiếp tục
        </PrimaryButton>
        <button type="button" className={styles.skipButton} onClick={handleSkip}>
          Bỏ qua
        </button>
      </div>
    </AuthLayout>
  );
}
