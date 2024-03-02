import { Input } from "@mui/material";
import { Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
      const token = await api.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", token.data.access_token);
      navigate("/menu");
    } catch (e) {
      setError(false);
    }
  };
  return (
    <div className={styles["login"]}>
    Вход
      <form className={styles["form"]} onSubmit={handleSubmit(submit)}>
        <div className={styles["field"]}>
          <label htmlFor="email">Ваш email</label>
          <Input
            {...register("email", {
              required: { value: true, message: "Заполните login" },
            })}
            id="email"
            name="email"
            placeholder="Email"
          />
        </div>
        <div className={styles["field"]}>
          <label htmlFor="password">Ваш пароль</label>
          <Input
            {...register("password", {
              required: { value: true, message: "Заполните password" },
            })}
            id="password"
            name="password"
            type="password"
            placeholder="Пароль"
          />
        </div>
        <Button>Вход</Button>
      </form>
      <div className={styles["links"]}>
        <div>Нет акканута?</div>
        <Link to="/auth/register">Зарегистрироваться</Link>
      </div>
    </div>
  );
}