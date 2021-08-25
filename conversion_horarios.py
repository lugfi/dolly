import json

"""
Rudimentario script que converte los json de Fiuba Plan de 
Fede del Mazo (https://github.com/FdelMazo/FIUBA-Plan) al formato
de json que utiliza Dolly.
El archivo de salida del script es, por ejemplo, 'Horarios_20221C.json'.
Hay que renombrarlo a 'Horarios_1Q2022.json' y moverlo a la carpeta 'data'.

Disclaimer: Los datos de Fede están en formato js, primero hay que 
convertirlos a .json
"""

data = {}

with open('carreras.json') as carreras:
    carreras_json = json.load(carreras)
    data['carreras'] = carreras_json
    

with open('horarios.json') as horarios_file:
    horarios = json.load(horarios_file)
    cuatrimestre = horarios['cuatrimestre']
    cursos = {}
    for curso in horarios['cursos']:
        if curso['codigo'] in cursos:
            import ipdb; ipdb.set_trace()
        docentes = curso['docentes'].split(' - ')
        docentes = [d.split(',')[0].title() for d in docentes]
        cursos[curso['codigo']] = {
            'docentes': '-'.join(docentes),
            'clases': curso['clases']
        }
    materias = []
    for materia in horarios['materias']:
        cursos_materia = []
        for c in materia['cursos']:
            cursos_materia.append(cursos[c])
        materia['cursos'] = cursos_materia
        materia['sel'] = 0
        materia['cursoSel'] = 0
        materia['expanded'] = 1
        materia['forzar'] = 0
        materia['cursoForzado'] = []
        materia['color'] = "#FFF45E"
        materias.append(materia)
    data['materias'] = materias

with open(f'Horarios_{cuatrimestre}.json', 'w') as salida:
    json.dump(data, salida, indent=4, ensure_ascii=False)
        