import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged} from "firebase/auth";
import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import {db} from '../firebase'

export function Login(){

    const [hayUsuario, setHayUsuario] = useState(false);
    const [nombreUsuario, setNombreUsuario ] = useState();
    const [correoUsuario, setCorreoUsuario] = useState();
    
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(user){
                setHayUsuario(true);
                setNombreUsuario(user.displayName);
                setCorreoUsuario(user.email);
                comprobarSiExiste(user.email);
            } else {
                setHayUsuario(false);
                setNombreUsuario(null);
                setCorreoUsuario(null);
            }
        });

    }, []);

    // Utilizo asyn y wait para que me carguen primero los los datos y que
    // despues me compruebe si existe un documento en la base de datos con el correo del usuario
    async function loginGoogle(){
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if(!(await comprobarSiExiste(user.email))){
                crearNuevoDoc(user.email);
            }
        } catch (error) {
            console.error('Error en el inicio de sesión', error);
        }
    }
    

    function LogOut(){
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log("sesion cerrada");
        }).catch((error) => {
            console.log("Error al cerrar sesion: "+ error)
        });
    }
    
    async function comprobarSiExiste(email) {
        try {
            const consulta = query(collection(db, "PokeApi"), where('Usuario', '==', email));
            const comprobacion = await getDocs(consulta);
            return !comprobacion.empty;
        } catch (error) {
            console.error("Error al comprobar si existe: ", error);
            return false;
        }
    }

    function crearNuevoDoc(correo){
        let nuevoDoc ={
            Usuario : correo,
            Puntos : 0
        }

        addDoc(collection(db, "PokeApi"),nuevoDoc)
        .then((DocRef)=>{
            console.log("documento creado con ID" , DocRef.id)
        }).catch((error)=>{
            console.log("ERROR: " +error);
        });
    }

    return(
        <>

        {hayUsuario ? 
        (<div>
            <p>Hola {nombreUsuario}</p>
            <button onClick={LogOut}>Cerrar Sesion</button>
        </div>
            
        ): 
        (<button onClick={loginGoogle}>Iniciar Sesion</button>) }
        
        
        
        </>

    );

}
