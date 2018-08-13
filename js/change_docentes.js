ChangeDocentes = {
  listDocentes: function(){
    const gente = {};
    FormMannager.data.materias.forEach(x => x.cursos.forEach(x=> x.docentes.split("-").forEach(x => gente[x]=true)));

    return Object.keys(gente);
  },
  loadDocentes: function(){
    ChangeDocentes.docentes = ChangeDocentes.data.docentes;
    let html = "";
    ChangeDocentes.docentes.forEach(function(x,i){
      html += '<option class="option" value="' + i + '">' + x + '</option>'
    });
    $("#newDocente").append(html).selectpicker('refresh');
  },
  change: function(old_docente, callback){
    ChangeDocentes.lastCallback = callback;
    ChangeDocentes.loadDocentes();
    $("#changeDocenteModal").find(".docentePlace").html(old_docente);
    $("#changeDocenteModal").modal("show");
  },
  init: function(){
    // Run at page ready
    $('#newDocente').on('changed.bs.select', function (e) {
      $("#changeDocente").prop('disabled',false);
    });

    $("#changeDocenteModal").on('hidden.bs.modal', function(e){
      ChangeDocentes.end();
    });

    $("#changeDocente").click(function(e){
      ChangeDocentes.lastCallback(ChangeDocentes.docentes[$("#newDocente").val()]);
      $("#changeDocenteModal").modal("hide");
    });

    $("#deleteDocente").click(function(e){
      console.log("Docente deleted");
      ChangeDocentes.lastCallback(null, 'delete');
      $("#changeDocenteModal").modal("hide");
    });

    getJSON(Config.dataPath + "comun.json", function(data,st){
      ChangeDocentes.data = data;
    }).fail(function(){
      ChangeDocentes.data = null;
      console.log(e);
      $("#load-fail").slideDown(1000);
    });

  },
  end: function(){
    $("#newDocente").empty().selectpicker('val','').selectpicker('refresh');
    $("#changeDocenteModal").find(".docentePlace").html("X");
    $("#changeDocente").prop('disabled',true);
  }
}
