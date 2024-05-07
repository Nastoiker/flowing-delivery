import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { Button, Input } from "@mui/material";
import { useForm } from "react-hook-form";
import { api } from "../../../helpers/api";
import styles from "../Login/Login.module.css";

export type RegisterForm = {
  email: {
    value: string;
  };
  password: {
    value: string;
  };
  name: {
    value: string;
  };
};

export function Register() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  useEffect(() => {
    if (currentUser?.name) {
      navigate("/");
    }
  }, [currentUser, navigate]);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<{
    email: string;
    password: string;
    name: string;
    username: string;
    surname: string;
  }>();
  const submit = async (data: {
    name: string;
    email: string;
    password: string;
    username: string;
    surname: string;
  }) => {
    try {
      const { name, email, password, username, surname } = data;
      await api.post("auth/register", {
        email,
        password,
        name,
        username,
        surname,
      });
      toast.success("Успешная регистрация");
      navigate("/auth/login");
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
    }
  };

  return (
    <div className={styles["login"]}>
      Регистрация
      <form className={styles["form"]} onSubmit={handleSubmit(submit)}>
        <div className={styles["field"]}>
          <label htmlFor="email">Ваш email</label>
          <Input
            id="email"
            {...register("email", {
              required: { value: true, message: "Заполните email" },
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Нужен email",
              },
            })}
            error={Boolean(errors.email)}
            name="email"
            placeholder="Email"
          />
        </div>
        <div className={styles["field"]}>
          <label htmlFor="password">Ваш пароль</label>
          <Input
            {...register("password", {
              required: { value: true, message: "Заполните login" },
            })}
            id="password"
            name="password"
            type="password"
            placeholder="Пароль"
          />
        </div>
        <div className={styles["field"]}>
          <label htmlFor="name">Ваше имя</label>

          <Input
            {...register("name", {
              required: { value: true, message: "Заполните login" },
            })}
          />
        </div>
        <div className={styles["field"]}>
          <label htmlFor="surname">Ваша фамилия</label>
          <Input
            id="surname"
            {...register("surname", {
              required: { value: true, message: "Заполните login" },
            })}
            placeholder="Имя"
          />
        </div>
        <div className={styles["field"]}>
          <label htmlFor="username">Ваше пользовательское имя</label>
          <Input
            id="username"
            {...register("username", {
              required: { value: true, message: "Заполните username" },
            })}
            name="username"
            placeholder="Имя"
          />
        </div>
        <Button type="submit">Зарегистрироваться</Button>
      </form>
      <div className={styles["links"]}>
        <div>Есть акканут?</div>
        <Link to="/auth/login">Войти</Link>
      </div>
    </div>
  );
}
