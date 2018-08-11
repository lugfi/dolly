
# coding: utf-8

# In[228]:


import pandas as pd
import numpy as np
#import matplotlib.pyplot as plt

pd.set_option('display.max_colwidth', -1)
outfile =  "datos.html"
datafile = "../gente.txt"


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

# In[229]:


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
puntajes = np.sqrt(np.square(df[features].values) @ wn)


# # Tabla de comparación
# 
# Tomando la media de cada feature, analizando para docente y materia por separado

# In[230]:


# Para un docente particular
docentes = list(df['doc'].unique()) # pss... lista de docentes
df[df['doc']=='Acero'][features].mean()


# In[231]:


# Para una materia en particular
puntajes = df[df['mat']==6103].groupby('doc')[features].mean()
puntajes.head()


# ## Índice múltiple
# Tendría que repetir el procedimiento para cada materia, pero si uso un indice múltiple (de la forma (materia,docente))
# me ahorro todo ese trabajo.

# In[232]:


comentarios = df.groupby(['mat','doc'])['comentarios'].apply(list).to_frame("comentarios")
counts = df.groupby(['mat','doc']).size().to_frame(name='respuestas')
grouped = df.groupby(['mat','doc'])[features].mean().join(counts).join(comentarios)

grouped


# In[233]:


import base64
import lxml.html

comment = comentarios['comentarios'][5][1]
#res = [ for x in comment]

def b64_to_html_decoding(comment_list):
    text = "[ULSTART]"
    for x in comment_list:
        #text = text + lxml.html.tostring(lxml.html.fromstring(base64.b64decode(x))).decode("ascii").replace("<p>","•").replace("</p>","\n")
        text = text + "[LISTART]" + base64.b64decode(x).decode("utf8")+"[LIEND]"
    return text + "[ULEND]"

#lxml.html.tostring(lxml.html.fromstring(base64.b64decode(comment))).decode("ascii").replace("<p>","<li>").replace("</p>","</li>")

grouped['comentarios'] = grouped['comentarios'].apply(b64_to_html_decoding)
grouped.to_json(orient='index')


# In[238]:


from decimal import Decimal
import datetime

def float_format(x):
    return str(round(Decimal(x),1))

html = grouped.to_html(float_format=float_format)

now = datetime.datetime.now()

html_head = '<!DOCTYPE html><html><head>  <meta charset="utf-8" />  <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />  <meta http-equiv="Expires" content="0">  <meta http-equiv="Last-Modified" content="0">  <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">  <meta http-equiv="Pragma" content="no-cache">  <title>Resultados</title></head><body>'

header = "<h4>Actualizado: " + str(now) +"</h4>"
with open(outfile, mode="w", encoding="utf8") as f:
    f.write(html_head+header+html+'</body></html>')

