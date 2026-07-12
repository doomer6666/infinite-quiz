import {
  MdPlayArrow,
  MdShare,
  MdEdit,
  MdContentCopy,
  MdDelete,
  MdUpload,
} from "react-icons/md";
import type { CtxType } from "@/shared/lib/hooks/index";

interface ContextMenuProps {
  visible: boolean;
  type: CtxType;
  position: { top: number; left: number };
}

export const ContextMenu = ({ visible, type, position }: ContextMenuProps) => {
  return (
    <div
      id="ctx-menu"
      className={`context-menu ${visible ? "visible" : ""}`}
      style={{ top: position.top, left: position.left }}
    >
      {type === "other" && (
        <>
          <div className="ctx-item">
            <MdPlayArrow size={16} /> Играть
          </div>
          <div className="ctx-item">
            <MdShare size={16} /> Поделиться
          </div>
        </>
      )}
      {type === "mine" && (
        <>
          <div className="ctx-item">
            <MdPlayArrow size={16} /> Запустить
          </div>
          <div className="ctx-item">
            <MdEdit size={16} /> Редактировать
          </div>
          <div className="ctx-item">
            <MdContentCopy size={16} /> Дублировать
          </div>
          <div className="ctx-divider" />
          <div className="ctx-item ctx-danger">
            <MdDelete size={16} /> Удалить
          </div>
        </>
      )}
      {type === "draft" && (
        <>
          <div className="ctx-item">
            <MdEdit size={16} /> Доработать
          </div>
          <div className="ctx-item">
            <MdUpload size={16} /> Опубликовать
          </div>
          <div className="ctx-divider" />
          <div className="ctx-item ctx-danger">
            <MdDelete size={16} /> Удалить
          </div>
        </>
      )}
    </div>
  );
};
