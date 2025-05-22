import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
const MobileChatbotImage = { src: "/images/mobile_heart.png" };

interface ChatMessageProps {
  message: string;
  sender: string; // 'user' or 'bot'
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender, timestamp }) => {
  const isUser = sender === 'user';

  // 아바타 크기 (필요에 따라 조절)
  const avatarSize = 32;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1,
        alignItems: 'flex-start', // 아바타와 메시지 버블 하단 정렬
      }}
    >
      {!isUser && (
        <Avatar 
          sx={{ 
            mr: 1, 
            width: avatarSize, 
            height: avatarSize, 
            bgcolor: 'transparent' // 이미지 배경 투명하게
          }} 
          src={MobileChatbotImage.src} // public 폴더 기준 경로
          alt="Bot Avatar"
        />
      )}
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          backgroundColor: isUser ? 'primary.main' : 'grey.200',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          // borderRadius 수정: 꼬리가 아바타를 향하도록
          borderRadius: isUser ? '10px 0px 10px 10px' : '0px 10px 10px 10px',
          maxWidth: 'calc(70% - 40px)', // 아바타 공간을 고려하여 최대 너비 약간 줄임
          wordBreak: 'break-word',
        }}
      >
        <Typography variant="body1">{message}</Typography>
        {timestamp && (
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              textAlign: isUser ? 'right' : 'left', 
              mt: 0.5, 
              color: isUser ? 'grey.300' : 'grey.600' 
            }}
          >
            {timestamp}
          </Typography>
        )}
      </Paper>
      {isUser && (
        <Avatar sx={{ ml: 1, width: avatarSize, height: avatarSize, bgcolor: 'primary.light' }}> 
          <PersonIcon fontSize="small" sx={{ color: 'white'}} /> 
        </Avatar>
      )}
    </Box>
  );
};

export default ChatMessage; 