import type { QuizWizardState } from "@/entities/quiz/index";
import React, { type ChangeEvent } from "react";
import { BsCardText, BsFileText } from "react-icons/bs";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

interface QuizBasicInfoProps {
  state: QuizWizardState;
  errors: Partial<Record<keyof QuizWizardState, string>>;
  updateState: (patch: Partial<QuizWizardState>) => void;
  imagePreviewUrl: string | null;
}

export const QuizBasicInfo: React.FC<QuizBasicInfoProps> = ({
  state,
  errors,
  updateState,
  imagePreviewUrl,
}) => {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateState({ imageFile: file });
    }
  };

  return (
    <div className="step-content">
      <div className="section-header">
        <div className="section-tag">
          <BsCardText size={12} /> Шаг 1
        </div>
        <div className="section-title">Основная информация</div>
        <div className="section-subtitle">
          Введите название квиза и загрузите превью
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <div className="card-title-icon">
            <BsFileText size={16} />
          </div>
          Название квиза <span className="badge-required">Обязательно</span>
        </div>
        <div className="card-subtitle">
          Придумайте короткое и запоминающееся название
        </div>

        <div className="field-wrap">
          <label className="field-label">Название</label>
          <div className="field-input-wrap">
            <span className="field-icon">
              <BsFileText size={16} />
            </span>
            <input
              type="text"
              className="field-input"
              placeholder="Например: Великие открытия в науке"
              value={state.title}
              onChange={(e) => updateState({ title: e.target.value })}
            />
          </div>
          <span
            className="field-hint"
            style={{ color: errors.title ? "var(--error)" : "" }}
          >
            {errors.title || "От 3 до 80 символов"}
          </span>
        </div>

        <div className="field-wrap">
          <label className="field-label">Превью квиза</label>
          <label
            className="field-input"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "160px",
              border: `2px dashed ${errors.imageFile ? "var(--error)" : "var(--outline-variant)"}`,
              borderRadius: "12px",
              cursor: "pointer",
              background: "var(--surface-variant)",
              padding: 0,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--outline)",
                }}
              >
                <MdOutlineAddPhotoAlternate size={28} />
                <span style={{ fontSize: "12px", fontWeight: 600 }}>
                  Нажмите для загрузки изображения
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </label>
          <span
            className="field-hint"
            style={{ color: errors.imageFile ? "var(--error)" : "" }}
          >
            {errors.imageFile || "Загрузите обложку (JPG, PNG)"}
          </span>
        </div>
      </div>
    </div>
  );
};
