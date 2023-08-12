import {describe, expect} from "@jest/globals";
import {Curso, Docente, Materia} from "./curso";

describe("Curso", () => {
	let curso: Curso;
	beforeEach(() => {
		curso = new Curso(1);
	});

	it("agregar_docente should add a docente", () => {
		const docente = new Docente("John");
		curso.agregar_docente(docente);
		expect(curso.docentes).toContain(docente)
	});

	it("tiene_docente should return true if docente is present", () => {
		const docente = new Docente("John");
		curso.agregar_docente(docente);
		expect(curso.tiene_docente("John")).toBe(true);
	});

	// Add more test cases for other methods
});

describe("Docente", () => {
	let docente: Docente;
	beforeEach(() => {
// valoraciones = {'asistencia': [5, 5], 'cumple_horarios': [5, 5], 'buen_trato': [5, 4], 'clase_organizada': [5, 5], 'claridad': [5, 5], 'fomenta_participacion': [4,3], 'panorama_amplio': [4,3], 'acepta_critica': [4,4], 'responde_mails': [3,3]}
		docente = new Docente("De Rossi");
	});

	it("agregar_valoracion should add a valoracion", () => {
		docente.agregar_valoracion("asistencia", "5");
		expect(docente.valoraciones["asistencia"]).toContain(5); // Update the expectation
	});

	it("get_valoraciones should return valoraciones object", () => {
		const valoraciones = docente.get_valoraciones();
		expect(valoraciones).toEqual({respuestas: 0, score: 0});
	});

	it("calcular_puntaje should calculate the mean of valoraciones", () => {
		docente.agregar_valoracion("asistencia", "5");
		docente.agregar_valoracion("asistencia", "5");
		docente.agregar_valoracion("cumple_horarios", "5");
		docente.agregar_valoracion("cumple_horarios", "5");
		docente.agregar_valoracion("buen_trato", "5");
		docente.agregar_valoracion("buen_trato", "4");
		docente.agregar_valoracion("clase_organizada", "5");
		docente.agregar_valoracion("clase_organizada", "5");
		docente.agregar_valoracion("claridad", "5");
		docente.agregar_valoracion("claridad", "5");
		docente.agregar_valoracion("fomenta_participacion", "4");
		docente.agregar_valoracion("fomenta_participacion", "3");
		docente.agregar_valoracion("panorama_amplio", "4");
		docente.agregar_valoracion("panorama_amplio", "3");
		docente.agregar_valoracion("acepta_critica", "4");
		docente.agregar_valoracion("acepta_critica", "4");
		docente.agregar_valoracion("responde_mails", "3");
		docente.agregar_valoracion("responde_mails", "3");

		docente.calcular_puntaje();
		let valoraciones = docente.get_valoraciones();
		expect(valoraciones["fomenta_participacion"]).toEqual(3.5); // Expected mean: (4+3) / 2 ("fomenta_participacion") = 3.5
	});

	it("calcular_puntaje should handle missing valoraciones", () => {
		docente.calcular_puntaje();
		let valoraciones = docente.get_valoraciones();
		// Since there are no valoraciones, the mean should be NaN
		expect(valoraciones["asistencia"]).toBeUndefined();
	});
	// Add more test cases for other methods
});

describe("Materia", () => {
	let materia: Materia;
	beforeEach(() => {
		materia = new Materia("CS101", "Introduction to Computer Science");
	});

	it("agregar_curso should add a curso", () => {
		const curso = new Curso(1);
		materia.agregar_curso(curso);
		expect(materia.cursos).toContain(curso);
	});

	it("tiene_docente should return true if docente is present", () => {
		const curso = new Curso(1);
		const docente = new Docente("John");
		curso.agregar_docente(docente);
		materia.agregar_curso(curso);
		expect(materia.tiene_docente("John")).toBe(true);
	});

	// Add more test cases for other methods
});
