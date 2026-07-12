import { useState, useEffect } from "react";

export type CtxType = "other" | "mine" | "draft";

interface CtxPosition {
  top: number;
  left: number;
}

export const useContextMenu = () => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<CtxType>("other");
  const [position, setPosition] = useState<CtxPosition>({ top: 0, left: 0 });

  const show = (e: React.MouseEvent, ctxType: CtxType) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let left = rect.left;
    let top = rect.bottom + 6;
    if (left + 180 > window.innerWidth) left = rect.right - 180;
    if (top + 200 > window.innerHeight) top = rect.top - 200;
    setPosition({ top: Math.max(8, top), left: Math.max(8, left) });
    setType(ctxType);
    setVisible(true);
  };

  const close = () => setVisible(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#ctx-menu") && !target.closest(".cover-menu-btn")) {
        close();
      }
    };
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return { visible, type, position, show, close };
};
