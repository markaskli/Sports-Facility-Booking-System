import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useDeleteTimeSlotMutation } from "../../mutations/timeSlotMutations";
import { useNavigate } from "@tanstack/react-router";

interface DeleteTimeSlotDialogProps {
  open: boolean;
  facilityId: number;
  timeSlotId: number;
  onClose: () => void;
  setSnackBarMessage: (input: string) => void;
  setDisplayOfSnackBarMessage: (value: boolean) => void;
}

const DeleteTimeSlotDialog = ({
  open,
  facilityId,
  timeSlotId,
  onClose,
  setSnackBarMessage,
  setDisplayOfSnackBarMessage,
}: DeleteTimeSlotDialogProps) => {
  const navigate = useNavigate();
  const deleteMutation = useDeleteTimeSlotMutation(facilityId, timeSlotId);

  const handleClose = () => {
    onClose();
  };

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: `/facilities/${facilityId}` });
      },
      onError: (error: any) => {
        setSnackBarMessage(
          error.response?.data?.message ||
            "Failed to delete time slot. Please try again."
        );
        setDisplayOfSnackBarMessage(true);
      },
    });
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
