import {describe, expect} from "@jest/globals";
import {emprolijar_docentes} from "./analysis-by-cuatri";

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
