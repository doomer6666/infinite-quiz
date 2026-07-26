import { DocumentType, types } from "@typegoose/typegoose";
import { inject, injectable } from "inversify";
import { Component } from "../../shared/types/conponent.js";
import { ILogger } from "../../shared/libs/logger/index.js";
import { GameHistoryEntity } from "./game-history.entity.js";
import { IGameHistoryService } from "./game-history-service.interface.js";
import { CreateGameHistoryDto } from "@infinite-quiz/common";

@injectable()
export class DefaultGameHistoryService implements IGameHistoryService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.GameHistoryModel)
    private readonly gameHistoryModel: types.ModelType<GameHistoryEntity>,
  ) {}

  public async create(
    dto: CreateGameHistoryDto,
  ): Promise<DocumentType<GameHistoryEntity>> {
    const result = await this.gameHistoryModel.create(dto);
    this.logger.info(`Game history created: ${dto.quizTitle}`);
    return result;
  }

  public async findByHostId(
    hostId: string,
  ): Promise<DocumentType<GameHistoryEntity>[]> {
    return this.gameHistoryModel.find({ hostId }).sort({ playedAt: -1 }).exec();
  }

  public async findByPlayerId(
    playerId: string,
  ): Promise<DocumentType<GameHistoryEntity>[]> {
    return this.gameHistoryModel
      .find({ "players.userId": playerId })
      .sort({ playedAt: -1 })
      .exec();
  }

  public async findAll(): Promise<DocumentType<GameHistoryEntity>[]> {
    return this.gameHistoryModel.find().sort({ playedAt: -1 }).exec();
  }
}
