'use client';

import { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      setLoading(true);
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response from chatbot");
      }

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = { sender: "bot", text: "Failed to send the message." };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)", /* Adjust for navbar height */
        maxHeight: "calc(100vh - 64px)",
        margin: "0",
        overflow: "hidden",
        fontFamily: "'Geist', sans-serif",
        backgroundColor: "#f7f9fc",
      }}
    >
      <header
        style={{
          padding: "16px 24px",
          backgroundColor: "#3a86ff",
          color: "white",
          fontWeight: "600",
          fontSize: "18px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          zIndex: "10",
        }}
      >
        Legal Assistant
      </header>
      
      <div
        style={{
          flex: "1",
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          scrollbarWidth: "thin",
          scrollbarColor: "#d4d4d8 transparent",
        }}
      >
        {chatHistory.length === 0 && !loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#71717a",
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ marginBottom: "16px", color: "#3a86ff" }}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3 style={{ fontWeight: "600", marginBottom: "8px" }}>Welcome to the Legal Chatbot</h3>
            <p style={{ fontSize: "14px" }}>
              Ask any questions about legal matters or online dispute resolution.
            </p>
          </div>
        ) : (
          <>
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                style={{
                  alignSelf: chat.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: chat.sender === "user" ? "#3a86ff" : "white",
                  color: chat.sender === "user" ? "white" : "#333",
                  padding: "12px 16px",
                  borderRadius: chat.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  maxWidth: "75%",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  wordBreak: "break-word",
                  lineHeight: "1.5",
                }}
              >
                {chat.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "white",
                  color: "#333",
                  padding: "12px 16px",
                  borderRadius: "18px 18px 18px 4px",
                  maxWidth: "75%",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  <span style={{ animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0s" }}>•</span>
                  <span style={{ animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.2s" }}>•</span>
                  <span style={{ animation: "bounce 1.4s infinite ease-in-out both", animationDelay: "0.4s" }}>•</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <footer
        style={{
          display: "flex",
          padding: "16px 24px",
          backgroundColor: "white",
          borderTop: "1px solid #e5e7eb",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.03)",
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: "1",
            padding: "12px 16px",
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            outline: "none",
            fontSize: "14px",
            backgroundColor: "#f8fafc",
            marginRight: "12px",
            transition: "border-color 0.15s ease-in-out",
          }}
          onFocus={(e) => e.target.style.borderColor = "#3a86ff"}
          onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          style={{
            backgroundColor: "#3a86ff",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.15s ease-in-out",
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3a86ff"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </footer>
      
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background-color: #d4d4d8;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
