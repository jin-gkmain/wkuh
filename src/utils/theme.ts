// theme.js 또는 App.js 등 테마를 설정하는 파일
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    // 기본 폰트 패밀리 설정
    fontFamily: [
      'S-CoreDream-3Light',
      'Noto Sans KR', // 한국어 폰트를 우선적으로
      'Roboto',         // 영문/숫자 등 다음 순위
      '-apple-system',  // 시스템 UI 폰트 (macOS, iOS)
      'BlinkMacSystemFont', // 시스템 UI 폰트 (Chrome on macOS)
      '"Segoe UI"',    // 시스템 UI 폰트 (Windows)
      'Arial',          // 일반적인 sans-serif
      'sans-serif',     // 최후의 sans-serif 폴백
    ].join(','), // 배열을 쉼표로 구분된 문자열로 변환
  },
  palette: {
    primary: {
      main: '#049EB8',
    },
    secondary: {
      main: '#6E6A7C',
    },
  },
});

export default theme;