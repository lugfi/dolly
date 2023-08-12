import {mean} from "lodash";


// const questions: string[] = ["asistencia", "cumple_horarios", "buen_trato", "clase_organizada", "claridad", "fomenta_participacion",
//	"panorama_amplio", "acepta_critica", "responde_mails"];

export class Curso {
	id: number;
	docentes: Docente[];

	constructor(id: number) {
		this.id = id;
		this.docentes = [];
	}

	agregar_docente(docente: Docente): void {
		this.docentes.push(docente);
	}

	tiene_docente(d: string): boolean {
		return this.docentes.some(doc => doc.get_nombre() === d);
	}

	get_docente(d: string): Docente | null {
		return this.docentes.find(doc => doc.get_nombre() === d) || null;
	}

	get_docentes(): Docente[] {
		return this.docentes;
	}

	get_docentes_str(): string {
		const lista: string[] = this.docentes.map(d => d.get_nombre());
		let final = lista.join('-');
		if (final.length > 50) {
			final = final.substring(0, 50) + '...';
		}
		return final;
	}

	get_dict_docentes(): { [key: string]: Docente } {
		const dict: { [key: string]: Docente } = {};
		for (const d of this.docentes) {
			dict[d.get_nombre()] = d;
		}
		return dict;
	}

	get_promedios(): { [key: string]: number } {
		const dict: { [key: string]: number } = {}; // Use number instead of number[]
		const questionResponses: { [key: string]: number[] } = {};

		// Accumulate responses for each question across all docentes
		for (const d of this.docentes) {
			const valoraciones = d.get_valoraciones();
			for (const v in valoraciones) {
				if (v === 'respuestas' || v === 'score') continue;
				if (!questionResponses[v]) {
					questionResponses[v] = [];
				}
				questionResponses[v] = questionResponses[v].concat(valoraciones[v]);
			}
		}

		// Calculate mean for each question
		for (const v in questionResponses) {
			const meanValue = mean(questionResponses[v]);
			dict[v] = parseFloat(meanValue.toFixed(2));
		}

		return dict;
	}
}

export class Docente {
	nombre: string;
	valoraciones: { [key: string]: number[] };
	valoracionesCalculadas: { [key: string]: number };
	respuestas: number;

	constructor(nombre: string) {
		this.nombre = nombre;
		this.valoraciones = {};
		this.valoracionesCalculadas = {};
		this.respuestas = 0;
	}

	get_nombre(): string {
		return this.nombre;
	}

	get_valoraciones(): { [key: string]: number } {
		const valoraciones = {...this.valoracionesCalculadas};
		valoraciones['respuestas'] = this.respuestas;
		valoraciones['score'] = 0;
		return valoraciones;
	}

	agregar_valoracion(question: string, valor: string): void {
		if (!this.valoraciones[question]) {
			this.valoraciones[question] = [];
		}
		if (valor === null || valor === undefined) return;
		try {
			const valor_int = parseInt(valor, 10);
			this.valoraciones[question].push(valor_int);
		} catch (error) {
			console.log('No se puede pasar a numero');
		}
	}

	calcular_puntaje(): void {
		for (const q in this.valoraciones) {
			const ratings = this.valoraciones[q];
			const totalRatings = ratings.length;
			const sumRatings = ratings.reduce((total, rating) => total + rating, 0);
			this.valoracionesCalculadas[q] = parseFloat((sumRatings / totalRatings).toFixed(3));
		}
	}
}


export class Materia {
	codigo: string;
	nombre: string;
	cursos: Curso[];

	constructor(codigo: string, nombre: string) {
		this.codigo = codigo;
		this.nombre = nombre;
		this.cursos = [];
	}

	agregar_curso(curso: Curso): void {
		this.cursos.push(curso);
	}

	tiene_docente(d: string): boolean {
		return this.cursos.some(c => c.tiene_docente(d));
	}

	get_docente(d: string): Docente | null {
		for (const c of this.cursos) {
			const doc = c.get_docente(d);
			if (doc !== null) {
				return doc;
			}
		}
		return null;
	}

	get_cursos(): Curso[] {
		return this.cursos;
	}

	get_all_docentes(): { [key: string]: Docente } {
		let dict: { [key: string]: Docente } = {};
		for (const c of this.cursos) {
			const dict_curso = c.get_dict_docentes();
			dict = {...dict, ...dict_curso};
		}
		return dict;
	}
}
