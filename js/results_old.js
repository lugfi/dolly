Results = {};

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
  filterMateria(mat){
    const rows = Results.data.filter(row => (Equivalency.getEquivalent(row.mat) == mat));
    const comments = Results.comentarios.filter(x => (Equivalency.getEquivalent(x.mat) == mat));
    Table.loadTable(rows, comments);
  },
  loadTable(rows, comments){
    // Calculate Score
    rows.map(function(row){
      row.score = Calc.score(row);
      return row;
    });

    // Sort table by score
    const sorted_rows = rows.sort((a,b) => (b.score-a.score));

    // Populate table
    sorted_rows.forEach(function(row){
      const comm = comments.filter(x => x.doc==row.doc);

			// Ordeno comentarios segun cuatrimestre (descendente)
			comm.sort((a, b) => {
				const [cuatriA, anioA] = a.cuat.split("Q")
				const [cuatriB, anioB] = b.cuat.split("Q")
				
				if (anioA > anioB) {
					return -1
				} else if (anioA < anioB) {
					return 1
				} else {
					if (cuatriA > cuatriB) {
						return -1
					} else {
						return 1
					}
				}
			})

			const comms = [];
			comm.forEach((item) => {
				item.comentarios.forEach((c) => {
					comms.push(c);
				});
			});

      // Use apropiate users glyphs as row.respuestas grows
      const users_glyph = (row.respuestas<3)?"fas fa-user":
                          (
                            (row.respuestas<10)?"fas fa-user-friends":"fas fa-users"
                          );
                    
      const txt_resp = ""+row.respuestas+" <i class='"+users_glyph+"'></i>";
      const txt_com = (comms.length>0?"<span class='ml-3'>"+comms.length+" <i class='fas fa-comment-dots'></i></span>":"");
      Table.addRow([
        {text: Calc.roundScore(row.score), class:""},
        {text: txt_resp, class: ""},
        {text: txt_com, class:""},
        {text: row.doc, class:""},
        {text: Calc.detalle(row), class:""}
      ], comm);
    });


    $('[data-toggle="tooltip"]').tooltip();
  },
  clearTable(){
    $("#tbody").empty();
    Table.lastrow = 0;
  },
  addRow(row, items) {
    // row = [{text:"", class:""}...{}]
    // comments = []
		const comments = [];
		items.forEach((item) => {
			item.comentarios.forEach((c) => {
				const comment = {
					comment: c,
					cuatri: item.cuat
				}
				comments.push(comment);
			});
		});
    const id = Table.lastrow++;

		const CUATRIS_VIRTUALES = Config.json_list.filter(e => e.virtual).map(e => e.ref)

    // Create comments html
    let comments_items = "";
    comments && comments.forEach((comment) => {
			badges = Table.cuatri_badge_html.replace("CUATRI", comment.cuatri)
			if (CUATRIS_VIRTUALES.includes(comment.cuatri)) {
				badges += Table.virtual_badge_html
			}

      comments_items += Table.comment_html.replace("COMMENT", Utils.escapeHtml(comment.comment).trim()).replace("BADGES", badges);
    });

    // Create row html
    let row_html = "";
    row.forEach(function(elem){
      row_html += Table.row_html.replace("TEXT", elem.text || "").replace("CLASS", elem.class || "");
    });

    const raw_html = Table.html_item + (comments? Table.comment_div : "");
    const html = raw_html.replace(/ID/g, id).replace("DATA_ROW",row_html).replace("COMMENT_LIST", comments_items || "");

    $("#tbody").append(html);
  },
  html_item: '<tr data-toggle="collapse" data-target="#demoID" class="accordion-toggle">\
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
  comment_html: '<div class="col-12 zebra pt-2 pb-2"><h6>BADGES</h6><div style="white-space: pre-wrap;">COMMENT</div></div>',
	cuatri_badge_html: '<span class="badge badge-secondary mr-2">CUATRI</span>',
	virtual_badge_html: '<span class="badge badge-secondary mr-2">VIRTUAL</span>'
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

      // Load encuestas data JSON
      getJSON("analitics/valoraciones_docentes.json", function(data,st){
        // Prepare keys
        Results.materias = Utils.get_indexes('mat',data);
        Results.docentes = Utils.get_indexes('doc',data);
        Results.data = data;
        console.log("data loaded");
        // Load comments
        getJSON("analitics/comentarios_docentes.json", function(data,st){
          // Decode
          d=data;
          Results.comentarios = data.map(function(x){
            x.comentarios = x.comentarios.filter(x=>x).map(b64_to_utf8);
            return x;
          });
          console.log("comments loaded");

          Table.init();
          // Load equivalent code instead real code - user transparent [sic]
          Table.filterMateria(Equivalency.getEquivalent($(document).getUrlParam("mat")));
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
