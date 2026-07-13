import { useState } from "react";

export const PageNameEnum = {
  all: "all",
  mine: "mine",
  drafts: "drafts",
} as const;

export type PageName = (typeof PageNameEnum)[keyof typeof PageNameEnum];

export const useActivePage = (initial: PageName) => {
  const [activePage, setActivePage] = useState<PageName>(initial);
  return { activePage, setActivePage };
};
