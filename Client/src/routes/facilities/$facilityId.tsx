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
import { createFileRoute, Outlet } from "@tanstack/react-router";
import Grid from "@mui/material/Grid2";
import TimeSlotCard from "../../components/timeSlot/timeSlotCard";
import EditFacilityDialog from "../../components/facility/editFacilityDialog";
import { useState } from "react";
import DeleteFacilityDialog from "../../components/facility/deleteFacilityDialog";
import CreateTimeSlotDialog from "../../components/timeSlot/createTimeSlotDialog";
import { getFacilityByIdQuery } from "../../mutations/facilityMutations";
import { TimeSlotDto } from "../../models/timeSlot";

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

  const handleOpenEditDialog = () => setEditDialogOpen(true);
  const handleCloseEditDialog = () => setEditDialogOpen(false);

  const handleOpenDeleteDialog = () => setDeleteDialogOpen(true);
  const handleCloseDeleteDialog = () => setDeleteDialogOpen(false);

  const { data, error, isLoading } = getFacilityByIdQuery(Number(facilityId));

  return (
    <Container>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Container>
          <Box
            mt={3}
            mb={4}
            sx={{
              display: "flex",
              flexDirection: "row", // Display side by side (left and right)
              alignItems: "flex-start", // Align items at the top
            }}
          >
            {/* Facility Image */}
            {data.pictureUrl && (
              <Box
                sx={{
                  flexShrink: 0, // Prevent the image from shrinking
                  width: "30%", // Set a fixed width for the image (adjust as needed)
                  mr: 3, // Margin-right to give space between image and text
                }}
              >
                <img
                  src={data.pictureUrl}
                  alt={data.name}
                  style={{
                    width: "100%", // Make the image fill the width of the container
                    height: "auto", // Maintain the aspect ratio
                    borderRadius: "8px", // Optional: rounded corners
                    objectFit: "cover", // Optional: maintain aspect ratio and cover the area
                  }}
                />
              </Box>
            )}

            {/* Facility Details */}
            <Box sx={{ flex: 1 }}>
              {/* Facility Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h4" component="h1" gutterBottom>
                  {data.name}
                </Typography>
                <Box>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleOpenEditDialog}
                  >
                    Edit Facility
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleOpenDeleteDialog}
                    sx={{ ml: 2 }}
                  >
                    Delete Facility
                  </Button>
                </Box>
              </Box>

              {/* Facility Description */}
              <Typography variant="body1" sx={{ mb: 2 }}>
                {data.description}
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Location: {data.address}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Contact: {data.emailAddress} | {data.phoneNumber}
                </Typography>
              </Box>

              {/* Facility Time Slots */}
              <Divider sx={{ mb: 2 }} />
              <Box display={"flex"} justifyContent={"space-between"} mb={2}>
                <Typography variant="h6" gutterBottom>
                  Current Time Slots
                </Typography>
                <Button
                  variant="outlined"
                  color="success"
                  size="small"
                  onClick={() => setCreateTimeSlotDialogOpen(true)}
                >
                  Add Time Slot
                </Button>
              </Box>

              <Grid container spacing={2}>
                {data.timeSlots.length > 0 ? (
                  data.timeSlots.map((slot: TimeSlotDto) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={slot.id}>
                      <TimeSlotCard timeSlot={slot} />
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body1" color="textSecondary">
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
    </Container>
  );
}
