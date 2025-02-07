import { getAuth, signInWithPopup ,GoogleAuthProvider, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import {db , githubProvider} from '../firebase'
import '../css/login.css';

export function Login(){

    const [hayUsuario, setHayUsuario] = useState(false);
    const [nombreUsuario, setNombreUsuario ] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);


    
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if(user){
                setHayUsuario(true);
                setNombreUsuario(user.displayName);
                setEmail(user.email);
                comprobarSiExiste(user.email);
            } else {
                setHayUsuario(false);
                setNombreUsuario(null);
            }
        });

    }, []);

    // Utilizo asyn y wait para que me guarde en una variable los datos del usuario, ya que de este modo se para la ejecucion del codigo, 
    // y que despues me compruebe si existe un documento en la base de datos con el correo del usuario
    async function loginGoogle(){
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        
        try {
            const resultado = await signInWithPopup(auth, provider);
            const usuario = resultado.user;
            setNombreUsuario(usuario.displayName);
            if(!(await comprobarSiExiste(usuario.email))){
                crearNuevoDoc(usuario.email);
            }
        } catch (error) {
            console.error('Error en el inicio de sesión', error);
        }
    }

    async function githubLogIn() {
        const auth = getAuth();

        try {
            const resultado = await signInWithPopup(auth, githubProvider);
            const usuario = resultado.user;
            setNombreUsuario(usuario.displayName || usuario.email); // Usa el correo electrónico si displayName es null
            if (!(await comprobarSiExiste(usuario.email))) {
                crearNuevoDoc(usuario.email, usuario.displayName || usuario.email);
            }
        } catch (error) {
            console.error('Error al iniciar sesión con GitHub', error);
        }
    }

    async function registrarUsuario(event) {
        event.preventDefault();
        const auth = getAuth();
        try {
            const registrar = await createUserWithEmailAndPassword(auth, email, password1);
            const user = registrar.user;
            setNombreUsuario(nombreUsuario);
            if (!(await comprobarSiExiste(user.email))) {
                crearNuevoDoc(user.email, nombreUsuario);
            }
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error al registrar usuario:", errorCode, errorMessage);
        }
    }
    

    async function iniciarSesion(event) {
        event.preventDefault();
        const auth = getAuth();
        try {
            const iniciar = await signInWithEmailAndPassword(auth, email, password1);
            const user = iniciar.user;
            
            // nombre del usuario de Firestore
            const q = query(collection(db, "PokeApi"), where("Usuario", "==", user.email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0].data();
                setNombreUsuario(userDoc.Nombre);
            }
    
            if(!(await comprobarSiExiste(user.email))){
                crearNuevoDoc(user.email, nombreUsuario);
            }
    
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error al iniciar sesión:", errorCode, errorMessage);
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

    function crearNuevoDoc(correo, nombre){
        let nuevoDoc ={
            Usuario : correo,
            Nombre: nombre,
            Puntos : 0
        }

        addDoc(collection(db, "PokeApi"),nuevoDoc)
        .then((DocRef)=>{
            console.log("documento creado con ID" , DocRef.id)
        }).catch((error)=>{
            console.log("ERROR: " +error);
        });
    }

    return (
      <>
      
        <div className="login-container">
  {hayUsuario ? (
    <div>
      <p className="user-greeting">Hola {nombreUsuario}</p>
      <button className="logout-button" onClick={LogOut}>Cerrar Sesión</button>
    </div>
  ) : (
    <>
      {isRegistering ? (
        <form onSubmit={registrarUsuario}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              onChange={(e) => setPassword1(e.target.value)}
              required
            />
          </div>
          <button type="submit">Registrar</button>
          <button className="switch-form-button" type="button" onClick={() => setIsRegistering(false)}>
            ¿Ya tienes una cuenta? Inicia Sesión
          </button>
        </form>
      ) : (
        <form onSubmit={iniciarSesion}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@email.com"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              onChange={(e) => setPassword1(e.target.value)}
              placeholder="Your Password"
            />
          </div>
          <button type="submit">Iniciar Sesión</button>
          <button className="google-button" onClick={loginGoogle}>Iniciar Sesión con Google</button>
          <button className="github-button" onClick={githubLogIn}>Iniciar Sesión con Github</button>
          <button className="switch-form-button" type="button" onClick={() => setIsRegistering(true)}>
            ¿No tienes una cuenta? Regístrate
          </button>
        </form>
      )}
    </>
  )}
</div>
<hr className="full-width-hr" />
      </>
    );

}
