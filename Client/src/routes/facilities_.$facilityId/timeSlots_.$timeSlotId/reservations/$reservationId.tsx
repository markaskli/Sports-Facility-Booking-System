import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Divider,
  Container,
} from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import EditReservationDialog from "../../../../components/reservation/editReservationDialogs";
import DeleteReservationDialog from "../../../../components/reservation/deleteReservationDialog";

export const Route = createFileRoute(
  "/facilities_/$facilityId/timeSlots_/$timeSlotId/reservations/$reservationId"
)({
  component: ReservationDetails,
});

function ReservationDetails() {
  const { facilityId, timeSlotId } = Route.useParams();
  const navigate = useNavigate();

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const reservation = {
    id: 1,
    userId: "4359dda1-1833-47d4-aa82-44223cc4628d",
    userName: "markas",
    userEmail: "markasmxk@gmail.com",
    reservationStatus: "Pending",
    timeSlotId: 1,
    reservationDate: "2024-10-26T00:00:00",
    numberOfParticipants: 1,
  };

  if (!reservation) {
    return <Typography variant="body1">Reservation not found</Typography>;
  }

  return (
    <Container>
      <Card sx={{ mt: 4, maxWidth: 600, mx: "auto", p: 2 }}>
        <CardContent>
          {/* Title */}
          <Typography variant="h5" gutterBottom align="center">
            Reservation Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Reservation Info */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Name:</strong> {reservation.userName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {reservation.userEmail}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Status:</strong> {reservation.reservationStatus}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Reservation Date:</strong>{" "}
              {new Date(reservation.reservationDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Number of Participants:</strong>{" "}
              {reservation.numberOfParticipants}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Action Buttons */}
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate({
                  to: `/facilities/${facilityId}/timeSlots/${timeSlotId}`,
                })
              }
            >
              Back
            </Button>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                color="warning"
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
        </CardContent>
      </Card>
      <EditReservationDialog
        open={isEditDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        reservationData={reservation}
      />
      <DeleteReservationDialog
        open={isDeleteDialogOpen}
        reservationId={reservation.id}
        reservationDate={reservation.reservationDate}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </Container>
  );
}
