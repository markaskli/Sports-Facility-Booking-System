import { Box, Typography } from "@mui/material";

export default function Footer() {
    return (
      <Box
        component="footer"
        sx={{
          bgcolor: "primary.main",
          color: "white",
          textAlign: "center",
          p: 2,
          mt: "auto",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Markas Klimovas IFF-1/2
        </Typography>
      </Box>
    );
  }