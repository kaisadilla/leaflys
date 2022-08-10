import React from 'react';
import Button from './Button';
import CoverPanel from './CoverPanel';
import Dialog from './Dialog';

/**
 * Valid props:
 ** isOpen — true if the modal is open.
 ** title — the title of the dialog.
 ** messageHTML — html code to display in the message area.
 ** message — text to display as the message of the dialog. Won't be displayed if messageHTML is defined
 ** confirm — the function to call when the user confirms.
 ** confirmLabel — the label of the confirm button.
 ** confirmStyle — the style of the confirm button.
 ** close — the function to call to close the dialog.
 */
function ConfirmDialog (props) {
    if (!props.isOpen) {
        return <></>;
    }

    const className = props.className ? props.className : "";
    
    return (
        <Dialog className={`dialog-confirm ${className}`} {...props}>
            <h2>{props.title}</h2>
            {props.messageHTML ?? <span class="message">{props.message}</span>}
            <div className="buttons">
                <Button baseStyle="clear" label="Cancel" onClick={props.close} />
                <Button baseStyle={props.confirmStyle} label={props.confirmLabel} onClick={props.confirm} />
            </div>
        </Dialog>
    );
}

export default ConfirmDialog;