import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";

export class PlayerResult {
  @prop({ type: () => String, required: true })
  public userId!: string;

  @prop({ type: () => String, required: true })
  public name!: string;

  @prop({ type: () => String, required: true })
  public avatar!: string;

  @prop({ type: () => Number, required: true })
  public score!: number;

  @prop({ type: () => Number, required: true })
  public place!: number;
}

@modelOptions({ schemaOptions: { collection: "game-history" } })
export class GameHistoryEntity extends defaultClasses.TimeStamps {
  @prop({ type: () => String, required: true })
  public quizId!: string;

  @prop({ type: () => String, required: true })
  public quizTitle!: string;

  @prop({ type: () => String, required: true })
  public hostId!: string;

  @prop({ type: () => String, required: true })
  public hostName!: string;

  @prop({ type: () => [PlayerResult], required: true })
  public players!: PlayerResult[];

  @prop({ type: () => Number, required: true })
  public questionCount!: number;

  @prop({ type: () => Number, required: true })
  public totalPoints!: number;

  @prop({ type: () => Number, required: true })
  public duration!: number;

  @prop({ type: () => String, required: true })
  public playedAt!: string;
}

export const GameHistoryModel = getModelForClass(GameHistoryEntity);
