import {Curso, Docente, Materia} from "./curso";
import {readCSVFile} from "./analysis";
import {RowData} from "./types";
import * as fs from "fs";

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


export function analizar_valoraciones(
	cuatri: string,
	archivo: string,
	materias: { [key: string]: Materia },
	equivalencias: { [key: string]: string[] }
): void {
	const docentes_valorados: Docente[] = [];

	const rows: RowData[] = readCSVFile(archivo);
	for (const row of rows) {
		const materias_eq = buscar_materias_equivalentes(row.mat, materias, equivalencias);
		if (materias_eq === null) {
			continue;
		}

		let docente: Docente | null = null;
		for (const mat of materias_eq) {
			docente = mat.get_docente(row.doc);
			if (docente !== null) {
				break;
			}
		}

		if (docente === null) {
			console.log(cuatri, 'El siguiente docente no se encontro: ',
				row.doc, row.cuat, row.mat);
			continue;
		}


		for (const rating in row) {
			if (!docentes_valorados.includes(docente)) {
				docentes_valorados.push(docente);
			}
			docente.agregar_valoracion(row.doc, rating);
		}
	}
	for (const d of docentes_valorados) {
		d.calcular_puntaje();
	}
}

export function buscar_docente(
	docente: string,
	materias: Materia[],
	dict_docentes: { [key: string]: Docente }
): Docente {
	for (const materia of materias) {
		if (materia.tiene_docente(docente)) {
			return materia.get_docente(docente) as Docente;
		}
	}
	const newDocente = new Docente(docente);
	dict_docentes[docente] = newDocente;
	return newDocente;
}

export function analizarCuatri(archivo: string): void {
	const eq = JSON.parse(fs.readFileSync('../data/equivalencias.json', 'utf8'));
	const equivalencias = analizar_equivalencias(eq);
	console.log('Analizando cuatri...');

	//const cuatriParts = archivo.split('_');
	//const cuatri = cuatriParts[cuatriParts.length - 1].split('.')[0];

	const rawData = fs.readFileSync(archivo, 'utf8');
	const js = JSON.parse(rawData);
	let id_actual = 0;
	const materias: { [key: string]: Materia } = {};
	const docentes: { [key: string]: Docente } = {};
	const cursos: { [key: number]: Curso } = {};

	for (const mat_id of js['materias']) {
		const mat = new Materia(mat_id.codigo, mat_id.nombre);
		materias[mat.codigo] = mat;
	}

	for (const mat_codigo of Object.keys(materias)) {
		const materias_eq = buscar_codigos_materias_equivalentes(mat_codigo, equivalencias);
		if (!materias_eq) {
			continue;
		}
		for (const m of materias_eq) {
			if (!(m in materias)) {
				materias[m] = new Materia(m, materias[mat_codigo].nombre);
			}
		}
	}

	for (const mat_id of js['materias']) {
		for (const curso_id of mat_id.cursos) {
			const curso = new Curso(id_actual);
			cursos[id_actual] = curso;
			let docentes_raw = curso_id.docentes;
			docentes_raw = emprolijar_docentes(docentes_raw);
			const materias_eq = buscar_materias_equivalentes(mat_id.codigo, materias, equivalencias);
			for (const d of docentes_raw) {
				const doc = buscar_docente(d, materias_eq || [], docentes);
				curso.agregar_docente(doc);
			}
			if (materias_eq !== null) {
				for (const m of materias_eq) {
					m.agregar_curso(curso);
				}
			}
			id_actual++;
		}
		id_actual = 0;
	}
}




