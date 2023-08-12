import {describe, expect} from "@jest/globals";
import {analizar_equivalencias, emprolijar_docentes} from "./analysis-by-cuatri";

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
