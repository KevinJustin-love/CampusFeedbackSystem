import React, { useEffect, useRef, useState } from "react";
import { chatAPI } from "../api";
import "../styles/ChatWidget.css";

// 简易的悬浮聊天窗口组件
// - 支持消息历史显示
// - 支持加载状态
// - 自动滚动到底部
// - 默认允许未登录使用（后端 AllowAny）

const ChatWidget = () => {
  // 添加浮动动画样式
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "您好！我是 DoveLink 智能客服，很高兴为您服务～",
    },
  ]);

  const listRef = useRef(null);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const posRef = useRef(null);
  const [hoverFab, setHoverFab] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoverHeaderBtn, setHoverHeaderBtn] = useState(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 768;
  });
  const [pos, setPos] = useState(() => {
    // 初始放在右下角，如果无法获取 window，则回退
    try {
      const size = 64;
      const saved = localStorage.getItem("chatWidgetPos");
      if (saved) return JSON.parse(saved);
      return {
        left: Math.max(20, (window.innerWidth || 800) - size - 20),
        top: Math.max(20, (window.innerHeight || 600) - size - 20),
      };
    } catch {
      return { left: 20, top: 20 };
    }
  });

  // 同步 ref
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  // 使用 emoji 鸽子图标，不依赖外部图片文件
  const USE_EMOJI_ONLY = true;

  const toggleOpen = () => setIsOpen((v) => !v);

  const toggleFullscreen = () => {
    setIsFullscreen((v) => !v);
  };

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();

    // 确保聊天面板显示在最顶层
    if (isOpen) {
      // 添加面板显示时的处理
      document.body.style.position = "relative";
    }

    return () => {
      if (isOpen) {
        // 清理处理
        document.body.style.position = "";
      }
    };
  }, [messages, isOpen]);

  // 窗口尺寸变化时，保证按钮仍在可视区域内，并更新移动端状态
  useEffect(() => {
    const handleResize = () => {
      const size = isMobile ? 80 : 64;
      setIsMobile(window.innerWidth <= 768);
      setPos((p) => ({
        left: Math.min(Math.max(0, p.left), window.innerWidth - size),
        top: Math.min(Math.max(0, p.top), window.innerHeight - size),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // 拖拽相关逻辑
  const startDrag = (clientX, clientY) => {
    draggingRef.current = false; // 初始不认为是拖动，避免误触发
    dragOffsetRef.current = {
      x: clientX - pos.left,
      y: clientY - pos.top,
    };

    const move = (mx, my) => {
      const size = isMobile ? 80 : 64;
      const newLeft = Math.min(
        Math.max(0, mx - dragOffsetRef.current.x),
        window.innerWidth - size
      );
      const newTop = Math.min(
        Math.max(0, my - dragOffsetRef.current.y),
        window.innerHeight - size
      );
      // 小于阈值的移动不算拖拽
      if (!draggingRef.current) {
        const dx = Math.abs(newLeft - posRef.current.left);
        const dy = Math.abs(newTop - posRef.current.top);
        if (dx + dy > 3) draggingRef.current = true;
      }
      setPos({ left: newLeft, top: newTop });
    };

    const onMouseMove = (e) => move(e.clientX, e.clientY);
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      // 结束拖拽时执行吸附边缘
      const finalPos = snapToEdges(posRef.current, isMobile);
      setPos(finalPos);
      try {
        localStorage.setItem("chatWidgetPos", JSON.stringify(finalPos));
      } catch {}
      // 如果不是拖拽，当作点击打开/关闭
      if (!draggingRef.current) toggleOpen();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseDownFab = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const onTouchStartFab = (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    startDrag(touch.clientX, touch.clientY);
    const onTouchMove = (ev) => {
      ev.preventDefault(); // 避免页面滚动干扰拖拽
      const t = ev.touches[0];
      if (!t) return;
      const size = isMobile ? 80 : 64;
      const newLeft = Math.min(
        Math.max(0, t.clientX - dragOffsetRef.current.x),
        window.innerWidth - size
      );
      const newTop = Math.min(
        Math.max(0, t.clientY - dragOffsetRef.current.y),
        window.innerHeight - size
      );
      if (!draggingRef.current) {
        const dx = Math.abs(newLeft - posRef.current.left);
        const dy = Math.abs(newTop - posRef.current.top);
        if (dx + dy > 3) draggingRef.current = true;
      }
      setPos({ left: newLeft, top: newTop });
    };
    const onTouchEnd = () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      const finalPos = snapToEdges(posRef.current, isMobile);
      setPos(finalPos);
      try {
        localStorage.setItem("chatWidgetPos", JSON.stringify(finalPos));
      } catch {}
      if (!draggingRef.current) toggleOpen();
    };
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await chatAPI.chat({ message: text, history });
      const reply = data?.message || "抱歉，暂时无法获取回复。";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "抱歉，智能客服暂时不可用，请稍后再试。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 计算聊天面板基于按钮的位置
  // 如果是全屏模式或移动端，则占满整个视窗
  const panelSize =
    isMobile || isFullscreen
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: 360, height: 440 };
  const btnSize = isMobile ? 80 : 64;

  // 始终将面板水平居中对齐到按钮
  let panelLeft = pos.left - (panelSize.width - btnSize) / 2;

  // 确保面板不会超出屏幕左右边界
  if (panelLeft < 12) {
    panelLeft = 12;
  } else if (panelLeft + panelSize.width > window.innerWidth - 12) {
    panelLeft = window.innerWidth - panelSize.width - 12;
  }

  // 始终将面板放在按钮正下方
  let panelTop = isMobile || isFullscreen ? 0 : pos.top + btnSize + 12;

  // 确保面板不会超出屏幕底部
  if (
    !isMobile &&
    !isFullscreen &&
    panelTop + panelSize.height > window.innerHeight - 12
  ) {
    // 如果下方空间不足，则放在按钮上方
    panelTop = Math.max(12, pos.top - panelSize.height - 12);
  }

  return (
    <>
      {/* 可拖拽的悬浮按钮（使用鸽子图片） */}
      <div
        role="button"
        aria-label="打开客服"
        className={`chat-widget-fab ${
          isMobile ? "chat-widget-fab-mobile" : ""
        } ${draggingRef.current ? "grabbing" : ""}`}
        style={{
          left: pos.left,
          top: pos.top,
          transform:
            hoverFab && !draggingRef.current ? "scale(1.06)" : "scale(1)",
        }}
        onMouseDown={onMouseDownFab}
        onTouchStart={onTouchStartFab}
        onMouseEnter={() => setHoverFab(true)}
        onMouseLeave={() => setHoverFab(false)}
      >
        {/* 始终显示 emoji 鸽子图标 */}
        <div className="chat-widget-icon">🤖</div>
        {/* 气泡提示 - 未打开时显示 */}
        {!isOpen && <div className="chat-widget-bubble">点击我开始对话</div>}
        {/* 右上角关闭标记提示（打开时可见） */}
        {isOpen && <div className="chat-widget-badge">×</div>}
      </div>

      {/* 背景遮罩（移动端全屏时显示） */}
      {isOpen && (isMobile || isFullscreen) && (
        <div
          className="chat-widget-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 聊天窗口（贴近按钮显示 / 移动端全屏） */}
      {isOpen && (
        <div
          className={`chat-widget-panel ${
            isMobile || isFullscreen ? "chat-widget-panel-mobile" : ""
          }`}
          style={{
            ...(isMobile || isFullscreen
              ? {}
              : { left: panelLeft, top: panelTop }),
          }}
        >
          <div className="chat-widget-header">
            <span>DoveLink 智能客服</span>
            <div className="chat-widget-header-buttons">
              {/* 全屏/缩小按钮（仅桌面端显示） */}
              {!isMobile && (
                <button
                  className="chat-widget-header-button"
                  style={{
                    backgroundColor:
                      hoverHeaderBtn === "fullscreen"
                        ? "rgba(247, 241, 232, 0.2)"
                        : "rgba(247, 241, 232, 0.1)",
                  }}
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "缩小到窗口" : "全屏显示"}
                  onMouseEnter={() => setHoverHeaderBtn("fullscreen")}
                  onMouseLeave={() => setHoverHeaderBtn(null)}
                >
                  {isFullscreen ? "🗗" : "🗖"}
                </button>
              )}
              {/* 关闭按钮 */}
              <button
                className="chat-widget-header-button"
                style={{
                  backgroundColor:
                    hoverHeaderBtn === "close"
                      ? "rgba(247, 241, 232, 0.2)"
                      : "rgba(247, 241, 232, 0.1)",
                }}
                onClick={() => setIsOpen(false)}
                title="关闭"
                onMouseEnter={() => setHoverHeaderBtn("close")}
                onMouseLeave={() => setHoverHeaderBtn(null)}
              >
                ×
              </button>
            </div>
          </div>

          <div className="chat-widget-list" ref={listRef}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`chat-widget-msg ${
                  m.role === "user"
                    ? "chat-widget-msg-user"
                    : "chat-widget-msg-bot"
                }`}
              >
                <div
                  className={`chat-widget-msg-bubble ${
                    m.role === "user"
                      ? "chat-widget-msg-bubble-user"
                      : "chat-widget-msg-bubble-bot"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="chat-widget-loading">正在思考…</div>}
          </div>

          <div className="chat-widget-input-row">
            <textarea
              className="chat-widget-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="请输入问题，按 Enter 发送（Shift+Enter 换行）"
              rows={2}
            />
            <button
              className="chat-widget-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                opacity: loading || !input.trim() ? 0.6 : 1,
              }}
            >
              发送
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// 位置保持函数：确保图标不会超出视窗边界
function snapToEdges(currentPos, isMobile) {
  const size = isMobile ? 80 : 64;
  const margin = 5; // 减小边缘空白，允许更灵活的位置
  const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
  const vh = typeof window !== "undefined" ? window.innerHeight : 1080;

  // 只限制不超出边界，不进行边缘吸附
  const left = Math.min(Math.max(margin, currentPos.left), vw - size - margin);
  const top = Math.min(Math.max(margin, currentPos.top), vh - size - margin);

  return { left, top };
}

export default ChatWidget;
