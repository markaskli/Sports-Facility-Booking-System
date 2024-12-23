import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Grid from "@mui/material/Grid2";
import { formatTime } from "../../../components/utils/dateUtils";
import ReservationCard from "../../../components/reservation/reservationCard";
import EditTimeSlotDialog from "../../../components/timeSlot/editTimeSlotDialog";
import { useState } from "react";
import DeleteTimeSlotDialog from "../../../components/timeSlot/deleteTimeSlotDialog";
import CreateReservationDialog from "../../../components/reservation/createReservationDialog";
import { getTimeSlotByIdQuery } from "../../../mutations/timeSlotMutations";
import { ReservationDto } from "../../../models/reservation";
import { useUser } from "../../../contexts/userContext";

export const Route = createFileRoute(
  "/facilities_/$facilityId/timeSlots/$timeSlotId"
)({
  component: TimeSlotDetails,
});

function TimeSlotDetails() {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isCreateReservationDialogOpen, setCreateReservationDialogOpen] =
    useState(false);
  const [isSnackbarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const { facilityId, timeSlotId } = Route.useParams();

  const { user } = useUser();

  const navigate = useNavigate();

  const { data, error, isLoading } = getTimeSlotByIdQuery(
    Number(facilityId),
    Number(timeSlotId)
  );

  return (
    <>
      {isLoading ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
        >
          <Typography variant="body1" textAlign="center" sx={{ mb: 4 }}>
            Loading time slot information...
          </Typography>
          <CircularProgress />
        </Box>
      ) : error || !data ? (
        // Handle error or if data is undefined/null
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
        >
          <Typography variant="body1" textAlign="center" sx={{ mb: 4 }}>
            Time slot information not found.
          </Typography>
        </Box>
      ) : (
        <>
          <Card sx={{ mb: 4 }}>
            {/* Page Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ p: 2 }}
            ></Box>

            <CardContent>
              {/* Time Slot Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
                sx={{
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 0 },
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate({ to: `/facilities/${facilityId}` })}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Back
                </Button>
                <Typography
                  variant="h5"
                  textAlign={{ xs: "center", sm: "left" }}
                >
                  {data?.startTime
                    ? formatTime(data.startTime)
                    : "Start time unavailable"}{" "}
                  -
                  {data?.endTime
                    ? formatTime(data.endTime)
                    : "End time unavailable"}
                </Typography>
                {data?.createdById === user?.id ||
                user?.roles.some((role) => role === "SystemAdministrator") ? (
                  <Box display="flex" flexDirection={"row"} gap={1}>
                    <Button
                      variant="outlined"
                      color="warning"
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                      onClick={() => setEditDialogOpen(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      Delete
                    </Button>
                  </Box>
                ) : null}
              </Box>
              <Divider sx={{ my: 2 }} />
              {/* Reservations Section */}
              <Box display={"flex"} justifyContent={"space-between"} mb={2}>
                <Typography variant="h6" gutterBottom>
                  Reservations ({data?.reservations?.length || 0})
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setCreateReservationDialogOpen(true)}
                >
                  Add reservation
                </Button>
              </Box>
              {data?.reservations?.length > 0 ? (
                <Grid container spacing={2}>
                  {data.reservations.map((reservation: ReservationDto) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={reservation.id}>
                      <ReservationCard reservation={reservation} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Typography variant="body1" color="textSecondary">
                    No reservations for this time slot.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          {/* Dialogs */}
          <EditTimeSlotDialog
            open={isEditDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            setSnackBarMessage={(message) => setSnackBarMessage(message)}
            setDisplayOfSnackBarMessage={(status) => setSnackBarOpen(status)}
            timeSlotData={{
              startTime: data?.startTime,
              endTime: data?.endTime,
            }}
            timeSlotId={Number(timeSlotId)}
            facilityId={Number(facilityId)}
          />
          <DeleteTimeSlotDialog
            open={isDeleteDialogOpen}
            facilityId={Number(facilityId)}
            timeSlotId={Number(timeSlotId)}
            onClose={() => setDeleteDialogOpen(false)}
            setSnackBarMessage={(message) => setSnackBarMessage(message)}
            setDisplayOfSnackBarMessage={(status) => setSnackBarOpen(status)}
          />
          <CreateReservationDialog
            open={isCreateReservationDialogOpen}
            facilityId={Number(facilityId)}
            timeSlotId={Number(timeSlotId)}
            onClose={() => setCreateReservationDialogOpen(false)}
            setSnackBarMessage={(message) => setSnackBarMessage(message)}
            setDisplayOfSnackBarMessage={(status) => setSnackBarOpen(status)}
          />
        </>
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
    </>
  );
}
