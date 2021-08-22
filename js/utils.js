// Base 64 UFT-8 friendly.
// Taken from https://developer.mozilla.org/es/docs/Web/API/WindowBase64/Base64_codificando_y_decodificando
function utf8_to_b64( str ) {
  let res = "";
  try{
    res = window.btoa(unescape(encodeURIComponent( str )));
  }catch(err){
    console.log("Dolly encode error: ", str)
  }
  return res;
}

function b64_to_utf8( str ) {
  let res = "";
  try{
    res = decodeURIComponent(escape(window.atob( str )));
  }catch(err){
    console.log("Dolly decode error: ", str)
  }
  return res;
}

const sortComentariosPorCuatriDescendente = (a, b) => {
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
}

Stats = {
  stats: function(x){
    const mean = x.reduce((sum, value) => sum + value) /x.length;

    let variance = 0;
    x.forEach(function(x){
      variance += (x-mean)**2;
    });

    variance /= x.length;

    return {mean: mean, variance: variance};
  }
}

function printCSV(x){
  const d = Config.CSVDelim;
  let l = x.curso+d+x.materia+d+x.cuatri+d+x.timestamp;
  Object.keys(x.questions).forEach(i => (!isNaN(Number(i)) && (l+=d+x.questions[i])));
  l += d+utf8_to_b64(x.questions["comments"]);
  return l;
}

function getJSON(url, fn){
  return $.ajax({
    dataType: "json",
    url: url,
    mimeType: "application/json",
    cache: false,
    success: fn
  });
}


Utils = {
  remove_acentos: function(str){
    return str.replace(/ñ/g, "~n").replace(/Ñ/g,"~N").normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/~n/g,"ñ").replace(/~N/g, "Ñ");
  },
  escapeHtml: function(string){
    // Taken from https://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
    // Gracias Emiliano!
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };

    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  },
  get_indexes: function(index_name, data){
    let conj = {};
    data.forEach(function(x){
      conj[x[index_name]] = true;
    });
    return Object.keys(conj);
  }
}
