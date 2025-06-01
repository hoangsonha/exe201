import React from 'react';
import './Advertisement.css';
import fakeAds1 from '../../assets/ads/fakeAds1.svg';
import fakeAds2 from '../../assets/ads/fakeAds2.svg';

const Advertisement = () => {
  return (
    <div className="advertisement-section">
      <div className="ad-container">
        <img src={fakeAds1} alt="Advertisement" className="ad-image" />
        <div className="ad-overlay">
          <span className="ad-label">Sponsored</span>
        </div>
      </div>
      
      <div className="ad-container">
        <img src={fakeAds2} alt="Advertisement" className="ad-image" />
        <div className="ad-overlay">
          <span className="ad-label">Sponsored</span>
        </div>
      </div>
    </div>
  );
};

export default Advertisement; 