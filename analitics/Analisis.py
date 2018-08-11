# coding: utf-8

# In[50]:


import pandas as pd
import numpy as np
#import matplotlib.pyplot as plt
import sys

outfile =  "datos.html"
datafile = "../gente.txt"

# Voy a sanitizar la tabla, por si aparece algun registro con menos campos o texto

questioncols = ['asistencia', 'cumple_horarios', 'buen_trato', 'calse_organizada', 'claridad', 'fomenta_participacion', 'panorama_amplio', 'acepta_critica', 'responde_mails']
usecols = ['doc', 'mat'] + questioncols

df_raw = pd.read_csv(datafile, usecols=usecols, header=0)
for index in questioncols:
    df_raw[index] = pd.to_numeric(df_raw[index], errors='coerce') # Furzo estos campos a numerico
    
df = data=df_raw.dropna() # Elimino campos con errores
df = df[df['doc']!="A Designar"] # Elimino el docente "A Designar"
#materias = df.mat.unique()


# # Calificación del docente
# 
# A fin de poder ordenar los docentes, para que los "mejores" aparezcan primero, es necesario obtener una métrica.
# Voy a utilizar una norma 2 pero con coeficientes de ponderación dados consignados en la siguiente tabla.

# In[51]:


pesos = {
    'asistencia': 1,
    'cumple_horarios': 1,
    'calse_organizada': .7,
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
np.sqrt(np.square(df[features].values) @ wn)


# # Tabla de comparación
# 
# Tomando la media de cada feature, analizando para docente y materia por separado

# In[52]:


# Para un docente particular
docentes = list(df['doc'].unique()) # pss... lista de docentes
df[df['doc']=='Acero'][features].mean()


# In[53]:


# Para una materia en particular
puntajes = df[df['mat']==6103].groupby('doc')[features].mean()
puntajes.head()


# ## Índice múltiple
# Tendría que repetir el procedimiento para cada materia, pero si uso un indice múltiple (de la forma (materia,docente))
# me ahorro todo ese trabajo.

# In[54]:


counts = df.groupby(['mat','doc']).size().to_frame(name='respuestas')
grouped = df.groupby(['mat','doc'])[features].mean().join(counts)

grouped


# In[55]:


grouped.reset_index().to_json(orient='index')


# In[56]:


from decimal import Decimal
import datetime

def float_format(x):
    return str(round(Decimal(x),1))

html = grouped.to_html(float_format=float_format)

now = datetime.datetime.now()
header = "<h4>Actualizado: " + str(now) +"</h4>"

with open(outfile, mode="w", encoding="utf8") as f:
    f.write(header+html)

