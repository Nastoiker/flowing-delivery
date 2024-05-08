import { Box, Input } from "@mui/material";
import { useForm } from "react-hook-form";
import { ILogin } from "./types";

export const SignIn = () => {
  const { register } = useForm<ILogin>();
  return (
    <Box>
      <Input placeholder="Имя" {...register("name")} />
      <Input placeholder="пароль" {...register("password")} />
    </Box>
  );
};
