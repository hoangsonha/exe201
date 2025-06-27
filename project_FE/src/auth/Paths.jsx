import { ROLES } from "./Roles";
import EmployeeManagement from "../pages/EmployeeManagement";
import Empty from "../pages/Empty";
import UserProfile from "../pages/user/UserProfile";
import EditUser from "../pages/user/EditUser";
import Upgrade from "../pages/upgrade/Upgrade";
import Bookmark from "../pages/save/Bookmark";

export const PATHS = {
    HOME: {
        path: '/home',
        label: 'Home',
        element: <Empty />,
        allowedRoles: [ROLES.USER, ROLES.MANAGER, ROLES.STAFF],
        layout: true
    },
    PROFILE: {
        path: '/profile',
        label: 'Profile',
        element: <UserProfile />,
        allowedRoles: [ROLES.USER, ROLES.MANAGER, ROLES.ADMIN],
        layout: false
    },
    EDIT_PROFILE: {
        path: '/edit-profile',
        label: 'Edit Profile',
        element: <EditUser />,
        allowedRoles: [ROLES.USER, ROLES.MANAGER, ROLES.ADMIN],
        layout: false
    },
    SAVED: {
        path: '/bookmarks',
        label: 'Bookmarks',
        element: <Bookmark />,
        allowedRoles: [ROLES.USER],
        layout: false
    },
    UPGRADE: {
        path: '/upgrade',
        label: 'Upgrade',
        element: <Upgrade />,
        allowedRoles: [ROLES.USER, ROLES.MANAGER],
        layout: false
    },
    MANAGER_EMPLOYEE: {
        path: '/manager-employees',
        label: 'Employee',
        element: <EmployeeManagement />,
        allowedRoles: [ROLES.ADMIN],
        layout: true
    },
}

export const FULL_PATHS_LIST = Object.values(PATHS);

export const getRolePaths = (role) => {
    if (role == ROLES.ADMIN) {
        return [PATHS.MANAGER_EMPLOYEE, PATHS.EDIT_PROFILE, PATHS.PROFILE];
    } if (role == ROLES.USER) {
        return [PATHS.UPGRADE, PATHS.EDIT_PROFILE, PATHS.PROFILE, PATHS.HOME, PATHS.SAVED];
    } if (role == ROLES.MANAGER) {
        return [PATHS.UPGRADE, PATHS.EDIT_PROFILE, PATHS.PROFILE, PATHS.HOME];
    } else {
        return [PATHS.HOME];
    }
}

export const isAuthorized = (role, pathName) => {
    if (!role || !pathName) return false;

    if (['/profile', '/edit-profile', '/upgrade'].includes(pathName)) return true;

    let exactMatch = FULL_PATHS_LIST.find(p => p.path === pathName);
    if (exactMatch) return exactMatch.allowedRoles.includes(role);

    let partialMatch = FULL_PATHS_LIST.find(p => 
        pathName.startsWith(p.path) && p.path.includes(":")
    );
    if (partialMatch) return partialMatch.allowedRoles.includes(role);

    return false;
};


