import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";

interface ReservationDeleteDialogProps {
  open: boolean;
  reservationId: number;
  reservationDate: string;
  onClose: () => void;
}

const DeleteReservationDialog = (props: ReservationDeleteDialogProps) => {
  const { reservationId, reservationDate, open, onClose } = props;

  const handleConfirm = () => {
    console.log("deleted", reservationId);
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="delete-dialog-title">
      <DialogTitle id="delete-dialog-title">Delete Reservation</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete the reservation for{" "}
          <strong>{new Date(reservationDate).toDateString()}</strong>? This
          action cannot be undone.
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
