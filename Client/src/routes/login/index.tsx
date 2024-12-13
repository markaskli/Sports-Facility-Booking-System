import { Container, Typography, Box, TextField, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";

export const Route = createFileRoute("/login/")({
  component: LoginComponent,
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    console.log("Login Data:", data);
    // Add login API call here
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Login
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
          sx={{ mb: 3 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
        <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
          <Grid>
            <Link href="/register">
              Don't have an account? Register
            </Link>
          </Grid>
          <Grid>
            <Link href="/forgot-password" >
              Forgot Password?
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
