import { Stack, Typography, Grid, TextField } from "@mui/material";
import langFile from "@/lang";

type PatientLayoutProps = {
  patientInfo: Patient;
  lang: string;
};

export default function PatientInfoLayout({
  patientInfo,
  lang,
}: PatientLayoutProps) {
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
        padding: "20px",
      }}
    >
      <Grid container spacing={2} sx={{ width: "90%" }}>
        <Grid size={12}>
          <PatientInfoItem
            value={patientInfo?.u_name_eng || ""}
            label={langFile[lang].MOBILE_PRELIMINARY_PATIENTNAME_INPUT_DESC}
          />
        </Grid>
        <Grid size={12}>
          <PatientInfoItem
            value={patientInfo?.birthday || ""}
            label={langFile[lang].MOBILE_PRELIMINARY_PATIENTBIRTHDAY_INPUT_DESC}
          />
        </Grid>
        <Grid size={6}>
          <PatientInfoItem
            value={
              patientInfo?.birthday
                ? (
                    new Date().getFullYear() -
                    parseInt(patientInfo.birthday.substring(0, 4))
                  ).toString()
                : ""
            }
            label={langFile[lang].MOBILE_PRELIMINARY_PATIENTAGE_INPUT_DESC}
          />
        </Grid>
        <Grid size={6}>
          <PatientInfoItem
            value={patientInfo?.tall || ""}
            label={langFile[lang].MOBILE_PRELIMINARY_PATIENTHEIGHT_INPUT_DESC}
          />
        </Grid>
        <Grid size={6}>
          <PatientInfoItem
            value={patientInfo?.sex || ""}
            label={langFile[lang].MOBILE_PRELIMINARY_PATIENTGENDER_INPUT_DESC}
          />
        </Grid>
        <Grid size={6}>
          <PatientInfoItem
            value={patientInfo?.weight || ""}
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
