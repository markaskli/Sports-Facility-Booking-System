import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

interface ReservationFormData {
  reservationDate: Dayjs;
  numberOfParticipants: number | null;
}

interface ReservationDialogProps {
  open: boolean;
  onClose: () => void;
}

// Validation Schema using Zod
const reservationSchema = z.object({
  reservationDate: z.instanceof(dayjs as unknown as typeof Dayjs, {
    message: "End Time is required.",
  }),
  numberOfParticipants: z
    .number()
    .min(1, { message: "Number of participants must be at least 1" })
    .or(z.literal(""))
    .optional(),
});

const CreateReservationDialog = ({ open, onClose }: ReservationDialogProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
  });

  const onSubmit = (data: ReservationFormData) => {
    console.log("Reservation Data:", data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle>Add Reservation</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: 400 }}
        >
          {/* Reservation Date */}
          <Box mb={2}>
            <Controller
              name="reservationDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value || null}
                  label="Reservation Date"
                  onChange={(newValue) => field.onChange(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              )}
            />
            {errors.reservationDate && (
              <Box color="error.main" fontSize="0.8rem">
                {errors.reservationDate.message}
              </Box>
            )}
          </Box>

          {/* Number of Participants */}
          <Box mb={2}>
            <Controller
              name="numberOfParticipants"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Number of Participants"
                  type="number"
                  fullWidth
                />
              )}
            />
            {errors.numberOfParticipants && (
              <Box color="error.main" fontSize="0.8rem">
                {errors.numberOfParticipants.message}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          color="primary"
        >
          Add Reservation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateReservationDialog;
