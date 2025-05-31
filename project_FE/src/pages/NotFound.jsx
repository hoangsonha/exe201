import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
    <div className="not-found d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: "#f7f7f7", height: "100vh" }}>
        <img
            src="https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png"
            alt="not-found"
        />
        <Link to="/" className="link-home">
            Go Login
        </Link>
    </div>
);

export default NotFound;
