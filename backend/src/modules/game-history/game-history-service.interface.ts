import { DocumentType } from "@typegoose/typegoose";
import { GameHistoryEntity } from "./game-history.entity.js";
import { CreateGameHistoryDto } from "@infinite-quiz/common";

export interface IGameHistoryService {
  create(dto: CreateGameHistoryDto): Promise<DocumentType<GameHistoryEntity>>;
  findByHostId(hostId: string): Promise<DocumentType<GameHistoryEntity>[]>;
  findByPlayerId(playerId: string): Promise<DocumentType<GameHistoryEntity>[]>;
  findAll(): Promise<DocumentType<GameHistoryEntity>[]>;
}
