export type LoginUserDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  token: string;
  slug: string;
  email: string;
};
