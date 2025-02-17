import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CardActionArea,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { createFileRoute, Link } from "@tanstack/react-router";
import CreateFacilityDialog from "../../components/facility/createFacilityDialog";
import { useState } from "react";
import { getFacilitiesQuery } from "../../mutations/facilityMutations";
import { FacilityDto } from "../../models/facility";
import { useUser } from "../../contexts/userContext";

export const Route = createFileRoute("/facilities/")({
  component: FacilitiesComponent,
});

function FacilitiesComponent() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSnackbarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const { user } = useUser();

  const { data, error, isLoading } = getFacilitiesQuery();

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <Typography variant="body1" textAlign="center" sx={{ mb: 4 }}>
            Loading facilities...
          </Typography>
          <CircularProgress />
        </Box>
      ) : error || !data ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <Typography variant="body1" textAlign="center" sx={{ mb: 4 }}>
            Information about facilities could not be loaded.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Container sx={{ mt: 4 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              my={3}
            >
              <Typography variant="h4" component="h1">
                Facilities
              </Typography>
              {user?.roles.some(
                (role) =>
                  role === "FacilityAdministrator" ||
                  role === "SystemAdministrator"
              ) ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenDialog}
                >
                  Add Facility
                </Button>
              ) : null}
            </Box>

            <Typography variant="body1" textAlign="center" sx={{ mb: 4 }}>
              Browse through our available sports facilities and book your
              favorite one.
            </Typography>

            {/* Facilities List */}
            {data && data.length > 0 ? (
              <Grid container spacing={4} justifyContent="center">
                {data.map((facility: FacilityDto) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={facility.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardActionArea
                        component={Link}
                        to={`/facilities/${facility.id}`}
                      >
                        <CardContent>
                          <Box mb={3}>
                            <Typography variant="h5" component="div">
                              {facility.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {facility.description}
                            </Typography>
                          </Box>
                          <Chip
                            label={facility.facilityType}
                            size="small"
                          ></Chip>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography
                variant="h6"
                textAlign="center"
                color="text.secondary"
                sx={{ mt: 4 }}
              >
                No facilities available. Please add a new facility.
              </Typography>
            )}

            <CreateFacilityDialog
              open={isDialogOpen}
              onClose={handleCloseDialog}
              setSnackBarMessage={(message) => setSnackBarMessage(message)}
              setDisplayOfSnackBarMessage={(status) => setSnackBarOpen(status)}
            />
          </Container>
        </Box>
      )}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={2500}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        onClose={() => {
          setSnackBarOpen(false);
          setSnackBarMessage("");
        }}
      >
        <Alert
          onClose={() => {
            setSnackBarOpen(false);
            setSnackBarMessage("");
          }}
          variant="filled"
          severity={
            snackBarMessage.includes("successfully") ? "success" : "error"
          }
          sx={{ width: "100%" }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
