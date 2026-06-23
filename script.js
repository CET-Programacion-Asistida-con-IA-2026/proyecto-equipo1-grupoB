/* ==========================================================================
   PLATAFORMA CONECTANDO COMEDORES - LOGICA DE INTERACTIVIDAD
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar las funciones principales
    initBuscador();
    initFormularios();
    initNavegacionSuave();
});

/* ==========================================================================
   1. SCRIPT DEL BUSCADOR DE COMEDORES (SIMULADO)
   ========================================================================== */
function initBuscador() {
    // Seleccionamos los elementos dentro del contenedor-buscador
    const contenedorBuscador = document.querySelector('.contenedor-buscador');
    if (!contenedorBuscador) return;

    const inputCiudad = contenedorBuscador.querySelector('input[type="text"]');
    const selectCategoria = contenedorBuscador.querySelector('select');
    const botonBuscar = contenedorBuscador.querySelector('button');
    const mapaPlaceholder = contenedorBuscador.querySelector('.mapa-placeholder');

    // Base de datos ficticia para simular la búsqueda
    const comedoresFicticios = [
        { nombre: "Merendero Rayito de Sol", ciudad: "La Plata", categoria: "Merendero / Copa de leche", direccion: "Calle 50 #1234" },
        { nombre: "Comedor San Vicente", ciudad: "San Vicente", categoria: "Comedor diario", direccion: "Av. Rivadavia 450" },
        { nombre: "Viandas Solidarias del Sur", ciudad: "La Plata", categoria: "Entrega de viandas", direccion: "Diagonal 74 #890" },
        { nombre: "El Quincho Comunitario", ciudad: "Buenos Aires", categoria: "Comedor diario", direccion: "Brandsen 805, La Boca" },
        { nombre: "Copa de Leche Los Bajitos", ciudad: "San Vicente", categoria: "Merendero / Copa de leche", direccion: "Almeira 210" }
    ];

    botonBuscar.addEventListener('click', () => {
        const ciudadBuscada = inputCiudad.value.trim().toLowerCase();
        const categoriaBuscada = selectCategoria.value;

        // Limpiamos el placeholder del mapa para mostrar resultados
        mapaPlaceholder.innerHTML = "";
        mapaPlaceholder.style.flexDirection = "column";
        mapaPlaceholder.style.padding = "2rem";
        mapaPlaceholder.style.height = "auto";
        mapaPlaceholder.style.minHeight = "350px";

        // Filtrar array
        const resultados = comedoresFicticios.filter(comedor => {
            const coincideCiudad = ciudadBuscada === "" || comedor.ciudad.toLowerCase().includes(ciudadBuscada);
            const coincideCategoria = comedor.categoria === categoriaBuscada;
            return coincideCiudad && coincideCategoria;
        });

        // Renderizar resultados en el contenedor del mapa
        if (resultados.length > 0) {
            const tituloResultados = document.createElement('h4');
            tituloResultados.textContent = `Resultados encontrados (${resultados.length}):`;
            tituloResultados.style.marginBottom = "1rem";
            tituloResultados.style.color = "#333436";
            mapaPlaceholder.appendChild(tituloResultados);

            const lista = document.createElement('ul');
            lista.style.listStyle = "none";
            lista.style.width = "100%";
            lista.style.display = "flex";
            lista.style.flexDirection = "column";
            lista.style.gap = "1rem";

            resultados.forEach(comedor => {
                const item = document.createElement('li');
                item.style.background = "#ffffff";
                item.style.padding = "1rem";
                item.style.borderRadius = "8px";
                item.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";
                item.style.textAlign = "left";
                item.innerHTML = `
                    <strong style="color: #608c27;">${comedor.nombre}</strong><br>
                    <small>📍 ${comedor.direccion} - ${comedor.ciudad}</small><br>
                    <span style="font-size: 0.85rem; background: #fdf6ec; padding: 2px 6px; border-radius: 4px; color: #f29f63;">${comedor.categoria}</span>
                `;
                lista.appendChild(item);
            });
            mapaPlaceholder.appendChild(lista);
        } else {
            mapaPlaceholder.innerHTML = `
                <p style="text-align: center; color: #7f8c8d;">
                    🔍 No se encontraron espacios en "<strong>${inputCiudad.value || 'cualquier ciudad'}</strong>" para la categoría "<strong>${categoriaBuscada}</strong>".<br>
                    <span style="font-size: 0.9rem;">Probá buscando 'La Plata' o 'San Vicente'.</span>
                </p>
            `;
        }
    });
}

/* ==========================================================================
   2. PROCESAMIENTO DE FORMULARIOS (CONTACTO / REGISTROS)
   ========================================================================== */
function initFormularios() {
    // Seleccionamos todos los formularios dentro de la sección de registros
    const formularios = document.querySelectorAll('#formularios-registro form');

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
