import { Navigate, Outlet, useLocation } from "react-router";
import classNames from "classnames/bind";
import { useContext } from 'react';

import { UserContext } from "../App";
import { FULL_PATHS_LIST, isAuthorized } from "./Paths";
import { DEFAULT_PATHS, ROLES } from "./Roles";
import styles from "./ProtectedRoutes.module.scss";

import Sidebar from '../component/Layout/Sidebar';
import Header from '../component/Layout/Header';
import Advertisement from "../pages/home/Advertisement";

const cx = classNames.bind(styles);

export const ProtectedRoutes = () => {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const pathName = location.pathname;

    if (!user) {
        console.log('Not logged in');
        return <Navigate to="/" />;
    }

    if (!isAuthorized(user.role, pathName)) {
        console.log('Unauthorized');
        return <Navigate to="/403" />;
    }

    if (pathName === '/' && user.role !== ROLES.USER) {
        return <Navigate to={DEFAULT_PATHS[user.role]} />
    }

    const currentRoute = FULL_PATHS_LIST.find(p => p.path === pathName) || 
                        FULL_PATHS_LIST.find(p => pathName.startsWith(p.path) && p.path.includes(":"));

    if (!currentRoute?.layout) {
        return <Outlet />;
    }

    return (
        <div className="home-page">
            <Header />
            <div className="home-content">
                <Sidebar />
                <div className="main-content">
                <Outlet />
                </div>
                <Advertisement />
            </div>
        </div>
    );
}
