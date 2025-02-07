import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../css/detallePokemon.css';

export function detallePokemon() {
    const { idPokemon } = useParams();
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

    function imagenFondo(type) {
        return `../img/carta_${type}.png`;
    }

    return (
        <div className="detalle-container">
            <div className="pokemon-card-detalle">
                <div 
                    className="pokemon-card-background" 
                    style={{backgroundImage: `url(${imagenFondo(datosPokemon.types[0].type.name)})` }}
                ></div>
                <div className="pokemon-content">
                    <span className="pokemon-id">#{datosPokemon.id.toString().padStart(3, '0')}</span>
                    <h1 className="pokemon-name">{datosPokemon.name}</h1>
                    <div className="pokemon-image-container-detalle">
                        <img src={datosPokemon.sprites.front_default} alt={datosPokemon.name} className="pokemon-image-detalle" />
                    </div>
                    <div className="pokemon-info">
                        <div className="left-column">
                            <div className="pokemon-stats info-box">
                                <h3>Stats</h3>
                                {datosPokemon.stats.map(estadistica => (
                                    <p key={estadistica.stat.name} className="stat">
                                        <span className="stat-name">{estadistica.stat.name}:</span> 
                                        <span className="stat-value">{estadistica.base_stat}</span>
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className="right-column">
                            <div className="pokemon-types-and-measurements info-box">
                                <div className="pokemon-types">
                                    {datosPokemon.types.map(tipo => (
                                        <p key={tipo.type.name} className={`type ${tipo.type.name}`}> {tipo.type.name} </p>
                                    ))}
                                </div>
                                <div className="pokemon-measurements">
                                    <h3>Measurements</h3>
                                    <p>Height: {datosPokemon.height}</p>
                                    <p>Weight: {datosPokemon.weight}</p>
                                </div>
                            </div>
                            <div className="pokemon-abilities info-box">
                                <h3>Abilities</h3>
                                {datosPokemon.abilities.map(ability => (
                                    <p key={ability.ability.name} className="ability">
                                        {ability.ability.name}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}