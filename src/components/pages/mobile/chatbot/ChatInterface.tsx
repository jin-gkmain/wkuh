import React, { useState, useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import ChatMessage from '@/components/common/mobile/ChatMessage';
import ChatInput from '@/components/common/mobile/ChatInput';
import { fetchChatbotResponse, ChatHistoryItem } from '@/data/chatbot'; // 수정된 import

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp?: string;
}

const initialMessagesData: Omit<Message, 'timestamp'>[] = [
  { id: '1', text: '안녕하세요! 무엇을 도와드릴까요?', sender: 'bot' },
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 타이핑 효과를 위한 타이머 참조

  useEffect(() => {
    setMessages(
      initialMessagesData.map(msg => ({
        ...msg,
        timestamp: new Date().toLocaleTimeString(),
      }))
    );
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const scrollToBottom = (behavior: 'auto' | 'smooth' = 'smooth') => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatContainerRef.current.scrollTo({
        top: maxScrollTop > 0 ? maxScrollTop : 0,
        behavior: behavior,
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const isInitialLoad = messages.length === initialMessagesData.length && 
                            messages[0]?.id === initialMessagesData[0]?.id && 
                            messages.filter(m => m.sender === 'user').length === 0;
      const scrollBehavior = isInitialLoad ? 'auto' : 'smooth';
      
      const timer = setTimeout(() => {
        scrollToBottom(scrollBehavior);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const simulateTyping = (botMessageId: string, fullText: string) => {
    let currentText = '';
    let charIndex = 0;

    const typeChar = () => {
      if (charIndex < fullText.length) {
        currentText += fullText[charIndex];
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: currentText } : msg
          )
        );
        charIndex++;
        typingTimeoutRef.current = setTimeout(typeChar, 50); // 타이핑 속도 (ms)
      } else {
        // 타이핑 완료 후 추가 작업 (예: timestamp 업데이트 등)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, timestamp: new Date().toLocaleTimeString() } : msg
          )
        );
      }
    };
    typeChar();
  };

  const handleSendMessage = async (text: string) => {
    if (typingTimeoutRef.current) { // 이전 타이핑 효과 중지
      clearTimeout(typingTimeoutRef.current);
    }

    const currentMessages = [...messages];
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setLoading(true);

    const botMessageId = `bot-${Date.now()}`;
    const tempBotMessage: Message = {
      id: botMessageId,
      text: '…', 
      sender: 'bot',
      // timestamp는 simulateTyping 완료 후 설정
    };
    setMessages((prevMessages) => [...prevMessages, tempBotMessage]);

    const historyForApi: ChatHistoryItem[] = [];
    for (let i = 0; i < currentMessages.length; i++) {
      if (currentMessages[i].sender === 'bot' && currentMessages[i+1]?.sender === 'user') {
        historyForApi.push({
          outputs: currentMessages[i].text,
          inputs: currentMessages[i+1].text,
        });
        i++; 
      }
    }

    try {
      const answer = await fetchChatbotResponse(historyForApi, text);
      // 기존 tempBotMessage를 즉시 answer로 업데이트하지 않고, 타이핑 효과 시작
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, text: '' } : msg // 텍스트를 비우고 타이핑 시작 준비
        )
      );
      simulateTyping(botMessageId, answer);

    } catch (error) {
      console.error("챗봇 응답 처리 오류:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, text: "죄송합니다. 답변을 가져오는 데 실패했습니다.", timestamp: new Date().toLocaleTimeString() } : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', flexGrow: 1 }}>
      <Box ref={chatContainerRef} sx={{ flexGrow: 1, overflowY: 'auto', p: 2, pb: '70px' }}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg.text} sender={msg.sender} timestamp={msg.timestamp} />
        ))}
      </Box>
      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
    </Box>
  );
};

export default ChatInterface; 