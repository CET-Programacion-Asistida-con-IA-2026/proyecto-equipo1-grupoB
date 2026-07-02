/* ==========================================================================
   PLATAFORMA CONECTANDO COMEDORES - LOGICA DE INTERACTIVIDAD
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar las funciones principales
    initMap();
    initBuscador();
    initFormularios();
    initNavegacionSuave();
});

/* ==========================================================================
   1. SCRIPT DEL BUSCADOR DE COMEDORES + MAPA (Leaflet + OpenStreetMap)
   Al buscar, se filtra la lista (izquierda) y se sincroniza con los
   marcadores del mapa (derecha). Leaflet es gratuito, sin API key.
   ========================================================================== */

// Base de datos ficticia para simular la búsqueda (coordenadas aproximadas)
const comedoresFicticios = [
    { nombre: "Merendero Rayito de Sol", ciudad: "La Plata", categoria: "Merendero / Copa de leche", direccion: "Calle 50 #1234", lat: -34.9205, lng: -57.9536 },
    { nombre: "Comedor San Vicente", ciudad: "San Vicente", categoria: "Comedor diario", direccion: "Av. Rivadavia 450", lat: -35.0206, lng: -58.4198 },
    { nombre: "Viandas Solidarias del Sur", ciudad: "La Plata", categoria: "Entrega de viandas", direccion: "Diagonal 74 #890", lat: -34.9214, lng: -57.9544 },
    { nombre: "El Quincho Comunitario", ciudad: "Buenos Aires", categoria: "Comedor diario", direccion: "Brandsen 805, La Boca", lat: -34.6345, lng: -58.3631 },
    { nombre: "Copa de Leche Los Bajitos", ciudad: "San Vicente", categoria: "Merendero / Copa de leche", direccion: "Almeira 210", lat: -35.0180, lng: -58.4150 }
];

let map;
let markers = [];

function initMap() {
    const mapaDiv = document.getElementById('mapa-comedores');
    if (!mapaDiv || typeof L === 'undefined') return;

    map = L.map(mapaDiv).setView([-34.85, -58.15], 9); // centrado entre La Plata / San Vicente / CABA

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> colaboradores',
        maxZoom: 19,
    }).addTo(map);

    // Mostramos todos los comedores apenas carga el mapa
    pintarMarcadores(comedoresFicticios);
}

function initBuscador() {
    const contenedorBuscador = document.querySelector('.contenedor-buscador');
    if (!contenedorBuscador) return;

    const inputCiudad = contenedorBuscador.querySelector('input[type="text"]');
    const selectCategoria = contenedorBuscador.querySelector('select');
    const botonBuscar = contenedorBuscador.querySelector('button');
    const listaResultados = document.getElementById('lista-resultados');

    botonBuscar.addEventListener('click', () => {
        const ciudadBuscada = inputCiudad.value.trim().toLowerCase();
        const categoriaBuscada = selectCategoria.value;

        const resultados = comedoresFicticios.filter(comedor => {
            const coincideCiudad = ciudadBuscada === "" || comedor.ciudad.toLowerCase().includes(ciudadBuscada);
            const coincideCategoria = comedor.categoria === categoriaBuscada;
            return coincideCiudad && coincideCategoria;
        });

        pintarLista(resultados, listaResultados, inputCiudad.value, categoriaBuscada);
        pintarMarcadores(resultados);

        // Si hay resultados, el mapa se centra en el primero
        if (map && resultados.length > 0) {
            map.setView([resultados[0].lat, resultados[0].lng], 13);
        }
    });
}

