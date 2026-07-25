import { socket } from "@/shared/index";

export const gameApi = {
  create: (quizId: string, hostId: string) =>
    socket.emit("game:create", { quizId, hostId }),

  join: (code: string, userId: string) =>
    socket.emit("game:join", { code, userId }),

  reconnect: (code: string, userId: string, role: string) =>
    socket.emit("game:reconnect", { code, userId, role }),

  start: (code: string) => socket.emit("game:start", { code }),

  showQuestion: (code: string) => socket.emit("game:show-question", { code }),

  startAnswering: (code: string) =>
    socket.emit("game:start-answering", { code }),

  submitAnswer: (code: string, answerId: string, userId: string) =>
    socket.emit("game:answer", { code, answerId, userId }),

  nextQuestion: (code: string) => socket.emit("game:next", { code }),
};
