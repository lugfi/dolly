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

	it("get_promedios should calculate the mean of valoraciones for each question", () => {
		let docente1 = new Docente("John");
		let docente2 = new Docente("Jane");
		curso.agregar_docente(docente1);
		curso.agregar_docente(docente2);

		// Add the provided input
		docente1.agregar_valoracion("asistencia", "5");
		docente1.agregar_valoracion("asistencia", "5");
		docente1.agregar_valoracion("cumple_horarios", "5");
		docente1.agregar_valoracion("cumple_horarios", "5");
		docente1.agregar_valoracion("buen_trato", "5");
		docente1.agregar_valoracion("buen_trato", "4");
		docente1.agregar_valoracion("clase_organizada", "5");
		docente1.agregar_valoracion("clase_organizada", "5");
		docente1.agregar_valoracion("claridad", "5");
		docente1.agregar_valoracion("claridad", "5");
		docente1.agregar_valoracion("fomenta_participacion", "4");
		docente1.agregar_valoracion("fomenta_participacion", "3");
		docente1.agregar_valoracion("panorama_amplio", "4");
		docente1.agregar_valoracion("panorama_amplio", "3");
		docente1.agregar_valoracion("acepta_critica", "4");
		docente1.agregar_valoracion("acepta_critica", "4");
		docente1.agregar_valoracion("responde_mails", "3");
		docente1.agregar_valoracion("responde_mails", "3");
		docente1.calcular_puntaje(); // must be called before get_promedios

		//{'asistencia': [5, 4], 'cumple_horarios': [5, 4], 'buen_trato': [5, 4], 'clase_organizada': [5, 4], 'claridad': [5, 4], 'fomenta_participacion': [4, 3], 'panorama_amplio': [3, 3], 'acepta_critica': [4, 3], 'responde_mails': [3, 1]}
		docente2.agregar_valoracion("asistencia", "5");
		docente2.agregar_valoracion("asistencia", "4");
		docente2.agregar_valoracion("cumple_horarios", "5");
		docente2.agregar_valoracion("cumple_horarios", "4");
		docente2.agregar_valoracion("buen_trato", "5");
		docente2.agregar_valoracion("buen_trato", "4");
		docente2.agregar_valoracion("clase_organizada", "5");
		docente2.agregar_valoracion("clase_organizada", "4");
		docente2.agregar_valoracion("claridad", "5");
		docente2.agregar_valoracion("claridad", "4");
		docente2.agregar_valoracion("fomenta_participacion", "4");
		docente2.agregar_valoracion("fomenta_participacion", "3");
		docente2.agregar_valoracion("panorama_amplio", "3");
		docente2.agregar_valoracion("panorama_amplio", "3");
		docente2.agregar_valoracion("acepta_critica", "4");
		docente2.agregar_valoracion("acepta_critica", "3");
		docente2.agregar_valoracion("responde_mails", "3");
		docente2.agregar_valoracion("responde_mails", "1");
		docente2.calcular_puntaje(); // must be called before get_promedios


		const promedios = curso.get_promedios();
		const expected = {'acepta_critica': 3.75, 'asistencia': 4.75, 'buen_trato': 4.5, 'claridad': 4.75, 'clase_organizada': 4.75, 'cumple_horarios': 4.75, 'fomenta_participacion': 3.5, 'panorama_amplio': 3.25, 'responde_mails': 2.5};

		expect(promedios).toEqual(expected);
	});
	it("get_docentes should return the list of docentes", () => {
		let docente1 = new Docente("John");
		let docente2 = new Docente("Alice");
		curso.agregar_docente(docente1);
		curso.agregar_docente(docente2);
		const docentes = curso.get_docentes();
		expect(docentes).toEqual([docente1, docente2]);
	});

	it("get_docentes_str should return a formatted string of docente names", () => {
		let docente1 = new Docente("John");
		let docente2 = new Docente("Alice");
		curso.agregar_docente(docente1);
		curso.agregar_docente(docente2);
		const docentesStr = curso.get_docentes_str();
		expect(docentesStr).toEqual("John-Alice");
	});

	it("get_docentes_str should truncate names that are too long", () => {
		let docente1 = new Docente("John");
		let docente2 = new Docente("Alice");
		const longNameDocente = new Docente("ThisIsAVeryLongDocenteNameThatExceedsFiftyCharacters");
		curso.agregar_docente(docente1);
		curso.agregar_docente(docente2);
		curso.agregar_docente(longNameDocente);

		const docentesStr = curso.get_docentes_str();
		expect(docentesStr).toEqual("John-Alice-ThisIsAVeryLongDocenteNameThatExceedsFi...");
	});

	it("get_docente should return the correct docente by name", () => {
		let docente1 = new Docente("Alice");
		curso.agregar_docente(docente1);

		const foundDocente = curso.get_docente("Alice");
		expect(foundDocente).toBe(docente1);
	});

	it("get_docente should return null if docente is not found", () => {
		const foundDocente = curso.get_docente("Bob");
		expect(foundDocente).toBeNull();
	});
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
