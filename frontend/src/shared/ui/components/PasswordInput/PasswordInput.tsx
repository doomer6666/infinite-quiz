import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import "./PasswordInput.css";

export type PasswordInputProps = {
  password: string;
  setPassword: (password: string) => void;
};

const PasswordInput = ({ password, setPassword }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="field-input-wrap">
      <span className="field-icon">
        <FiLock size={16} />
      </span>
      <input
        type={showPassword ? "text" : "password"}
        className="field-input has-right"
        placeholder="Минимум 8 символов"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="field-toggle"
        onClick={() => setShowPassword(!showPassword)}
        type="button"
      >
        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
      </button>
    </div>
  );
};

export default PasswordInput;
