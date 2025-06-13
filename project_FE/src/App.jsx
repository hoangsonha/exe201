import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ProtectedRoutes } from './auth/ProtectedRoutes.jsx';
import { FULL_PATHS_LIST } from './auth/Paths.jsx';
import Login from './pages/login/Login.jsx';
import Forbidden from './pages/Forbidden.jsx';
import NotFound from './pages/NotFound.jsx';
// import InformationUser from './pages/InformationUser.jsx';
import SignUp from './pages/signup/Signup.jsx';
import Home from './pages/home/Home.jsx';
import PostDetail from './pages/home/PostDetail.jsx';
import AboutUs from './pages/aboutUs/AboutUs.jsx';
import Explore from './pages/explore/Explore.jsx';
import Upgrade from './pages/upgrade/Upgrade.jsx';
import UserProfile from './pages/user/UserProfile.jsx';
import EditUser from './pages/user/EditUser.jsx';

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
                    
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/edit-profile" element={<EditUser />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/upgrade" element={<Upgrade />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/403" element={<Forbidden />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;