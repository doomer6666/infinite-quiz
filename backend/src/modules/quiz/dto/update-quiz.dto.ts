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
  @IsOptional()
  @IsString()
  public text?: string;

  @IsOptional()
  @IsBoolean()
  public isCorrect?: boolean;
}

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  public imageFilename?: string;

  @IsOptional()
  @IsString()
  public text?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  public timeLimit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  public points?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAnswerDto)
  public answers?: UpdateAnswerDto[];
}

export class UpdateQuizDto {
  @IsOptional()
  @IsString()
  public imageFilename?: string;

  @IsOptional()
  @IsString()
  public title?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  public questions?: UpdateQuestionDto[];
}
