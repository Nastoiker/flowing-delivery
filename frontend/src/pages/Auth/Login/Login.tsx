import { Alert, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { api } from "@/helpers/api";
import { setItem } from "@/helpers/localStorage";
import styles from "./Login.module.css";

export type LoginForm = { email: string; password: string };
export function Login() {
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: { email: location.state?.email || "" },
  });
  const submit = async (data: LoginForm) => {
    setServerError("");
    try {
      const response = await api.post("auth/login", data);
      if (!response.data.access_token) throw new Error("Missing token");
      setItem("token", response.data.access_token);
      window.location.assign("/menu");
    } catch (error: any) {
      const message = error?.response?.data?.message;
      setServerError(
        Array.isArray(message)
          ? message.join(". ")
          : typeof message === "string"
          ? message
          : "Не удалось войти. Проверьте соединение и попробуйте ещё раз."
      );
    }
  };
  return (
    <div className={styles.login}>
      <Typography margin="50px 0" variant="h4">
        Вход
      </Typography>
      <form className={styles.form} onSubmit={handleSubmit(submit)} noValidate>
        {location.state?.registered && (
          <Alert severity="success">
            Аккаунт создан. Войдите с вашим паролем.
          </Alert>
        )}
        {serverError && (
          <Alert severity="error" role="alert">
            {serverError}
          </Alert>
        )}
        <TextField
          label="Ваш email"
          type="email"
          autoComplete="email"
          {...register("email", {
            required: "Заполните email",
            setValueAs: (value) => value.trim(),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Введите корректный email",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Ваш пароль"
          type="password"
          autoComplete="current-password"
          {...register("password", { required: "Заполните пароль" })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Вход…" : "Войти"}
        </Button>
      </form>
      <div className={styles.links}>
        <Typography>Нет аккаунта?</Typography>
        <Link to="/auth/register">Зарегистрироваться</Link>
      </div>
    </div>
  );
}
