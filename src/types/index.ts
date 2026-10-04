export type QuestionType = "qcm" | "vf" | "texte";

export interface Question {
  question: string;
  type: QuestionType;
  options?: string[];
  reponse: string | string[] | boolean;
}
