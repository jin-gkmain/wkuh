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
      <div className="mobile-layout">
        <div className="mobile-layout-content">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              pb: 0,
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
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default MobileLayout;
