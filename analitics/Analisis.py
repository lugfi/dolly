
# coding: utf-8

# In[359]:
import csv
import json
import pandas as pd
import numpy as np
import os
from Curso import questions
from Curso import Docente
from Curso import Curso
from Curso import Materia
from AnalisisPorCuatri import analizar_cuatri

#import matplotlib.pyplot as plt

pd.set_option('display.max_colwidth', -1)
datafile = "../gente.txt"
out_valoraciones = "valoraciones_docentes.json"
out_puntaje = "puntaje_docentes.json"
out_comentarios = "comentarios_docentes.json"

# Voy a sanitizar la tabla, por si aparece algun registro con menos campos o texto

questioncols = ['asistencia', 'cumple_horarios', 'buen_trato', 'clase_organizada',
                'claridad', 'fomenta_participacion', 'panorama_amplio', 'acepta_critica', 'responde_mails']
usecols = ['doc', 'mat', 'cuat'] + questioncols + ['comentarios']

df_raw = pd.read_csv(datafile, usecols=usecols, header=0)

for index in questioncols:
    # Furzo estos campos a numerico
    df_raw[index] = pd.to_numeric(df_raw[index], errors='coerce')

# Elimino campos con errores, excepto comentarios nulos
df = df_raw.dropna(subset=['doc', 'mat'] + questioncols)

df = df[df['doc'] != "A Designar"]  # Elimino el docente "A Designar"

# Para unir los comentarios con el cuatrimestre correspondiente
df['cuat'].map(str)
df['separador'] = ' - '
df['editado'] = 0
df['comentarios_aux'] = df['cuat'] + df['separador']
df['comments'] = df['comentarios_aux'] + df['comentarios']
# Borro las columnas del df innecesarias
del df['comentarios_aux']
del df['separador']

# Defino los cuatrimestres para filtar
cuatrimestres = ['1Q2014', '2Q2014', '1Q2015', '2Q2015', '1Q2016', '2Q2016',
                 '1Q2017', '2Q2017', '1Q2018', '2Q2018', '1Q2019', '2Q2019', '1Q2020', '2Q2020', '1Q2021', '2Q2021', '1Q2022']
listas_df = []
for c in cuatrimestres:
    listas_df.append(df.loc[df['cuat'] == c])


#materias = df.mat.unique()
df.head()


# # Calificación del docente
#
# A fin de poder ordenar los docentes, para que los "mejores" aparezcan primero, es necesario obtener una métrica.
# Voy a utilizar una norma 2 pero con coeficientes de ponderación dados consignados en la siguiente tabla.

# In[360]:


pesos = {
    'asistencia': 1,
    'cumple_horarios': 1,
    'clase_organizada': .7,
    'claridad': .7,
    'buen_trato': 0.5,
    'acepta_critica': 0.5,
    'fomenta_participacion': 0.5,
    'responde_mails': 0.5,
    'panorama_amplio': 0.5
}
features = list(pesos.keys())
w = np.array(list(pesos.values()))
wn = w/np.sum(w)


def calc_score(row):
    return np.sqrt(np.square(row) @ wn)


#a = df.groupby(['mat','doc']).size().to_frame(name='coso')
# df.groupby(['mat','doc']).join(a)

# d=calc_score(df.groupby(['mat','doc'])[features].mean().values)

# df.groupby(['mat','doc'])[features].size().index

#df.groupby(['mat','doc']).agg({'puntaje': d})

# Series(data=d, .to_frame(name='puntaje')
# df.groupby(['mat','doc']).join()


# ## Índice múltiple
# Tendría que repetir el procedimiento para cada materia, pero si uso un indice múltiple (de la forma (materia,docente))
# me ahorro todo ese trabajo.

# In[361]:
counts = df.groupby(['mat', 'doc']).size().to_frame(name='respuestas')
grouped = df.groupby(['mat', 'doc'])[features].mean().join(counts)

with open(out_valoraciones, mode="w", encoding="utf8") as f:
    f.write(grouped.reset_index().to_json(orient='records'))

comentarios = df.groupby(['mat', 'doc', 'cuat', 'editado'])[
    'comentarios'].apply(list).to_frame("comentarios")
with open(out_comentarios, mode="w", encoding="utf8") as f:
    f.write(comentarios.reset_index().to_json(orient='records'))

analizar_cuatri('../data/Horarios_1Q2022.json')
