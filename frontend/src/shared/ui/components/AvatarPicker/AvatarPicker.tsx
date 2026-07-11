import { useState } from "react";
import { FiUser, FiUpload, FiChevronUp, FiChevronDown } from "react-icons/fi";
import "./AvatarPicker.css";

const AvatarPicker = () => {
  const [showDefaultAvatars, setShowDefaultAvatars] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const DEFAULT_AVATARS = [
    {
      bg: "#E5F2FF",
      svg: `<circle cx="22" cy="22" r="22" fill="#E5F2FF"/><circle cx="22" cy="18" r="7" fill="#0077FF" opacity=".9"/><ellipse cx="22" cy="34" rx="11" ry="8" fill="#0077FF" opacity=".7"/>`,
    },
    {
      bg: "#E6F9F0",
      svg: `<circle cx="22" cy="22" r="22" fill="#E6F9F0"/><circle cx="22" cy="18" r="7" fill="#1A9E5C" opacity=".9"/><ellipse cx="22" cy="34" rx="11" ry="8" fill="#1A9E5C" opacity=".7"/>`,
    },
    {
      bg: "#FFF3E5",
      svg: `<circle cx="22" cy="22" r="22" fill="#FFF3E5"/><circle cx="22" cy="18" r="7" fill="#E67E00" opacity=".9"/><ellipse cx="22" cy="34" rx="11" ry="8" fill="#E67E00" opacity=".7"/>`,
    },
    {
      bg: "#FFE5E5",
      svg: `<circle cx="22" cy="22" r="22" fill="#FFE5E5"/><circle cx="22" cy="18" r="7" fill="#BA1A1A" opacity=".9"/><ellipse cx="22" cy="34" rx="11" ry="8" fill="#BA1A1A" opacity=".7"/>`,
    },
    {
      bg: "#F0E5FF",
      svg: `<circle cx="22" cy="22" r="22" fill="#F0E5FF"/><circle cx="22" cy="18" r="7" fill="#7B2FBE" opacity=".9"/><ellipse cx="22" cy="34" rx="11" ry="8" fill="#7B2FBE" opacity=".7"/>`,
    },
    {
      bg: "#E5FFFA",
      svg: `<circle cx="22" cy="22" r="22" fill="#E5FFFA"/><circle cx="22" cy="18" r="7" fill="#00897B" opacity=".9"/><ellipse cx="22" cy="34" rx="11" ry="8" fill="#00897B" opacity=".7"/>`,
    },
    {
      bg: "#FFE5F3",
      svg: `<circle cx="22" cy="22" r="22" fill="#FFE5F3"/><circle cx="22" cy="18" r="7" fill="#D63384" opacity=".9"/><ellipse cx="22" cy="34" rx="11" ry="8" fill="#D63384" opacity=".7"/>`,
    },
    {
      bg: "#E5EAF5",
      svg: `<circle cx="22" cy="22" r="22" fill="#E5EAF5"/><circle cx="22" cy="18" r="7" fill="#1A2E5A" opacity=".9"/><ellipse cx="22" cy="34" rx="11" ry="8" fill="#1A2E5A" opacity=".7"/>`,
    },
  ];

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Файл слишком большой. Максимум 5 МБ.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedAvatar(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDefaultAvatarSelect = (avatar) => {
    const svgStr = `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">${avatar.svg}</svg>`;
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 88;
      canvas.height = 88;
      canvas.getContext("2d").drawImage(img, 0, 0, 88, 88);
      URL.revokeObjectURL(url);
      setSelectedAvatar(canvas.toDataURL());
    };
    img.src = url;
  };
  return (
    <div className="avatar-section">
      <span className="avatar-section-label">Аватар</span>
      <div className="avatar-picker">
        <div className={`avatar-preview ${selectedAvatar ? "has-image" : ""}`}>
          {selectedAvatar ? (
            <img src={selectedAvatar} alt="avatar" />
          ) : (
            <FiUser size={28} />
          )}
        </div>
        <div className="avatar-actions">
          <label className="btn-upload" htmlFor="avatar-file-input">
            <FiUpload size={15} />
            Загрузить фото
          </label>
          <input
            type="file"
            id="avatar-file-input"
            accept="image/*"
            onChange={handleAvatarUpload}
          />
          <span className="avatar-hint">JPG, PNG, GIF · до 5 МБ</span>
          <button
            className="default-avatars-toggle"
            type="button"
            onClick={() => setShowDefaultAvatars(!showDefaultAvatars)}
          >
            {showDefaultAvatars ? (
              <FiChevronUp size={12} />
            ) : (
              <FiChevronDown size={12} />
            )}
            Выбрать из готовых
          </button>
        </div>
      </div>

      <div
        className={`default-avatars-panel ${showDefaultAvatars ? "open" : ""}`}
      >
        <span className="default-avatars-panel-title">Готовые аватары</span>
        <div className="default-avatars-grid">
          {DEFAULT_AVATARS.map((avatar, index) => (
            <div
              key={index}
              className="default-avatar-item"
              onClick={() => handleDefaultAvatarSelect(avatar)}
              dangerouslySetInnerHTML={{
                __html: `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">${avatar.svg}</svg>`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarPicker;
