import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useUpdateTimeSlotMutation } from "../../mutations/timeSlotMutations";

const timeSlotSchema = z
  .object({
    startTime: z.instanceof(dayjs as unknown as typeof Dayjs, {
      message: "Start Time is required and must be a valid time.",
    }),
    endTime: z.instanceof(dayjs as unknown as typeof Dayjs, {
      message: "End Time is required and must be a valid time.",
    }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time cannot be earlier than start time.",
    path: ["endTime"],
  });

interface TimeSlotFormData extends z.infer<typeof timeSlotSchema> {}

interface EditTimeSlotDialogProps {
  open: boolean;
  timeSlotData: TimeSlotFormData;
  timeSlotId: number;
  facilityId: number;
  onClose: () => void;
  setSnackBarMessage: (input: string) => void;
  setDisplayOfSnackBarMessage: (value: boolean) => void;
}

const EditTimeSlotDialog = ({
  open,
  timeSlotData,
  timeSlotId,
  facilityId,
  onClose,
  setSnackBarMessage,
  setDisplayOfSnackBarMessage,
}: EditTimeSlotDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimeSlotFormData>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      startTime: dayjs(timeSlotData.startTime).tz("Europe/Vilnius"),
      endTime: dayjs(timeSlotData.endTime).tz("Europe/Vilnius"),
    },
  });

  const handleClose = () => {
    reset(); // Reset form state when dialog closes
    onClose();
  };

  const updateTimeSlotMutation = useUpdateTimeSlotMutation(timeSlotId);

  const submitHandler = (data: TimeSlotFormData) => {
    // Illegal activities
    const startTime = data.startTime;
    const endTime = data.endTime;

    const startHour = startTime.hour()+2; // Extract hours
    const startMinute = startTime.minute(); // Extract minutes
    const endHour = endTime.hour()+2; // Extract hours
    const endMinute = endTime.minute(); // Extract minutes

    // Create new Date objects with extracted time and the desired timezone offset (+02:00 for Vilnius)
    const startTimeWithTimeZone = new Date(
      `1901-01-01T${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}:00+02:00`
    );
    const endTimeWithTimeZone = new Date(
      `1901-01-01T${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}:00+02:00`
    );

    updateTimeSlotMutation.mutate(
      {
        facilityId: facilityId,
        payload: {
          startTime: startTimeWithTimeZone.toISOString(),
          endTime: endTimeWithTimeZone.toISOString(),
        },
      },
      {
        onSuccess: () => {
          setSnackBarMessage("Time Slot updated successfully!");
          setDisplayOfSnackBarMessage(true);
          handleClose();
        },
        onError: (error: any) => {
          setSnackBarMessage(
            error.response?.data?.message ||
              "Failed to update time slot. Please try again."
          );
          setDisplayOfSnackBarMessage(true);
        },
      }
    );
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle>Edit Time Slot</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submitHandler)}>
          {/* Start Time */}
          <Box padding={1}>
            <Box mb={2}>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <>
                    <TimePicker
                      {...field}
                      value={field.value}
                      timezone="Europe/Vilnius"
                      onChange={(newValue) => field.onChange(newValue)}
                      ampm={false}
                      label="Start Time"
                      views={["hours", "minutes"]}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                    {errors.startTime && (
                      <Box mt={0.5} color="error.main" fontSize="0.8rem">
                        {errors.startTime.message}
                      </Box>
                    )}
                  </>
                )}
              />
            </Box>

            <Box mb={2}>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <>
                    <TimePicker
                      {...field}
                      value={field.value}
                      timezone="Europe/Vilnius"
                      ampm={false}
                      onChange={(newValue) => field.onChange(newValue)}
                      label="End Time"
                      views={["hours", "minutes"]}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                    {errors.endTime && (
                      <Box mt={0.5} color="error.main" fontSize="0.8rem">
                        {errors.endTime.message}
                      </Box>
                    )}
                  </>
                )}
              />
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
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTimeSlotDialog;
