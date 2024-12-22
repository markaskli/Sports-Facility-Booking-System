import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import { useDeleteReservationMutation } from "../../mutations/reservationMutations";
import { useNavigate } from "@tanstack/react-router";

interface ReservationDeleteDialogProps {
  open: boolean;
  facilityId: number;
  timeSlotId: number;
  reservationId: number;
  reservationDate: string;
  onClose: () => void;
  setSnackBarMessage: (input: string) => void;
  setDisplayOfSnackBarMessage: (value: boolean) => void;
}

const DeleteReservationDialog = (props: ReservationDeleteDialogProps) => {
  const {
    facilityId,
    timeSlotId,
    reservationId,
    reservationDate,
    open,
    onClose,
    setSnackBarMessage,
    setDisplayOfSnackBarMessage,
  } = props;
  const navigate = useNavigate();

  const deleteMutation = useDeleteReservationMutation(
    reservationId,
    timeSlotId
  );

  const handleConfirm = () => {
    deleteMutation.mutate(
      {
        facilityId,
      },
      {
        onSuccess: () => {
          navigate({ to: `/facilities/${facilityId}/timeSlots/${timeSlotId}` });
        },
        onError: (error: any) => {
          setSnackBarMessage(
            error.response?.data?.message ||
              "Failed to delete reservation. Please try again."
          );
          setDisplayOfSnackBarMessage(true);
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="delete-dialog-title">
      <DialogTitle id="delete-dialog-title">Delete Reservation</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete the reservation for{" "}
          <strong>
            {new Date(reservationDate).toLocaleDateString("lt-LT")}
          </strong>
          ? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteReservationDialog;
