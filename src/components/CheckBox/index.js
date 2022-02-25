import React from 'react';
import '../../scss/components/_checkbox.scss';

const Checkbox = props => (
    <label className='container' style={props.style}>
        {props.label}
        <input type='checkbox' {...props} />
        <span className={`checkmark ${props.checkall === 'true' ? 'checkall' : 'checkone'}`}></span>
    </label>
);

export default Checkbox;
