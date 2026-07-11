import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

export class UpdateAnswerDto {
  public text?: string;

  public isCorrect?: boolean;
}

export class UpdateQuestionDto {
  public imageFilename?: string;

  public text?: string;

  public timeLimit?: number;

  public points?: number;

  public answers?: UpdateAnswerDto[];
}

export class UpdateQuizDto {
  public imageFilename?: string;

  public title?: string;

  public questions?: UpdateQuestionDto[];
}
