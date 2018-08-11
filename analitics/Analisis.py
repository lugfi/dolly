
# coding: utf-8

# In[316]:


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from decimal import Decimal

df_raw = pd.read_csv("db_dolly.txt", index_col=False, error_bad_lines=False)
df = df_raw[df_raw['doc']!="A Designar"]
df.head()
#materias = df.mat.unique()


# # Calificación del docente
# 
# A fin de poder ordenar los docentes, para que los "mejores" aparezcan primero, es necesario obtener una métrica.
# Voy a utilizar una norma 2 pero con coeficientes de ponderación dados consignados en la siguiente tabla.

# In[317]:


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
np.sqrt(np.square(df[features].values) @ wn)


# # Tabla de comparación
# 
# Tomando la media de cada feature, analizando para docente y materia por separado

# In[318]:


# Para un docente particular
docentes = list(df['doc'].unique()) # pss... lista de docentes
df[df['doc']=='Acero'][features].mean()


# In[319]:


# Para una materia en particular
puntajes = df[df['mat']==6103].groupby('doc')[features].mean()
puntajes.head()


# ## Índice múltiple
# Tendría que repetir el procedimiento para cada materia, pero si uso un indice múltiple (de la forma (materia,docente))
# me ahorro todo ese trabajo.

# In[320]:


counts = df.groupby(['mat','doc']).size().to_frame(name='respuestas')
grouped = df.groupby(['mat','doc'])[features].mean().join(counts)

grouped


# In[321]:


grouped.reset_index().to_json(orient='index')


# In[324]:


def float_format(x):
    return str(round(Decimal(x),1))

html = grouped.to_html(float_format=float_format)

with open('datos.html', 'w') as f:
    print(html, file=f)

