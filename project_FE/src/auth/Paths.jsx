import { ROLES } from "./Roles";
import EmployeeManagement from "../pages/EmployeeManagement";
import CompanyManagement from "../pages/CompanyManagement";
import ProjectManagement from "../pages/ProjectManagement";
import InformationUser from "../pages/InformationUser";
import Empty from "../pages/Empty";

export const PATHS = {
    HOME: {
        path: '/home',
        label: 'Home',
        element: <Empty />,
        allowedRoles: [ROLES.USER, ROLES.MANAGER, ROLES.STAFF],
        layout: true
    },
    // COMBO_VACCINE: {
    //     path: '/combo-vaccine',
    //     label: 'Combo',
    //     element: <VaccineCombo />,
    //     allowedRoles: [ROLES.USER]
    // },
    MANAGER_EMPLOYEE: {
        path: '/manager-employees',
        label: 'Employee',
        element: <EmployeeManagement />,
        allowedRoles: [ROLES.ADMIN],
        layout: true
    },
    MANAGER_COMPANY: {
        path: '/manager-companies',
        label: 'Company',
        element: <CompanyManagement />,
        allowedRoles: [ROLES.ADMIN],
        layout: true
    },
    MANAGER_PROJECT: {
        path: '/manager-projects',
        label: 'Project',
        element: <ProjectManagement />,
        allowedRoles: [ROLES.ADMIN],
        layout: true
    },
}

export const FULL_PATHS_LIST = Object.values(PATHS);
export const getRolePaths = (role) => {
    if (role == ROLES.ADMIN) {
        return [PATHS.MANAGER_EMPLOYEE, PATHS.MANAGER_COMPANY, PATHS.MANAGER_PROJECT];
    } else {
        return [PATHS.HOME];
    }
}

export const isAuthorized = (role, pathName) => {
    if (!role || !pathName) return false;

    if (pathName === "/profile") return true;

    let exactMatch = FULL_PATHS_LIST.find(p => p.path === pathName);
    if (exactMatch) return exactMatch.allowedRoles.includes(role);

    let partialMatch = FULL_PATHS_LIST.find(p => 
        pathName.startsWith(p.path) && p.path.includes(":")
    );
    if (partialMatch) return partialMatch.allowedRoles.includes(role);

    return false;
};


