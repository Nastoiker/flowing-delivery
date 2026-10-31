import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/helpers/api";
import styles from "../Login/Login.module.css";

type RegisterForm = {
  email: string;
  password: string;
  name: string;
  surname: string;
  username: string;
  consent: boolean;
};
export enum STATUS_CAPTCHA {
  VISIBLE = "visible",
  HIDEN = "hiden",
  SUCCES = "succes",
  TOKEN_EXPIRED = "token-expired",
}

export function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();
  const nameRules = {
    required: "Заполните поле",
    setValueAs: (value: string) => value.trim(),
    pattern: {
      value: /^[\p{L}\p{M}][\p{L}\p{M} '\u2019-]*$/u,
      message: "Используйте буквы, пробел, дефис или апостроф",
    },
  };
  const submit = async ({
    email,
    password,
    name,
    surname,
    username,
  }: RegisterForm) => {
    setServerError("");
    try {
      await api.post("auth/register", {
        email,
        password,
        name,
        surname,
        username,
      });
      navigate("/auth/login", { state: { registered: true, email } });
    } catch (error: any) {
      const message = error?.response?.data?.message;
      setServerError(
        Array.isArray(message)
          ? message.join(". ")
          : typeof message === "string"
          ? message
          : "Не удалось зарегистрироваться. Проверьте соединение и попробуйте ещё раз."
      );
    }
  };
  return (
    <div className={styles.login}>
      <Typography margin="50px 0" variant="h4">
        Регистрация
      </Typography>
      <form className={styles.form} onSubmit={handleSubmit(submit)} noValidate>
        {serverError && (
          <Alert severity="error" role="alert">
            {serverError}
          </Alert>
        )}
        <TextField
          label="Ваш email"
          autoComplete="email"
          type="email"
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
          autoComplete="new-password"
          type="password"
          {...register("password", { required: "Заполните пароль" })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          label="Ваше имя"
          autoComplete="given-name"
          {...register("name", nameRules)}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Ваша фамилия"
          autoComplete="family-name"
          {...register("surname", nameRules)}
          error={!!errors.surname}
          helperText={errors.surname?.message}
        />
        <TextField
          label="Ваше пользовательское имя"
          autoComplete="username"
          {...register("username", {
            required: "Заполните имя пользователя",
            setValueAs: (value) => value.trim(),
          })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
        <FormControlLabel
          control={
            <Checkbox
              {...register("consent", {
                required: "Подтвердите согласие на обработку данных",
              })}
            />
          }
          label="Я согласен на обработку персональных данных"
        />
        {errors.consent && (
          <Typography color="error" role="alert">
            {errors.consent.message}
          </Typography>
        )}
        <Link to="/politics">Условия обработки данных</Link>
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Регистрация…" : "Зарегистрироваться"}
        </Button>
      </form>
      <div className={styles.links}>
        <Typography>Есть аккаунт?</Typography>
        <Link to="/auth/login">Войти</Link>
      </div>
    </div>
  );
}
