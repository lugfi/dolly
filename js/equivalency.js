Equivalency = {
  init: function(cb){
    getJSON(Config.dataPath + Config.equivalencyData, function(data,st){
      Equivalency.data = data;
      console.log("Equivalencias cargadas!");
      cb("success");
    }).fail(function(){
      cb("failure");
    });
  },
  getEquivalent: function(mat){
    if(! Equivalency.data) throw "No se inicializaron las equivalencias.";
    const equivalencies = Equivalency.data.find(eq => eq.find(m=>m==mat));
    const ret =  (equivalencies && equivalencies[0]) || mat;
    //(mat==ret) || console.log("Equivalencia: "+mat+"-->"+ret);

    return ret;
  }
}
