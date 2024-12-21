import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePageComponent,
});

// Modal styles
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

export function HomePageComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Typography
          variant="h3"
          component="h1"
          textAlign="center"
          color="primary"
          gutterBottom
        >
          Welcome to Facilities Reservations
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mb: 4 }}>
          Effortlessly book sports facilities and manage your reservations.
        </Typography>

        <Grid container spacing={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Reserve Facilities
              </Typography>
              <Typography variant="body2">
                Browse and book your favorite sports facilities easily.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={handleModalOpen}>
                Learn More
              </Button>
            </CardActions>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Manage Time Slots
              </Typography>
              <Typography variant="body2">
                Ensure optimal scheduling with efficient slot management.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={handleModalOpen}>
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Container>
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            About This Feature
          </Typography>
          <Typography sx={{ mt: 2 }}>
            This feature helps you better manage your reservations and time
            slots for sports facilities.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleModalClose}
            sx={{ mt: 3 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
