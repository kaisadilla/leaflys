import React from 'react';

/**
 * Valid props:
 ** close — the function to call to close this dialog when clicking outside of it.
 * No function means the panel won't close when clicking outside.
 */
function CoverPanel (props) {
    return (
        <div className="cover-panel" onClick={props.close}>
            {props.children}
        </div>
    );
}

export default CoverPanel;