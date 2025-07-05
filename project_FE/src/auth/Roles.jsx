export const ROLES = {
    ADMIN: 'ROLE_ADMIN',
    STAFF: 'ROLE_STAFF',
    MANAGER: 'ROLE_MANAGER',
    USER: 'ROLE_USER'
}

export const ROLES_LABEL = {
    [ROLES.ADMIN]: 'Admin',
    [ROLES.USER]: 'User',
    [ROLES.MANAGER]: 'Manager',
    [ROLES.STAFF]: 'Staff'
}

export const DEFAULT_PATHS = {
    [ROLES.ADMIN]: '/manager-employees',
    [ROLES.MANAGER]: '/',
    [ROLES.STAFF]: '/',
    [ROLES.USER]: '/',
}

