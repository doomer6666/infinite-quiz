import { Expose, Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class CreateAnswerRdo {
  @Expose()
  public text!: string;

  @Expose()
  public isCorrect!: boolean;
}

export class CreateQuestionRdo {
  @IsOptional()
  @Expose()
  public imagePath?: string;

  @Expose()
  public text!: string;

  @Expose()
  public timeLimit!: number;

  @Expose()
  public points!: number;

  @Expose()
  @Type(() => CreateAnswerRdo)
  public answers!: CreateAnswerRdo[];
}

export class CreateQuizRdo {
  @Expose()
  public hostId!: string;

  @IsOptional()
  @Expose()
  public imagePath?: string;

  @Expose()
  public title!: string;

  @Expose()
  @Type(() => CreateQuestionRdo)
  public questions!: CreateQuestionRdo[];
}
