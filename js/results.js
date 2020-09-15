Prueba = {
  tarjeta: '<div class="card">\
    <div class="card-header">\
      <h5 class="mb-0">\
        <button class="btn btn-link" data-toggle="collapse" data-target="#collapseSET" aria-expanded="false" >\
        <div class="puntaje-detalle" style="background-color: FONDO; color: black;"" data-toggle="tooltip" data-placement="bottom" title="Puntaje promedio">PUNTAJE</div>\
          <span class="cambiante"> TEXT </span>\
        </button>\
      </h5>\
    </div>\
    <div id="collapseSET" class="collapse multi-collapse show" >\
      <div class="card-body">\
      <table class="table cambiante" style="border-collapse:collapse; width: 0 auto;">\
      <thead>\
        <tr>\
          <th class="">Score</th>\
          <th class="">#Resp</th>\
          <th class="">Docente</th>\
          <th class="table-header-icons">\
            <span><i class="fas fa-calendar-check puntaje fa-fw cambiante" data-toggle="tooltip" data-placement="bottom" title="Asistencia a clase"></i></span>\
            <span><i class="far fa-clock puntaje fa-fw cambiante" data-toggle="tooltip" data-placement="bottom" title="Cumple los horarios"></i></span>\
            <span><i class="fas fa-sitemap puntaje fa-fw cambiante" data-toggle="tooltip" data-placement="bottom" title="Sus clases están bien organizadas"></i></span>\
            <span><i class="fas fa-glasses puntaje fa-fw cambiante" data-toggle="tooltip" data-placement="bottom" title="Explica con claridad"></i></span>\
            <span><i class="fas fa-heart puntaje fa-fw cambiante" data-toggle="tooltip" data-placement="bottom" title="Mantiene un trato adecuado"></i></span>\
            <span><i class="fas fa-hands-helping puntaje fa-fw cambiante" data-toggle="tooltip" data-placement="bottom" title="Acepta la crítica fundamentada"></i></span>\
            <span><i class="far fa-comments puntaje fa-fw cambiante" data-toggle="tooltip" data-placement="bottom" title="Fomenta la participación"></i></span>\
            <span><i class="far fa-envelope-open puntaje fa-fw cambiante" data-toggle="tooltip" data-placement="bottom" title="Responde por mail o Campus"></i></span>\
            <span><i class="fas fa-star puntaje fa-fw cambiante" data-toggle="tooltip" data-placement="bottom" title="Presenta un panorama amplio"></i></span>\
          </th>\
        </tr>\
      </thead>\
      <tbody id="tbody">\
        CUERPO\
      </tbody>\
  </table>\
      </div>\
    </div>\
  </div>'
};

Results = {
  html_docente: '<tr data-toggle="collapse" data-target=".multi-collapse" aria-expanded="true" aria-controls="docNRO" class="accordion-toggle curso">\
    DATA_ROW\
  </tr>',
  docente_div:'<tr>\
      <td colspan="6" class="hiddenRow">\
          <div id="docID" class="accordian-body collapse ml-3">\
          DOCENTES\
          </div>\
      </td>\
  </tr>',
  row_docente: '<td class="" colspan="3">TEXT</td>',
  docente_html: '<div class="col-12 ">DOCENTE</div>'
};

