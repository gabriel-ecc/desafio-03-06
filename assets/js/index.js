const inputMonto = document.querySelector("#input-monto");
const selectMonedas = document.querySelector("#select-monedas");
const btnBuscar = document.querySelector("#btn-buscar");
const outputMonto = document.querySelector("#output-monto");
const urlApi = "https://mindicador.cl/api";
let grapharea = document.getElementById("area-grafico");
const fondoGrafico = document.querySelector("#fondo-grafico");
const areaResultados = document.querySelector("#resultados");
let myChart = "";
let serieMoneda;

const obtenerDatos = async(url) =>{
    try{
        const res = await fetch(url);
        const data = await res.json();
        return data;
    }catch(e){
        areaResultados.style.display = 'flex';
        outputMonto.innerHTML = e.message;
    }
    
};

const generaListaMoneda = async() =>{
    const datos = await obtenerDatos(urlApi);
    const tiposDeMonedas = Object.keys(datos);
    tiposDeMonedas.splice(tiposDeMonedas.indexOf('version'), 3);
    for (const tipoMoneda of tiposDeMonedas) {
        const opcion1 = document.createElement("option");
        opcion1.value = tipoMoneda;
        opcion1.text = tipoMoneda;
        selectMonedas.appendChild(opcion1)
    }
};

const retornaSerieMoneda = async(moneda) =>{
    const datos = await obtenerDatos(urlApi+"/"+moneda);
    return datos.serie;
};

const transformaDinero = async(monto, moneda) => {
    serieMoneda = await retornaSerieMoneda(moneda);
    serieMoneda.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    const fechaMaxima = serieMoneda[0].fecha;
    const valorMoneda = serieMoneda.filter(valor => valor.fecha == fechaMaxima);
    const salida = (monto / valorMoneda[0].valor).toFixed(2);
    if(moneda === "imacec" | moneda === "tpm" | moneda === "tasa_desempleo" | moneda === "ipc"){
        return `${moneda}`;
    }else{
        return `${salida} ${moneda}`;
    }
    
};

const main = () =>{
    generaListaMoneda();
};

 const renderGrafica = async(moneda) => {
    const data = await getAndCreateDataToChart(moneda);
    const config = {
    type: "line",
    data
    };
    if(myChart){
        myChart.destroy();
    }
    myChart = new Chart(grapharea, config); 
}


async function getAndCreateDataToChart(moneda) {
    serieMoneda = serieMoneda.slice(-10);
    serieMoneda.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    const labels = serieMoneda.map((serie) => {
        const fecha = new Date(serie.fecha);
        return fecha.toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' }); 
    });
    const data = serieMoneda.map((serie) => {
    const valor = serie.valor;
        return Number(valor);
    });
    const datasets = [
    {
    label: moneda.toUpperCase(),
    borderColor: "#7AB2D3",
    data,
    pointRadius: 10,
    fill: false
    }
    ];
    return { labels, datasets };
};
    

main();

btnBuscar.addEventListener("click", async()=>{
    btnBuscar.disabled = true;
    outputMonto.innerHTML = '<div class="loader"></div>'; 
    try{
        outputMonto.innerHTML = await transformaDinero(inputMonto.value, selectMonedas.value);
        fondoGrafico.classList.remove("no-display");
        areaResultados.style.display = 'flex';
        await renderGrafica(selectMonedas.value);
    }catch(error)
    {
        areaResultados.style.display = 'flex';
        outputMonto.innerHTML = error;
    }
    btnBuscar.disabled = false;
    btnBuscar.innerHTML = 'Buscar'; 
});