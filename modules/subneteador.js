export default class Subneteador {
    #redes;
    #rangos;
    #ipInicial;
    constructor() {
        this.#rangos = [];
        this.#redes = [];
        this.#ipInicial = [];
    }

    // Metodos getters para obtener los atributos privados
    getRangos() {
        return this.#rangos;
    }

    getRedes() {
        return this.#redes;
    }

    getIpInicial() {
        return this.#ipInicial;
    }

    // Método privado para definir la clase de la red
    #definirClase() {
        const totalHosts = [...this.#redes].reduce((suma, numero) => suma + numero);
        if (this.#ipInicial.length == 0) {
            if (totalHosts <= 220) {
                this.#ipInicial = [192, 168, 0, 0];
            } else if (totalHosts > 220 && totalHosts < 65500) {
                this.#ipInicial = [172, 16, 0, 0];
            } else {
                this.#ipInicial = [10, 0, 0, 0];
            }
        }
    }

    // Metodo para calcular las redes con VLSM
    calcularRedes(redes, ipInicial = []) {
        this.#rangos = [];
        this.#redes = redes;
        const hostsOrdenados = [...this.#redes].sort((a, b) => b - a);
        this.#ipInicial = ipInicial;
        this.#definirClase();
        hostsOrdenados.forEach(red => {
            let nBits = (red + 1).toString(2).length;
            let mascara = 32 - nBits;
            let hosts = 2 ** nBits;

            let ipInicialEntero = (this.#ipInicial[0] << 24) | (this.#ipInicial[1] << 16) | (this.#ipInicial[2] << 8) | this.#ipInicial[3]
            let ipFinalEntero = ipInicialEntero + hosts - 1;
            let ipFinal = [
                (ipFinalEntero >> 24) & 0xFF,
                (ipFinalEntero >> 16) & 0xFF,
                (ipFinalEntero >> 8) & 0xFF,
                ipFinalEntero & 0xFF
            ];
            this.#rangos.push({
                red: this.#ipInicial,
                mascara: mascara,
                hosts_totales: hosts,
                hosts_disponibles: hosts - 2,
                broadcast: ipFinal
            });
            ipInicialEntero = ipFinalEntero + 1;
            this.#ipInicial = [
                (ipInicialEntero >> 24) & 0xFF,
                (ipInicialEntero >> 16) & 0xFF,
                (ipInicialEntero >> 8) & 0xFF,
                ipInicialEntero & 0xFF
            ];
        });
        return this.#rangos;
    }

    // Metodo para calcular los octetos de una mascara de red
    calcularMascara(nBits) {
        let mascara = (1 << nBits) - 1;
        mascara <<= (32 - nBits);
        let octetos = [
            (mascara >> 24) & 0xFF,
            (mascara >> 16) & 0xFF,
            (mascara >> 8) & 0xFF,
            mascara & 0xFF
        ];
        return octetos;
    }
}