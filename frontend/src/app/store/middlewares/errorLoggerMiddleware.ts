import { isRejected, type Middleware } from "@reduxjs/toolkit";
import { eventBus } from "@/shared/lib/eventBus";

interface ErrorPayload {
  status?: number | string;
  data?: unknown;
  error?: string;
  message?: string;
}

const extractMessage = (obj: unknown): string => {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (typeof obj !== "object") return "";

  const record = obj as Record<string, unknown>;

  if ("error" in record && typeof record.error === "string") {
    return record.error;
  }

  if ("message" in record && typeof record.message === "string") {
    return record.message;
  }

  if ("details" in record && typeof record.details === "string") {
    return record.details;
  }

  if (Array.isArray(record.details) && record.details.length > 0) {
    const first = record.details[0];
    if (first && typeof first === "object" && "message" in first) {
      return String(first.message);
    }
    if (typeof first === "string") {
      return first;
    }
  }

  if (Array.isArray(record.data)) {
    const first = record.data[0];
    if (first && typeof first === "object" && "message" in first) {
      return String(first.message);
    }
  }

  const keysToSearch = ["data", "payload", "error", "response"];
  for (const key of keysToSearch) {
    if (key in record && record[key]) {
      const result = extractMessage(record[key]);
      if (result) return result;
    }
  }

  for (const key in record) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      const val = record[key];
      if (
        typeof val === "string" &&
        (key === "message" || key === "error" || key === "err")
      ) {
        return val;
      }
    }
  }

  return "";
};

export const errorLoggerMiddleware: Middleware = () => (next) => (action) => {
  if (isRejected(action)) {
    const payload = action.payload as ErrorPayload | undefined;

    if (payload && "status" in payload && payload.status === 401) {
      return next(action);
    }

    let message = extractMessage(payload);

    if (!message && action && typeof action === "object" && "error" in action) {
      const actionError = (action as Record<string, unknown>).error;
      message = extractMessage(actionError);
    }

    if (!message) {
      message = "Произошла непредвиденная ошибка";
    }
    eventBus.emit(message);
  }

  return next(action);
};
