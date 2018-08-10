Results = {
  pooldata: {},
  loadMateria: function(val){
    //console.log(val);
  },
  loadData: function(){
    // Read and parse CSV data
    $.ajaxSetup({ cache: false });
    $.get(Config.resultsURL, function(data){
      Results.pooldata = data.split("\n").filter(x => x.length).map(x => JSON.parse(b64_to_utf8(x)));
      $.getJSON(Config.dataPath + "comun.json", function(commondata){
        // I need to filter only the materias in commondata listed in pooldata
        c=commondata;
        p=Results.pooldatapooldata;
        usedMaterias = new Set(Results.pooldata.map(x=>x.materia));
        const availableMaterias = commondata.materias.filter(m => usedMaterias.has(m.codigo));

        let html = "";
        availableMaterias.forEach(function(elem,i){
          html += '<option value="' + elem.codigo + '">' + elem.codigo + "-" + elem.nombre + '</option>'
        });
        $("#materia").append(html).prop("disabled", false).selectpicker('refresh');
        $("#course-gruop").collapse("show");
        $("#loading").collapse("hide");

      }).fail(function(e){
        $("#modal-no-connection").modal("show");
      });
    }).fail(function(e){
      $("#modal-no-connection").modal("show");
    });
  },
  onSelectMateria: function(){
    // If i want to use materias aliases, put the code here
    const data = Results.pooldata.filter(x => (x.materia==$("#materia").val()));

    // Groups responses by docente's name
    d=data;
    const docente = {};
    data.forEach(function(elem){
      if(docente[elem.curso]===undefined) docente[elem.curso] = [];
        docente[elem.curso].push(elem);
    });

    doc = docente;
    // Calc stats
    Object.keys(docente).forEach(function(name){
      Results.addStats(docente[name]);
    });
  },
  addStats: function(data){
    const features = this._compactResponses(data);
    const stats = Object.keys(features).filter(f => f!=="comments").map(k => Stats.stats(features[k]));
    const globalstats = Stats.stats(Object.keys(stats).map(x=>stats[x].mean))
    const name = data[0].curso;
    //console.log(name, globalstats, stats, features.comments);
    Cards.addCard(name, globalstats, stats, features.comments);
  },
  _compactResponses: function(data){
    const rows = {};
    data.forEach(function(q){
      //console.log(q);
      const keys = Object.keys(q.questions);
      keys.forEach(function(k){
        if(rows[k]===undefined) rows[k]=[];
        // Convert to numeric if valid
        rows[k].push(isNaN(Number(q.questions[k]))?q.questions[k]:Number(q.questions[k]));
      });
    });
    return rows;
  },
  init: function(){
    Results.loadData();
  }
};



Cards = {
  card_idx: 0,
  addCard: function(name, globalstats, stats, comments){
    const html = this.cardhtml.replace(/INDEX/g,this.card_idx).replace(/One/g,this.card_idx).replace(/TITLE/g,name).replace(/GLOBALMEAN/g, globalstats.mean.toFixed(2)).replace(/GLOBARVAR/g, globalstats.variance.toFixed(2));

    $("#accordion").append(html);
    Object.keys(stats).forEach(function(k){
      const quest = Questions.questions.find(q=>q.id==Number(k));
      const questTxt = quest.short? quest.short: quest.question;

      $("#accordion").find(".questions").append('<li>'+questTxt+': '+stats[k].mean.toFixed(2)+'&plusmn; '+stats[k].variance.toFixed(2)+'</li>');
    });

    comments.forEach(c => c && $("#accordion").find(".comments").append('<li>'+c+'</li>'));

    this.card_idx++;
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
                Puntaje: GLOBALMEAN &plusmn; GLOBARVAR\
              </button>\
            </span>\
          </div>\
          <div id="collapseOne" class="collapse" aria-labelledby="headingOne">\
            <div class="card-body">\
            <h4>Estadísticas</h4>\
            <ul class="questions">\
            </ul>\
            <h4>Comentarios</h4>\
            <ul class="comments">\
            </ul>\
          </div>\
        </div>'
}
