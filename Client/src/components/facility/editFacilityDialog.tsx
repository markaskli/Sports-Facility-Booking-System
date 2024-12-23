import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { FacilityDto } from "../../models/facility";
import { useUpdateFacilityMutation } from "../../mutations/facilityMutations";

const facilitySchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(2, "Address is required"),
  description: z.string().nullable(),
  pictureUrl: z.union([z.literal(""), z.string().trim().url()]),
  phoneNumber: z.string().min(1, "Phone number is required").max(20),
  emailAddress: z.string().email("Must be a valid email address"),
  maxNumberOfParticipants: z.coerce
    .number()
    .min(1, "Must be at least 1")
    .or(z.literal(""))
    .transform((value) => (value === "" ? null : value))
    .optional(),
  facilityTypeId: z.number().min(1, "Facility type is required"),
});

const facilityTypeOptions = [
  { id: 1, name: "Gym" },
  { id: 2, name: "Swimming Pool" },
  { id: 3, name: "Tennis Court" },
];

interface FacilityFormData extends z.infer<typeof facilitySchema> {}

interface FacilityEditDialogProps {
  data: FacilityDto;
  open: boolean;
  onClose: () => void;
  setSnackBarMessage: (input: string) => void;
  setDisplayOfSnackBarMessage: (value: boolean) => void;
}

const EditFacilityDialog = (props: FacilityEditDialogProps) => {
  const {
    onClose,
    data,
    open,
    setSnackBarMessage,
    setDisplayOfSnackBarMessage,
  } = props;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FacilityFormData>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: data.name,
      address: data.address,
      description: data.description,
      pictureUrl: data.pictureUrl as string | undefined,
      phoneNumber: data.phoneNumber,
      emailAddress: data.emailAddress,
      maxNumberOfParticipants: data.maxNumberOfParticipants ?? undefined,
      facilityTypeId: 1,
    },
  });

  const editFacilityMutation = useUpdateFacilityMutation();

  const handleClose = () => {
    reset(); // Reset the form when closing the dialog
    onClose();
  };

  const submitHandler = (data: FacilityFormData) => {
    editFacilityMutation.mutate(
      {
        id: props.data.id,
        maxNumberOfParticipants: data.maxNumberOfParticipants ?? undefined,
        ...data,
      },
      {
        onSuccess: () => {
          setSnackBarMessage("Facility updated successfully!");
          setDisplayOfSnackBarMessage(true);
          handleClose();
        },
        onError: (error: any) => {
          setSnackBarMessage(
            error.response?.data?.message ||
              "Failed to update facility. Please try again."
          );
          setDisplayOfSnackBarMessage(true);
        },
      }
    );
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Facility</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address"
                fullWidth
                margin="normal"
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            )}
          />
          <Controller
            name="pictureUrl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Picture URL"
                fullWidth
                margin="normal"
                error={!!errors.pictureUrl}
                helperText={errors.pictureUrl?.message}
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone Number"
                fullWidth
                margin="normal"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            )}
          />
          <Controller
            name="emailAddress"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email Address"
                fullWidth
                margin="normal"
                error={!!errors.emailAddress}
                helperText={errors.emailAddress?.message}
              />
            )}
          />
          <Controller
            name="maxNumberOfParticipants"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Max Number of Participants"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.maxNumberOfParticipants}
                helperText={errors.maxNumberOfParticipants?.message}
              />
            )}
          />
          <Controller
            name="facilityTypeId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Facility Type"
                select
                fullWidth
                margin="normal"
                error={!!errors.facilityTypeId}
                helperText={errors.facilityTypeId?.message}
              >
                {facilityTypeOptions.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
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

export default EditFacilityDialog;
