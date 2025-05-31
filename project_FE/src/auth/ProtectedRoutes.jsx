import { Navigate, Outlet, useLocation } from "react-router";
import classNames from "classnames/bind";
import { useContext } from 'react';

import Header from "/src/common/Header.jsx";
import Footer from "/src/common/Footer.jsx";
import { UserContext } from "../App";
import { isAuthorized } from "./Paths";
import { DEFAULT_PATHS, ROLES } from "./Roles";
import styles from "./ProtectedRoutes.module.scss";

const cx = classNames.bind(styles);

export const ProtectedRoutes = () => {
    const { user } = useContext(UserContext);
    const location = useLocation().pathname;

    if (!user) {
        console.log('Not logged in');
        return <Navigate to="/" />;
    }

    if (!isAuthorized(user.role, location)) {
        console.log('Unauthorized');
        return <Navigate to="/403" />;
    }

    if (location == '/' && user.role !== ROLES.USER) {
        return <Navigate to={DEFAULT_PATHS[user.role]} />
    }

    return (
        <div className={cx("app")}>
            <Header />
            <div className={cx("content")}>
                <Outlet />
            </div>
            <Footer className={cx("footer")}/>
        </div>
    );
}
