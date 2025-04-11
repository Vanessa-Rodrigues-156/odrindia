'use client';
import { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          zIndex: 1000,
          cursor: 'pointer'
        }}
        aria-label="Open Chatbot"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '430px',
            border: 'none',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            zIndex: 1000,
            backgroundColor: 'white'
          }}
        >
          <iframe
            src="https://console.dialogflow.com/api-client/demo/embedded/0f378c1a-0611-45d7-aa77-0faccc66742c"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            allow="microphone"
          ></iframe>
        </div>
      )}
    </>
  );
};

export default Chatbot;
