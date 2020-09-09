import csv
import json
import pandas as pd
import numpy as np
import os
from Curso import questions
from Curso import Docente
from Curso import Curso
from Curso import Materia


def emprolijar_docentes(docentes_raw):
    docentes_raw = docentes_raw.split('-')
    if "A Designar" in docentes_raw:
        docentes_raw.remove("A Designar")
    return docentes_raw


datafile = "../gente.txt"
script_dir = os.path.dirname(__file__) #<-- absolute dir the script is in

def escribir_log(cuatri,mensaje, doc, cuat, mat, linea):
    with open(cuatri+'log.txt', 'a+') as log:
        log.write(mensaje + ',' + doc + ',' + cuat + ',' + mat + ',' + linea + '\n')

def escribir_json(cuatri,materias, docentes, cursos):
    data = {}
    lista = []
    data['opciones'] = []
    for m in materias:
        mat = materias[m]
        #data['codigo'] =  mat.get_codigo()
        codigo = mat.get_codigo()
        for c in mat.get_cursos():
            #materias['cursos'][c.get_index()] = {}
            curso = {}
            curso['nombre'] = c.get_docentes_str()
            curso['promedio'] = c.get_promedios()
            curso['docentes'] = {}
            for d in c.get_docentes():
                curso['docentes'][d.get_nombre()] = d.get_valoraciones()
            data['opciones'].append(curso)

        file_path = os.path.join(script_dir, 'cursos/' +codigo + '.json')
        with open(file_path, 'w') as outfile:
            json.dump(data, outfile)
        data.clear()
        data['opciones'] = []









def analizar_cuatri(archivo):
    print('Analizando cuatri...')
    cuatri = archivo.split('_')
    cuatri = cuatri[-1].split('.')
    cuatri = cuatri[0]
    f = open(archivo,)
    js = json.load(f)
    id_actual = 0
    materias = {}
    docentes = {}
    cursos = {}
    for mat_id in js['materias']:
        mat = Materia(mat_id['codigo'], mat_id['nombre'])
        materias[mat.get_codigo()] = mat
        for curso_id in mat_id['cursos']:
            curso = Curso(id_actual)
            cursos[id_actual] = curso
            docentes_raw = curso_id['docentes']
            docentes_raw = emprolijar_docentes(docentes_raw)
            for d in docentes_raw:
                if mat.tiene_docente(d):
                    doc = mat.get_docente(d)
                else:
                    doc = Docente(d)
                    docentes[d] = doc
                curso.agregar_docente(doc)
            mat.agregar_curso(curso)
            id_actual += 1
        id_actual = 0
    analizar_valoraciones(cuatri,datafile, materias)
    escribir_json(cuatri,materias, docentes, cursos)

def analizar_valoraciones(cuatri,archivo, materias):
    docentes_valorados = []
    with open(archivo, mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                line_count += 1
                continue
            if row['mat'] not in materias:
                escribir_log(cuatri, 'La siguiente materia no fue encontrada: ',row['mat'], row['cuat'], row['mat'],str(line_count))
                line_count += 1
                continue
            mat = materias[row['mat']]
            docente = mat.get_docente(row['doc'])
            if docente is None:
                escribir_log(cuatri,'El siguiente docente no se encontro: ',row['doc'], row['cuat'], row['mat'], str(line_count))
                line_count += 1
                continue
            for q in questions:
                if docente not in docentes_valorados:
                    docentes_valorados.append(docente)
                docente.agregar_valoracion(q, row[q])
            line_count += 1
    for d in docentes_valorados:
        d.calcular_puntaje()
