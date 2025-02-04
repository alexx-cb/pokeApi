import { getAuth, signInWithPopup, GoogleAuthProvider, signOut} from "firebase/auth";

export function Login(){

    
    function loginGoogle(){
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        
        signInWithPopup(auth, provider).then(

            ()=>console.log("Sesion iniciada, hola: ")
    
        ).catch((reason) => {
        console.error('Failed sign', reason)
      })
    }
    

    function LogOut(){
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log("sesion cerrada")
        }).catch((error) => {
            console.log("Error al cerrar sesion: "+ error)
        });
    }
    

    return(
        <>
        <button onClick={loginGoogle}>Iniciar Sesion</button>
        <button onClick={LogOut}>Cerrar Sesion</button>
        
        </>

    );

}
