import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Answer, Question, Quiz } from "../../shared/types/index.js";

@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
export class AnswerEntity implements Answer {
  @prop({ required: true, trim: true })
  public text!: string;

  @prop({ required: true, default: false })
  public isCorrect!: boolean;
}

@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
export class QuestionEntity implements Question {
  @prop({ required: true, trim: true })
  public text!: string;

  @prop({ required: true, min: 1 })
  public timeLimit!: number;

  @prop({ required: true, min: 1 })
  public points!: number;

  @prop({ required: true, type: () => [AnswerEntity] })
  public answers!: Answer[];
}

export interface QuizEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: "quiz",
  },
})
export class QuizEntity extends defaultClasses.TimeStamps implements Quiz {
  //   constructor(quizData: Quiz) {
  //     super();
  //     this.title = quizData.title;
  //     this.hostId = quizData.hostId;
  //     this.questions = quizData.questions;
  //   }

  @prop({ required: true, type: () => String })
  public title!: string;

  @prop({ required: true, type: () => Number })
  public hostId!: number;

  @prop({ required: true, type: () => [QuestionEntity] })
  public questions!: Question[];
}

export const QuizModel = getModelForClass(QuizEntity);