function pintarLista(resultados, listaResultados, ciudadBuscada, categoriaBuscada) {
    listaResultados.innerHTML = "";

    if (resultados.length > 0) {
        const tituloResultados = document.createElement('h4');
        tituloResultados.textContent = `Resultados encontrados (${resultados.length}):`;
        listaResultados.appendChild(tituloResultados);

        resultados.forEach((comedor, index) => {
            const item = document.createElement('div');
            item.className = 'tarjeta-comedor';
            item.innerHTML = `
                <strong>${comedor.nombre}</strong><br>
                <small>📍 ${comedor.direccion} - ${comedor.ciudad}</small><br>
                <span class="etiqueta-categoria">${comedor.categoria}</span>
            `;
            // Al hacer click en la tarjeta, el mapa se centra ahí y abre el globo de info
            item.addEventListener('click', () => enfocarComedor(comedor, index));
            listaResultados.appendChild(item);
        });
    } else {
        const mensaje = document.createElement('p');
        mensaje.className = 'mensaje-vacio';
        mensaje.innerHTML = `
            🔍 No se encontraron espacios en "<strong>${ciudadBuscada || 'cualquier ciudad'}</strong>" para la categoría "<strong>${categoriaBuscada}</strong>".<br>
            <span style="font-size: 0.9rem;">Probá buscando 'La Plata' o 'San Vicente'.</span>
        `;
        listaResultados.appendChild(mensaje);
    }
}

function pintarMarcadores(lista) {
    if (!map) return; // el mapa todavía no cargó

    markers.forEach(m => map.removeLayer(m));
    markers = [];

    lista.forEach(comedor => {
        const marker = L.marker([comedor.lat, comedor.lng]).addTo(map);
        marker.bindPopup(`<strong>${comedor.nombre}</strong><br>${comedor.direccion} - ${comedor.ciudad}<br>${comedor.categoria}`);
        markers.push(marker);
    });
}

function enfocarComedor(comedor, index) {
    if (!map || !markers[index]) return;
    map.setView([comedor.lat, comedor.lng], 15);
    markers[index].openPopup();
}

/* ==========================================================================
   2. PROCESAMIENTO DE FORMULARIOS (CONTACTO / REGISTROS)
   ========================================================================== */
function initFormularios() {
    // Seleccionamos todos los formularios dentro de la sección de registros y el de contacto
    const formularios = document.querySelectorAll('#formularios-registro form, #contacto form');

    formularios.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que la página se recargue

            // Obtenemos el bloque contenedor para poder manipular la interfaz visual
            const bloqueFormulario = form.closest('.bloque-formulario');
            const tituloFormulario = bloqueFormulario.querySelector('h3').textContent;

            // Recopilar los datos para simular el envío (puedes verlos en la consola del navegador)
            const formData = new FormData(form);
            const datosFormulario = {};
            formData.forEach((value, key) => {
                datosFormulario[key] = value;
            });
            console.log(`Datos recibidos de [${tituloFormulario}]:`, datosFormulario);

            // Guardamos temporalmente el contenido original del formulario por si se quiere resetear
            const contenidoOriginal = bloqueFormulario.innerHTML;

            // Mostramos un mensaje de éxito estético usando los colores de la paleta
            bloqueFormulario.innerHTML = `
                <div class="mensaje-exito" style="
                    background-color: #fdf6ec; 
                    border: 2px solid #608c27; 
                    padding: 2.5rem; 
                    border-radius: 12px; 
                    text-align: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                ">
                    <span style="font-size: 3rem;">🎉</span>
                    <h3 style="color: #608c27; margin: 1rem 0 0.5rem 0;">¡Registro recibido con éxito!</h3>
                    <p style="color: #333436; margin-bottom: 1.5rem;">Gracias por sumarte a la Red Comedores. Nos pondremos en contacto con vos muy pronto.</p>
                    <button type="button" class="btn-volver" style="
                        background-color: #333436; 
                        color: #ffffff; 
                        padding: 0.6rem 1.5rem; 
                        border: none; 
                        border-radius: 12px; 
                        cursor: pointer;
                        font-weight: 600;
                    ">Volver a enviar</button>
                </div>
            `;

            // Listener para el botón de volver atrás y restaurar el formulario vacío
            bloqueFormulario.querySelector('.btn-volver').addEventListener('click', () => {
                bloqueFormulario.innerHTML = contenidoOriginal;
                // Volvemos a inicializar el formulario ya que reescribimos el HTML del nodo
                initFormularios();
            });
        });
    });
}

/* ==========================================================================
   3. NAVEGACIÓN SUAVE (FALLBACK EXTRA)
   ========================================================================== */
function initNavegacionSuave() {
    const enlacesNav = document.querySelectorAll('header nav a, #inicio div a, #indicio div a');

    enlacesNav.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            const targetId = enlace.getAttribute('href');
            
            // Verificamos si es un enlace interno de la página
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    e.preventDefault();
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}
