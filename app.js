const centerLat=38.871857;
const centerLng=-77.056267;
const radius=1500;
let pizzaCount=0;
let barCount=0;

fetchData();

async function fetchData(){
 let pizza=await queryOverpass(`["amenity"="restaurant"]["cuisine"~"pizza"]`);
 let bars=await queryOverpass(`["amenity"="bar"]["lgbtq"~"yes|primary"]`);
 pizzaCount=pizza.length;
 barCount=bars.length;
 renderCharts();
 calcDefcon();
}

async function queryOverpass(filter){
 let q=`[out:json];node${filter}(around:${radius},${centerLat},${centerLng});out;`;
 let r=await fetch("https://overpass-api.de/api/interpreter",{method:"POST",body:q});
 let d=await r.json();
 return d.elements||[];
}

function calcDefcon(){
 let hour=new Date().getHours();
 let night=(hour>=20||hour<=3)?1.5:1;
 let score=(pizzaCount*night)/(barCount||1);
 let level=5;
 if(score>6)level=1;
 else if(score>4)level=2;
 else if(score>2)level=3;
 else if(score>1)level=4;
 document.getElementById("defcon").textContent="DEFCON "+level;
}

function renderCharts(){
 new Chart(document.getElementById("pizzaChart"),{
  type:"bar",
  data:{labels:["Pizza Places"],datasets:[{data:[pizzaCount]}]},
  options:{plugins:{legend:{display:false}}}
 });

 new Chart(document.getElementById("barChart"),{
  type:"bar",
  data:{labels:["Gay Bars"],datasets:[{data:[barCount]}]},
  options:{plugins:{legend:{display:false}}}
 });
}
