export type AnalysisData = {
  doc: string;
  mat: string;
  cuat: string;
  comentarios: string;
};

export type QuestionData = {
  asistencia: number;
  cumple_horarios: number;
  clase_organizada: number;
  claridad: number;
  buen_trato: number;
  acepta_critica: number;
  fomenta_participacion: number;
  responde_mails: number;
  panorama_amplio: number;
  editado: string; // New property
};

export type RowData = AnalysisData & QuestionData;

export type PuntajesData = {
  [key: string]: number;
};

export type ValoracionData = { mat: string; doc: string; puntaje: number };

export type ComentariosData = {
  [key: string]: { comentarios: string; editado: string | number }[];
};
