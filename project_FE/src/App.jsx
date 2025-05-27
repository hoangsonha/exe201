import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router';

import { ProtectedRoutes } from './auth/ProtectedRoutes.jsx';
import { FULL_PATHS_LIST } from './auth/Paths.jsx';
import Login from './pages/login/Login.jsx';
import Forbidden from './pages/Forbidden.jsx';
import NotFound from './pages/NotFound.jsx';
import InformationUser from './pages/InformationUser.jsx';
import SignUp from './pages/signup/Signup.jsx';

export const UserContext = createContext(null);

function App() {

    const [user, setUser] = useState(() => {
        const user = localStorage.getItem('user');
        return user
            ? JSON.parse(user)
            : null;
    });

    const signIn = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('user');
    }

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }  

    return (
        <UserContext.Provider value={{ user, signIn, signOut, updateUser }}>
            <BrowserRouter>
                <Routes>
                    <Route element={<ProtectedRoutes />}>
                        {
                            FULL_PATHS_LIST.map((path, index) => (
                                <Route key={index} path={path.path} element={path.element}/>
                            ))
                        }
                    </Route>
                    
                    <Route path="/profile" element={<InformationUser />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/403" element={<Forbidden />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;