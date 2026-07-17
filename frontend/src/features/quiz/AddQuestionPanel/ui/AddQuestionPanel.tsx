import {
  BsXLg,
  BsCardText,
  BsImage,
  BsFiles,
  BsCollection,
} from "react-icons/bs";

interface AddQuestionPanelProps {
  onClose: () => void;
  onAdd: (type: "text" | "image", mode: "single" | "multi") => void;
}

export const AddQuestionPanel: React.FC<AddQuestionPanelProps> = ({
  onClose,
  onAdd,
}) => {
  return (
    <div id="add-panel">
      <div className="add-panel-wrap">
        <div className="add-panel-header">
          <div className="add-panel-title-wrap">
            <div className="add-panel-title">Добавить вопрос</div>
            <div className="add-panel-sub">Выберите тип нового вопроса</div>
          </div>
          <button className="add-panel-close" onClick={onClose}>
            <BsXLg size={14} />
          </button>
        </div>
        <div className="add-panel-body">
          <div className="add-types-section-label">Выберите тип</div>
          <div className="add-types-grid">
            <div
              className="add-type-card"
              onClick={() => onAdd("text", "single")}
            >
              <div className="add-type-icon icon-ts">
                <BsCardText size={24} color="#3D5A80" />
              </div>
              <div className="add-type-info">
                <div className="add-type-name">Текст — один ответ</div>
                <div className="add-type-desc">
                  Текстовый вопрос с одним правильным вариантом из списка
                </div>
                <div className="add-type-tags">
                  <span className="add-type-tag badge-text">Текст</span>
                  <span className="add-type-tag badge-single">Один</span>
                </div>
              </div>
            </div>

            <div
              className="add-type-card"
              onClick={() => onAdd("text", "multi")}
            >
              <div className="add-type-icon icon-tm">
                <BsCardText size={24} color="#6B21A8" />
              </div>
              <div className="add-type-info">
                <div className="add-type-name">Текст — несколько ответов</div>
                <div className="add-type-desc">
                  Текстовый вопрос с несколькими правильными вариантами
                </div>
                <div className="add-type-tags">
                  <span className="add-type-tag badge-text">Текст</span>
                  <span className="add-type-tag badge-multi">Много</span>
                </div>
              </div>
            </div>

            <div
              className="add-type-card"
              onClick={() => onAdd("image", "single")}
            >
              <div className="add-type-icon icon-is">
                <BsImage size={24} color="#B25B00" />
              </div>
              <div className="add-type-info">
                <div className="add-type-name">Фото — один ответ</div>
                <div className="add-type-desc">
                  Вопрос с изображением и одним правильным вариантом
                </div>
                <div className="add-type-tags">
                  <span className="add-type-tag badge-image">Фото</span>
                  <span className="add-type-tag badge-single">Один</span>
                </div>
              </div>
            </div>

            <div
              className="add-type-card"
              onClick={() => onAdd("image", "multi")}
            >
              <div className="add-type-icon icon-im">
                <BsImage size={24} color="#1A9E5C" />
              </div>
              <div className="add-type-info">
                <div className="add-type-name">Фото — несколько ответов</div>
                <div className="add-type-desc">
                  Вопрос с изображением и несколькими верными вариантами
                </div>
                <div className="add-type-tags">
                  <span className="add-type-tag badge-image">Фото</span>
                  <span className="add-type-tag badge-multi">Много</span>
                </div>
              </div>
            </div>
          </div>

          <div className="divider-label">
            <div className="divider-line"></div>
            <span className="divider-text">или импортировать</span>
            <div className="divider-line"></div>
          </div>

          <div className="import-row">
            <button className="import-btn">
              <div
                className="import-btn-icon"
                style={{ background: "#EEF4FF" }}
              >
                <BsFiles size={20} color="#3D5A80" />
              </div>
              <div className="import-btn-text">
                <div className="import-btn-name">Из файла</div>
                <div className="import-btn-sub">CSV, XLSX, JSON</div>
              </div>
            </button>
            <button className="import-btn">
              <div
                className="import-btn-icon"
                style={{ background: "#F3E8FF" }}
              >
                <BsCollection size={20} color="#6B21A8" />
              </div>
              <div className="import-btn-text">
                <div className="import-btn-name">Из квиза</div>
                <div className="import-btn-sub">Скопировать вопросы</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
