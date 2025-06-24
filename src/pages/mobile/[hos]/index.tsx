import { useRouter } from "next/router";
import MobileLayout from "@/components/pages/mobile/MobileLayout";
import ButtonCard from "@/components/common/mobile/ButtonCard"; // ButtonCard 경로 확인 필요
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
// import EventNoteIcon from '@mui/icons-material/EventNote'; // 일정확인 아이콘 예시
import Stack from "@mui/material/Stack";
// 이미지 경로 확인 필요
// import MobilePaperweightImage from "../../../../public/images/mobile_doc.png";
// import MobileChatbotImage from "../../../../public/images/mobile_heart.png";
// import MobileScheduleImage from "../../../../public/images/mobile_schedule.png";
import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import langFile from "@/lang"; // langFile 경로 확인 필요

// 임시 이미지 경로 또는 placeholder (실제 이미지 경로로 대체 필요)
const MobilePaperweightImage = { src: "/images/mobile_doc.png" };
const MobileChatbotImage = { src: "/images/mobile_heart.png" };
// const MobileScheduleImage = { src: "/images/mobile_schedule.png" };

export default function MobileHosIndexPage() {
  const router = useRouter();
  const { hos } = router.query;
  const { lang } = useContext(LanguageContext);

  // TODO: 각 버튼 클릭 시 실제 동작 함수 연결 필요
  const handlePreliminaryClick = () => {
    router.push(`/mobile/${hos}/preliminary`); // 예시 경로
  };

  const handleChatbotClick = () => {
    router.push(`/mobile/${hos}/chatbot`);
  };

  // const handleScheduleClick = () => {
  //   console.log("Navigate to schedule check");
  // };

  return (
    <MobileLayout isNotMain={true}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100%",
          m: 2,
          mt: 5,
          pb: "100px",
        }}
      >
        <Stack
          sx={{ width: "100%", alignItems: "center" }}
          direction="column"
          spacing={6}
        >
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {langFile[lang]?.MOBILE_INDEX_TITLE || `Welcome to ${hos}`}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              pl={4}
              pr={4}
              pt={1}
              pb={1}
            >
              {langFile[lang]?.MOBILE_INDEX_DESC ||
                "Please select an option below."}
            </Typography>
          </Box>

          {/* 일정 확인 버튼 (필요시 주석 해제 및 아이콘, 이미지, 기능 연결) */}
          {/* 
          <ButtonCard 
            title={langFile[lang]?.MOBILE_INDEX_SCHEDULE_TITLE || "Check Schedule"} 
            content={langFile[lang]?.MOBILE_INDEX_SCHEDULE_DESC || "View your appointments."}
            action={handleScheduleClick} 
            icon={<EventNoteIcon/>} 
            media={MobileScheduleImage.src} 
            buttonText={langFile[lang]?.MOBILE_INDEX_SCHEDULE_BUTTON || "Go"} 
          /> 
          */}

          <ButtonCard
            title={
              langFile[lang]?.MOBILE_INDEX_PAPERWEIGHT_TITLE ||
              "Fill Questionnaire"
            }
            content={
              langFile[lang]?.MOBILE_INDEX_PAPERWEIGHT_DESC ||
              "Complete your medical questionnaire."
            }
            action={handlePreliminaryClick}
            icon={<LibraryBooksIcon />}
            media={MobilePaperweightImage.src} // 이미지 경로 확인 및 수정 필요
            buttonText={
              langFile[lang]?.MOBILE_INDEX_PAPERWEIGHT_BUTTON || "Start"
            }
          />
          <ButtonCard
            title={
              langFile[lang]?.MOBILE_INDEX_CHATBOT_TITLE || "Chat Consultation"
            }
            content={
              langFile[lang]?.MOBILE_INDEX_CHATBOT_DESC ||
              "Get help via our chatbot."
            }
            action={handleChatbotClick}
            icon={<LightbulbIcon />}
            media={MobileChatbotImage.src} // 이미지 경로 확인 및 수정 필요
            buttonText={langFile[lang]?.MOBILE_INDEX_CHATBOT_BUTTON || "Chat"}
          />
        </Stack>
      </Box>
    </MobileLayout>
  );
}
