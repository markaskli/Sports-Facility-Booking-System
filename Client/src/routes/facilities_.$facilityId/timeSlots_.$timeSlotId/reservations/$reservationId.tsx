import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Divider,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import EditReservationDialog from "../../../../components/reservation/editReservationDialogs";
import DeleteReservationDialog from "../../../../components/reservation/deleteReservationDialog";
import { getReservationByIdQuery } from "../../../../mutations/reservationMutations";
import { useUser } from "../../../../contexts/userContext";

export const Route = createFileRoute(
  "/facilities_/$facilityId/timeSlots_/$timeSlotId/reservations/$reservationId"
)({
  component: ReservationDetails,
});

function ReservationDetails() {
  const { facilityId, timeSlotId, reservationId } = Route.useParams();

  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSnackbarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const { user } = useUser();

  const navigate = useNavigate();

  const { data, error, isLoading } = getReservationByIdQuery(
    Number(facilityId),
    Number(timeSlotId),
    Number(reservationId)
  );

  return (
    <Container>
      {isLoading ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
        >
          <Typography variant="body1" textAlign="center" sx={{ mb: 4 }}>
            Loading reservation information...
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
            Reservation data not found.
          </Typography>
        </Box>
      ) : (
        <>
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
                  <strong>Name:</strong> {data.userName || "N/A"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong> {data.userEmail || "N/A"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Status:</strong> {data.reservationStatus || "N/A"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Reservation Date:</strong>{" "}
                  {data.reservationDate
                    ? new Date(data.reservationDate).toLocaleDateString("lt-LT")
                    : "Not Specified"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Number of Participants:</strong>{" "}
                  {data.numberOfParticipants ?? "Not Specified"}
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
                {data?.userId === user?.id ||
                user?.roles.some((role: string) => role === "SystemAdministrator") ? (
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
                ) : null}
              </Box>
            </CardContent>
          </Card>
          <EditReservationDialog
            open={isEditDialogOpen}
            reservationData={data}
            facilityId={Number(facilityId)}
            onClose={() => setEditDialogOpen(false)}
            setSnackBarMessage={(message) => setSnackBarMessage(message)}
            setDisplayOfSnackBarMessage={(status) => setSnackBarOpen(status)}
          />
          <DeleteReservationDialog
            open={isDeleteDialogOpen}
            facilityId={Number(facilityId)}
            timeSlotId={Number(timeSlotId)}
            reservationId={Number(reservationId)}
            reservationDate={data?.reservationDate}
            onClose={() => setDeleteDialogOpen(false)}
            setSnackBarMessage={(message) => setSnackBarMessage(message)}
            setDisplayOfSnackBarMessage={(status) => setSnackBarOpen(status)}
          />
        </>
      )}
  
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