Calc = {
  detalle(data){
    const res = Object.keys(Calc.pesos).map(k => data[k]);
    colors = res.map(x => Calc.colors[Math.floor(Math.abs(x-0.001))]);

    const number_html = "<div class='puntaje-detalle' style='background-color: FONDO; color: black;' data-toggle='tooltip' data-placement='bottom' title='TOOLTIP'>NUMBER</div>";
    let html="";
    res.forEach(function(n,i){
      html += number_html.replace("FONDO", colors[i]).replace("NUMBER", Calc.roundScoreFix(n)).replace("TOOLTIP", Calc.tooltips[i]);
    });
    return html;
  },
  tooltips: [ // Link to questions.js
    "Asistencia a clase",
    "Cumple los horarios",
    "Sus clases están bien organizadas",
    "Explica con claridad",
    "Mantiene un trato adecuado",
    "Acepta la crítica fundamentada",
    "Fomenta la participación",
    "Responde por mail o Campus",
    "Presenta un panorama amplio"
  ],
  pickColor(score){
    var index = Math.floor(Math.abs(score-0.001));
    return Calc.colors[index];
  },
  score(data){
    let tot = 0;
    Object.keys(Calc.pesos).forEach(function(k){
      tot += data[k]*Calc.pesos[k];
    });
    return tot/Calc.sum(Calc.pesos);
  },
  colors:[
    '#ff0000', //:(
    '#ff8000',
    '#ffff33', //:|
    '#b2ff66',
    '#33ff33'  //:D
  ],
  pesos: {
    'asistencia': 1,
    'cumple_horarios': 1,
    'clase_organizada': .7,
    'claridad': .7,
    'buen_trato': 0.5,
    'acepta_critica': 0.5,
    'fomenta_participacion': 0.5,
    'responde_mails': 0.5,
    'panorama_amplio': 0.5
  },

  roundScore: function(x){
    return Math.round(10*x)/10;
  },
  roundScoreFix: function(x){
    let str = "" + (Math.round(10*x)/10);
    str += (str.length==1)?".0":"";
    return str;
  },
  sum: function(arr){
    return Object.values(arr).reduce((a,b)=>a+b)
  },
  mean: function(arr){
    return Object.values(arr).reduce((a,b)=>a+b)/Object.values(arr).length;
  },
}

Table = {
  lastrow:0,
  init: function(){
    Table.clearTable();
  },
  loadTable(materia,nombre,rows){
    // Calculate Score

    let blabla = "imprimiendo comments";
    console.log(blabla);
    // console.log(comments);
    rows.map(function(row){
      row.score = Calc.score(row);
      return row;
    });
    const sorted_rows = rows.sort((a,b) => (b.score-a.score));
    console.log(sorted_rows);

    let html_doc = "";
    rows.forEach(function(row){
      if (row.respuestas >0){
      var comments = Results.comentarios.filter(x => (x.doc == row.nombre && Equivalency.getEquivalent(x.mat) == materia));
      const comms = [];
      comments.forEach((item, i) => {
        if(item.comentarios && item.editado == 0){
          item.comentarios.forEach((c, j) => {
            item.comentarios[j] = '(' + item.cuat + ')' + ' - ' + c;
          });
          item.editado = 1;
        }
        item.comentarios.forEach((c, i) => {
          comms.push(c);
        });
      });
      // Use apropiate users glyphs as row.respuestas grows
      const users_glyph = (row.respuestas<3)?"fas fa-user":
                          (
                            (row.respuestas<10)?"fas fa-user-friends":"fas fa-users"
                          );

      const txt_resp = ""+row.respuestas+" <i class='"+users_glyph+"'></i>" + (comms.length>0?"<span class='ml-3'>"+comms.length+" <i class='fas fa-comment-dots'></i></span>":"");

      html_doc += Table.addRow(nombre,[
        {text: Calc.roundScore(row.score), class:""},
        {text: txt_resp, class: ""},
        {text: row.nombre, class:""},
        {text: Calc.detalle(row), class:""}
      ],comms);
    }
      });
      $('[data-toggle="tooltip"]').tooltip();
      return html_doc;
  },
  clearTable(){
    $("#accordion").empty();
    Table.lastrow = 0;
  },
  addRow(doc_id,row, comments){
    // row = [{text:"", class:""}...{}]
    // comments = []

    const id = Table.lastrow++;

    // Create comments html
    let comments_items = "";
    comments && comments.forEach(function(comment){
      comments_items += Table.comment_html.replace("COMMENT", Utils.escapeHtml(comment));
    });

    // Create row html
    let row_html = "";
    row.forEach(function(elem){
      row_html += Table.row_html.replace("TEXT", elem.text || "").replace("CLASS", elem.class || "");
    });

    const raw_html = Table.html_item + (comments? Table.comment_div : "");
    const html = raw_html.replace(/ID/g, id).replace("DATA_ROW",row_html).replace("COMMENT_LIST", comments_items || "").replace(/NRO/g, doc_id);
    //Descomentar esto si funciona mal:
    return html
    //$("#tbody").append(html);
  },
  html_item: '<tr id="docNRO" data-toggle="collapse" data-target="#demoID" class="accordion-toggle multi-collapse">\
    DATA_ROW\
  </tr>',
  comment_div:'<tr>\
      <td colspan="6" class="hiddenRow">\
          <div id="demoID" class="accordian-body collapse ml-3">\
          COMMENT_LIST\
          </div>\
      </td>\
  </tr>',
  row_html: '<td class="CLASS">TEXT</td>',
  comment_html: '<div class="col-12 zebra">COMMENT</div>'
}

