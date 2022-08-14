import React from 'react';
import InputCombo from '../../elements/InputCombo';
import Textbox from '../../elements/Textbox';
import { useUIContext } from '../../logic/useUIContext';

function PolygonProperties (props) {
    const {
        editedFeature,
        setEditedFeature,
    } = useUIContext();
    
    const evt_nameTextbox = (evt) => {
        setEditedFeature({
            ...editedFeature,
            name: evt.target.value,
        })
    };
    const evt_categoryTextbox = (evt) => {
        setEditedFeature({
            ...editedFeature,
            category: evt.target.value,
        })
    };
    const evt_idTextbox = (evt) => {
        setEditedFeature({
            ...editedFeature,
            id: evt.target.value,
        })
    };

    return (
        <div className="properties control-table">
            <InputCombo className="pair">
                <label htmlFor="feature-name">Name</label>
                <Textbox id="feature-name" value={editedFeature.name} onChange={evt_nameTextbox} />
            </InputCombo>
            <InputCombo className="pair">
                <label htmlFor="feature-category">Category</label>
                <Textbox id="feature-category" value={editedFeature.category} onChange={evt_categoryTextbox} />
            </InputCombo>
            <InputCombo className="pair">
                <label htmlFor="feature-id">Id</label>
                <Textbox id="feature-id" value={editedFeature.id} onChange={evt_idTextbox} />
            </InputCombo>
        </div>
    );
}

export default PolygonProperties;