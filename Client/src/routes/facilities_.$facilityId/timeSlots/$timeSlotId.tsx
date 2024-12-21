import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Grid from "@mui/material/Grid2";

import { formatTime } from "../../../components/utils/dateUtils";
import ReservationCard from "../../../components/reservation/reservationCard";
import EditTimeSlotDialog from "../../../components/timeSlot/editTimeSlotDialog";
import { useState } from "react";
import DeleteTimeSlotDialog from "../../../components/timeSlot/deleteTimeSlotDialog";
import CreateReservationDialog from "../../../components/reservation/createReservationDialog";

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

  const { facilityId, timeSlotId } = Route.useParams();
  const navigate = useNavigate();

  const timeSlot = {
    id: 1,
    reservations: [
      {
        id: 1,
        userId: "4359dda1-1833-47d4-aa82-44223cc4628d",
        userName: "markas",
        userEmail: "markasmxk@gmail.com",
        reservationStatus: "Pending",
        timeSlotId: 1,
        reservationDate: "2024-10-26T00:00:00",
        numberOfParticipants: 1,
      },
      {
        id: 2,
        userId: "4359dda1-1833-47d4-aa82-44223cc4628d",
        userName: "markas",
        userEmail: "markasmxk@gmail.com",
        reservationStatus: "Pending",
        timeSlotId: 1,
        reservationDate: "2024-10-27T00:00:00",
        numberOfParticipants: 1,
      },
      {
        id: 4,
        userId: "a353f413-0dd7-4e27-afd3-a69e992632f6",
        userName: "user",
        userEmail: "user@gmail.com",
        reservationStatus: "Pending",
        timeSlotId: 1,
        reservationDate: "2024-10-28T00:00:00",
        numberOfParticipants: 1,
      },
    ],
    facilityId: 1,
    createdById: "4359dda1-1833-47d4-aa82-44223cc4628d",
    startTime: "0001-01-01T08:00:00",
    endTime: "0001-01-01T09:00:00",
  };

  return (
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
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate({ to: `/facilities/${facilityId}` })} // Navigate back to the previous page
            >
              Back
            </Button>
            <Typography variant="h5">
              {formatTime(timeSlot.startTime)} - {formatTime(timeSlot.endTime)}
            </Typography>
            <Box>
              <Button
                variant="outlined"
                color="warning"
                sx={{ mr: 1 }}
                onClick={() => setEditDialogOpen(true)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          {/* Reservations Section */}
          <Box display={"flex"} justifyContent={"space-between"} mb={2}>
            <Typography variant="h6" gutterBottom>
              Reservations ({timeSlot.reservations.length})
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setCreateReservationDialogOpen(true)}
            >
              Add reservation
            </Button>
          </Box>
          {timeSlot.reservations.length > 0 ? (
            <Grid container spacing={2}>
              {timeSlot.reservations.map((reservation) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={reservation.id}>
                  <ReservationCard reservation={reservation} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No reservations for this time slot.
            </Typography>
          )}
        </CardContent>
      </Card>
      <EditTimeSlotDialog
        open={isEditDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        timeSlotData={timeSlot}
      />
      <DeleteTimeSlotDialog
        open={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        facilityId={Number(facilityId)}
        timeSlotId={Number(timeSlotId)}
      />

      <CreateReservationDialog
        open={isCreateReservationDialogOpen}
        onClose={() => setCreateReservationDialogOpen(false)}
      />
    </>
  );
}