// Hooks and init
$(function(){
  Equivalency.init(function(st){
    if (st!="success"){
      $("#errorModal").modal("show");
      return;
    }
    // Equivalency loaded

    // Populate Selectpicker
    getJSON("data/comun.json", function(data,st){
      console.log("cursos loaded!");
      let html="";
      data.materias.forEach(function(x,i){
        html += '<option class="option" value="' + x.codigo + '">' + x.codigo + " " + Utils.remove_acentos(x.nombre) + '</option>'
      });
      $("#materia").empty().append(html).selectpicker('val','').removeAttr("disabled").selectpicker('refresh'); //important!

      $("#materia").val($(document).getUrlParam("mat")).selectpicker('refresh');

      $("#materia").on('changed.bs.select',function(e){
        const url = $(location).attr('href').split("?")[0] + "?mat="+$("#materia").val();
        $(location).attr('href', url);

      });
      var materia = Equivalency.getEquivalent($(document).getUrlParam("mat"));
      const file = materia + ".json";
      // Load encuestas data JSON
      getJSON(Config.cursosPath + file, function(data,st){

        console.log("comments loaded");
        // Prepare keys
        Results.data = data;
        console.log("data loaded");
        // Load comments
        getJSON("analitics/comentarios_docentes.json", function(data,st){
          d=data;

          Results.comentarios = d.map(function(x){
             x.comentarios = x.comentarios.filter(x=>x).map(b64_to_utf8);
             return x;
          });
          // Decode
          let html_final ="";
          var id = 0;
          var cursos = Results.data.opciones;
          cursos.map(function(c){
            c.score = Calc.score(c.promedio);
            return c;
          });
          const sorted_cursos = cursos.sort((a,b) => (b.score-a.score));
          sorted_cursos.forEach(function(x,i){
            let raw_html = "";
            if (x.score){
            // row_html += Table.row_html.replace("TEXT",Calc.roundScore(Calc.score(x.promedio)));
            // row_html += Results.row_docente.replace("TEXT", x.nombre || "");
            // //row_html += Table.row_html.replace("TEXT",Calc.detalle(x.promedio));
            // raw_html = Results.html_docente.replace(/NRO/g, id);
            html_final += Prueba.tarjeta.replace("TEXT",x.nombre).replace(/SET/g,id).replace("PUNTAJE", Calc.roundScore(x.score)).replace("FONDO", Calc.pickColor(x.score));

            var docentes = x.docentes;
            let html_doc = "";
            // html_doc += Table.loadTable(materia,x.nombre,docentes);
            const docs = [];
            $.each(docentes, function( k, v ) {
                docs.push(v);
            });
            html_doc += Table.loadTable(materia,x.nombre,docs);
            html_final = html_final.replace("CUERPO", html_doc);
            // html2 += html_doc;
            id++;
          }
          });

          Table.init();
          $("#accordion").append(html_final);
          $('[data-toggle="tooltip"]').tooltip();



          // Load equivalent code instead real code - user transparent [sic]

          //Table.filterMateria(Equivalency.getEquivalent($(document).getUrlParam("mat")));
        }).fail(function(err){
          console.log("error loading comments");
          $("#load-fail").slideDown(1000);
        });
      }).fail(function(err){
        console.log("error loading data");
        $("#load-fail").slideDown(1000);
      });
    }).fail(function(e){
      console.log("Error loading cursos");
      $("#load-fail").slideDown(1000);
    });
  });
});
