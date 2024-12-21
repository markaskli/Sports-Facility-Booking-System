import { Container, Typography, Box, TextField, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginUser } from "../../queries/authQueries";
import { useUser } from "../../contexts/userContext";

export const Route = createFileRoute("/login/")({
  component: LoginComponent,
});

const loginSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginComponent() {
  const { setUser } = useUser();
  const navigate = useNavigate({ from: "/login" });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const responseData = await LoginUser(data);
      setUser({
        userName: responseData.userName,
        email: responseData.email,
        role: "temp",
      });
      navigate({ to: "/" });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 8,
      }}
    >
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <TextField
          label="Username"
          type="userName"
          fullWidth
          {...register("userName")}
          error={!!errors.userName}
          helperText={errors.userName?.message}
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
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid>
            <Button component={Link} to="/register">
              Don't have an account? Register
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
