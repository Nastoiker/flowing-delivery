import { Button, Input, InputLabel, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../helpers/api";
import styles from "./Login.module.css";

export type LoginForm = {
  email: {
    value: string;
  };
  password: {
    value: string;
  };
};

export function Login() {
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ email: string; password: string }>();
  useEffect(() => {
    if (jwt) {
      navigate("/");
    }
  }, [jwt, navigate]);
  const [error, setError] = useState<boolean>();

  const submit = async (data: { email: string; password: string }) => {
    try {
      setError(false);
      const { email, password } = data;
      const token = await api.post("auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", token.data.access_token);
      navigate("/menu");
      toast.success("Успешный вход");
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
      setError(false);
    }
  };
  return (
    <div className={styles["login"]}>
      <Typography margin={"50px 0"} variant="h4">
        Вход
      </Typography>
      <form className={styles["form"]} onSubmit={handleSubmit(submit)}>
        <div className={styles["field"]}>
          <InputLabel>Ваш email</InputLabel>
          <Input
            {...register("email", {
              required: { value: true, message: "Заполните email" },
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Нужен email",
              },
            })}
            error={Boolean(errors.email)}
            id="email"
            name="email"
            placeholder="Email"
          />
        </div>
        <div className={styles["field"]}>
          <InputLabel>Ваш пароль</InputLabel>
          <Input
            {...register("password", {
              required: { value: true, message: "Заполните password" },
            })}
            error={Boolean(errors.password)}
            id="password"
            name="password"
            type="password"
            placeholder="Пароль"
          />
        </div>
        <Button variant="contained" type="submit">
          Войти
        </Button>
      </form>
      <div className={styles["links"]}>
        <Typography>Нет акканута?</Typography>
        <Link to="/auth/register">
          <Typography color="primary">Зарегистрироваться</Typography>
        </Link>
      </div>
    </div>
  );
}
