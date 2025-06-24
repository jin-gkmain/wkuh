import { Stack, Typography, Grid, TextField } from "@mui/material";
import langFile from "@/lang";

type PatientLayoutProps = {
  patientInfo: MobilePatient;
  lang: string;
};

export default function PatientInfoLayout({
  patientInfo,
  lang,
}: PatientLayoutProps) {
  console.log("patientInfo in layout >", patientInfo);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "white", // 배경색 (필요시 'rgba(255, 255, 255, 0.9)' 등으로 변경)
        zIndex: 10, // 슬라이더 위에 표시
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
        paddingTop: "100px",
        overflowY: "auto",
      }}
    >
      <Grid container spacing={2} sx={{ width: "90%" }}>
        <Grid size={12}>
          <PatientInfoItem
            value={patientInfo?.p_name_eng || ""}
            label={langFile[lang].MOBILE_PRELIMINARY_PATIENTNAME_INPUT_DESC}
          />
        </Grid>
        <Grid size={12}>
          <PatientInfoItem
            value={patientInfo?.p_birthday || ""}
            label={langFile[lang].MOBILE_PRELIMINARY_PATIENTBIRTHDAY_INPUT_DESC}
          />
        </Grid>
        <Grid size={6}>
          <PatientInfoItem
            value={
              calculateAgeFromYYYYMMDD(patientInfo?.p_birthday || "") > 0
                ? calculateAgeFromYYYYMMDD(
                    patientInfo?.p_birthday || ""
                  ).toString()
                : ""
            }
            label={langFile[lang].MOBILE_PRELIMINARY_PATIENTAGE_INPUT_DESC}
          />
        </Grid>
        <Grid size={6}>
          <PatientInfoItem
            value={patientInfo?.p_tall || ""}
            label={langFile[lang].MOBILE_PRELIMINARY_PATIENTHEIGHT_INPUT_DESC}
          />
        </Grid>
        <Grid size={6}>
          <PatientInfoItem
            value={patientInfo?.p_sex || ""}
            label={langFile[lang].MOBILE_PRELIMINARY_PATIENTGENDER_INPUT_DESC}
          />
        </Grid>
        <Grid size={6}>
          <PatientInfoItem
            value={patientInfo?.p_weight || ""}
            label={langFile[lang].MOBILE_PRELIMINARY_PATIENTWEIGHT_INPUT_DESC}
          />
        </Grid>
      </Grid>
    </div>
  );
}

function PatientInfoItem({ value, label }: { value: string; label: string }) {
  return (
    <Stack direction="column" spacing={2}>
      <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        {label}
      </Typography>
      <TextField
        disabled
        value={value || ""}
        sx={{
          borderRadius: "10px",
          border: "1px solid #EEEEEE",
          backgroundColor: "#F8F8F8",
        }}
        slotProps={{
          input: {
            sx: {
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: "10px",
              border: "none",
              padding: "0px",
            },
          },
        }}
      />
    </Stack>
  );
}

function calculateAgeFromYYYYMMDD(birthDateString: string): number {
  // 입력 문자열 길이 확인 및 숫자 여부 확인 (선택 사항이지만 유효성 검사에 좋음)
  if (birthDateString.length !== 8 || !/^\d+$/.test(birthDateString)) {
    console.error(
      "유효하지 않은 생년월일 형식입니다. 'YYYYMMDD' 8자리 숫자를 입력해주세요."
    );
    return -1;
  }

  // YYYY-MM-DD 형식으로 변환하여 Date 객체 생성
  const year = parseInt(birthDateString.substring(0, 4), 10);
  const month = parseInt(birthDateString.substring(4, 6), 10) - 1; // 월은 0부터 시작하므로 -1
  const day = parseInt(birthDateString.substring(6, 8), 10);

  const birthDate = new Date(year, month, day);
  const today = new Date();

  // 변환된 Date 객체가 유효한 날짜인지 확인 (예: 2월 30일 같은 경우)
  // Date 객체는 유효하지 않은 날짜를 입력하면 자동으로 다음 달로 넘어갈 수 있으므로,
  // 다시 getFullYear, getMonth, getDate를 통해 원본과 일치하는지 확인합니다.
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month ||
    birthDate.getDate() !== day
  ) {
    console.error(
      "유효하지 않은 생년월일입니다. 실제 존재하지 않는 날짜입니다."
    );
    return -1;
  }

  let age = today.getFullYear() - birthDate.getFullYear();

  // 생일이 아직 지나지 않았는지 확인
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // 생년월일이 현재 날짜보다 미래인 경우
  if (age < 0) {
    return -1; // 또는 0을 반환하거나 적절하게 처리
  }
  return age;
}
