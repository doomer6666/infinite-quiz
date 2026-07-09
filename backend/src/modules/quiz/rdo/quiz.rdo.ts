import { Expose, Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class AnswerRdo {
  @Expose()
  public text!: string;

  @Expose()
  public isCorrect!: boolean;
}

export class QuestionRdo {
  @IsOptional()
  @Expose()
  public imageFilename?: string;

  @Expose()
  public text!: string;

  @Expose()
  public timeLimit!: number;

  @Expose()
  public points!: number;

  @Expose()
  @Type(() => AnswerRdo)
  public answers!: AnswerRdo[];
}

export class QuizRdo {
  @Expose()
  public hostId!: string;

  @IsOptional()
  @Expose()
  public imageFilename?: string;

  @Expose()
  public title!: string;

  @Expose()
  @Type(() => QuestionRdo)
  public questions!: QuestionRdo[];
}
