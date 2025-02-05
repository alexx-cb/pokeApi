import { useEffect, useState } from "react";

export function Juego(){

    const [idPokeAleatorio, setidPokeAleatorio] = useState();
    const [pokeAleatorio, setPokeAleatorio] = useState([]);
    const valoresPosibles = ["steel", "water", "bug", "drake", "electric", "ghost", "fire", "fairy", "ice", 
        "fighting", "normal", "plant", "psychic", "ground", "rock", "dark", "poison", "flying"];

    const [valoresJuego, setValoresJuego] = useState([]);

    var vidas=3;

    function peticion(){
        if (idPokeAleatorio !== null) {
            fetch(`https://pokeapi.co/api/v2/pokemon/${idPokeAleatorio}`)
                .then(respuesta => respuesta.json())
                .then(datos => {
                    setPokeAleatorio(datos);
                    vidas=3;
                })
                .catch((error) => {
                    console.log("Error al hacer el fetch para el aleatorio:" + error);
                });
        }
    }

    function idAleatorio(){
        setidPokeAleatorio(Math.floor(Math.random() * 1304) + 1);
    }

    function intento(valor) {
        const tipoPokemon = pokeAleatorio.types.map(tipo => tipo.type.name);
        if (tipoPokemon.includes(valor)) {
            idAleatorio();
            peticion();
        } else {
            vidas--;
            if(vidas<0){
                idAleatorio();
                peticion();
            }
        }

    }

    useEffect(()=>{
        idAleatorio();
    }, [])


    useEffect(() => {
        peticion();
    }, [idPokeAleatorio]);



    useEffect(() => {
        if(pokeAleatorio && pokeAleatorio.types){

            const tipoDelAleatorio = pokeAleatorio.types.map(tipo => tipo.type.name);
            const valoresDiferentes = valoresPosibles.filter(tipo => !tipoDelAleatorio.includes(tipo));

            const arrayValoresJuego = [];
            while(arrayValoresJuego.length <7){

                const indiceAleatorio = Math.floor(Math.random() * valoresDiferentes.length);
                arrayValoresJuego.push(valoresDiferentes[indiceAleatorio]);
                valoresDiferentes.splice(indiceAleatorio, 1);
            }

            tipoDelAleatorio.forEach(tipo =>{
                const posicionAleatoria = Math.floor(Math.random()* (arrayValoresJuego.length));
                arrayValoresJuego.splice(posicionAleatoria, 0, tipo);
            });

            setValoresJuego(arrayValoresJuego);
        }
    }, [pokeAleatorio]);

    
    

    if (!pokeAleatorio || !pokeAleatorio.types) {
        return <div>Loading...</div>;
    }
    

    return(
        <>
        <div>
            <img src={pokeAleatorio.sprites.front_default} alt={pokeAleatorio.name} /> 
            <h1>{pokeAleatorio.name}</h1>



            {valoresJuego.map((valor, index)=>(
            <div key={index} onClick={() => intento(valor)}>
                <p>{valor}</p>
            </div>
            
            ))}

        
        </div>

        </>

    );

}