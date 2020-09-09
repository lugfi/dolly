Results = {
  html_docente: '<tr data-toggle="collapse" data-target=".multi-collapse" aria-expanded="false" aria-controls="docNRO" class="accordion-toggle curso">\
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
  loadTable(nombre,docente, row){
    // Calculate Score
    var comments = Results.comentarios.filter(x => (x.doc == docente));
    row.score = Calc.score(row);
    if (row.respuestas == 0){
      return "";
    }
    console.log(comments);
    comments.forEach((item, i) => {
      if(item.comentarios && item.editado == 0){
        item.comentarios.forEach((c, j) => {
          item.comentarios[j] = '(' + item.cuat + ')' + ' - ' + c;
        });
        item.editado = 1;
      }
    });

    const comms = comments && comments[0].comentarios;
    // Populate table
    console.log(comms);


      // Use apropiate users glyphs as row.respuestas grows
      const users_glyph = (row.respuestas<3)?"fas fa-user":
                          (
                            (row.respuestas<10)?"fas fa-user-friends":"fas fa-users"
                          );

      const txt_resp = ""+row.respuestas+" <i class='"+users_glyph+"'></i>" + (comms.length>0?"<span class='ml-3'>"+comms.length+" <i class='fas fa-comment-dots'></i></span>":"");
      $('[data-toggle="tooltip"]').tooltip();
      return Table.addRow(nombre,[
        {text: Calc.roundScore(row.score), class:""},
        {text: txt_resp, class: ""},
        {text: docente, class:""},
        {text: Calc.detalle(row), class:""}
      ],comms);



  },
  clearTable(){
    $("#tbody").empty();
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
<<<<<<< HEAD

      });
      var materia = Equivalency.getEquivalent($(document).getUrlParam("mat"));
      const file = materia + ".json";
=======
      });
      var materia = Equivalency.getEquivalent($(document).getUrlParam("mat"));
      const file = materia + ".json";
      console.log(file)
>>>>>>> 3c7e930d83e100ec1c8573e34de6bb11d67bc085
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
          Results.data.opciones.forEach(function(x,i){
            let row_html = "";
            let raw_html = "";
            row_html += Table.row_html.replace("TEXT",Calc.roundScore(Calc.score(x.promedio)));
            row_html += Results.row_docente.replace("TEXT", x.nombre || "");
            //row_html += Table.row_html.replace("TEXT",Calc.detalle(x.promedio));
            raw_html = Results.html_docente.replace(/NRO/g, id);
            html_final += raw_html.replace("DATA_ROW",row_html);
            var docentes = x.docentes;
            let html_doc = ""
            $.each(docentes, function( k, v ) {
                html_doc += Table.loadTable(x.nombre,k,v);

            });
            html_final += html_doc;
            // html2 += html_doc;
            id++;
          });

          Table.init();
          $("#tbody").append(html_final);
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
