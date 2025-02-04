import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function RutasPrivadas() {
    let [usuario, setUsuario] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUsuario(<Outlet/>);
                console.log("SALTA CAMBIO EN LOGIN CON USER = " + user.displayName);
            } else {
                console.log("Cierra sesión");
                setUsuario(<Navigate to="/" />);
            }
        })
    }, []);

    return (
        usuario
    )
}