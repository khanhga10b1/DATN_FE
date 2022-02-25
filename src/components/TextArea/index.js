import React from 'react';
import '../../scss/components/_textfield.scss';

const TextArea = ({
    label = null,
    placeholder = '',
    cols = 20,
    rows = 5,
    customClass = '',
    disabled = false,
    ...props
}) => {
    var textAreas = document.getElementsByTagName('textarea');

    Array.prototype.forEach.call(textAreas, function (elem) {
        elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
    });
    return (
        <>
            <textarea
                cols={cols}
                rows={rows}
                disabled={disabled}
                placeholder={placeholder}
                className={`text textarea ${customClass} ${disabled ? 'text--disabled' : ''}`}
                {...props}
            />
        </>
    );
};

export default TextArea;
