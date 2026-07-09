import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

export class CreateAnswerDto {
  @IsString()
  public text!: string;

  @IsBoolean()
  public isCorrect!: boolean;
}

export class CreateQuestionDto {
  @IsString()
  public imageFilename?: string;

  @IsString()
  public text!: string;

  @IsInt()
  @Min(1)
  public timeLimit!: number;

  @IsInt()
  @Min(1)
  public points!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  public answers!: CreateAnswerDto[];
}

export class CreateQuizDto {
  @IsString()
  public imageFilename?: string;

  @IsString()
  public title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  public questions!: CreateQuestionDto[];
}
