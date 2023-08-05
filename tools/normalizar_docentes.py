import json
from pathlib import Path

"""
El siguiente script toma un archivo json con el formato del json que usa el organizador
y transforma los docentes de la siguiente forma:
APELLIDO, NOMBRE NOMBRE - APELLIDO, NOMBRE NOMBRE -> Apellido-Apellido
"""

DATA_DIR = Path(Path.cwd())
HORARIOS_FILENAME = "horarios.json" # Cambiar el archivo a usar

def obtenerCurso(codigoCurso, cursos):
    for curso in cursos:
        if(curso["codigo"] == codigoCurso):
            print(curso)
            return curso


with open(DATA_DIR / HORARIOS_FILENAME, 'r+', encoding='utf-8') as f:
    data = json.load(f)
    f.seek(0)
    cursos = data["cursos"]
    for materia in data['materias']:
        for codigoCurso in materia["cursos"]:
            curso = obtenerCurso(codigoCurso, cursos)
            docentes = [d.strip() for d in curso['docentes'].split('-')]
            docentes_apellidos = [d.split(',')[0].title() for d in docentes] # Me quedo solo con el apellido
            docentes_final = '-'.join(docentes_apellidos)
            curso['docentes'] = docentes_final
    json.dump(data, f, ensure_ascii=False)
    f.truncate()
