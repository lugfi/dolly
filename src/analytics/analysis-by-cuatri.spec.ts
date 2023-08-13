import {describe, expect} from "@jest/globals";
import {
	analizar_equivalencias,
	buscar_codigos_materias_equivalentes, buscar_docente,
	buscar_materias_equivalentes,
	emprolijar_docentes
} from "./analysis-by-cuatri";
import {Curso, Materia} from "./curso";

describe('emprolijar_docentes', () => {
	it('should remove "A Designar" from docentes_raw list', () => {
		const docentes_raw = "De Rossi-Martins-A Designar";
		const result = emprolijar_docentes(docentes_raw);
		expect(result).toEqual(["De Rossi", "Martins"]);
	});

	it('should not remove anything if "A Designar" is not present', () => {
		const docentes_raw = "De Rossi-Martins";
		const result = emprolijar_docentes(docentes_raw);
		expect(result).toEqual(["De Rossi", "Martins"]);
	});

	it('should return an empty list if input is empty', () => {
		const docentes_raw = "";
		const result = emprolijar_docentes(docentes_raw);
		expect(result).toEqual([""]);
	});
});


describe('analizar_equivalencias', () => {
	it('should create equivalence dictionary', () => {
		const input = [
			[7533, 7543, 9560],
			[7541, 9515],
			[7504, 9512],
			[7515, 7528, 9505]
		];

		const result = analizar_equivalencias(input);

		expect(result).toEqual({'7533': ['7533', '7543', '9560'], '7543': ['7533', '7543', '9560'], '9560': ['7533', '7543', '9560'], '7541': ['7541', '9515'], '9515': ['7541', '9515'], '7504': ['7504', '9512'], '9512': ['7504', '9512'], '7515': ['7515', '7528', '9505'], '7528': ['7515', '7528', '9505'], '9505': ['7515', '7528', '9505']});
	});
});

describe("buscar_codigos_materias_equivalentes", () => {
	const equivalencias = analizar_equivalencias([[7533, 7543, 9560],
		[7541, 9515],
		[7504, 9512],
		[7515, 7528, 9505]]);

	it("should return equivalent materia codes", () => {
		const materia = "7504";
		const equivalentCodes = buscar_codigos_materias_equivalentes(materia, equivalencias);
		expect(equivalentCodes).toEqual(["7504", "9512"]);
	});

	it("should handle non-existent materia", () => {
		const materia = "9999"; // Non-existent
		const equivalentCodes = buscar_codigos_materias_equivalentes(materia, equivalencias);
		expect(equivalentCodes).toEqual([]);
	});
});


describe("buscar_materias_equivalentes", () => {
	const dict_materias = {
		"7533": new Materia("7533", "Materia 1"),
		"7543": new Materia("7543", "Materia 2"),
	};

	const equivalencias = {
		"7533": ["7533", "7543", "9560"],
		"7541": ["7541", "9515"],
	};

	it("should return equivalent Materia instances", () => {
		const materia = "7533";
		const equivalentMaterias = buscar_materias_equivalentes(materia, dict_materias, equivalencias);
		const expectedEquivalentMaterias = [dict_materias["7533"], dict_materias["7543"]];
		expect(equivalentMaterias).toEqual(expectedEquivalentMaterias);
	});

	it("should handle non-existent materia", () => {
		const materia = "9999"; // Non-existent
		const equivalentMaterias = buscar_materias_equivalentes(materia, dict_materias, equivalencias);
		expect(equivalentMaterias).toBeNull();
	});

	it("should return empty array for non-equivalent materia", () => {
		const materia = "7541"; // Has no equivalent Materia instances
		const equivalentMaterias = buscar_materias_equivalentes(materia, dict_materias, equivalencias);
		expect(equivalentMaterias).toEqual([]);
	});
});

describe('buscar_docente function', () => {
	it('should return an existing docente', () => {
		const docenteName = 'John Doe';
		const materia = new Materia('MATH101', 'Mathematics');
		materia.agregar_curso(new Curso(0));

		const result = buscar_docente(docenteName, [materia], {});

		expect(result.nombre).toBe(docenteName);
	});

	it('should create a new docente if not found', () => {
		const docenteName = 'Jane Smith';
		const materias: Materia[] = [];
		const dict_docentes: {
			[key: string]: any
		} = {};

		const result = buscar_docente(docenteName, materias, dict_docentes);

		expect(result.nombre).toBe(docenteName);
		expect(dict_docentes[docenteName]).toBeDefined();
	});
});
