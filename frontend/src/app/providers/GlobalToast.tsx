import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import { eventBus } from "@/shared/lib/eventBus";

export const GlobalToast = () => {
  useEffect(() => {
    const unsubscribe = eventBus.subscribe((message) => {
      toast.error(message);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <Toaster position="bottom-right" richColors closeButton />;
};
