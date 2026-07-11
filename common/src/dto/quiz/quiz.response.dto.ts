export class AnswerDto {
  public text!: string;

  public isCorrect!: boolean;
}

export class QuestionDto {
  public imageFilename?: string;

  public text!: string;

  public timeLimit!: number;

  public points!: number;

  public answers!: AnswerDto[];
}

export class QuizDto {
  public hostId!: string;

  public imageFilename?: string;

  public title!: string;

  public questions!: QuestionDto[];
}
