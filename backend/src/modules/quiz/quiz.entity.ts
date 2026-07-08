import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import type { Answer, Question, Quiz } from "../../shared/types/index.js";

export class AnswerEntity implements Answer {
  @prop({ type: () => String, required: true, trim: true })
  public text!: string;

  @prop({ type: () => Boolean, required: true, default: false })
  public isCorrect!: boolean;
}

export class QuestionEntity implements Question {
  @prop({ type: () => String })
  public imagePath?: string;

  @prop({ type: () => String, required: true, trim: true })
  public text!: string;

  @prop({ type: () => Number, required: true, min: 1 })
  public timeLimit!: number;

  @prop({ type: () => Number, required: true, min: 1 })
  public points!: number;

  @prop({ required: true, type: () => [AnswerEntity] })
  public answers!: Answer[];
}

@modelOptions({ schemaOptions: { collection: "quiz" } })
export class QuizEntity extends defaultClasses.TimeStamps implements Quiz {
  @prop({ type: () => String, required: true })
  public title!: string;

  @prop({ type: () => String })
  public description?: string;

  @prop({ type: () => String, required: true })
  public imagePath!: string;

  @prop({ type: () => String, required: true })
  public hostId!: string;

  @prop({ required: true, type: () => [QuestionEntity] })
  public questions!: Question[];
}

export const QuizModel = getModelForClass(QuizEntity);
