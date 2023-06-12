// Read and sanitize the data from the CSV file
import {
  analizarCuatri,
  calculateScore,
  filterDesignarDocente,
  prepareComentariosData,
  prepareValoracionesData,
  readCSVFile,
  writeJSONToFile,
} from "~/analytics/analysis";

import {
  ComentariosData,
  PuntajesData,
  RowData,
  ValoracionData,
} from "~/analytics/types";

const datafile = "../gente.txt";
const outValoraciones = "valoraciones_docentes.json";
// const out_puntaje = "puntaje_docentes.json";
const outComentarios = "comentarios_docentes.json";

const rows: RowData[] = readCSVFile(datafile);

// Filter out "A Designar" docente
const filteredRows: RowData[] = filterDesignarDocente(rows);

// Calculate the score for each docente
const puntajes: PuntajesData = calculateScore(filteredRows);

// Prepare the data for writing to JSON files
const valoraciones: ValoracionData[] = prepareValoracionesData(puntajes);
const comentarios: ComentariosData = prepareComentariosData(filteredRows);

// Write data to JSON files
writeJSONToFile(outValoraciones, valoraciones);
writeJSONToFile(outComentarios, comentarios);

// Function to analyze the data by cuatrimestre
analizarCuatri("../data/Horarios_2Q2022.json");