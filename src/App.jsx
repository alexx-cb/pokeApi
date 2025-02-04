import './App.css'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import { crearCards } from './components/cards'
import { landig } from './components/landing'
import { error404 } from './components/error404'
import { RutasPrivadas } from './rutasPrivadas'
import { detallePokemon } from './components/detalle'
import { Login } from './components/login'
import { Juego } from './components/juego'

function App() {

  return (
    <>

    <BrowserRouter>

    <Link to='/'>Inicio</Link>
    <Link to='/Cartas'> Cartas </Link>
    <Link to='/Login'> Login </Link>
    <Link to='/Juego'> Juego </Link>
    



      <Routes>
        <Route exact path='/' Component={landig} />
        <Route exact path='/Detalle/:idPokemon' Component={detallePokemon} />
        <Route extact path='/Login' Component={Login} />
        <Route exact path='/Cartas' Component={ crearCards } />
        <Route exact path='/Juego' Component={ Juego} />

        <Route element={<RutasPrivadas />}>
        
          

        </Route> 

        <Route path='*' Component={error404} />
      </Routes>
      
    
    </BrowserRouter>
      
    </>
  )
}

export default App
