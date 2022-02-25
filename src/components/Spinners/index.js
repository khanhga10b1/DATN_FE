import React from 'react';

import '../../scss/components/_spinner.scss';
const Spinner = ({ ...props }) => {

    return (
        <div nottoggle={'true'} className={`spin`} {...props}>
            <div className="spin__area">
                <div>
                </div>
                <div>
                </div>
                <div>
                </div>
                <div>
                </div>
            </div>
        </div>
    );
}

export default Spinner;
