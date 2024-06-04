let uniqueKeys = {}; // Armazenar chaves únicas para garantir unicidade

// Função auxiliar para converter uma string em um índice
function hashStringToIndex(str, modulo) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash; // Converte para 32 bits
    }
    return Math.abs(hash) % modulo;
}

// Função auxiliar para converter uma string em um número
function hashStringToNumber(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash; // Converte para 32 bits
    }
    return hash;
}

function getColorIterator(key) {
    const colors = ["red", "green", "blue", "yellow", "purple"];
    let index = hashStringToIndex(key, colors.length); // Use o hash do key para definir o índice inicial
    let seed = hashStringToNumber(key);

    let next = function() {
        if (index >= colors.length) index = 0;
        return colors[index++];
    };

    let colorIterator = {
        next256: function() {
            seed = (seed * 9301 + 49297) % 233280;
            let value = Math.floor((seed / 233280.0) * 256);
            return Math.abs(value);
        },
        next16: function() {
            seed = (seed * 9301 + 49297) % 233280;
            let value = Math.floor((seed / 233280.0) * 16);
            return Math.abs(value);
        },
        next: function() {
            seed = (seed * 9301 + 49297) % 233280;
            let value = (seed / 233280.0) * 1000 + 1;
            return Math.abs(value);
        }
    };

    return Object.assign(next, colorIterator);
}

function widget(key, draw) {
    let nextColor = getColorIterator(key); // Cores mudam conforme o hash do key
    let icons = ["pacman","fantasma"]
    let type_icon = icons[nextColor.next16() % icons.length];
    console.log(nextColor.next16() % icons.length)
    // Renderiza diferentes ícones com base no valor de key
    if (type_icon === "pacman") {
        // Renderizar conjunto de componentes para o tipo 1
        let square = draw.rect(1000, 1000).move(0, 0).fill("#111");

        // Renderiza círculos e triângulo dentro do quadrado
        draw.circle().size(500).move(250, 250).fill(`rgb(${nextColor.next256()},${nextColor.next256()},${nextColor.next256()})`).opacity(1);
        draw.circle().size(70).move(500, 330).fill(nextColor()).opacity(1);
        let triangle = draw.polygon("760,400 500,500 760,650").fill("#111");
    } else if (type_icon === "fantasma") {
        // Renderizar conjunto de componentes para o tipo 2
        let square = draw.rect(1000, 1000).move(0, 0).fill("#111");
        
        cor_fantasma = `rgb(${nextColor.next256()},${nextColor.next256()},${nextColor.next256()})`
        draw.circle().size(500).move(250, 200).fill(cor_fantasma).opacity(1);
        draw.rect(500, 350).move(250, 450).fill(cor_fantasma);

        olho_fantasma = `rgb(${nextColor.next256()},${nextColor.next256()},${nextColor.next256()})`
        draw.circle().size(120).move(350, 400).fill("white").opacity(1);
        draw.circle().size(70).move(375, 425).fill(olho_fantasma).opacity(1);
        draw.circle().size(120).move(550, 400).fill("white").opacity(1);
        draw.circle().size(70).move(575, 425).fill(olho_fantasma).opacity(1);
    } else {
        // Se key não corresponder a nenhum valor conhecido
        console.log('Tipo de ícone desconhecido');
    }
}

function initializeSVG() {
    const svgContainers = document.getElementsByClassName("svg-container");
    const textoElements = document.getElementsByClassName("texto");

    for (let i = 0; i < svgContainers.length; i++) {
        const draw = SVG().addTo(svgContainers[i]).size('100%', '100%').viewbox(0, 0, 1000, 1000);
        widget("", draw);

        textoElements[i].addEventListener("input", () => {
            const texto = textoElements[i].value;
            svgContainers[i].innerHTML = ''; // Clear the SVG container before drawing a new widget
            const newDraw = SVG().addTo(svgContainers[i]).size('100%', '100%').viewbox(0, 0, 1000, 1000);
            widget(texto, newDraw);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Adiciona a biblioteca SVG.js
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.min.js";
    script.onload = function() {
        console.log('SVG.js library loaded.');
        initializeSVG();
    };
    document.head.appendChild(script);
});
