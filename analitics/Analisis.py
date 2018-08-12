
# coding: utf-8

# In[334]:


import pandas as pd
import numpy as np
#import matplotlib.pyplot as plt

pd.set_option('display.max_colwidth', -1)
datafile = "../gente.txt"
out_valoraciones =  "valoraciones_docentes.json"
out_puntaje =  "puntaje_docentes.json"
out_comentarios =  "comentarios_docentes.json"

# Voy a sanitizar la tabla, por si aparece algun registro con menos campos o texto

questioncols = ['asistencia', 'cumple_horarios', 'buen_trato', 'clase_organizada', 'claridad', 'fomenta_participacion', 'panorama_amplio', 'acepta_critica', 'responde_mails']
usecols = ['doc', 'mat'] + questioncols + ['comentarios']

df_raw = pd.read_csv(datafile, usecols=usecols, header=0)
for index in questioncols:
    df_raw[index] = pd.to_numeric(df_raw[index], errors='coerce') # Furzo estos campos a numerico
    
df = data=df_raw.dropna() # Elimino campos con errores
df = df[df['doc']!="A Designar"] # Elimino el docente "A Designar"
#materias = df.mat.unique()
df.head()


# # Calificación del docente
# 
# A fin de poder ordenar los docentes, para que los "mejores" aparezcan primero, es necesario obtener una métrica.
# Voy a utilizar una norma 2 pero con coeficientes de ponderación dados consignados en la siguiente tabla.

# In[335]:


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
#df.groupby(['mat','doc']).join(a)

#d=calc_score(df.groupby(['mat','doc'])[features].mean().values)

#df.groupby(['mat','doc'])[features].size().index

#df.groupby(['mat','doc']).agg({'puntaje': d})

#Series(data=d, .to_frame(name='puntaje')
#df.groupby(['mat','doc']).join()


# ## Índice múltiple
# Tendría que repetir el procedimiento para cada materia, pero si uso un indice múltiple (de la forma (materia,docente))
# me ahorro todo ese trabajo.

# In[336]:


counts = df.groupby(['mat','doc']).size().to_frame(name='respuestas')
grouped = df.groupby(['mat','doc'])[features].mean().join(counts)

with open(out_valoraciones, mode="w", encoding="utf8") as f:
    f.write(grouped.to_json(orient='index'))
    
comentarios = df.groupby(['mat','doc'])['comentarios'].apply(list).to_frame("comentarios")
with open(out_comentarios, mode="w", encoding="utf8") as f:
    f.write(comentarios.to_json(orient='index'))
    

