import React from 'react';

function DropdownItem (props) {
    function onClick () {
        props.onClick();
        props._closeMenu();
    }

    return (
        <li
            className={`menu-item ${props.selected ? "selected" : ""} ${props.className ?? ""}`}
            onClick={onClick}
        >
            {props.children}
        </li>
    );
}

export default DropdownItem;