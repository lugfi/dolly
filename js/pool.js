Pool = {
  questions: [
    {question: "Asiste normalmente a clase", short: "Asistencia a clase"},
    {question: "Cumple con los horarios establecidos", short: "Cumple los horarios"},
    {question: "Mantiene un trato adecuado con los alumnos", short: "Mantiene un trato adecuado"},
    {question: "Parece dominar la asignatura que imparte", short: "Sabe de la materia"},
    {question: "Sus clases están bien organizadas"},
    {question: "Explica con claridad"},
    {question: "Varía las estrategias de enseñanza para asegurar la comprensión, aclarar dudas o atender necesidades individuales"},
    {question: "Intenta que los alumnos participen en las clases", short: "Fomenta la participación en clase"},
    {question: "Presenta un panorama amplio de su asignatura"},
    {question: "Responde con exactitud y precisión a las preguntas que le hacen"},
    {question: "Acepta la crítica fundamentada"},
    {question: "Utiliza en clase un material didáctico que ayuda a comprender las explicaciones"},
    {question: "Responde dudas por mail/campus"}
  ],
  question_html: '<fieldset name="NAME"><div class="grid-row">\
    <div class="flex-item"><i class="fas fa-question-circle mr-2" data-toggle="tooltip" title="TOOLTIP"></i>TXT</div>\
    <label class="flex-item">\
      <input type="radio" value="1" name="NAME"> <span></span>\
    </label>\
    <label class="flex-item">\
      <input type="radio" value="2" name="NAME"> <span></span>\
    </label>\
    <label class="flex-item">\
      <input type="radio" value="3" name="NAME"> <span></span>\
    </label>\
    <label class="flex-item">\
      <input type="radio" value="4" name="NAME"> <span></span>\
    </label>\
    <label class="flex-item">\
      <input type="radio" value="5" name="NAME"> <span></span>\
    </label>\
  </div></fieldset>',
  header_html: '<form id="formIDX">\
        <div class="wrapper">\
          <div class="grid-header">\
            <div class="header-item"></div>\
            <div class="header-item">\
              <div><p><i class="far fa-frown"></i></p>1</div>\
            </div>\
            <div class="header-item">2</div>\
            <div class="header-item">3</div>\
            <div class="header-item">4</div>\
            <div class="header-item"><p><i class="far fa-smile"></i></p>5</div>\
          </div>',
  footer_html: '</div><button type="submit" class="btn btn-primary send">Listo</button></form>',

  createPoolHTML: function(idx){
    // question = ["question 1", "question 2", ...]
    let html = ""
    html += this.header_html.replace(/IDX/g, idx);
    this.questions.forEach(function(q, i){
      const short = q.short ? q.short : q.question;
      html += Pool.question_html.replace(/NAME/g, i).replace("TXT", short).replace("TOOLTIP", q.question);
    });

    html += this.footer_html;

    return html;
  },

  addPool: function(div, idx){
    // add Pool and all triggers and validations
    const place = $(div);

    place.html(this.createPoolHTML(idx));
    $(place).find(".send").click(function(event){
      // Validate form on submit
      event.preventDefault();
      if(Pool._validateForm(this.form)){
        // Call external function
        Pool.onSubmit(idx, $(this.form).serializeArray());
        console.log("yay!");
      }else{
        console.log("mal ahi");
      }
      return false;
    });
  },
  _validateForm: function(form){
    if (!form){
      throw "No form given.";
    }

    validate_ok = true;
    $(form).find("fieldset").each(function(i,elem){
      $(elem).removeClass("bg-danger");

      if(! Pool._isCompleted(elem)){
        validate_ok = false;
        $(elem).addClass("bg-danger");
      }
    });
    return validate_ok;
  },
  _isCompleted: function(row){
    return $(row).find("input").filter(":checked").length > 0;
  },
  getPoolData: function(idx){
    const form = $("#form"+idx);
    if(! Pool._validateForm(form)){
      throw "Form Not Completed";
    }

    return form.serializeArray()
  }
}
