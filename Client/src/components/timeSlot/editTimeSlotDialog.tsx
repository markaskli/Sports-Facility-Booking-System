import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

const timeSlotSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

interface TimeSlotFormData extends z.infer<typeof timeSlotSchema> {}

interface EditTimeSlotDialogProps {
  open: boolean;
  onClose: () => void;
  timeSlotData: TimeSlotFormData;
}

const EditTimeSlotDialog = ({
  open,
  onClose,
  timeSlotData,
}: EditTimeSlotDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimeSlotFormData>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: timeSlotData,
  });

  const handleClose = () => {
    reset(); // Reset form state when dialog closes
    onClose();
  };

  const submitHandler = (data: TimeSlotFormData) => {
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Time Slot</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submitHandler)}>
          {/* Start Time */}
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Start Time"
                type="datetime-local"
                fullWidth
                margin="normal"
                error={!!errors.startTime}
                helperText={errors.startTime?.message}
              />
            )}
          />

          {/* End Time */}
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="End Time"
                type="datetime-local"
                fullWidth
                margin="normal"
                error={!!errors.endTime}
                helperText={errors.endTime?.message}
              />
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(submitHandler)}
          color="primary"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTimeSlotDialog;
