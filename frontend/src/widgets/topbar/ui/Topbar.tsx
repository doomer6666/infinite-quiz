import { useAppSelector } from "@/shared/lib/hooks";
import { MdAdd } from "react-icons/md";

export const Topbar = () => {
  const image = useAppSelector((store) => store.currentUser.info.avatar);
  return (
    <div className="topbar">
      <div className="topbar-left"></div>
      <div className="topbar-right">
        <button className="btn-primary">
          <MdAdd size={16} color="white" />
          Создать квиз
        </button>
        <div className="topbar-avatar">
          <img src={image} />
        </div>
      </div>
    </div>
  );
};
