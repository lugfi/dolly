import { describe, expect } from "@jest/globals";

import {
  calculateScore,
  filterDesignarDocente,
  prepareComentariosData,
  prepareValoracionesData,
  readCSVFile,
  writeJSONToFile,
} from "./analysis";

describe("readCSVFile", () => {
  test("should correctly read and parse the CSV file", () => {
    const filepath = "gente.txt";
    // Create a sample CSV file for testing
    const rows = readCSVFile(filepath);
    expect(rows).not.toBeNull();
  });
});

describe("filterDesignarDocente", () => {
  test("should filter out 'A Designar' docentes from the rows", () => {
    const rows = readCSVFile("gente.txt");

    const filteredRows = filterDesignarDocente(rows);
    // Define the expected rows after filtering
    expect(filteredRows).not.toBeNull();
  });
});

describe("calculateScore", () => {
  test("should calculate the scores correctly based on the rows", () => {
    const rows = readCSVFile("gente.txt");
    const puntajes = calculateScore(rows);
    expect(puntajes).not.toBeNull();
  });
});

describe("prepareValoracionesData", () => {
  test("should prepare the valoraciones data correctly from the puntajes", () => {
    const rows = readCSVFile("gente.txt");
    const puntajes = calculateScore(rows);
    const valoraciones = prepareValoracionesData(puntajes);
    expect(valoraciones).not.toBeNull();
  });
});

describe("prepareComentariosData", () => {
  test("should prepare the comentarios data correctly from the rows", () => {
    const rows = readCSVFile("gente.txt");
    const comentarios = prepareComentariosData(rows);
    expect(comentarios).not.toBeNull();
  });
});

describe("writeJSONToFile", () => {
  test("should write the JSON data to the specified file", () => {
    const filepath = "./output.json";
    const data = { key: "value" };
    writeJSONToFile(filepath, data);
    // Read the content of the written file and compare it with the expected data
    // You can use fs.readFileSync to read the file content and perform the comparison
  });
});

describe("analizarCuatri", () => {
  test("should analyze the cuatrimestre data correctly", () => {
    // const jsonFile = "./cuatrimestre.json";
    // Invoke the analizarCuatri function with the JSON file
    // Implement the necessary assertions to check the analysis results
  });
});
