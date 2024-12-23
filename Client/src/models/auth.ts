export type LoginDto = {
  userName: string;
  password: string;
};

export type LoginResponseDto = {
  id: string;
  userName: string;
  email: string;
  accessToken: string;
  roles: string[];
};

export type RegisterDto = {
  userName: string;
  email: string;
  password: string;
};
