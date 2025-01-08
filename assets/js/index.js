const inputMonto = document.querySelector("#input-monto");
const selectMonedas = document.querySelector("#select-monedas");
const btnBuscar = document.querySelector("#btn-buscar");
const outputMonto = document.querySelector("#output-monto");
const urlApi = "https://mindicador.cl/api";

const obtenerDatos = async(url) =>{
    const res = await fetch(url);
    const data = await res.json();
    return data;
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

const transformaDinero = async(monto, moneda) => {


    return `${monto} ${moneda}`;
};

const main = () =>{
    
    generaListaMoneda();

};

main();

btnBuscar.addEventListener("click", async()=>{
    outputMonto.innerHTML = await transformaDinero(inputMonto.value, selectMonedas.value);
});