import './App.css'
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import { crearCards } from './components/cards'
import { landing } from './components/landing'
import { error404 } from './components/error404'
import { RutasPrivadas } from './rutasPrivadas'
import { detallePokemon } from './components/detalle'
import { Login } from './components/login'
import { Juego } from './components/juego';
import './css/menu.css';


function App() {

  const [hayUsuario, setHayUsuario] = useState(false);
      
      useEffect(()=>{
          const auth = getAuth();
          onAuthStateChanged(auth, (user) => {
              if(user){
                  setHayUsuario(true);
              }else{
                  setHayUsuario(false);
              }
          });
  
      }, [])

      

  return (
    <BrowserRouter>
            <nav className="navbar">
                <Link to="/" className="navbar-logo">PokéAPI</Link>
                <div className="navbar-links">
                    <Link to="/">Inicio</Link>
                    <Link to="/Cartas">Cartas</Link>
                    {hayUsuario ? (
                        <>
                            <Link to="/Juego">Juego</Link>
                            <Link to="/Login">Tu Sesión</Link>
                        </>
                    ) : (
                        <Link to="/Login">Login</Link>
                    )}
                </div>
            </nav>

            <Routes>
                <Route exact path="/" Component={landing} />
                <Route exact path="/Login" Component={Login} />
                <Route exact path="/Cartas" Component={crearCards} />
                <Route exact path="/Detalle/:idPokemon" Component={detallePokemon} />
                <Route element={<RutasPrivadas />}>
                    <Route exact path="/Juego" Component={Juego} />
                </Route>
                <Route path="*" Component={error404} />
            </Routes>
        </BrowserRouter>
  )
}

export default App
