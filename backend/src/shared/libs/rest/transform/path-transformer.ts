import { inject, injectable } from "inversify";
import { Component } from "../../../types/index.js";
import { IConfig, MainShema } from "../../../config/index.js";
import { ILogger } from "../../logger/index.js";
import { STATIC_RESOURCE_FIELDS } from "./path-transformer.constant.js";
import { getFullServerPath, isObject } from "../../../utils/common.js";
import {
  STATIC_FILES_ROUTE,
  STATIC_UPLOAD_ROUTE,
} from "../../../../app/index.js";
import {
  DEFAULT_STATIC_AVATAR_IMAGES,
  DEFAULT_STATIC_QUIZ_FILE_NAME,
} from "../../../constants/default-images.js";

@injectable()
export class PathTransformer {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<MainShema>,
  ) {
    this.logger.info("PathTranformer created!");
  }

  private hasDefaultImage(value: string) {
    return (
      DEFAULT_STATIC_AVATAR_IMAGES.includes(value) ||
      DEFAULT_STATIC_QUIZ_FILE_NAME === value
    );
  }

  private isStaticProperty(property: string) {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack: unknown[] = [data];

    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current as Record<string, unknown>) {
        if (Object.hasOwn(current as object, key)) {
          const value = (current as Record<string, unknown>)[key];

          if (isObject(value)) {
            stack.push(value);
            continue;
          }

          if (this.isStaticProperty(key) && typeof value === "string") {
            (current as Record<string, unknown>)[key] = this.buildUrl(value);
            continue;
          }

          if (this.isStaticProperty(key) && Array.isArray(value)) {
            (current as Record<string, unknown>)[key] = value.map((item) =>
              typeof item === "string" ? this.buildUrl(item) : item,
            );
          }
        }
      }
    }

    return data;
  }

  private buildUrl(value: string): string {
    const rootPath = this.hasDefaultImage(value)
      ? STATIC_FILES_ROUTE
      : STATIC_UPLOAD_ROUTE;
    return `${getFullServerPath(this.config.get("HOST"), this.config.get("PORT"))}${rootPath}/${value}`;
  }
}
