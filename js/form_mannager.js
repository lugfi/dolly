FormMannager = {
  cursoActual: {},
  formStatus:{},
  onSelectCuatri: function(){
    console.log("cuatri selected");
  },
  loadCuatriData: function(ref){
    // Loads JSON data and fills course select form
    const file = "Horarios_" + ref + ".json";
    $("#loading").show();
    $.getJSON("./data/"+file, function(data,st){
      if (st != "success")
        return;

      // Adds Materias to the selector
      FormMannager.data = data;
      let html="";
      data.materias.forEach(function(x,i){
        html += '<option class="option" value="' + i + '">' + x.codigo + " " + x.nombre + '</option>'
      });
      $("#materia").empty().append(html).selectpicker('val','').removeAttr("disabled").selectpicker('refresh'); //important!
      $("#curso").selectpicker('val','').attr("disabled", true).selectpicker('refresh');

      // Show couse selection form
      $("#course-gruop").collapse('show');

      // Alerts
      $("#loading").slideUp(500);
    }).fail(function(e){
      console.log(e);
      $("#load-fail").slideDown(1000);
    });
  },
  loadCursos: function(){
    const materia_idx = Number($("#materia").val());
    const cursos = this.data.materias[materia_idx].cursos;

    let html = "";
    cursos.forEach(function(x,i){
      html += '<option class="option" value="' + i + '">' + x.docentes.replace(/-/g, " - ") + '</option>'
    });
    $("#curso").empty();
    $("#curso").append(html).selectpicker('refresh');
    $("#curso").selectpicker('val','').removeAttr("disabled").selectpicker('refresh'); //important!

    // CLear
    $("#curso").selectpicker('val','').selectpicker('refresh');
    MyAccordion.clear();
    $("#cardSend").collapse("hide");
  },
  loadDocentes(){
    const materia_idx = Number($("#materia").val());
    const curso_idx = Number($("#curso").val());
    const cuatri = $("#cuatri").val();
    const codMateria = this.data.materias[materia_idx].codigo;
    const curso = this.data.materias[materia_idx].cursos[curso_idx];
    const docentes = curso.docentes.split("-");

    this.cursoActual = {
      materia: codMateria,
      cuatri: cuatri,
      docentes: docentes
    };

    MyAccordion.clear();

    docentes.forEach(function(x,i){
      MyAccordion.addCard(x);
    });

    //$("#form-pool").collapse('show');
  },
  cambiarDocente: function(e){
    e.preventDefault();
    const docente_idx = Number($(this).data("idx"));
    const docente = FormMannager.cursoActual.docentes[docente_idx];
    if (!docente){
      return false;
    }

    console.log("Cambiar docente: "+docente);

    ChangeDocentes.change(docente, function(newDocente, action){
      if (newDocente){
        $("#heading" + docente_idx).find(".docenteName").html(newDocente+'<i class="fas fa-helicopter ml-3"></i>');
        FormMannager.cursoActual.docentes[docente_idx] = newDocente;
      }else if (action == 'delete') {
        delete FormMannager.cursoActual.docentes[docente_idx];
        $("#collapse" + docente_idx).empty().collapse("hide");
        $("#heading" + docente_idx).find(".docenteName").html('<del>' + docente + '</del>');
        $("#heading" + docente_idx).find(".docenteName").prop('disabled', true);
      }
    });
  },
  onSubmitForms: function(idx, data){
    $("#collapse"+idx).collapse('hide');
    FormMannager.formStatus[idx] = true;

    // Must show button?
    let completed = true;
    FormMannager.cursoActual.docentes.forEach(function(e,i){
      completed &= FormMannager.formStatus[i];
    });

    if (completed){
      $("#cardSend").collapse("show");
    }
  },
  createCSV: function(idx){
    data = Pool.getPoolData(idx);
    let str = FormMannager.cursoActual.docentes[idx] + "|" + FormMannager.cursoActual.materia + "|" + FormMannager.cursoActual.cuatri + "|";
    data.forEach(function(elem){
      str += "" + elem.value + "|"
    });
    str += Date.now();

    return str;
  },
  sendForm:function(){
    let csvData = "";

    this.cursoActual.docentes.forEach(function(d,i){
      csvData += FormMannager.createCSV(i) + "\n";
    });

    csvData = csvData.trim();

    console.log("sending: ```" + csvData + "```");

    // Send CSV data
    $.post("http://web.fi.uba.ar/~fdanko/test.php",
    {
       pio: csvData
    },
    function(data, status){
       if(data.trim() == csvData){
         $("#okModal").modal("show");
         $("#materia").selectpicker('val','').selectpicker('refresh');
         $("#curso").selectpicker('val','').selectpicker('refresh');
         MyAccordion.clear();
         $("#cardSend").collapse("hide");
       }else{
         $("#errorModal").modal("show");
       }
    });
  }
}

MyAccordion = {
  card_idx: 0,
  addCard: function(title){
    const html = this.cardhtml.replace(/TITLE/g,title).replace(/INDEX/g,this.card_idx).replace(/One/g,this.card_idx);

    $("#accordion").append(html);
    Pool.addPool($("#collapse"+this.card_idx+" > .card-body"), this.card_idx);
    $(".fulano[data-idx=" + this.card_idx + "]").click(FormMannager.cambiarDocente);
    this.card_idx++;
    window.onDomChange();
  },
  clear: function(){
    this.card_idx = 0;
    $("#accordion").empty();
  },
  cardhtml: '<div class="card">\
          <div class="card-header d-flex justify-content-between" id="headingOne">\
            <span class="h5 mb-0 col">\
              <button class="btn btn-link docenteName" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true"  aria-controls="collapseOne">\
                TITLE \
              </button>\
            </span>\
            <a href="#" class="form-text text-muted fulano" data-idx="INDEX">No conozco a este fulano</a>\
          </div>\
          <div id="collapseOne" class="collapse show" aria-labelledby="headingOne">\
            <div class="card-body collapse show">\
          </div>\
        </div>'
}
