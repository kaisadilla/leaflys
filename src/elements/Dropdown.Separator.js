import React from 'react';

function DropdownSeparator (props) {
    return (
        <hr className={`menu-separator ${props.className ?? ""}`} />
    );
}

export default DropdownSeparator;