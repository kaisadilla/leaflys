import React from 'react';
import Button from '../elements/Button';
import Dropdown from '../elements/Dropdown';
import { EDITOR_MODES, EDITOR_MODES_NAMES, useUIContext } from '../logic/useUIContext';

function NavBar (props) {
    const { editorMode, setEditorMode } = useUIContext();

    return (
        <nav className="navbar">
            <Dropdown
                label={EDITOR_MODES_NAMES[editorMode]}
                className="editor-mode-menu"
                buttonClassName="editor-mode-menu-button"
                menuClassName="editor-mode-menu-dropdown"
            >
                {
                    Object.keys(EDITOR_MODES).map(k => {
                        return (
                            <Dropdown.Item
                                key={k}
                                onClick={() => setEditorMode(EDITOR_MODES[k])}
                                selected={editorMode === EDITOR_MODES[k]}
                            >
                                {EDITOR_MODES_NAMES[EDITOR_MODES[k]]}
                            </Dropdown.Item>
                        )
                    })
                }
                <Dropdown.Separator />
            </Dropdown>
            <div className="navbar-io-section">
                <div className="navbar-button-group">
                    <span className="navbar-group-name">Leaflys</span>
                    <Button baseStyle="normal" label="Open" />
                    <Button baseStyle="success" label="Save" />
                </div>
            </div>
        </nav>
    );
}

export default NavBar;