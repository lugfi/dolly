import json

def write_json(data, filename='Horarios_1Q2020.json'):
    with open(filename,'w') as f:
        json.dump(data, f)

with open('Horarios_1Q2020.json') as json_file:
    data = json.load(json_file)
    mat_def = None
    mat = data['materias']
    ayudantes = []
    with open('ayudantes.txt') as ayudantes_file:
        for linea in ayudantes_file:
            if linea[0] == "1":
                mat_buscada = linea.split(',')[1].rstrip('\n')
                for m in mat:
                    if m['codigo'] == mat_buscada:
                        mat_def = m
                continue
            ayudantes.append(linea.rstrip('\n'))
    curso_buscado = None
    for i in range(len(mat_def['cursos'])):
        if mat_def['cursos'][i]['docentes'].split('-')[0] == 'Buchwald':
            curso_buscado = i
    ayudantes.insert(0,mat_def['cursos'][curso_buscado]['docentes'])
    sep = '-'
    mat_def['cursos'][curso_buscado]['docentes'] = sep.join(ayudantes)
    print('Listo')


write_json(data)
