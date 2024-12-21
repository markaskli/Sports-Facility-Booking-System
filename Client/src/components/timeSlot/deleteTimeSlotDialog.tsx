import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface DeleteTimeSlotDialogProps {
  open: boolean;
  onClose: () => void;
  facilityId: number,
  timeSlotId: number
}

const DeleteTimeSlotDialog = ({ open, onClose }: DeleteTimeSlotDialogProps) => {
  const handleClose = () => {
    onClose();
  };

  const handleDelete = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Delete Time Slot</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this time slot?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleDelete} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTimeSlotDialog;
