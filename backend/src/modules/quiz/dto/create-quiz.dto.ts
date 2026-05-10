import { IsBoolean, IsInt, IsString, Min } from "class-validator";

export class CreateAnswerDto {
  @IsString()
  public text!: string;

  @IsBoolean()
  public isCorrect!: boolean;
}

export class CreateQuestionDto {
  @IsString()
  public text!: string;

  @IsInt()
  @Min(1)
  public timeLimit!: number;

  @IsInt()
  @Min(1)
  public points!: number;

  public answers!: CreateAnswerDto[];
}

export class CreateQuizDto {
  @IsString()
  public title!: string;

  public qusestions!: CreateQuestionDto[];
}
