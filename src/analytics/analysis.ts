import { readFileSync, writeFileSync } from "fs";
import {
  ComentariosData,
  PuntajesData,
  QuestionData,
  RowData,
  ValoracionData,
} from "./types";

export function readCSVFile(filepath: string): RowData[] {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const csvData = readFileSync(filepath, "utf8");
  const rows: RowData[] = csvData
    .split("\n")
    .map((line) => line.split(","))
    .filter((values) => values.length >= 13)
    .map((values) => ({
      doc: values[0].trim(),
      mat: values[1].trim(),
      cuat: values[2].trim(),
      asistencia: parseFloat(values[3].trim()),
      cumple_horarios: parseFloat(values[4].trim()),
      buen_trato: parseFloat(values[5].trim()),
      clase_organizada: parseFloat(values[6].trim()),
      claridad: parseFloat(values[7].trim()),
      fomenta_participacion: parseFloat(values[8].trim()),
      panorama_amplio: parseFloat(values[9].trim()),
      acepta_critica: parseFloat(values[10].trim()),
      responde_mails: parseFloat(values[11].trim()),
      comentarios: values[12].trim(),
    }));

  return rows;
}

export function filterDesignarDocente(rows: RowData[]): RowData[] {
  return rows.filter((row) => row.doc !== "A Designar");
}

export function calculateScore(rows: RowData[]): PuntajesData {
  const pesos: QuestionData = {
    asistencia: 1,
    cumple_horarios: 1,
    clase_organizada: 0.7,
    claridad: 0.7,
    buen_trato: 0.5,
    acepta_critica: 0.5,
    fomenta_participacion: 0.5,
    responde_mails: 0.5,
    panorama_amplio: 0.5,
  };

  const features = Object.keys(pesos);
  const w = Object.values(pesos);
  const wn = w.map((value) => value / w.reduce((sum, val) => sum + val, 0));

  const puntajes: PuntajesData = {};
  const respuestas: { [key: string]: number } = {};

  for (const row of rows) {
    const key = `${row.mat}-${row.doc}`;
    const values = features.map((feature) => row[feature]);
    const score = Math.sqrt(
      values.reduce((sum, val, index) => sum + val ** 2 * wn[index], 0)
    );

    if (!puntajes[key]) {
      puntajes[key] = 0;
      respuestas[key] = 0;
    }

    puntajes[key] += score;
    respuestas[key]++;
  }

  return puntajes;
}

export function prepareValoracionesData(
  puntajes: PuntajesData
): ValoracionData[] {
  return Object.entries(puntajes).map(([key, puntaje]) => {
    const [mat, doc] = key.split("-");
    return { mat, doc, puntaje };
  });
}

export function prepareComentariosData(rows: RowData[]): ComentariosData {
  const comentarios = rows.reduce((result, row) => {
    const key = `${row.mat}-${row.doc}-${row.cuat}`;
    const comment = { comentarios: row.comentarios, editado: row.editado || 0 };

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(comment);
    return result;
  }, {} as ComentariosData);

  return comentarios;
}

export function writeJSONToFile(filepath: string, data: any) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  writeFileSync(filepath, JSON.stringify(data, null, 2));
}

export function analizarCuatri(jsonFile: string) {
  // Implementation for analyzing cuatrimestre data
  // ...
}
