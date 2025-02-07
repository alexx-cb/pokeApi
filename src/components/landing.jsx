import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import '../css/landing.css';
import '../css/footer.css';

export function landing() {
    const [usuario, setUsuario] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (actual) => {
            setUsuario(actual);
        });

        return () => unsubscribe();
    }, [auth]);

    return (
        <>
        <hr />
        <div className="landing-container">
            <div className="info-section">
                <h1>Bienvenido a PokéAPI Explorer</h1>
                <p>Descubre el mundo Pokémon con nuestra completa base de datos alimentada por la PokéAPI.</p>
                <ul>
                    <li>Accede a información sobre todas las especies de Pokémon</li>
                    <li>Explora tipos, habilidades y estadísticas de Pokémon</li>
                    <li>Interfaz amigable para una fácil navegación</li>
                </ul>
            </div>
            
            <div className="action-section">
                <div className="action-card">
                    <h2>Tarjetas Pokémon</h2>
                    <p>Explora nuestra colección de tarjetas Pokémon.</p>
                    <Link to="/Cartas" className="action-button">Ver Pokemons</Link>
                </div>
                
                <div className="action-card">
                    <h2>Juego Pokémon</h2>
                    <p>Pon a prueba tu conocimiento Pokémon con nuestro juego interactivo.</p>
                    {usuario ? (
                        <Link to="/Juego" className="action-button">Jugar</Link>
                    ) : (
                        <Link to="/Login" className="action-button">Iniciar Sesión para Jugar</Link>
                    )}
                </div>
            </div>

            
        </div>
        <footer className="footer">
        Trabajo realizado por Alejandro Cabrera <a href="https://github.com/alexx-cb" target="_blank" rel="noopener noreferrer">GitHub</a> © PokeApi
        </footer>
        </>
    );
}
