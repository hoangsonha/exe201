import React from 'react';
import { Link } from 'react-router';

const Forbidden = () => {
    return (
        <div>
            <h1>403 - Forbidden</h1>
            <p>You do not have permission to access this page.</p>
            <Link to='/'>Go back to login</Link>
        </div>
    );
};

export default Forbidden;