import { io, Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@infinite-quiz/common";

type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
const baseUrl = import.meta.env.VITE_BASE_URL;

export const socket: GameSocket = io(baseUrl, {
  autoConnect: false,
  withCredentials: true,
});
