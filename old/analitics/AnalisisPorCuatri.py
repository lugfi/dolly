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


def analizar_equivalencias():
    equivalencias = {}
    file = open("../data/equivalencias.json", encoding="utf8")
    eq = json.load(file)
    for e in eq:
        for m in e:
            e_copia = [str(x) for x in e]
            equivalencias[str(m)] = e_copia
    return equivalencias


datafile = "../gente.txt"
script_dir = os.path.dirname(__file__)  # <-- absolute dir the script is in


def escribir_log(cuatri, mensaje, doc, cuat, mat, linea):
    # with open(cuatri+'log.txt', 'a+') as log:
    #     log.write(mensaje + ',' + doc + ',' + cuat + ',' + mat + ',' + linea + '\n')
    return


def escribir_json(cuatri, materias, docentes, cursos):
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
            curso['score'] = 0
            curso['docentes'] = {}
            for d in c.get_docentes():
                dict = {'nombre': d.get_nombre()}
                curso['docentes'][d.get_nombre()] = {
                    **d.get_valoraciones(), **dict}
            data['opciones'].append(curso)

        file_path = os.path.join(script_dir, 'cursos/' + codigo + '.json')
        with open(file_path, 'w', encoding="utf8") as outfile:
            json.dump(data, outfile)
        data.clear()
        data['opciones'] = []


def buscar_materias_equivalentes(materia, dict_materias, equivalencias):
    list = []
    if materia not in equivalencias:
        return [dict_materias[materia]] if materia in dict_materias else None
    for m in equivalencias[materia]:
        if m not in dict_materias:
            continue
        list.append(dict_materias[m])
    return list


def buscar_codigos_materias_equivalentes(materia, equivalencias):
    list = []
    for m in equivalencias.get(materia, []):
        if m != materia:
            list.append(m)
    return list


def buscar_docente(docente, materias, dict_docentes):
    for m in materias:
        if m.tiene_docente(docente):
            return m.get_docente(docente)
    doc = Docente(docente)
    dict_docentes[docente] = doc
    return doc


def analizar_cuatri(archivo):
    equivalencias = analizar_equivalencias()
    print('Analizando cuatri...')
    cuatri = archivo.split('_')
    cuatri = cuatri[-1].split('.')
    cuatri = cuatri[0]
    f = open(archivo, encoding="utf8")
    js = json.load(f)
    id_actual = 0
    materias = {}
    docentes = {}
    cursos = {}
    for mat_id in js['materias']:
        mat = Materia(mat_id['codigo'], mat_id['nombre'])
        materias[mat.get_codigo()] = mat

    for mat_codigo in [k for k in materias.keys()]:
        materias_eq = buscar_codigos_materias_equivalentes(
            mat_codigo, equivalencias)
        if not materias_eq:
            continue
        for m in materias_eq:
            if m not in materias:
                materias[m] = Materia(m, materias[mat_codigo].nombre)

    for mat_id in js['materias']:
        mat = materias[mat_id['codigo']]
        for curso_id in mat_id['cursos']:
            curso = Curso(id_actual)
            cursos[id_actual] = curso
            docentes_raw = curso_id['docentes']
            docentes_raw = emprolijar_docentes(docentes_raw)
            materias_eq = buscar_materias_equivalentes(
                mat_id['codigo'], materias, equivalencias)
            for d in docentes_raw:
                doc = buscar_docente(d, materias_eq, docentes)
                curso.agregar_docente(doc)
            for m in materias_eq:
                m.agregar_curso(curso)
            id_actual += 1
        id_actual = 0
    analizar_valoraciones(cuatri, datafile, materias, equivalencias)
    escribir_json(cuatri, materias, docentes, cursos)


def analizar_valoraciones(cuatri, archivo, materias, equivalencias):
    docentes_valorados = []
    with open(archivo, mode='r', encoding="utf8") as csv_file:
        csv_reader = csv.DictReader(csv_file)
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                line_count += 1
                continue
            mat_code = row['mat']
            materias_eq = buscar_materias_equivalentes(
                mat_code, materias, equivalencias)
            if materias_eq is None:
                continue
            docente = None
            for mat in materias_eq:
                docente = mat.get_docente(row['doc'])
                if not docente is None:
                    break
            if docente is None:
                escribir_log(cuatri, 'El siguiente docente no se encontro: ',
                             row['doc'], row['cuat'], row['mat'], str(line_count))
                line_count += 1
                continue
            for q in questions:
                if docente not in docentes_valorados:
                    docentes_valorados.append(docente)
                docente.agregar_valoracion(q, row[q])
            line_count += 1
    for d in docentes_valorados:
        d.calcular_puntaje()
