import {Materia} from "~/analytics/curso";

export function emprolijar_docentes(docentes_raw: string): string[] {
	const docentes_raw_list = docentes_raw.split('-');
	if (docentes_raw_list.includes("A Designar")) {
		docentes_raw_list.splice(docentes_raw_list.indexOf("A Designar"), 1);
	}
	return docentes_raw_list;
}

export function analizar_equivalencias(eq: number[][]): { [key: string]: string[] } {
	const equivalencias: { [key: string]: string[] } = {};
	for (const equivalenciaGroup of eq) {
		for (const materia of equivalenciaGroup) {
			equivalencias[materia.toString()] = equivalenciaGroup.map(x => x.toString());
		}
	}
	return equivalencias;
}

export function buscar_codigos_materias_equivalentes(
	materia: string,
	equivalencias: { [key: string]: string[] }
): string[] {
	const equivalentMateriaCodigos: string[] = [];

	if (materia in equivalencias) {
		equivalentMateriaCodigos.push(materia);
		for (const m of equivalencias[materia]) {
			if (m !== materia) {
				equivalentMateriaCodigos.push(m);
			}
		}
	}

	return equivalentMateriaCodigos;
}


export function buscar_materias_equivalentes(
	materia: string,
	dict_materias: { [key: string]: Materia },
	equivalencias: { [key: string]: string[] }
): Materia[] | null {
	const equivalentMaterias: Materia[] = [];

	if (!(materia in equivalencias)) {
		if (materia in dict_materias) {
			equivalentMaterias.push(dict_materias[materia]);
		}
		return equivalentMaterias.length > 0 ? equivalentMaterias : null;
	}

	for (const m of equivalencias[materia]) {
		if (m in dict_materias) {
			equivalentMaterias.push(dict_materias[m]);
		}
	}

	return equivalentMaterias;
}
