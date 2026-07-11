export class CreateAnswerDto {
  public text!: string;

  public isCorrect!: boolean;
}

export class CreateQuestionDto {
  public imageFilename?: string;

  public text!: string;

  public timeLimit!: number;

  public points!: number;

  public answers!: CreateAnswerDto[];
}

export class CreateQuizDto {
  public imageFilename?: string;

  public title!: string;

  public questions!: CreateQuestionDto[];
}
