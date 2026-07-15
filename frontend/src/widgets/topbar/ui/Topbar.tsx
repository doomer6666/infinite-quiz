import { useMeQuery } from "@/entities/user/index";
import { UserRoleEnum } from "@infinite-quiz/common";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";

export const Topbar = () => {
  const { data } = useMeQuery();

  return (
    <div className="topbar">
      <div className="topbar-left"></div>
      <div className="topbar-right">
        {data?.role === (UserRoleEnum.host || UserRoleEnum.admin) && (
          <Link to="create" className="btn-primary">
            <MdAdd size={16} color="white" />
            Создать квиз
          </Link>
        )}
        <div className="topbar-avatar">
          <img src={data?.avatar} />
        </div>
      </div>
    </div>
  );
};
