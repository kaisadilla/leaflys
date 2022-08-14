import React from 'react';
import Button from '../elements/Button';
import Dropdown from '../elements/Dropdown';
import { EDITOR_MODES, EDITOR_MODES_NAMES, useUIContext } from '../logic/useUIContext';
import useNavBar from './useNavBar';

function NavBar (props) {
    const { editorMode, setEditorMode } = useUIContext();
    const { openDocument, saveDocument } = useNavBar();

    const $editorModes = Object.keys(EDITOR_MODES).map(k => (
        <Dropdown.Item
            key={k}
            onClick={() => setEditorMode(EDITOR_MODES[k])}
            selected={editorMode === EDITOR_MODES[k]}
        >
            {EDITOR_MODES_NAMES[EDITOR_MODES[k]]}
        </Dropdown.Item>
    ));

    return (
        <nav className="navbar">
            <Dropdown
                label={EDITOR_MODES_NAMES[editorMode]}
                className="editor-mode-menu"
                buttonClassName="editor-mode-menu-button"
                menuClassName="editor-mode-menu-dropdown"
            >
                {$editorModes}
                <Dropdown.Separator />
            </Dropdown>
            <div className="navbar-io-section">
                <div className="horizontal-control-group">
                    <span className="horizontal-control-group-name navbar-group-name">Leaflys</span>
                    <div className="horizontal-control-group-controls">
                        <Button baseStyle="normal" label="Open" onClick={openDocument} />
                        <Button baseStyle="success" label="Save" onClick={saveDocument} />
                    </div>
                </div>
                <div className="horizontal-control-group">
                    <span className="horizontal-control-group-name navbar-group-name">Geojson</span>
                    <div className="horizontal-control-group-controls">
                        <Button baseStyle="normal" label="Import" />
                        <Button baseStyle="success" label="Export" />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;