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
    getJSON(Config.dataPath + file, function(data,st){
      if (st != "success")
        return;

      // Adds Materias to the selector
      FormMannager.data = data;
      let html="";
      data.materias.forEach(function(x,i){
        html += '<option class="option" value="' + i + '">' + x.codigo + " " + Utils.remove_acentos(x.nombre) + '</option>'
      });
      $("#materia").empty().append(html).selectpicker('val','').removeAttr("disabled").selectpicker('refresh'); //important!
      $("#curso").selectpicker('val','').attr("disabled", true).selectpicker('refresh');

      // Show couse selection form
      $("#course-gruop").collapse('show');

      // Alerts
      $("#loading").slideUp(500);

      // Cleaning
      FormMannager.clearForm();
      FormMannager.cursoActual = {};
    }).fail(function(e){
      console.log(e);
      $("#load-fail").slideDown(1000);
    });
  },
  loadCursos: function(){
    if (!$("#materia").val()) return;

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
    if (!$("#curso").val()) return;
    console.log("loadDocentes:"+$("#curso").val());

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

        // Working with deleted array is very difficult
        let len = 0;
        FormMannager.cursoActual.docentes.forEach(function(){len++});
        if(!len){
          // All docentes deleted
          FormMannager.clearForm();
          return;
        }

        FormMannager.onSubmitForms(docente_idx);
        $("#collapse" + docente_idx).empty().collapse("hide");
        $("#heading" + docente_idx).find(".docenteName").html('<del>' + docente + '</del>');
        $("#heading" + docente_idx).find(".docenteName").prop('disabled', true);


      }
    });
  },
  onSubmitForms: function(idx, data){
    // This is called by Pool.onSubmit when a pool is completed (and validated).
    // data is unused
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
  packData: function(idx){
    data = Pool.getPoolData(idx);
    const jsondata = {
      curso: FormMannager.cursoActual.docentes[idx],
      materia: Equivalency.getEquivalent(FormMannager.cursoActual.materia),
      cuatri: FormMannager.cursoActual.cuatri,
      timestamp: Date.now(),
      questions: {}
    };

    data.forEach(function(elem){
      jsondata.questions[elem.name] = elem.value;
    });

    return jsondata;
  },
  createDataString: function(idx){
    return utf8_to_b64(JSON.stringify(FormMannager.packData(idx)));
  },
  sendForm:function(){
    let dataStr = "";

    this.cursoActual.docentes.forEach(function(d,i){
      dataStr += printCSV(FormMannager.packData(i)) + "\n";
    });

    dataStr = dataStr.trim();

    if (!dataStr.length){
      throw "Empty form";
    }

    console.log("sending: ```" + dataStr + "```");

    // Send CSV data
    $.post(Config.submitURL,
    {
       pio: dataStr
    },
    function(data, status){
       if(status == "success" && data.trim() == dataStr.trim()){
         $("#okModal").modal("show");
         FormMannager.clearForm();
         console.log("ok!");
       }else{
         $("#errorModal").modal("show");
         console.log("Error on sending data!");
         console.log("data",data);
         console.log("status",status);
       }
    });
  },
  clearForm(){
    $("#materia").selectpicker('val','').selectpicker('refresh');
    $("#curso").selectpicker('val','').selectpicker('refresh');
    $("#cardSend").collapse("hide");
    MyAccordion.clear();
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
            <a href="#" class="form-text text-muted fulano" data-idx="INDEX">No tengo opinión formada / No cursé con este docente</a>\
          </div>\
          <div id="collapseOne" class="collapse show" aria-labelledby="headingOne">\
            <div class="card-body collapse show">\
          </div>\
        </div>'
}
