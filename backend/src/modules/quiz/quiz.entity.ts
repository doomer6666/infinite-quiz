import {
  Answer,
  Question,
  Quiz,
  QuizCategoryEnum,
  QuizStatusEnum,
  type QuizStatus,
} from "@infinite-quiz/common";
import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Types } from "mongoose";

export class AnswerEntity implements Answer {
  public _id!: Types.ObjectId;

  @prop({ type: () => String, required: true, trim: true })
  public text!: string;

  @prop({ type: () => Boolean, required: true, default: false })
  public isCorrect!: boolean;
}

export class QuestionEntity implements Question {
  public _id!: Types.ObjectId;

  @prop({ type: () => String })
  public imageFilename?: string;

  @prop({ type: () => String, required: true, trim: true })
  public text!: string;

  @prop({ type: () => Number, required: true, min: 1 })
  public timeLimit!: number;

  @prop({ type: () => Number, required: true, min: 1 })
  public points!: number;

  @prop({ required: true, type: () => [AnswerEntity] })
  public answers!: AnswerEntity[];
}

@modelOptions({ schemaOptions: { collection: "quiz" } })
export class QuizEntity extends defaultClasses.TimeStamps implements Quiz {
  @prop({ type: () => String, required: true })
  public title!: string;

  @prop({ type: () => String })
  public description?: string;

  @prop({ type: () => String, required: true })
  public imageFilename!: string;

  @prop({ type: () => String, required: true })
  public hostId!: string;

  @prop({ required: true, type: () => [QuestionEntity] })
  public questions!: QuestionEntity[];

  @prop({
    required: true,
    type: () => String,
  })
  public status!: QuizStatus;

  @prop({ type: () => Number, required: true })
  questionCount!: number;

  @prop({ type: () => Number, required: true })
  pointsCount!: number;

  @prop({
    type: () => String,
    required: true,
  })
  category!: string;
}

export const QuizModel = getModelForClass(QuizEntity);
