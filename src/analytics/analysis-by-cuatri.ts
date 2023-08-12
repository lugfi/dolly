export function emprolijar_docentes(docentes_raw: string): string[] {
	const docentes_raw_list = docentes_raw.split('-');
	if (docentes_raw_list.includes("A Designar")) {
		docentes_raw_list.splice(docentes_raw_list.indexOf("A Designar"), 1);
	}
	return docentes_raw_list;
}
