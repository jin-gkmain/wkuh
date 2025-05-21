import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface ChatMessageProps {
  message: string;
  sender: string; // 'user' or 'bot'
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, sender, timestamp }) => {
  const isUser = sender === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          backgroundColor: isUser ? 'primary.main' : 'grey.200',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          borderRadius: isUser ? '10px 10px 0 10px' : '10px 10px 10px 0',
          maxWidth: '70%',
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
    </Box>
  );
};

export default ChatMessage; 