import { useContext, useState } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import langFile from "@/lang";
import CustomToggleBtn from "./inputs/CustomToggleBtn";
import SegmentedPillButtonsGroup from "./inputs/CustomToggleBtn";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function HistorySearchBox() {
  const { lang } = useContext(LanguageContext);
  const [period, setPeriod] = useState<string>("1");

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{
        width: "100%",
        padding: 1,
        boxShadow: 5,
        borderRadius: 1,
      }}
    >
      <Grid container spacing={1} sx={{ alignItems: "center", width: "100%" }}>
        <Grid size={1} sx={{ alignItems: "center" }}>
          <Typography variant="body1">
            {langFile[lang].HISTORY_SEARCH_BOX_SELECT_PERIOD}
          </Typography>
        </Grid>
        <Grid size={8}>
          <SegmentedPillButtonsGroup
            options={[
              {
                label: langFile[lang].HISTORY_SEARCH_PERIOD_TOTAL,
                value: "1",
              },
              {
                label: langFile[lang].HISTORY_SEARCH_PERIOD_TODAY,
                value: "2",
              },
              {
                label: langFile[lang].HISTORY_SEARCH_PERIOD_3DAYS,
                value: "3",
              },
              {
                label: langFile[lang].HISTORY_SEARCH_PERIOD_1WEEK,
                value: "4",
              },
              {
                label: langFile[lang].HISTORY_SEARCH_PERIOD_1MONTH,
                value: "5",
              },
              {
                label: langFile[lang].HISTORY_SEARCH_PERIOD_3MONTHS,
                value: "6",
              },
              {
                label: langFile[lang].HISTORY_SEARCH_PERIOD_6MONTHS,
                value: "7",
              },
              {
                label: langFile[lang].HISTORY_SEARCH_PERIOD_1YEAR,
                value: "8",
              },
            ]}
            onSelect={(value) => setPeriod(value)}
            defaultValue={"1"}
          />
        </Grid>
        <Grid size={3} sx={{ alignItems: "center" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={1}>
          <Typography variant="body1">
            {langFile[lang].HISTORY_SEARCH_HOSPITAL_NAME}
          </Typography>
        </Grid>
        <Grid size={11}>
          <FormControl>
            <FormGroup aria-label="hospital" row={true}>
              {Array.from({ length: 3 }, (_, i) => (
                <FormControlLabel
                  value={i}
                  control={<Checkbox />}
                  label="병원명"
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>

        <Grid size={1}>
          <Typography variant="body1">
            {langFile[lang].HISTORY_SEARCH_STATUS}
          </Typography>
        </Grid>
        <Grid size={6}>
          <FormControl>
            <FormGroup aria-label="status" row={true}>
              <FormControlLabel
                value={0}
                control={<Checkbox />}
                label="진료대기"
              />
              <FormControlLabel
                value={1}
                control={<Checkbox />}
                label="진료완료"
              />
              <FormControlLabel
                value={2}
                control={<Checkbox />}
                label="처방완료"
              />
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid size={5}>
          <FormControl></FormControl>
          <Button variant="contained">검색</Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#BCBCBC",
              "&:hover": {
                backgroundColor: "#BCBCBC",
              },
            }}
          >
            초기화
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}
