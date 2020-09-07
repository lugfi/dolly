import json

def write_json(data, filename='Horarios_1Q2020.json'):
    with open(filename,'w') as f:
        json.dump(data, f)


with open('Horarios_1Q2020.json') as json_file:
    data = json.load(json_file)

    mat = data['materias']
    mat_def = None
    mat_buscada = input('Ingrese la materia: ')
    for m in mat:
        if m['codigo'] == mat_buscada:
            mat_def = m
    print('A continuacion de detallan los cursos: ')
    for i in range(len(mat_def['cursos'])):
        print(str(i) + ' - ' + mat_def['cursos'][i]['docentes'])

    curso_editar = int(input('Que curso desea editar? (Ingrese indice): '))
    opcion = input('Desea eliminar o agregar docente? (1-Eliminar, 2-Agregar) ')
    curso = mat_def['cursos'][curso_editar]['docentes']
    separador = '-'
    if int(opcion) == 1:
        print('Usted esta eliminando un docente del curso: ' + curso)
        doc = input('Que docente desea eliminar? (Escribalo tal cual): ')
        curso_list = curso.split(separador)
        curso_list.remove(doc)
        mat_def['cursos'][curso_editar]['docentes'] = separador.join(curso_list)
        print('Listo!')
    if int(opcion) == 2:
        print('Usted esta agregando un docente al curso: ' + curso)
        doc = input('Que docente desea agregar? (Escribalo tal cual): ')
        curso_list = curso.split(separador)
        curso_list.append(doc)
        mat_def['cursos'][curso_editar]['docentes'] = separador.join(curso_list)
        print('Listo!')


write_json(data)
