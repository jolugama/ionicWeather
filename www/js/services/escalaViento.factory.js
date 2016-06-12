(function() {
  'use strict';

  angular
  .module('app')
  .factory('escalaVientoService', escalaVientoService);

  escalaVientoService.$inject = [];

  /* @ngInject */
  function escalaVientoService() {
    var vientoJson={
  "operation": true,
  "results": [
    {
      "grado": 0,
      "estado": "calma",
      "kmh": "0-2",
      "ms": "0-0.4",
      "desc": "Calma. El humo asciende verticalmente."
    },
    {
      "grado": 1,
      "estado": "Ventolina",
      "kmh": "2-6",
      "ms": "0.5-1.6",
      "desc": "La dirección del viento se observa por la dirección del humo, pero no por las banderas."
    },
    {
      "grado": 2,
      "estado": "Brisa muy débil",
      "kmh": "7-11",
      "ms": "1.7-3",
      "desc": "El viento se nota en la cara. Las hojas y las banderas empiezan a moverse."
    },
    {
      "grado": 3,
      "estado": "Brisa débil",
      "kmh": "12-19",
      "ms": "3.1-5.2",
      "desc": "Las hojas y ramas finas se mueven constantemente, el viento extiende las banderas."
    },
    {
      "grado": 4,
      "estado": "Brisa moderada",
      "kmh": "20-29",
      "ms": "5.3-8",
      "desc": "El polvo, el papel  y las ramitas se mueven por el viento."
    },
    {
      "grado": 5,
      "estado": "Brisa fresca",
      "kmh": "30-39",
      "ms": "8.1-10.8",
      "desc": "Los árboles de pequeño porte empiezan a moverse, en los lagos se observan crestas blancas en la superficie del agua."
    },
    {
      "grado": 6,
      "estado": "Brisa fuerte",
      "kmh": "40-50",
      "ms": "10.8-13.8",
      "desc": "Se mueven las ramas gruesas de los arboles. El viento silba en los cables. Es difícil usar paraguas."
    },
    {
      "grado": 7,
      "estado": "Viento fuerte",
      "kmh": "51-61",
      "ms": "13.9-17.2",
      "desc": "Todos los arboles están en movimiento, existe fuerte resistencia al caminar contra el viento."
    },
    {
      "grado": 8,
      "estado": "Temporal",
      "kmh": "62-74",
      "ms": "17.3-20.5",
      "desc": "Algunas ramas se rompen por el efecto del viento, es difícil andar contra del viento."
    },
    {
      "grado": 9,
      "estado": "Temporal fuerte",
      "kmh": "75-87",
      "ms": "20.6-24.1",
      "desc": "Pequeños daños en casas y chimeneas,  las tejas se levantan por el viento."
    },
    {
      "grado": 10,
      "estado": "Temporal duro",
      "kmh": "88-101",
      "ms": "24.2-28",
      "desc": "Árboles arrancados de raíz, daños graves en las casas."
    },
    {
      "grado": 11,
      "estado": "borrasca",
      "kmh": "102-117",
      "ms": "28.1-32.5",
      "desc": "Daños grandes (poco frecuentes en interior)."
    },
    {
      "grado": 12,
      "estado": "huracán",
      "kmh": "118",
      "ms": "32.6-10000",
      "desc": "se utiliza la escala creada por Saffir/Simpson de intensidad de huracanes. 5 categorías"
    }
  ]
}

    var service = {
      getDescripcion: getDescripcion
    };

    return service;


    function getDescripcion(metros){
  
      var resultado=['',''];
      for (var i =0; i<vientoJson.results.length ; i++) {
        var arrayMetros=vientoJson.results[i].ms.split('-');
        if(metros>parseFloat(arrayMetros[0]) && metros<=parseFloat(arrayMetros[1])){
          resultado=[vientoJson.results[i].estado,vientoJson.results[i].desc];
          return resultado;
        }
      };
    }

  }
})();
