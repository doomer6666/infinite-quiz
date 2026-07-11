import { UserRoleEnum, type UserRole } from "@infinite-quiz/common";
import { FiUser, FiBriefcase } from "react-icons/fi";

type RoleSelectorProps = {
  role: UserRole;
  setRole: (role: UserRole) => void;
};

const RoleSelector = ({ role, setRole }: RoleSelectorProps) => {
  return (
    <div className="role-selector">
      <button
        className={`role-btn ${role === UserRoleEnum.memder ? "active" : ""}`}
        type="button"
        onClick={() => setRole(UserRoleEnum.memder)}
      >
        <FiUser size={15} />
        Участник
      </button>
      <button
        className={`role-btn ${role === UserRoleEnum.host ? "active" : ""}`}
        type="button"
        onClick={() => setRole(UserRoleEnum.host)}
      >
        <FiBriefcase size={15} />
        Организатор
      </button>
    </div>
  );
};

export default RoleSelector;
