export type AnalysisData = {
  doc: string;
  mat: string;
  cuat: string;
  comentarios: string;
};

export type PuntajeData = {
  asistencia: number;
  cumple_horarios: number;
  clase_organizada: number;
  claridad: number;
  buen_trato: number;
  acepta_critica: number;
  fomenta_participacion: number;
  responde_mails: number;
  panorama_amplio: number;
};

export type InfoData = {
  timestamp: number;
  editado: string; // New property
};

export type RowData = AnalysisData & PuntajeData & InfoData;

export type PuntajesData = {
  [key: string]: PuntajeData;
};

export type ValoracionData = { mat: string; doc: string; puntaje: PuntajeData };

export type ComentariosData = {
  [key: string]: { comentarios: string; editado: string | number }[];
};
