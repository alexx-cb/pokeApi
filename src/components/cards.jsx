import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/pokemonList.css';

export function crearCards() {
    const [pokemons, setPokemons] = useState([]);
    const [offset, setOffset] = useState(0);
    const limit = 20;

    function peticion(nuevoOffset) {
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${nuevoOffset}`)
            .then(response => response.json())
            .then(data => {
                const datosGeneralesPokemon = data.results.map(pokemon =>
                    fetch(pokemon.url)
                        .then(response => response.json())
                );

                Promise.all(datosGeneralesPokemon)
                    .then(datosPokemon => {
                        setPokemons(prevPokemons => [...prevPokemons, ...datosPokemon]);
                    })
                    .catch(error => console.error('Error al cargar los datos del pokemon:', error));
            })
            .catch(error => console.error('Error al hacer fetch de la API:', error));
    }

    useEffect(() => {
        peticion(offset);
    }, []);

    function masPokemons() {
        setOffset(prevOffset => {
            const nuevoOffset = prevOffset + limit;
            peticion(nuevoOffset);
            return nuevoOffset;
        });
    }
    

    function imagenFondo(type) {
        return `../img/carta_${type}.png`;
    }

    return (
        <div className='contenedor-principal'>
            <h1>Pokemons</h1>
            <div className="pokemon-list-container">
                {pokemons.map(pokemon => (
                    <Link to={`/Detalle/${pokemon.id}`} key={pokemon.name} className="pokemon-card">
                        <div 
                            className="pokemon-card-background" 
                            style={{backgroundImage: `url(${imagenFondo(pokemon.types[0].type.name)})` }}
                        ></div>
                        <div className="pokemon-content">
                            <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
                            <img 
                                src={pokemon.sprites.front_default} 
                                alt={pokemon.name} 
                                className="pokemon-image"
                            />
                            <h2 className="pokemon-name">{pokemon.name}</h2>
                            <div className="pokemon-types">
                                {pokemon.types.map(tipo => (
                                    <span 
                                        key={tipo.type.name} 
                                        className={`pokemon-type ${tipo.type.name}`}
                                    >
                                        {tipo.type.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <button onClick={masPokemons} className="more-button">Más pokemons</button>
        </div>
    );
}
