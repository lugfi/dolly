export type QuestionData = Record<string, number>;

export type RowData = QuestionData & {
  doc: string;
  mat: string;
  cuat: string;
  comentarios: string;
};

export type PuntajesData = { [key: string]: number };

export type ValoracionData = { mat: string; doc: string; puntaje: number };

export type ComentariosData = {
  [key: string]: { comentarios: string[]; editado: number }[];
};
