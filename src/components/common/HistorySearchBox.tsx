import { useContext, useState } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import {
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

export default function HistorySearchBox() {
  const { lang } = useContext(LanguageContext);
  const [period, setPeriod] = useState<string>("1");

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{ width: "100%", padding: 1, boxShadow: 5, borderRadius: 1 }}
    >
      <Stack direction="row" spacing={2}>
        <Typography variant="body1">
          {langFile[lang].HISTORY_SEARCH_BOX_SELECT_PERIOD}
        </Typography>
        <SegmentedPillButtonsGroup
          options={[
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
          ]}
          onSelect={(value) => setPeriod(value)}
          style={{ width: "30%" }}
        />
        {/* <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
        </Select> */}
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography variant="body1">
          {langFile[lang].HISTORY_SEARCH_HOSPITAL_NAME}
        </Typography>
        <Select>
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
        </Select>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography variant="body1">
          {langFile[lang].HISTORY_SEARCH_STATUS}
        </Typography>
        <Select>
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
        </Select>
      </Stack>
    </Stack>
  );
}
