import React, { useRef } from 'react';
import '../../scss/components/_modal.scss';
import { useOnClickOutside } from '../../utils/onClickOutside';
const Modal = ({ handleClose, show, children, maxWidth=800 }) => {
    const showHideClassName = show ? 'modal display-block' : 'modal display-none';
    const ref = useRef();
    useOnClickOutside(ref, () => handleClose());

    return (
        <div className={showHideClassName}>
            <section ref={ref} className='modal__main' style={{maxWidth : `${maxWidth}px`}}>
                {children}
            </section>
        </div>
    );
};
export default Modal;
