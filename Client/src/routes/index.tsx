import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  createTheme,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#1E88E5",
    },
    secondary: {
      main: "#FFC107",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
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

export function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // User login state (mocked here)

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const handleSettingsMenuClose = () => setIsSettingsMenuOpen(false);
  const toggleLogin = () => {
    setIsUserLoggedIn((prev) => !prev); // Toggle login/logout status
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu">
              {/* <MenuIcon /> */}
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sports Booking
          </Typography>
          {!isMobile && (
            <Link color="inherit" to="/facilities">
              Facilities
            </Link>
          )}
          {!isMobile && (
            <Link color="inherit" to="/reservations">
              Reservations
            </Link>
          )}

          {/* Display login button when user is not logged in */}
          {!isUserLoggedIn ? (
            <Button color="inherit" onClick={toggleLogin}>
              Login
            </Button>
          ) : (
            <>
              {/* Display icon when user is logged in */}
              <IconButton color="inherit">
                {/* <AccountCircle /> */}
              </IconButton>
              {/* Add logout option in settings menu */}
              <Menu
                open={isSettingsMenuOpen}
                onClose={handleSettingsMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={toggleLogin}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          textAlign="center"
          color="primary"
          gutterBottom
        >
          Welcome to Sports Booking
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

      <Box
        component="footer"
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 2,
          mt: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Markas Klimovas IFF-1/2
        </Typography>
      </Box>

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
    </ThemeProvider>
  );
}
