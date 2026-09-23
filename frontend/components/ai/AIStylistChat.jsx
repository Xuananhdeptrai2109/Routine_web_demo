"use client";

import { useState, useRef, useEffect } from "react";
import InteractiveOutfitCard from "./InteractiveOutfitCard";
import { sendStylistChatMessage } from "@/lib/aiStylistService";
import { useUser } from "@/context/UserContext";
import styles from "./AIStylistChat.module.css";

const GENDER_QUICK_CHIPS = {
  women: [
    "Tư vấn set đồ nữ thanh lịch đi làm",
    "Áo sơ mi kết hợp chân váy dạo phố",
    "Outfit hẹn hò nữ cuối tuần dưới 1 triệu",
    "Gợi ý đầm/set đồ phong cách tối giản",
  ],
  men: [
    "Tư vấn set đồ công sở lịch sự nam",
    "Gợi ý áo polo kết hợp quần tây thanh lịch",
    "Outfit dạo phố năng động nam",
    "Tìm áo phông dáng lớn màu xám",
  ],
  default: [
    "Tìm áo phông dáng lớn màu xám dạo phố",
    "Tư vấn set đồ công sở lịch sự",
    "Outfit hẹn hò cuối tuần dưới 1 triệu",
    "Gợi ý áo polo kết hợp quần tây thanh lịch",
  ],
};

function getWelcomeConfig(user) {
  const gender = user?.gender;
  const name = user?.name ? ` ${user.name}` : "";

  if (gender === "women") {
    return {
      text: `Xin chào${name} 👋! Tôi là Trợ lý Thời trang AI Stylist của Routine. Rất vui được hỗ trợ tư vấn trang phục nữ chuẩn phong cách cho bạn. Hôm nay bạn muốn tìm đồ theo dịp nào (công sở, dạo phố, hẹn hò)?`,
      chips: GENDER_QUICK_CHIPS.women,
    };
  }

  if (gender === "men") {
    return {
      text: `Xin chào${name} 👋! Tôi là Trợ lý Thời trang AI Stylist của Routine. Rất vui được hỗ trợ tư vấn trang phục nam chuẩn gu cho bạn. Hôm nay bạn muốn tìm đồ theo dịp nào (công sở, dạo phố, hẹn hò)?`,
      chips: GENDER_QUICK_CHIPS.men,
    };
  }

  if (gender === "unisex") {
    return {
      text: `Xin chào${name} 👋! Tôi là Trợ lý Thời trang AI Stylist của Routine. Tôi sẵn sàng gợi ý và phối đồ từ tất cả bộ sưu tập thời trang trong kho cho bạn. Hôm nay bạn muốn tìm đồ theo phong cách nào?`,
      chips: GENDER_QUICK_CHIPS.default,
    };
  }

  return {
    text: "Xin chào 👋! Tôi là Trợ lý Thời trang AI Stylist của Routine. Hôm nay bạn muốn tìm trang phục theo dịp nào, dáng mặc (form rộng, vừa, ôm) hay phong cách gì?",
    chips: GENDER_QUICK_CHIPS.default,
  };
}

export default function AIStylistChat({ initialPrompt = "", currentProductId = null, embedded = false }) {
  const { user, isLoggedIn, openAuthPrompt } = useUser();
  const welcome = getWelcomeConfig(user);

  const [messages, setMessages] = useState([
    {
      id: "msg-welcome",
      role: "ai",
      text: welcome.text,
      outfit: null,
      followUps: welcome.chips,
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Nếu có initialPrompt được truyền từ bên ngoài (ví dụ từ nút Complete The Look)
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt.trim());
    }
  }, [initialPrompt]);

  async function handleSendMessage(textToSend) {
    const text = textToSend || inputText;
    if (!text || !text.trim() || loading) return;

    const userMessageId = `usr-${Date.now()}`;
    const newHistory = messages
      .filter((m) => m.id !== "msg-welcome")
      .map((m) => ({
        role: m.role === "ai" ? "model" : "user",
        text: m.text,
        outfitId: m.outfit?.id || null,
        outfitTitle: m.outfit?.title || null,
        products: m.outfit?.products?.map((p) => p.name) || [],
      }));

    const updatedMessages = [
      ...messages,
      {
        id: userMessageId,
        role: "user",
        text: text.trim(),
      },
    ];

    setMessages(updatedMessages);
    setInputText("");
    setLoading(true);

    try {
      const response = await sendStylistChatMessage({
        message: text.trim(),
        history: newHistory,
        currentProductId,
        userPreferences: user ? { gender: user.gender, style: user.stylePreference } : null,
      });

      setMessages([
        ...updatedMessages,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: response.message,
          outfit: response.outfit,
          products: response.products,
          followUps: response.followUps || [],
        },
      ]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          id: `ai-err-${Date.now()}`,
          role: "ai",
          text: "Xin lỗi bạn, kết nối tới AI Stylist đang bận hoặc gián đoạn. Bạn vui lòng thử lại sau ít giây nhé!",
          followUps: ["Thử lại câu hỏi vừa rồi", "Gợi ý set đồ dạo phố"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <div className={`${styles.aiChatContainer} ${embedded ? styles.isEmbedded : ""}`}>
      {/* Khung cuộn tin nhắn */}
      <div className={styles.aiChatThread}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.chatBubbleWrapper} ${msg.role === "ai" ? styles.isAi : styles.isUser}`}
          >
            {msg.role === "ai" && (
              <div className={styles.stylistAvatar} title="Routine AI Stylist">
                <span>R</span>
              </div>
            )}

            <div className={styles.chatBubbleContent}>
              <div className={`${styles.chatBubble} ${msg.role === "ai" ? styles.isAi : styles.isUser}`}>
                <p className={styles.bubbleText}>{msg.text}</p>
              </div>

              {/* Thẻ phối đồ tương tác trực quan */}
              {msg.outfit && msg.outfit.products && msg.outfit.products.length > 0 && (
                <InteractiveOutfitCard outfit={msg.outfit} />
              )}

              {/* Gợi ý câu hỏi tiếp theo (Follow-up chips) */}
              {msg.followUps && msg.followUps.length > 0 && (
                <div className={styles.followupChipsContainer}>
                  <span className={styles.chipsLabel}>Gợi ý câu hỏi:</span>
                  <div className={styles.chipsList}>
                    {msg.followUps.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={styles.chipBtn}
                        onClick={() => handleSendMessage(chip)}
                        disabled={loading}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading / Typing indicator */}
        {loading && (
          <div className={`${styles.chatBubbleWrapper} ${styles.isAi}`}>
            <div className={styles.stylistAvatar}>
              <span>R</span>
            </div>
            <div className={`${styles.chatBubble} ${styles.isAi} ${styles.typingBubble}`}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.typingText}>Stylist đang phân tích dáng đồ & phối set...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input gửi tin nhắn */}
      <div className={styles.aiChatInputArea}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.chatInput}
            placeholder="Nhập phong cách, dịp mặc (VD: áo phông dáng lớn màu xám, đồ đi tiệc...)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            type="button"
            className={styles.btnSend}
            onClick={() => handleSendMessage()}
            disabled={loading || !inputText.trim()}
            title="Gửi câu hỏi"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
