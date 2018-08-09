/* This "module" should remeber all the questions, even the "deleted" ones
To delete a questions, simply remove their id from activeQuestions array.
*/

Questions = {
  questions: [
    {id: 0, question: "Asiste normalmente a clase", short: "Asistencia a clase"},
    {id: 1, question: "Cumple con los horarios establecidos", short: "Cumple los horarios"},
    {id: 2, question: "Mantiene un trato adecuado con los alumnos", short: "Mantiene un trato adecuado"},
    {id: 3, question: "Parece dominar la asignatura que imparte", short: "Sabe de la materia"},
    {id: 4, question: "Sus clases están bien organizadas"},
    {id: 5, question: "Explica con claridad"},
    {id: 6, question: "Varía las estrategias de enseñanza para asegurar la comprensión, aclarar dudas o atender necesidades individuales"},
    {id: 7, question: "Intenta que los alumnos participen en las clases", short: "Fomenta la participación en clase"},
    {id: 8, question: "Presenta un panorama amplio de su asignatura"},
    {id: 9, question: "Responde con exactitud y precisión a las preguntas que le hacen"},
    {id: 10, question: "Acepta la crítica fundamentada"},
    {id: 11, question: "Utiliza en clase un material didáctico que ayuda a comprender las explicaciones"},
    {id: 12, question: "Responde dudas por mail/campus"}
  ],
  activeQuestions: [0,1,2,3,4,5,6,7,8,9,10,11,12],
  getQuestions: function(){
    return Questions.questions.filter(q => Questions.activeQuestions.includes(q.id));
  }
}
