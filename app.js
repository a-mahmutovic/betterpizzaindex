const centerLat=38.871857;
const centerLng=-77.056267;
const radius=1500;
let pizzaCount=0;
let barCount=0;

boot();

async function boot(){
 await sleep(800);
 await fetchData();
 renderCharts();
 calcDefcon();
}

async function fetchData(){
 let pizza=await query(`["amenity"="restaurant"]["cuisine"~"pizza"]`);
 let bars=await query(`["amenity"="bar"]["lgbtq"~"yes|primary"]`);
 pizzaCount=pizza.length;
 barCount=bars.length;
}

async function query(filter){
 let q=`[out:json];node${filter}(around:${radius},${centerLat},${centerLng});out;`;
 let r=await fetch("https://overpass-api.de/api/interpreter",{method:"POST",body:q});
 let d=await r.json();
 return d.elements||[];
}

function calcDefcon(){
 let h=new Date().getHours();
 let night=(h>=20||h<=3)?1.7:1;
 let ratio=(pizzaCount*night)/(barCount||1);
 let lvl=5;
 if(ratio>6)lvl=1;
 else if(ratio>4)lvl=2;
 else if(ratio>2)lvl=3;
 else if(ratio>1)lvl=4;
 let el=document.getElementById("defcon");
 el.textContent="DEFCON "+lvl;
 el.setAttribute("data-text","DEFCON "+lvl);
}

function renderCharts(){
 new Chart(pizzaChart,{
  type:"line",
  data:{labels:["NOW"],datasets:[{data:[pizzaCount],borderWidth:2}]},
  options:{scales:{x:{display:false},y:{display:false}},plugins:{legend:{display:false}},animation:{duration:1500}}
 });
 new Chart(barChart,{
  type:"line",
  data:{labels:["NOW"],datasets:[{data:[barCount],borderWidth:2}]},
  options:{scales:{x:{display:false},y:{display:false}},plugins:{legend:{display:false}},animation:{duration:1500}}
 });
}

function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
