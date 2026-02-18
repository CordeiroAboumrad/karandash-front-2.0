import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { RegularRoutes } from "../../router/routes";
import styles from "./Login.module.css";
import karandashLogo from "../../assets/karandash.png";
import { login } from "../../data/apis/requests";
import { FormProvider, useForm } from "react-hook-form";
import { LoginForm } from "../../data/schemas/schemas";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const methods = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (email && password) {
  //     login(email, password).then(() => {
  //       debugger;
  //       sessionStorage.setItem("isAuthenticated", "true");
  //     });
  //     navigate(RegularRoutes.HOME);
  //   }
  // };

  const handleSubmit = methods.handleSubmit((data) => {
    debugger;
    if (data.email && data.password) {
      login(email, password).then(() => {
        debugger;
        sessionStorage.setItem("isAuthenticated", "true");
      });
      navigate(RegularRoutes.HOME);
    }
    methods.reset(data);
  });

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoContainer}>
        <a
          href="http://www.acessoainformacao.gov.br/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img src={karandashLogo} alt="link acesso informacao" />
        </a>
      </div>
      <div className={styles.loginBox}>
        <h2>Login</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                {...methods.register("email")}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                {...methods.register("password")}
                required
              />
            </div>
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
