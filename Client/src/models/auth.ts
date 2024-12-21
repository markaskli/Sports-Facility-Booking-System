export type LoginDto = {
    userName: string
    password: string
}

export type LoginResponseDto = {
    userName: string,
    email: string,
    accessToken: string
}

export type RegisterDto = {
    userName: string
    email: string
    password: string
}