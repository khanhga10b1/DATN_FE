import React from 'react';
import * as Icon from 'react-feather';

const Feather = ({ name, ...props }) => {
    return <>{React.createElement(Icon[`${name}`], { ...props })}</>;
};

export default Feather;
