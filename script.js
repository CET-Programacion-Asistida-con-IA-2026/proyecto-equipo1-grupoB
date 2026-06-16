let comedores = [];
let donadores = [];

function registrarComedor(nombre, ubicacion, responsable) {
    const comedor = {
        nombre,
        ubicacion,
        responsable
    };

    comedores.push(comedor);
    console.log("Comedor registrado:", comedor);
}

function registrarDonador(nombre, email, telefono) {
    const donador = {
        nombre,
        email,
        telefono
    };

    donadores.push(donador);
    console.log("Donador registrado:", donador);
}

function mostrarComedores() {
    console.log("=== COMEDORES ===");
    comedores.forEach(comedor => {
        console.log(`${comedor.nombre} - ${comedor.ubicacion} - ${comedor.responsable}`);
    });
}

function mostrarDonadores() {
    console.log("=== DONADORES ===");
    donadores.forEach(donador => {
        console.log(`${donador.nombre} - ${donador.email} - ${donador.telefono}`);
    });
}
