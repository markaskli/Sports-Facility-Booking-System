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
import { useCreateReservationMutation } from "../../mutations/reservationMutations";

interface ReservationFormData {
  reservationDate: Dayjs;
  numberOfParticipants: number | null;
}

interface ReservationDialogProps {
  open: boolean;
  facilityId: number;
  timeSlotId: number;
  onClose: () => void;
  setSnackBarMessage: (input: string) => void;
  setDisplayOfSnackBarMessage: (value: boolean) => void;
}

// Validation Schema using Zod
const reservationSchema = z.object({
  reservationDate: z.instanceof(dayjs as unknown as typeof Dayjs, {
    message: "End Time is required.",
  }),
  numberOfParticipants: z.coerce
    .number()
    .min(1, { message: "Number of participants must be at least 1" })
    .or(z.literal(""))
    .transform((value) => (value === "" ? null : value))
    .optional(),
});

const CreateReservationDialog = ({
  open,
  facilityId,
  timeSlotId,
  onClose,
  setSnackBarMessage,
  setDisplayOfSnackBarMessage,
}: ReservationDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
  });

  const createMutation = useCreateReservationMutation(timeSlotId);

  const onSubmit = (data: ReservationFormData) => {
    createMutation.mutate(
      {
        facilityId,
        createDto: {
          reservationDate: dayjs(data.reservationDate)
            .tz("Europe/Vilnius")
            .format(),
          numberOfParticipants: data.numberOfParticipants,
        },
      },
      {
        onSuccess: () => {
          setSnackBarMessage("Reservation created successfully!");
          setDisplayOfSnackBarMessage(true);
          reset();
          onClose();
        },
        onError: (error: any) => {
          setSnackBarMessage(
            error.response?.data?.message ||
              "Failed to create Reservation. Please try again."
          );
          setDisplayOfSnackBarMessage(true);
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Reservation</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} padding={1}>
          {/* Reservation Date */}
          <Box mb={2}>
            <Controller
              name="reservationDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value || null}
                  timezone="Europe/Vilnius"
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
        <Button onClick={handleClose} color="secondary">
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
