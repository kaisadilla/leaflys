import React from 'react';

function Dropdown_Separator (props) {
    return (
        <hr className={`menu-separator ${props.className ?? ""}`} />
    );
}

export default Dropdown_Separator;