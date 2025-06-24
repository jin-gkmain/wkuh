import theme from "@/utils/theme";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useContext } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LangType, LanguageContext } from "@/context/LanguageContext";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

interface MobileLayoutProps {
  children: ReactNode;
  isNotMain?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  isNotMain = false,
}) => {
  const router = useRouter();
  const { lang, setLang } = useContext(LanguageContext);

  // 현재 경로가 메인 페이지인지 확인 (예: /mobile/102)
  const isMainPage = router.asPath && /^\/mobile\/\d+$/.test(router.asPath);

  useEffect(() => {
    const setAppHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--app-height", `${window.innerHeight}px`);
    };

    window.addEventListener("resize", setAppHeight);
    setAppHeight(); // 초기 로드 시 호출

    return () => window.removeEventListener("resize", setAppHeight);
  }, []);

  const handleLangChange = (event: SelectChangeEvent<string>) => {
    setLang(event.target.value as LangType);
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        className="mobile-layout"
        style={{
          minWidth: "360px",
          maxWidth: "428px",
          minHeight: "740px",
          height: "var(--app-height, 100vh)",
          margin: "auto",
          position: "relative",
          overflow: isMainPage ? "hidden" : "auto",
          background: "white",
          paddingBottom: "env(safe-area-inset-bottom)",
          display: isMainPage ? "flex" : "block",
          flexDirection: isMainPage ? "column" : "initial",
        }}
      >
        <div
          className="mobile-layout-content"
          style={{
            position: "relative",
            zIndex: 1,
            flex: isMainPage ? 1 : "initial",
            display: isMainPage ? "flex" : "block",
            flexDirection: isMainPage ? "column" : "initial",
            overflow: isMainPage ? "hidden" : "visible",
            minHeight: isMainPage ? 0 : "auto",
            height: isMainPage ? "auto" : "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              pb: 0,
              flexShrink: 0, // 헤더 영역이 줄어들지 않도록
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 10,
            }}
          >
            <Box>
              {!isNotMain && (
                <IconButton onClick={() => router.back()}>
                  <ArrowBackIcon />
                </IconButton>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <LanguageIcon sx={{ mr: 1 }} />
              <FormControl
                sx={{ minWidth: 80 }}
                size="small"
                variant="standard"
              >
                <Select
                  defaultValue="ko"
                  value={lang}
                  onChange={handleLangChange}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="ko">Korean</MenuItem>
                  <MenuItem value="kk">Qazaqşa</MenuItem>
                  <MenuItem value="mn">Монгол хэл</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <div
            className="mobile-content-wrapper"
            style={{
              flex: isMainPage ? 1 : "initial",
              overflow: isMainPage ? "hidden" : "visible",
              display: isMainPage ? "flex" : "block",
              flexDirection: isMainPage ? "column" : "initial",
              minHeight: isMainPage ? 0 : "auto",
            }}
          >
            <div
              style={{
                minHeight: isMainPage ? "calc(100vh - 60px)" : "auto",
                paddingBottom: isMainPage ? "100px" : "0",
                overflowY: isMainPage ? "auto" : "visible",
                flex: isMainPage ? 1 : "initial",
                WebkitOverflowScrolling: isMainPage ? "touch" : "auto",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default MobileLayout;
