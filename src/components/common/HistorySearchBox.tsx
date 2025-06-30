import { useContext, useState, useRef } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CustomToggleBtn from "./inputs/CustomToggleBtn";
import SegmentedPillButtonsGroup from "./inputs/CustomToggleBtn";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import langFile from "@/lang";

export type HistorySearchBoxProps = {
  hospitals: string[];
  onSearch: (
    startDate: string,
    endDate: string,
    status: string[],
    hospitals: string[],
    searchParam: string,
    searchValue: string
  ) => void;
};

export default function HistorySearchBox({
  hospitals,
  onSearch,
}: HistorySearchBoxProps) {
  const { lang, webLang } = useContext(LanguageContext);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [selectedHospitals, setSelectedHospitals] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchParam, setSearchParam] = useState<string>("doctor");
  const [isSelectingEndDate, setIsSelectingEndDate] = useState<boolean>(false);
  const [startDatePickerOpen, setStartDatePickerOpen] =
    useState<boolean>(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState<boolean>(false);

  const endDatePickerRef = useRef<any>(null);
  const today = dayjs();

  const handlePeriodSelect = (period: string) => {
    const today = dayjs();
    let start: Dayjs;
    let end: Dayjs = today;

    switch (period) {
      case "1": // 전체
        setStartDate(null);
        setEndDate(null);
        return;
      case "2": // 오늘
        start = today;
        end = today;
        break;
      case "3": // 3일
        start = today.subtract(3, "day");
        break;
      case "4": // 1주일
        start = today.subtract(1, "week");
        break;
      case "5": // 1개월
        start = today.subtract(1, "month");
        break;
      case "6": // 3개월
        start = today.subtract(3, "month");
        break;
      case "7": // 6개월
        start = today.subtract(6, "month");
        break;
      case "8": // 1년
        start = today.subtract(1, "year");
        break;
      default:
        return;
    }

    setStartDate(start);
    setEndDate(end);
  };

  const handleHospitalChange = (hospital: string, checked: boolean) => {
    if (checked) {
      setSelectedHospitals([...selectedHospitals, hospital]);
    } else {
      setSelectedHospitals(selectedHospitals.filter((h) => h !== hospital));
    }
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatus([...selectedStatus, status]);
    } else {
      setSelectedStatus(selectedStatus.filter((s) => s !== status));
    }
  };

  const handleStartDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue);
  };

  const handleStartDateAccept = (newValue: Dayjs | null) => {
    setStartDate(newValue);
    setStartDatePickerOpen(false);

    if (newValue) {
      // 시작 날짜가 설정되면 자동으로 종료 날짜 선택으로 이동
      setTimeout(() => {
        setEndDatePickerOpen(true);
      }, 100);
    }

    // 종료 날짜가 시작 날짜보다 이전인 경우 종료 날짜를 시작 날짜로 설정
    if (newValue && endDate && endDate.isBefore(newValue)) {
      setEndDate(newValue);
    }
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    setEndDate(newValue);
  };

  const handleEndDateAccept = (newValue: Dayjs | null) => {
    if (startDate && newValue && newValue.isBefore(startDate)) {
      // 종료 날짜가 시작 날짜보다 이전인 경우 시작 날짜로 설정
      setEndDate(startDate);
    } else {
      setEndDate(newValue);
    }
    setEndDatePickerOpen(false);
  };

  // DatePicker 클릭 시 항상 시작날짜부터 선택하도록 수정
  const handleDatePickerClick = () => {
    // 시작날짜가 없거나, 이미 둘 다 선택되어 있는 경우 시작날짜부터 다시 선택
    if (!startDate || (startDate && endDate)) {
      setStartDatePickerOpen(true);
      setEndDatePickerOpen(false);
    } else if (startDate && !endDate) {
      // 시작날짜만 있는 경우 종료날짜 선택
      setStartDatePickerOpen(false);
      setEndDatePickerOpen(true);
    }
  };

  const handleSearch = () => {
    onSearch(
      startDate?.format("YYYY-MM-DD") || "",
      endDate?.format("YYYY-MM-DD") || "",
      selectedStatus,
      selectedHospitals,
      searchParam,
      searchValue
    );
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedHospitals([]);
    setSelectedStatus([]);
    setSearchValue("");
    setIsSelectingEndDate(false);
    setStartDatePickerOpen(false);
    setEndDatePickerOpen(false);
  };

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{
        width: "99%",
        ml: 0.5,
        padding: 1,
        boxShadow: 2,
        borderRadius: 1,
      }}
    >
      <Grid container spacing={1} sx={{ alignItems: "center", width: "100%" }}>
        <Grid size={1} sx={{ alignItems: "center" }}>
          <Typography variant="body1">
            {langFile[webLang].HISTORY_SEARCH_BOX_SELECT_PERIOD}
          </Typography>
        </Grid>
        <Grid size={6}>
          <SegmentedPillButtonsGroup
            options={[
              {
                label: langFile[webLang].HISTORY_SEARCH_PERIOD_TOTAL,
                value: "1",
              },
              {
                label: langFile[webLang].HISTORY_SEARCH_PERIOD_TODAY,
                value: "2",
              },
              {
                label: langFile[webLang].HISTORY_SEARCH_PERIOD_3DAYS,
                value: "3",
              },
              {
                label: langFile[webLang].HISTORY_SEARCH_PERIOD_1WEEK,
                value: "4",
              },
              {
                label: langFile[webLang].HISTORY_SEARCH_PERIOD_1MONTH,
                value: "5",
              },
              {
                label: langFile[webLang].HISTORY_SEARCH_PERIOD_3MONTHS,
                value: "6",
              },
              {
                label: langFile[webLang].HISTORY_SEARCH_PERIOD_6MONTHS,
                value: "7",
              },
              {
                label: langFile[webLang].HISTORY_SEARCH_PERIOD_1YEAR,
                value: "8",
              },
            ]}
            onSelect={handlePeriodSelect}
            defaultValue={"1"}
          />
        </Grid>
        <Grid
          size={5}
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={langFile[webLang].HISTORY_SEARCH_START_DATE}
              value={startDate}
              onChange={handleStartDateChange}
              onAccept={handleStartDateAccept}
              open={startDatePickerOpen}
              onOpen={() => setStartDatePickerOpen(true)}
              onClose={() => setStartDatePickerOpen(false)}
              maxDate={today}
              format="YYYY-MM-DD"
              slotProps={{
                textField: {
                  size: "small",
                  sx: { width: "170px" },
                  onClick: () => handleDatePickerClick(),
                  inputProps: {
                    readOnly: true,
                  },
                },
              }}
            />
            <Typography variant="body2">~</Typography>
            <DatePicker
              label={langFile[webLang].HISTORY_SEARCH_END_DATE}
              value={endDate}
              onChange={handleEndDateChange}
              onAccept={handleEndDateAccept}
              ref={endDatePickerRef}
              open={endDatePickerOpen}
              onOpen={() => setEndDatePickerOpen(true)}
              onClose={() => setEndDatePickerOpen(false)}
              minDate={startDate || undefined}
              maxDate={today}
              format="YYYY-MM-DD"
              slotProps={{
                textField: {
                  size: "small",
                  sx: { width: "170px" },
                  onClick: () => handleDatePickerClick(),
                  inputProps: {
                    readOnly: true,
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        {hospitals.length > 1 && (
          <>
            <Grid size={1}>
              <Typography variant="body1" sx={{ fontSize: "13px" }}>
                {langFile[webLang].HISTORY_SEARCH_HOSPITAL_NAME}
              </Typography>
            </Grid>
            <Grid size={11} sx={{ pl: 1 }}>
              <FormControl>
                <FormGroup aria-label="hospital" row={true}>
                  {hospitals.map((hospital, i) => (
                    <FormControlLabel
                      key={i}
                      value={hospital}
                      control={
                        <Checkbox
                          checked={selectedHospitals.includes(hospital)}
                          onChange={(e) =>
                            handleHospitalChange(hospital, e.target.checked)
                          }
                        />
                      }
                      label={hospital}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
          </>
        )}

        <Grid size={1}>
          <Typography variant="body1">
            {langFile[webLang].HISTORY_SEARCH_STATUS}
          </Typography>
        </Grid>
        <Grid size={6} sx={{ pl: 1 }}>
          <FormControl>
            <FormGroup aria-label="status" row={true}>
              <FormControlLabel
                value="0"
                control={
                  <Checkbox
                    checked={selectedStatus.includes("0")}
                    onChange={(e) => handleStatusChange("0", e.target.checked)}
                  />
                }
                label={langFile[webLang].HISTORY_SEARCH_STATUS_WAITING}
              />
              <FormControlLabel
                value="1"
                control={
                  <Checkbox
                    checked={selectedStatus.includes("1")}
                    onChange={(e) => handleStatusChange("1", e.target.checked)}
                  />
                }
                label={langFile[webLang].HISTORY_SEARCH_STATUS_COMPLETED}
              />
              <FormControlLabel
                value="2"
                control={
                  <Checkbox
                    checked={selectedStatus.includes("2")}
                    onChange={(e) => handleStatusChange("2", e.target.checked)}
                  />
                }
                label={langFile[webLang].HISTORY_SEARCH_STATUS_PRESCRIBED}
              />
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid
          size={5}
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "end",
            justifyContent: "flex-end",
          }}
        >
          <Select
            size="small"
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
          >
            <MenuItem value="doctor">
              {langFile[webLang].HISTORY_SEARCH_DOCTOR}
            </MenuItem>
            <MenuItem value="specialty">
              {langFile[webLang].HISTORY_SEARCH_SPECIALTY}
            </MenuItem>
          </Select>
          <TextField
            variant="outlined"
            placeholder={langFile[webLang].HISTORY_SEARCH_SEARCH_PLACEHOLDER}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              backgroundColor: "#049EB8",
              padding: "8px 10px",
              "&:hover": { backgroundColor: "rgba(4, 158, 184, 0.8)" },
            }}
          >
            {langFile[webLang].HISTORY_SEARCH_SEARCH}
          </Button>
          <Button
            variant="contained"
            onClick={handleReset}
            sx={{
              padding: "8px 10px",
              backgroundColor: "rgba(188, 188, 188, 1)",
              "&:hover": {
                backgroundColor: "rgba(188, 188, 188, 0.8)",
              },
            }}
          >
            {langFile[webLang].HISTORY_SEARCH_RESET}
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
}
