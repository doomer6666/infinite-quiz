import { useMeQuery } from "@/entities/user/index";
import { MdAdd } from "react-icons/md";

export const Topbar = () => {
  const { data } = useMeQuery();

  return (
    <div className="topbar">
      <div className="topbar-left"></div>
      <div className="topbar-right">
        <button className="btn-primary">
          <MdAdd size={16} color="white" />
          Создать квиз
        </button>
        <div className="topbar-avatar">
          <img src={data?.avatar} />
        </div>
      </div>
    </div>
  );
};
