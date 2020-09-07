questions = ["asistencia","cumple_horarios","buen_trato","clase_organizada","claridad","fomenta_participacion","panorama_amplio","acepta_critica","responde_mails"]
class Curso:
    def __init__(self,id):
        self.id = id
        self.docentes = []

    def agregar_docente(self,docente):
        self.docentes.append(docente)

    def tiene_docente(self, d):
        for doc in self.docentes:
            if doc.get_nombre() == d:
                return True
        return False
    def get_docente(self,d):
        for doc in self.docentes:
            if doc.get_nombre() == d:
                return doc
        return None
    def get_index(self):
        return str(self.id)
    def get_docentes(self):
        return self.docentes

class Docente:
    def __init__(self,nombre):
        self.nombre = nombre
        self.valoraciones = {}
    def agregar_valoracion(self,question, valor):
        if question not in self.valoraciones:
            self.valoraciones[question] = []
        if valor is None: return
        try:
            valor_int = int(valor)
            self.valoraciones[question].append(valor_int)
        except ValueError:
            print('No se puede pasar a numero')

    def get_nombre(self):
        return self.nombre
    def get_valoraciones(self):
        return self.valoraciones
    def calcular_puntaje(self):
        for q in self.valoraciones:
            cant = 0
            suma = 0
            for i in self.valoraciones[q]:
                suma += i
                cant += 1
            self.valoraciones[q] = round(suma/cant,1)


class Materia:
    def __init__(self,codigo,nombre):
        self.codigo = codigo
        self.nombre = nombre
        self.cursos = []
    def agregar_curso(self,curso):
        self.cursos.append(curso)
    def get_codigo(self):
        return self.codigo
    def tiene_docente(self,d):
        for c in self.cursos:
            if c.tiene_docente(d):
                return True
        return False
    def get_docente(self,d):
        for c in self.cursos:
            doc = c.get_docente(d)
            if doc is None:
                continue
            if doc is not None:
                return doc
    def get_cursos(self):
        return self.cursos
