import { useState } from "react";

export type PageName = "all" | "mine" | "drafts";

export const useActivePage = (initial: PageName = "all") => {
  const [activePage, setActivePage] = useState<PageName>(initial);
  return { activePage, setActivePage };
};
