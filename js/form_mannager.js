FormMannager = {
  onSelectCuatri: function(){
    console.log("cuatri selected");
  },
  loadCuatriData: function(file){
    // Loads JSON data and fills course select form
    $("#loading").show();
    $.getJSON("https://raw.githubusercontent.com/lugfi/organizador-fiuba/master/"+file, function(data,st){
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
  },
  loadDocentes(){
    const materia_idx = Number($("#materia").val());
    const curso_idx = Number($("#curso").val());
    const curso = this.data.materias[materia_idx].cursos[curso_idx];
    const docentes = curso.docentes.split("-");

    docentes.forEach(function(x,i){
      MyAccordion.addCard(x);
    });

    //$("#form-pool").collapse('show');
  },
  cambiarDocente: function(e){
    const docente_idx = Number($(this).data("idx"));
    console.log("Cambiar docente: "+docente_idx);
  },
  onSubmitForms: function(idx, data){
    // data
    console.log(idx,data);
    $("#collapse"+idx).collapse('hide');
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
  cardhtml: '<div class="card">\
          <div class="card-header d-flex justify-content-between" id="headingOne">\
            <span class="h5 mb-0 col">\
              <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true"  aria-controls="collapseOne">\
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
