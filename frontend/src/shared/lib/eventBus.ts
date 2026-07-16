type Listener = (message: string) => void;
const listeners = new Set<Listener>();

export const eventBus = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  emit(message: string) {
    listeners.forEach((listener) => listener(message));
  },
};
