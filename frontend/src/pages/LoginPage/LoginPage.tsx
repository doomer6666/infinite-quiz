import { Controller, useForm } from "react-hook-form";
import { FiMail } from "react-icons/fi";
import PasswordInput from "../../shared/ui/components/PasswordInput/PasswordInput";
import { type LoginUserDto, LoginUserShema } from "@infinite-quiz/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginUserMutation } from "./login.api";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginPage = () => {
  const [loginUser] = useLoginUserMutation();
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const {
    register: login,
    handleSubmit,
    control,
  } = useForm<LoginUserDto>({
    resolver: zodResolver(LoginUserShema),
  });

  const onSubmit = async (data: LoginUserDto) => {
    try {
      const { token } = await loginUser(data).unwrap();
      localStorage.setItem("token", token);
      navigate("/quizes");
      window.location.reload();
    } catch (error) {
      setLoginError(error.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-panel">
        <div className="form-inner">
          <div className="form-title">Вход</div>
          <div className="form-subtitle">Введите ваши данные для входа</div>
          <div className="field-wrap" style={{ marginBottom: "14px" }}>
            <label className="field-label">Email</label>
            <div className="field-input-wrap">
              <span className="field-icon">
                <FiMail size={16} />
              </span>
              <input
                {...login("email")}
                type="email"
                className="field-input"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="field-wrap">
            <label className="field-label">Пароль</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  password={field.value}
                  setPassword={field.onChange}
                />
              )}
            />
          </div>

          <button className="btn-primary" type="submit">
            Войти
          </button>
          {loginError && (
            <div className="field-error visible">{loginError}</div>
          )}
          <p className="switch-text">
            Нет аккаунта? <Link to="/registration">Зарегестрироваться</Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;
