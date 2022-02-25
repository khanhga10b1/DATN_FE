import React from 'react';
import '../../scss/components/_button.scss';

/**
 *
 * @param checked
 * @param props
 * @returns {*}
 * @constructor
 */
export default function Button({
    label,
    type = 'primary',
    htmlType = 'button',
    disabled = false,
    children,
    customClass = '',
    ...props
}) {
    return (
        <button
            type={htmlType}
            className={`${customClass} ${disabled ? 'btn--disabled' : ''} ${
                type === 'primary' ? 'btn btn--primary' : 'btn btn--secondary'
            }`}
            {...props}>
            {children !== undefined ? children : label}
        </button>
    );
}
