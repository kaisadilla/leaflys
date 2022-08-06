import React, { useState } from "react";
import Button from "./Button";
import PopupDiv from "./PopupDiv";
import DropdownItem from "./Dropdown.Item";
import DropdownSeparator from "./Dropdown.Separator";

/**
 * Valid props:
 ** label — the name to display on the button.
 ** className — the class of the control.
 ** buttonClassName — the class of the button that opens the menu.
 ** menuClassName — the class of the menu itself.
 */
function Dropdown (props) {
    const [open, setOpen] = useState(false);

    const openMenu = () => setOpen(true);
    const closeMenu = () => setOpen(false);
    
    // TODO: Close when clicking outside the menu.

    // add the "closeMenu" prop to every children.
    const children = React.Children.map(props.children, c => {
        return React.isValidElement(c) ? React.cloneElement(c, {_closeMenu: closeMenu}) : c;
    });

    return (
        <div className={`dropdown-menu ${props.className ?? ""}`}>
            <Button className={props.buttonClassName} label={props.label} onClick={openMenu} />
            {
                open &&
                <PopupDiv className={`menu-container ${props.menuClassName ?? ""}`} onClickOutside={closeMenu}>
                    <ul className="menu-items">
                        {children}
                    </ul>
                </PopupDiv>
            }
        </div>
    );
}

Dropdown.Item = DropdownItem;
Dropdown.Separator = DropdownSeparator;

export default Dropdown;