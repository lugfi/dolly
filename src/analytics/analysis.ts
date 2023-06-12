import { readFileSync, writeFileSync } from "fs";
import { groupBy, mean } from "lodash";
import {
  ComentariosData,
  PuntajeData,
  PuntajesData,
  RowData,
  ValoracionData,
} from "./types";

// TODO: editado never was used, deleted from all code!
export function readCSVFile(filepath: string): RowData[] {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const csvData: string = readFileSync(filepath, "utf8");
  const rows: Array<Array<string>> = csvData
    .split("\n")
    .slice(1) // Skip the first line
    .map((line) => line.split(","))
    .filter((values) => values.length >= 14);
  const data: RowData[] = rows.map((values) => ({
    doc: values[0].trim(),
    mat: values[1].trim(),
    cuat: values[2].trim(),
    timestamp: parseInt(values[3].trim(), 10),
    asistencia: parseFloat(values[4].trim()),
    cumple_horarios: parseFloat(values[5].trim()),
    buen_trato: parseFloat(values[6].trim()),
    clase_organizada: parseFloat(values[7].trim()),
    claridad: parseFloat(values[8].trim()),
    fomenta_participacion: parseFloat(values[9].trim()),
    panorama_amplio: parseFloat(values[10].trim()),
    acepta_critica: parseFloat(values[11].trim()),
    responde_mails: parseFloat(values[12].trim()),
    comentarios: values[13]?.trim(),
    editado: values[14]?.trim() || "",
  }));

  return data;
}

export function filterDesignarDocente(rows: RowData[]): RowData[] {
  return rows.filter((row) => row.doc !== "A Designar");
}

export function calculateScore(rows: RowData[]): PuntajesData {
  const groupKey = (row: RowData) => `${row.mat}-${row.doc}`;
  const groupData = groupBy(rows, groupKey);

  return Object.keys(groupData).reduce((acc, key) => {
    const rows = groupData[`${key}`];
    const puntajeData: PuntajeData = {
      asistencia: mean(rows.map((row) => row.asistencia)),
      cumple_horarios: mean(rows.map((row) => row.cumple_horarios)),
      clase_organizada: mean(rows.map((row) => row.clase_organizada)),
      claridad: mean(rows.map((row) => row.claridad)),
      buen_trato: mean(rows.map((row) => row.buen_trato)),
      acepta_critica: mean(rows.map((row) => row.acepta_critica)),
      fomenta_participacion: mean(rows.map((row) => row.fomenta_participacion)),
      responde_mails: mean(rows.map((row) => row.responde_mails || 0)),
      panorama_amplio: mean(rows.map((row) => row.panorama_amplio)),
    };

    return { ...acc, [key]: puntajeData };
  }, {});
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
  return rows.reduce((result, row) => {
    const key = `${row.mat}-${row.doc}-${row.cuat}`;
    const comment = { comentarios: row.comentarios, editado: row.editado || 0 };

    const updatedResult: ComentariosData = {
      ...result,
      [key]: [...(result[`${key}`] || []), comment],
    };

    return updatedResult;
  }, {} as ComentariosData);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function writeJSONToFile(filepath: string, data: any) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  writeFileSync(filepath, JSON.stringify(data, null, 2));
}

export function analizarCuatri() {
  // Implementation for analyzing cuatrimestre data
  // ...
}
