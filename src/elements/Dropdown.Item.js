import React from 'react';

function Dropdown_Item (props) {
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

export default Dropdown_Item;