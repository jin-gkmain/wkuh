import React, { useState } from "react";
import { Box, TextField, IconButton, Card, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 0,
        left: "auto",
        right: "auto",
        width: "100%",
        maxWidth: "428px", // MobileLayout의 max-width와 동기화 필요
        margin: "auto",
        p: 1,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
          sx={{
            mr: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
          }}
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={disabled || !inputValue.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatInput;
