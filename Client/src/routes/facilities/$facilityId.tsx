import {
  Box,
  Container,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import Grid from "@mui/material/Grid2";
import TimeSlotCard from "../../components/timeSlot/timeSlotCard";
import EditFacilityDialog from "../../components/facility/editFacilityDialog";
import { useState } from "react";
import DeleteFacilityDialog from "../../components/facility/deleteFacilityDialog";
import CreateTimeSlotDialog from "../../components/timeSlot/createTimeSlotDialog";
import { getFacilityByIdQuery } from "../../mutations/facilityMutations";
import { TimeSlotDto } from "../../models/timeSlot";
import { ImageNotSupported } from "@mui/icons-material";
import { useUser } from "../../contexts/userContext";

export const Route = createFileRoute("/facilities/$facilityId")({
  component: FacilityDetailsComponent,
});

function FacilityDetailsComponent() {
  const { facilityId } = Route.useParams();

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isCreateTimeSlotDialogOpen, setCreateTimeSlotDialogOpen] =
    useState(false);
  const [isSnackbarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const { user } = useUser();

  const handleOpenEditDialog = () => setEditDialogOpen(true);
  const handleCloseEditDialog = () => setEditDialogOpen(false);

  const handleOpenDeleteDialog = () => setDeleteDialogOpen(true);
  const handleCloseDeleteDialog = () => setDeleteDialogOpen(false);

  const { data, error, isLoading } = getFacilityByIdQuery(Number(facilityId));

  return (
    <Container>
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
            Loading facility information...
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
            Facility information could not be loaded.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Box>
      ) : (
        <Container>
          {/* Facility Details */}
          <Box sx={{ flex: 1 }}>
            {/* Facility Header */}
            <Box>
              <Box
                mt={3}
                mb={4}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" }, // Responsive layout
                  alignItems: { xs: "center", sm: "flex-start" },
                  justifyContent: "space-between",
                }}
              >
                {/* Facility Image */}
                <Box
                  sx={{
                    flexShrink: 0,
                    width: { xs: "100%", sm: "30%" }, // Responsive width
                    mb: { xs: 2, sm: 0 }, // Spacing adjustment for mobile
                    mr: { sm: 3 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {data.pictureUrl ? (
                    <img
                      src={data.pictureUrl}
                      alt={data.name}
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <ImageNotSupported
                      sx={{
                        fontSize: "64px",
                        color: "gray",
                      }}
                    />
                  )}
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ width: { xs: "100%", sm: "auto" } }} // Full width on mobile
                >
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={{
                      xs: "center", // Align center on mobile
                      sm: "flex-end", // Align flex-end on desktop (from small screens and up)
                    }}
                    sx={{
                      width: {
                        xs: "100%", // For mobile screens
                        sm: "auto", // For screens larger than 'sm'
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="h1"
                      gutterBottom
                      textAlign={{ xs: "center", sm: "left" }} // Center text on mobile
                    >
                      {data.name}
                    </Typography>
                    {data?.createdById === user?.id ||
                    user?.roles.some(
                      (role) => role === "SystemAdministrator"
                    ) ? (
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        sx={{ gap: { xs: 2, sm: 0 } }}
                      >
                        {/* Edit and Delete Buttons */}
                        <Button
                          variant="outlined"
                          color="warning"
                          onClick={handleOpenEditDialog}
                          sx={{ ml: { sm: 2, xs: 0 }, mt: { xs: 1, sm: 0 } }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={handleOpenDeleteDialog}
                          sx={{ ml: { sm: 2, xs: 0 }, mt: { xs: 1, sm: 0 } }} // Adjust spacing
                        >
                          Delete
                        </Button>
                      </Box>
                    ) : null}
                  </Box>
                </Box>
              </Box>

              {/* Facility Description */}
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  whiteSpace: "normal", // Allow wrapping
                  wordBreak: "break-word", // Handle long words
                  textAlign: { xs: "center", sm: "left" }, // Center on mobile
                }}
              >
                {data.description}
              </Typography>
              <Box
                display="flex"
                justifyContent={{ xs: "center", sm: "space-between" }}
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "center", sm: "flex-start" }}
                mb={2}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  textAlign={{ xs: "center", sm: "left" }}
                >
                  Location: {data.address}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  textAlign={{ xs: "center", sm: "right" }}
                  sx={{ mt: { xs: 1, sm: 0 } }}
                >
                  Contact: {data.emailAddress} | {data.phoneNumber}
                </Typography>
              </Box>

              {/* Facility Time Slots */}
              <Divider sx={{ mb: 2 }} />
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                mb={2}
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "center", sm: "flex-start" }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  textAlign={{ xs: "center", sm: "left" }}
                >
                  Current Time Slots
                </Typography>
                {data?.createdById === user?.id ||
                user?.roles.some((role) => role === "SystemAdministrator") ? (
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={() => setCreateTimeSlotDialogOpen(true)}
                    sx={{ mt: { xs: 1, sm: 0 } }}
                  >
                    Add Time Slot
                  </Button>
                ) : null}
              </Box>

              <Grid container spacing={2} mb={3}>
                {data.timeSlots.length > 0 ? (
                  data.timeSlots.map((slot: TimeSlotDto) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={slot.id}>
                      <TimeSlotCard timeSlot={slot} />
                    </Grid>
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    textAlign="center"
                  >
                    No time slots available.
                  </Typography>
                )}
              </Grid>
            </Box>
          </Box>
          {/* Dialogs */}
          <EditFacilityDialog
            data={data}
            open={isEditDialogOpen}
            onClose={handleCloseEditDialog}
            setSnackBarMessage={(message) => setSnackBarMessage(message)}
            setDisplayOfSnackBarMessage={(status) => setSnackBarOpen(status)}
          />
          <DeleteFacilityDialog
            facilityId={data.id}
            facilityName={data.name}
            open={isDeleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            setSnackBarMessage={(message) => setSnackBarMessage(message)}
            setDisplayOfSnackBarMessage={(status) => setSnackBarOpen(status)}
          />
          <CreateTimeSlotDialog
            facilityId={data.id}
            open={isCreateTimeSlotDialogOpen}
            onClose={() => setCreateTimeSlotDialogOpen(false)}
            setSnackBarMessage={(message) => setSnackBarMessage(message)}
            setDisplayOfSnackBarMessage={(status) => setSnackBarOpen(status)}
          />
        </Container>
      )}
      {/* Snackbar */}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={2500}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        disableWindowBlurListener
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
    </Container>
  );
}
