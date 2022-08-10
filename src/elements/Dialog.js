import React from 'react';
import Button from './Button';
import CoverPanel from './CoverPanel';

/**
 * Valid props:
 ** isOpen — true if the modal is open.
 ** className — a custom class for the dialog box.
 ** close — the function to call to close the dialog.
 ** clickOutsideToClose — if true, clicking outside the dialog will close it.
 */
function Dialog (props) {
    if (!props.isOpen) {
        return <></>;
    }

    const className = props.className ? props.className : "";
    return (
        <CoverPanel close={props.clickOutsideToClose && props.close}>
            <div className={`default-dialog ${className}`} onClick={e => e.stopPropagation()}>
                {props.children}
            </div>
        </CoverPanel>
    );
}

export default Dialog;