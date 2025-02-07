import { useEffect, useState } from "react";
import { collection, updateDoc, getDocs, query, where, doc } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { db } from "../firebase";
import '../css/juego.css';

export function Juego(){

    const [idPokeAleatorio, setidPokeAleatorio] = useState();
    const [pokeAleatorio, setPokeAleatorio] = useState([]);
    const valoresPosibles = ["steel", "water", "bug", "drake", "electric", "ghost", "fire", "fairy", "ice", 
        "fighting", "normal", "grass", "psychic", "ground", "rock", "dark", "poison", "flying"];

    const [valoresJuego, setValoresJuego] = useState([]);
    const [emailUsuario, setEmailUsuario] = useState();
    const [vidas, setVidas] = useState(3);
    const [puntosUsuario, setPuntosUsuario] = useState();

    const [usuariosRanking, setUsuariosRanking] = useState([]);
    
    useEffect(()=>{
        const auth= getAuth();
        onAuthStateChanged(auth, (user)=>{
            setEmailUsuario(user.email);
        })
    }, [emailUsuario])

    useEffect(() => {
        if (emailUsuario) {
            idAleatorio();
            obtenerUsuarios();
            cargarPuntosIniciales(); 
        }
    }, [emailUsuario]);


    useEffect(() => {
        if (idPokeAleatorio !== null) {
            peticion();
        }
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


    function idAleatorio(){
        setidPokeAleatorio(Math.floor(Math.random() * 1304) + 1);
    }

    function peticion(){
        if (idPokeAleatorio !== null) {
            fetch(`https://pokeapi.co/api/v2/pokemon/${idPokeAleatorio}`)
                .then(respuesta => respuesta.json())
                .then(datos => {
                    setPokeAleatorio(datos);
                })
                .catch((error) => {
                    console.log("Error al hacer el fetch para el aleatorio:" + error);
                });
        }
    }

    
    function intento(valor) {
        const tipoPokemon = pokeAleatorio.types.map(tipo => tipo.type.name);
        if (tipoPokemon.includes(valor)) {
            idAleatorio();
            peticion();
            setVidas(3);
            actualizarPuntos(emailUsuario);
            obtenerUsuarios();
        } else {
            setVidas(prevVidas => prevVidas - 1);
            if(vidas<1){
                idAleatorio();
                peticion();
                setVidas(3);
            }
        }

    }

    async function actualizarPuntos(email) {
        try {
            const consulta = query(collection(db, "PokeApi"), where('Usuario', '==', email));
            const comprobacion = await getDocs(consulta);
            
            if(!comprobacion.empty){
                const doc = comprobacion.docs[0];
                const datosActuales = doc.data();
                const puntosActuales = datosActuales.Puntos;
                const nuevosPuntos = puntosActuales + 1;
    
                await updateDoc(doc.ref, {
                    Puntos: nuevosPuntos
                });
                setPuntosUsuario(nuevosPuntos); // Actualiza el estado inmediatamente
                console.log(`Puntos actualizados correctamente. Nuevo valor: ${nuevosPuntos}`);
                return nuevosPuntos;
            } else {
                console.log("No se encontró el documento para el email proporcionado");
                return false;
            }
        } catch (error) {
            console.error("Error al comprobar si existe: ", error);
            return false;
        }
    }
    

    async function obtenerUsuarios(){
        try{
            const consulta = await getDocs(collection(db, "PokeApi"));
            const usuarios = consulta.docs.map(campos => campos.data());
            usuarios.sort((a, b) => b.Puntos - a.Puntos);
            setUsuariosRanking(usuarios);
        }catch(error){
            console.error("Error al obtener los usuarios: ", error);
        }
    }

    async function cargarPuntosIniciales(){
        try {
            const consulta = query(collection(db, "PokeApi"), where('Usuario', '==', emailUsuario));
            const comprobacion = await getDocs(consulta);
            
            if(!comprobacion.empty){
                const doc = comprobacion.docs[0];
                const datosActuales = doc.data();
                setPuntosUsuario(datosActuales.Puntos);
            }
        } catch (error) {
            console.error("Error al cargar los puntos iniciales: ", error);
        }
    }

    if (!pokeAleatorio || !pokeAleatorio.types) {
        return <div>Loading...</div>;
    }
    

    return(
        <div className="game-wrapper">
    <h1 className="game-title">Adivina el tipo del pokemon</h1>
    <div className="game-container">
        <div className="ranking-section">
            <h2 className="ranking-title">Usuarios y Puntuaciones</h2>
            {usuariosRanking.map((usuario, index) => (
                <div key={index} className="ranking-item">
                    <span>{usuario.Nombre}</span>
                    <span>{usuario.Puntos} puntos</span>
                </div>
            ))}
        </div>

        <div className="game-section">
            <img src={pokeAleatorio.sprites.front_default} alt={pokeAleatorio.name} className="pokemon-image" /> 
            <h2 className="pokemon-name">{pokeAleatorio.name}</h2>
            <div className="game-stats">
                <h3>Vidas: {vidas}</h3>
                <h4>Tus Puntos: {puntosUsuario}</h4>
            </div>

            <div className="types-container">
                {valoresJuego.map((valor, index) => (
                    <button 
                        key={index} 
                        onClick={() => intento(valor)} 
                        className={`type-button ${valor}`}
                    >
                        {valor}
                    </button>
                ))}
            </div>
        </div>
    </div>
</div>


    );

}