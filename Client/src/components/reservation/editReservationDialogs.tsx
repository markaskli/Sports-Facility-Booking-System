import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { ReservationDto } from "../../models/reservation";
import { useUpdateReservationMutation } from "../../mutations/reservationMutations";

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

// TypeScript Interface
interface ReservationFormData extends z.infer<typeof reservationSchema> {}

interface EditReservationDialogProps {
  open: boolean;
  reservationData: ReservationDto;
  facilityId: number;
  onClose: () => void;
  setSnackBarMessage: (input: string) => void;
  setDisplayOfSnackBarMessage: (value: boolean) => void;
}

const EditReservationDialog = ({
  open,
  reservationData,
  facilityId,
  onClose,
  setSnackBarMessage,
  setDisplayOfSnackBarMessage,
}: EditReservationDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      reservationDate: dayjs(reservationData.reservationDate).tz(
        "Europe/Vilnius"
      ),
      numberOfParticipants: reservationData.numberOfParticipants ?? undefined,
    },
  });

  const updateMutation = useUpdateReservationMutation(
    reservationData.id,
    reservationData.timeSlotId
  );

  const handleClose = () => {
    reset(); // Reset form state when dialog closes
    onClose();
  };

  const submitHandler = (data: ReservationFormData) => {
    updateMutation.mutate(
      {
        facilityId,
        payload: {
          reservationDate: data.reservationDate.format(),
          numberOfParticipants: data.numberOfParticipants,
        },
      },
      {
        onSuccess: () => {
          setSnackBarMessage("Reservation updated successfully!");
          setDisplayOfSnackBarMessage(true);
          reset();
          onClose();
        },
        onError: (error: any) => {
          setSnackBarMessage(
            error.response?.data?.message ||
              "Failed to update Reservation. Please try again."
          );
          setDisplayOfSnackBarMessage(true);
        },
      }
    );
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Reservation</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submitHandler)}>
          {/* Reservation Date */}
          <Box padding={1}>
            <Box mb={2}>
              <Controller
                name="reservationDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={field.value}
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
                    margin="normal"
                    error={!!errors.numberOfParticipants}
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditReservationDialog;
