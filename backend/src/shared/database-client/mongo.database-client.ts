import { inject, injectable } from "inversify";
import { IDatabaseClient } from "./database-client.interface.js";
import { Component } from "../types/conponent.js";
import mongoose from "mongoose";
import { setTimeout } from "node:timers/promises";
import { ILogger } from "../libs/logger/index.js";

const RETRY_COUNT = 3;
const RETRY_TIMEOUT = 1000;

@injectable()
export class MongoDatabaseClient implements IDatabaseClient {
  private _isConnected = false;

  constructor(@inject(Component.Logger) private readonly logger: ILogger) {}

  public get isConnected(): boolean {
    return this._isConnected === true;
  }
  public async connect(url: string): Promise<void> {
    if (this._isConnected) {
      throw new Error("MongoDB client already connected");
    }

    this.logger.info("Trying to connect to MongoDB...");

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        await mongoose.connect(url, {
          family: 4,
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
        });

        this._isConnected = true;
        this.logger.info("Database connection established.");
        return;
      } catch (error) {
        attempt++;
        this.logger.error(
          `Failed to connect. Attempt ${attempt}`,
          error as Error,
        );
        await setTimeout(RETRY_TIMEOUT);
      }
    }

    throw new Error(`Unable to connect after ${RETRY_COUNT} attempts`);
  }

  public async disconnect(): Promise<void> {
    if (!this._isConnected) {
      throw new Error("Not connected to the database");
    }

    await mongoose.disconnect();
    this._isConnected = false;
    this.logger.info("Database connection closed.");
  }
}
