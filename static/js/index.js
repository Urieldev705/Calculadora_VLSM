import Subneteador from "../../modules/subneteador.js";
let subneteador = new Subneteador();
const isThereInitialIp = document.getElementById("ip-inicial-personalizada");
let ipInicial = () => {
    const oct1 = parseInt(document.getElementById("octeto1").value);
    const oct2 = parseInt(document.getElementById("octeto2").value);
    const oct3 = parseInt(document.getElementById("octeto3").value);
    const oct4 = parseInt(document.getElementById("octeto4").value);
    return [oct1, oct2, oct3, oct4];
}

document.getElementById("numero-de-redes").addEventListener("input", function() {
    let numeroDeRedes = parseInt(this.value);
    let cont_inputs = document.getElementById("cont-inputs-redes");
    cont_inputs.innerHTML = "";
    for (let i = 0; i < numeroDeRedes; i++) {
        let input = document.createElement("input");
        input.type = "number";
        input.id = `red-${i}`;
        input.min = 1;
        input.required = true;
        input.placeholder = "Número de hosts";
        cont_inputs.appendChild(input);
    }
});

document.getElementById("form-subneteo").addEventListener("submit", function(e) {
    e.preventDefault();
    let numeroDeRedes = parseInt(document.getElementById("numero-de-redes").value);
    let hosts = [];
    for (let i = 0; i < numeroDeRedes; i++) {
        hosts.push(parseInt(document.getElementById(`red-${i}`).value));
    }
    if (isThereInitialIp.checked) {
        mostrarInformacion(subneteador.calcularRedes(hosts, ipInicial()));
    } else {
        mostrarInformacion(subneteador.calcularRedes(hosts));
    }
});

function mostrarInformacion(resultados) {
    let tabla_subneteo = document.getElementById("tabla-subneteo");
    tabla_subneteo.innerHTML = ``;
    resultados.forEach((rango, index) => {
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${rango.red.join(".")}</td>
            <td>${rango.broadcast.join(".")}</td>
            <td>${subneteador.calcularMascara(rango.mascara).join(".")}</td>
            <td>${rango.mascara}</td>
            <td>${rango.hosts_totales}</td>
            <td>${rango.hosts_disponibles}</td>
        `;
        tabla_subneteo.appendChild(fila);
    });
}