import { useEffect, useState } from "react";

export function Juego(){

    const [idPokeAleatorio, setidPokeAleatorio] = useState();
    const [pokeAleatorio, setPokeAleatorio] = useState([]);

    useEffect(()=>{
        setidPokeAleatorio(Math.floor(Math.random() * 1304) + 1);
    }, [])
    

    useEffect(() => {
        if (idPokeAleatorio !== null) {
            fetch("https://pokeapi.co/api/v2/pokemon/" + idPokeAleatorio)
                .then(respuesta => respuesta.json())
                .then(datos => {
                    setPokeAleatorio(datos);
                })
                .catch((error) => {
                    console.log("Error al hacer el fetch para el aleatorio:" + error);
                });
        }
    }, [idPokeAleatorio]);

    return(
        <>
        
        <h1>{pokeAleatorio.name}</h1>
        </>

    );

}