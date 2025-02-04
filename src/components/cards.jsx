import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function crearCards() {
    const [pokemons, setPokemons] = useState([]);
    var limit = 20;
    var offset = 0;

    
    function peticion() {
        // fetch de la api para pillar los pokemons
        fetch("https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset)
            .then(response => response.json())
            .then(data => {
                // con los datos que nos ha dado la api hacemos otro fetch con la url de cada pokemon con sus datos generales
                const datosGeneralesPokemon = data.results.map(pokemon =>
                    fetch(pokemon.url)
                        .then(response => response.json())
                );

                // Promesa de que nos dara los datos, nos buscara los datos aunq no esten cargados en ese momento
                Promise.all(datosGeneralesPokemon)
                    .then(datosPokemon => {
                        //guardamos si los pokemons antiguos y los nuevos en la misma variable
                        setPokemons(prevPokemons => [...prevPokemons, ...datosPokemon]);
                    })
                    .catch(error => console.error('Error al cargar los datos del pokemon:', error));
            })
            .catch(error => console.error('Error al hacer fecth de la API:', error));
    }

    useEffect(() => {
        peticion();
    }, []);

    function masPokemons(){
        offset += limit
        peticion();
    }

    return (
        <>

            <h1>Pokemons</h1>
            <div>
                {pokemons.map(pokemon => (
                    <div key={pokemon.name} class= "contenedorPokemon">
                        <Link to={'/Detalle/'+pokemon.id}>
                        
                        <img src={pokemon.sprites.front_default} alt={`${pokemon.name}`}/>
                        <h2>{pokemon.name}</h2>
                        {pokemon.types.map(tipo => (
                            <p key={tipo.type.name}> {tipo.type.name} </p>
                        ))}
                        </Link>
                    </div>
                ))}
                
            </div>
            <button onClick={masPokemons}>Mas pokemons</button>
        </>
    );
}