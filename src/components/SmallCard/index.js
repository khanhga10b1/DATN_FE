import React from 'react';

import '../../scss/components/_small-card.scss';
const SmallCard = ({ background, color,margin = "left", className = '', ...props }) => {
    return (
        <div className={`small-card ${className}`} {...props} style={{ background: background, color: color,margin: margin }}>
            {props.children}
        </div>
    );
};

export default SmallCard;
