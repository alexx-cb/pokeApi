import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function detallePokemon(s){
    const {idPokemon} = useParams();
    const [datosPokemon, setDatosPokemon] = useState(null);

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon/" + idPokemon)
            .then(respuesta => respuesta.json())
            .then(datos => {
                setDatosPokemon(datos);
            })
            .catch(error => {
                console.log("Error en el fetch: " + error);
            });
    }, [idPokemon]);
    
    if (!datosPokemon) {
        return <div>Loading...</div>;
    }

    return(
        <>
        <div>
            <h1>{datosPokemon.name}</h1>
            <img src={datosPokemon.sprites.front_default} alt={datosPokemon.name} />

            {datosPokemon.types.map(tipo=> (
                <p key={tipo.type.name}> {tipo.type.name} </p>
            ))}

            {datosPokemon.stats.map(estadisticas=>(
                <p key={estadisticas.stat.name}>{estadisticas.stat.name}: {estadisticas.base_stat}</p>
            ))}

            <p>Height: {datosPokemon.height}</p>
            <p>Weight: {datosPokemon.weight}</p>
            
        </div>
            
        </>
    );
}