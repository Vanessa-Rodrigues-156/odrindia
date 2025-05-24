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
        fontFamily: "'Inter', system-ui, sans-serif",
        backgroundColor: "#ffffff",
      }}
    >
      <header
        style={{
          padding: "16px 24px",
          background: "transparent",
          color: "#333",
          fontWeight: "600",
          fontSize: "16px",
          borderBottom: "1px solid #eee",
          zIndex: "10",
        }}
      >
        Legal Assistant
      </header>
      
      <div
        style={{
          flex: "1",
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          scrollbarWidth: "thin",
          scrollbarColor: "#d4d4d8 transparent",
          backgroundColor: "#f9fafb",
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
              color: "#4b5563",
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "32px",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                maxWidth: "400px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#ebf4ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#2563eb" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 style={{ 
                fontWeight: "700", 
                marginBottom: "12px", 
                fontSize: "20px",
                color: "#1f2937"
              }}>
                Welcome to the Legal Assistant
              </h3>
              <p style={{ 
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#6b7280",
                marginBottom: "24px"
              }}>
                Ask any questions about legal matters or online dispute resolution services
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "10px",
                  width: "100%"
                }}
              >
                {["What is ODR?", "How can I resolve a dispute online?", "What legal services do you offer?"].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMessage(suggestion);
                      // Use setTimeout to allow React to update state before sending
                      setTimeout(handleSendMessage, 0);
                    }}
                    style={{
                      padding: "10px 12px",
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      textAlign: "left",
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "#4b5563",
                      transition: "background-color 0.15s ease-in-out",
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f9fafb"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                style={{
                  alignSelf: chat.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: chat.sender === "user" ? "#2563eb" : "white",
                  color: chat.sender === "user" ? "white" : "#333",
                  padding: "14px 18px",
                  borderRadius: chat.sender === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  maxWidth: "70%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                  wordBreak: "break-word",
                  lineHeight: "1.6",
                  fontSize: "15px",
                  border: chat.sender === "user" ? "none" : "1px solid #f0f0f0",
                  animation: "fadeSlideIn 0.3s ease-out forwards",
                }}
              >
                {chat.text}
                <div style={{ 
                  fontSize: "11px", 
                  marginTop: "6px", 
                  opacity: "0.7", 
                  textAlign: chat.sender === "user" ? "right" : "left" 
                }}>
                  {chat.sender === "user" ? "You" : "Legal Assistant"}
                </div>
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "white",
                  color: "#333",
                  padding: "14px 18px",
                  borderRadius: "20px 20px 20px 4px",
                  maxWidth: "70%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                  border: "1px solid #f0f0f0",
                }}
              >
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
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
          borderTop: "1px solid #f0f0f0",
          boxShadow: "0 -1px 3px rgba(0,0,0,0.02)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            position: "relative",
            maxWidth: "850px",
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: "12px", 
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask something about legal matters or ODR services..."
            style={{
              flex: "1",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "none",
              outline: "none",
              fontSize: "15px",
              backgroundColor: "transparent",
              transition: "box-shadow 0.15s ease-in-out",
            }}
            onFocus={(e) => e.target.parentNode.style.boxShadow = "0 0 0 2px rgba(37, 99, 235, 0.2)"}
            onBlur={(e) => e.target.parentNode.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)"}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            style={{
              backgroundColor: message.trim() ? "#2563eb" : "#e5e7eb",
              color: message.trim() ? "white" : "#9ca3af",
              border: "none",
              margin: "6px",
              borderRadius: "8px",
              minWidth: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: message.trim() ? "pointer" : "default",
              transition: "all 0.15s ease-in-out",
            }}
            disabled={!message.trim()}
            onMouseEnter={(e) => {
              if (message.trim()) e.currentTarget.style.backgroundColor = "#1d4ed8"
            }}
            onMouseLeave={(e) => {
              if (message.trim()) e.currentTarget.style.backgroundColor = "#2563eb"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13"></path>
              <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
          </button>
        </div>
      </footer>
      
      <style jsx>{`
        /* Typing indicator */
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: #2563eb;
          border-radius: 50%;
          opacity: 0.6;
          display: inline-block;
        }
        
        .typing-indicator span:nth-child(1) {
          animation: typing 1.4s infinite ease-in-out;
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation: typing 1.4s infinite ease-in-out;
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation: typing 1.4s infinite ease-in-out;
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
        
        /* Smooth appearance for messages */
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 5px;
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
