import axiosInstance from "../axiosInstance";
import { LoginDto, LoginResponseDto, RegisterDto } from "../models/auth";

export const LoginUser = async (
  request: LoginDto
): Promise<LoginResponseDto> => {
  const { data } = await axiosInstance.post("/Authentication/login", request);

  const { accessToken, userName, email } = data;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify({ userName, email }));
  }

  return data;
};

export const RegisterUser = async (request: RegisterDto): Promise<void> => {
  await axiosInstance.post("/Authentication/register", request);
};

export const RefreshToken = async () => {
  const { data } = await axiosInstance.post("/Authentication/accessToken");
  return data;
};

export const LogoutUser = async () => {
  await axiosInstance.post("/Authentication/logout");
  localStorage.removeItem("accessToken");
};
