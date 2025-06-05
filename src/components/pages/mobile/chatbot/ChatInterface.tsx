import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, CardContent, Card, Typography } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ChatMessage from "@/components/common/mobile/ChatMessage";
import ChatInput from "@/components/common/mobile/ChatInput";
import { fetchChatbotResponse, ChatHistoryItem } from "@/data/chatbot";
import { LanguageContext } from "@/context/LanguageContext";
import langFile from "@/lang";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp?: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { lang } = useContext(LanguageContext);
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const scrollToBottom = (behavior: "auto" | "smooth" = "smooth") => {
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
      const scrollBehavior = "smooth";

      const timer = setTimeout(() => {
        scrollToBottom(scrollBehavior);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const simulateTyping = (botMessageId: string, fullText: string) => {
    let currentText = "";
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
        typingTimeoutRef.current = setTimeout(typeChar, 50);
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, timestamp: new Date().toLocaleTimeString() }
              : msg
          )
        );
      }
    };
    typeChar();
  };

  const handleSendMessage = async (text: string) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const currentMessages = [...messages];
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setLoading(true);

    const botMessageId = `bot-${Date.now()}`;
    const tempBotMessage: Message = {
      id: botMessageId,
      text: "…",
      sender: "bot",
    };
    setMessages((prevMessages) => [...prevMessages, tempBotMessage]);

    const historyForApi: ChatHistoryItem[] = [];
    for (let i = 0; i < currentMessages.length; i++) {
      if (
        currentMessages[i].sender === "bot" &&
        currentMessages[i + 1]?.sender === "user"
      ) {
        historyForApi.push({
          outputs: currentMessages[i].text,
          inputs: currentMessages[i + 1].text,
        });
        i++;
      }
    }

    try {
      const answer = await fetchChatbotResponse(historyForApi, text);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, text: "" } : msg
        )
      );
      simulateTyping(botMessageId, answer);
    } catch (error) {
      console.error("챗봇 응답 처리 오류:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                text: "죄송합니다. 답변을 가져오는 데 실패했습니다.",
                timestamp: new Date().toLocaleTimeString(),
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 1,
          mb: 4,
        }}
      >
        <Card
          sx={{
            width: "80%",
            border: "1px solid #e0e0e0",
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            boxShadow: 0,
            p: 0,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              pt: 2,
              pb: 0,
            }}
          >
            <LightbulbIcon sx={{ width: 30, height: 30, mr: 1 }} />
            <Typography variant="body2">
              {langFile[lang]?.MOBILE_CHATBOT_INTRO}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box
        ref={chatContainerRef}
        sx={{ flexGrow: 1, overflowY: "auto", p: 2, pb: "100px" }}
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.text}
            sender={msg.sender}
            timestamp={msg.timestamp}
          />
        ))}
      </Box>
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={loading}
        placeholder={langFile[lang]?.MOBILE_CHATBOT_INPUT_PLACEHOLDER}
      />
    </Box>
  );
};

export default ChatInterface;
