import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTimeSlotMutation } from "../../mutations/timeSlotMutations";

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

interface CreateTimeSlotDialogProps {
  open: boolean;
  facilityId: number;
  onClose: () => void;
  setSnackBarMessage: (input: string) => void;
  setDisplayOfSnackBarMessage: (value: boolean) => void;
}

const CreateTimeSlotDialog = ({
  open,
  facilityId,
  onClose,
  setSnackBarMessage,
  setDisplayOfSnackBarMessage,
}: CreateTimeSlotDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimeSlotFormData>({
    resolver: zodResolver(timeSlotSchema),
  });

  const handleClose = () => {
    reset(); // Reset form state when dialog closes
    onClose();
  };

  const createTimeSlotMutation = useCreateTimeSlotMutation();

  const submitHandler = (data: TimeSlotFormData) => {
    createTimeSlotMutation.mutate(
      {
        facilityId,
        createDto: {
          startTime: new Date(data.startTime.format("l LT")),
          endTime: new Date(data.endTime.format("l LT")),
        },
      },
      {
        onSuccess: () => {
          setSnackBarMessage("Time Slot created successfully!");
          setDisplayOfSnackBarMessage(true);
          handleClose();
        },
        onError: (error: any) => {
          setSnackBarMessage(
            error.response?.data?.message ||
              "Failed to create Time Slot. Please try again."
          );
          setDisplayOfSnackBarMessage(true);
        },
      }
    );
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle>Create Time Slot</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(submitHandler)}
          maxWidth="400px"
          mx="auto"
        >
          <Box padding={1}>
            <Box mb={2}>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <>
                    <TimePicker
                      {...field}
                      value={field.value || null}
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
                      value={field.value || null}
                      onChange={(newValue) => field.onChange(newValue)}
                      ampm={false}
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
        </Box>
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

export default CreateTimeSlotDialog;
