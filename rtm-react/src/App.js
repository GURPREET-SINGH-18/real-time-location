import {useContext} from 'react'
import Home from "./pages/home/Home";
import Login from './pages/login/Login';
import Register from "./pages/register/Register";
import {AuthContext} from '../src/context/AuthContext'
import { 
    BrowserRouter,
    Routes,
    Route,
    Navigate 
} from "react-router-dom";

function App() {
    const {user} = useContext(AuthContext)
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={user ? <Home/> : <Login/>} />
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login/> } />
                <Route path="/register" element={user ? <Navigate to="/" /> :<Register/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;