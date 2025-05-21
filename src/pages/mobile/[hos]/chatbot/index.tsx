import MobileLayout from "@/components/pages/mobile/MobileLayout";
import ChatInterface from "@/components/pages/mobile/chatbot/ChatInterface";
// import { Box, Typography } from "@mui/material"; // 현재 사용 안함

export default function ChatbotPage() {
  return (
    <MobileLayout isNotMain={false}>
      {/* 
        MobileLayout의 isNotMain prop은 헤더의 뒤로가기 버튼 등을 제어합니다.
        챗봇 페이지의 경우 isNotMain={true}로 설정하여 뒤로가기 버튼이 나타나도록 할 수 있습니다.
        (MobileLayout 구현에 따라 동작 방식이 다를 수 있음)
      */}
      {/* 페이지 제목 등은 필요시 아래와 같이 추가 가능 */}
      {/* 
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6">챗봇 상담</Typography>
      </Box> 
      */}
      <ChatInterface />
    </MobileLayout>
  );
} 