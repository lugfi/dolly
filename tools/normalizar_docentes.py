import json
from pathlib import Path

"""
El siguiente script toma un archivo json con el formato del json que usa el organizador
y transforma los docentes de la siguiente forma:
APELLIDO, NOMBRE NOMBRE - APELLIDO, NOMBRE NOMBRE -> Apellido-Apellido
"""

DATA_DIR = Path(Path.cwd() / "data")
HORARIOS_FILENAME = "Horarios_1Q2020.json" # Cambiar el archivo a usar

with open(DATA_DIR / HORARIOS_FILENAME, 'r+') as f:
    data = json.load(f)
    f.seek(0)
    for materia in data['materias']:
        for curso in materia['cursos']:
            docentes = [d.strip() for d in curso['docentes'].split('-')]
            docentes_apellidos = [d.split(',')[0].title() for d in docentes] # Me quedo solo con el apellido
            docentes_final = '-'.join(docentes_apellidos)
            curso['docentes'] = docentes_final
    json.dump(data, f, ensure_ascii=False)
    f.truncate()
