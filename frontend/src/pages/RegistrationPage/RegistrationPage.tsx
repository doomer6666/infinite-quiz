import { FiAtSign, FiMail, FiPlus } from "react-icons/fi";
import "./RegistrationPage.css";
import PasswordInput from "../../shared/ui/components/PasswordInput/PasswordInput";
import RoleSelector from "../../shared/ui/components/RoleSelector/RoleSelector";
import { CreateUserSchema } from "@infinite-quiz/common";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useCreateUserMutation } from "./registration.api";

const RegisterSchema = CreateUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});
type RegisterForm = z.infer<typeof RegisterSchema>;

const checkStrength = (val: string) => {
  if (!val)
    return {
      width: "0%",
      color: "transparent",
      text: "Введите пароль",
      textColor: "var(--outline)",
    };

  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    {
      width: "25%",
      color: "#BA1A1A",
      text: "Очень слабый",
      textColor: "#BA1A1A",
    },
    { width: "50%", color: "#E67E00", text: "Слабый", textColor: "#E67E00" },
    { width: "75%", color: "#0077FF", text: "Хороший", textColor: "#0077FF" },
    {
      width: "100%",
      color: "#1A9E5C",
      text: "Надёжный",
      textColor: "#1A9E5C",
    },
  ];

  return levels[Math.max(0, score - 1)];
};

const RegistrationPage = () => {
  const [createUser] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(RegisterSchema) });

  const passwordValue = useWatch({
    control,
    name: "password",
  });
  const strength = checkStrength(passwordValue);

  const onSubmit = async (data: RegisterForm) => {
    try {
      const dto = CreateUserSchema.parse(data);
      console.log(data);
      const res = await createUser(dto).unwrap();
      console.log(res);
    } catch (err) {
      console.error("Ошибка создания:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-panel">
        <div className="form-inner">
          <div className="form-title">Создать аккаунт</div>
          <div className="form-subtitle">Заполните данные для регистрации</div>

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <RoleSelector role={field.value} setRole={field.onChange} />
            )}
          />

          <div className="field-group">
            <div className="field-wrap">
              <label className="field-label">Имя пользователя</label>
              <div className="field-input-wrap">
                <span className="field-icon">
                  <FiAtSign size={16} />
                </span>
                <input
                  {...register("name")}
                  type="text"
                  className="field-input"
                  placeholder="username"
                />
              </div>
              <span className="field-hint">
                Будет отображаться в таблице лидеров
              </span>
            </div>

            <div className="field-wrap">
              <label className="field-label">Email</label>
              <div className="field-input-wrap">
                <span className="field-icon">
                  <FiMail size={16} />
                </span>
                <input
                  {...register("email")}
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
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{
                    width: strength.width,
                    background: strength.color,
                  }}
                />
              </div>
              <span
                className="strength-label"
                style={{ color: strength.textColor }}
              >
                {strength.text}
              </span>
            </div>

            <div className="field-wrap">
              <label className="field-label">Подтверждение пароля</label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    password={field.value}
                    setPassword={field.onChange}
                  />
                )}
              />

              {errors.confirmPassword && (
                <span className="field-error visible">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>

          <button className="btn-primary" type="submit">
            <FiPlus size={17} />
            Зарегистрироваться
          </button>

          <p className="switch-text">
            Уже есть аккаунт? <a href="/login">Войти</a>
          </p>
          <p className="terms-text">
            Регистрируясь, вы соглашаетесь с{" "}
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              Условиями использования
            </a>{" "}
            и
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              Политикой конфиденциальности
            </a>
          </p>
        </div>
      </div>
    </form>
  );
};

export default RegistrationPage;
