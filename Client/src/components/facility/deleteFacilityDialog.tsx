import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import { useDeleteFacilityMutation } from "../../mutations/facilityMutations";
import { useNavigate } from "@tanstack/react-router";

interface FacilityDeleteDialogProps {
  open: boolean;
  facilityName: string;
  facilityId: number;
  onClose: () => void;
  setSnackBarMessage: (input: string) => void;
  setDisplayOfSnackBarMessage: (value: boolean) => void;
}

const DeleteFacilityDialog = (props: FacilityDeleteDialogProps) => {
  const {
    facilityId,
    facilityName,
    open,
    onClose,
    setSnackBarMessage,
    setDisplayOfSnackBarMessage,
  } = props;

  const navigate = useNavigate();

  const deleteFacilityMutation = useDeleteFacilityMutation();

  const onConfirm = () => {
    deleteFacilityMutation.mutate(facilityId, {
      onSuccess: () => {
        navigate({ to: ".." });
      },
      onError: (error: any) => {
        setSnackBarMessage(
          error.response?.data?.message ||
            "Failed to delete facility. Please try again."
        );
        setDisplayOfSnackBarMessage(true);
      },
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="delete-dialog-title">
      <DialogTitle id="delete-dialog-title">Delete Facility</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete the facility{" "}
          <strong>{facilityName}</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteFacilityDialog;
