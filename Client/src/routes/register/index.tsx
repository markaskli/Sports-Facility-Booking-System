import { zodResolver } from "@hookform/resolvers/zod";
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/register/")({
  component: RegisterComponent,
});

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

function RegisterComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormInputs) => {
    console.log("Register Data:", data);
    // Add registration API call here
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          sx={{ mb: 3 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid>
            <Link href="/login">
              Already have an account? Login
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
