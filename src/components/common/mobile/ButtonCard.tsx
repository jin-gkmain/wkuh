import { Box, Button, Card, CardActions,  CardContent, CardHeader, CardMedia, Icon, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import React from "react";

type props = {
  title: string;
  content: string;
  action: () => void;
  icon: React.ReactNode;
  media: string;
  buttonText: string;
}

export default function ButtonCard({ title, content, action, icon, media, buttonText }: props) {
  return (
    <Card sx={{ width: '90%', borderRadius: '20px', boxShadow: '0px 4px 32px 0px rgba(0, 0, 0, 0.1)' }}>
      <Stack direction="row" pl={1} pr={1} pb={1}>
        <Stack direction="column" sx={{ width: '65%' }}>
          <CardContent sx={{ pb: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              {icon}
              <Typography variant="button" sx={{ fontSize: '18px', fontWeight: 'bold' }}>{title}</Typography>
            </Stack>
          </CardContent>
          <CardContent sx={{ pb: 2, pt: 1}}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px' }}>{content}</Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}> 
            <Button color="primary" variant="contained" onClick={action} sx={{ width: '70%' }}>
              <Typography variant="button">{buttonText}</Typography>
            </Button>
          </CardActions>
        </Stack>
        <Box sx={{ width: '35%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CardMedia image={media} title={title} sx={{ height: 140, width: 140 }} />
        </Box>
      </Stack>
    </Card>
  );
}