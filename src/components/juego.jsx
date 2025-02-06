import { useEffect, useState } from "react";
import { collection, updateDoc, getDocs, query, where, doc } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { db } from "../firebase";

export function Juego(){

    const [idPokeAleatorio, setidPokeAleatorio] = useState();
    const [pokeAleatorio, setPokeAleatorio] = useState([]);
    const valoresPosibles = ["steel", "water", "bug", "drake", "electric", "ghost", "fire", "fairy", "ice", 
        "fighting", "normal", "plant", "psychic", "ground", "rock", "dark", "poison", "flying"];

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

                    const puntosActuales = datosActuales.Puntos

                    const nuevosPuntos = puntosActuales + 1;
        
                    await updateDoc(doc.ref, {
                        Puntos: nuevosPuntos
                        
                    });
                    setPuntosUsuario(nuevosPuntos);
                    console.log(puntosUsuario);
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
            setUsuariosRanking(usuarios);
        }catch(error){
            console.error("Error al obtener los usuarios: ", error);
        }
    }

    if (!pokeAleatorio || !pokeAleatorio.types) {
        return <div>Loading...</div>;
    }
    

    return(
        <>
        <div>
            <img src={pokeAleatorio.sprites.front_default} alt={pokeAleatorio.name} /> 
            <h1>{pokeAleatorio.name}</h1>
            <h3>Vidas: {vidas}</h3>
            <h4>Tus Puntos: {puntosUsuario}</h4>


            {valoresJuego.map((valor, index)=>(
            <div key={index} onClick={() => intento(valor)}>
                <p>{valor}</p>
            </div>
            
            ))}
        </div>

        <div>
                <h2>Usuarios y Puntuaciones</h2>
                {usuariosRanking.map((usuario, index) => (
                    <div key={index}>
                        <p>Nombre: {usuario.Nombre}</p>
                        <p>Puntos: {usuario.Puntos}</p>
                    </div>
                ))}
            </div>

        </>

    );

}