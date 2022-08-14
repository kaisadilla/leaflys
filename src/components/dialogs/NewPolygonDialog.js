import React, { useLayoutEffect, useState } from 'react';
import Button from '../../elements/Button';
import Dialog from '../../elements/Dialog';
import InputCombo from '../../elements/InputCombo';
import SpanButton from '../../elements/SpanButton';
import Textbox from '../../elements/Textbox';
import { useDocumentContext } from '../../logic/useDocumentContext';

function NewPolygonDialog (props) {
    const { addNewPolygon } = useDocumentContext();

    const [name, setName] = useState(null);
    const [category, setCategory] = useState(null);
    const [id, setId] = useState(null);

    useLayoutEffect(() => {
        setName("New polygon");
        setCategory("default");
        setId(crypto.randomUUID());
    }, [props.isOpen]);

    const evt_addPolygon = e => {
        addNewPolygon(name, category, id);
        props.close();
    }

    return (
        <Dialog className="dialog-new-shape" {...props}>
            <h2>New polygon</h2>
            <div className="properties">
                <InputCombo className="property">
                    <label htmlFor="feature-name">Name</label>
                    <Textbox id="feature-name" value={name} onChange={e => setName(e.target.value)} />
                </InputCombo>
                <InputCombo className="property">
                    <label htmlFor="feature-category">Category</label>
                    <Textbox id="feature-category" value={category} onChange={e => setCategory(e.target.value)} />
                </InputCombo>
                <InputCombo className="property">
                    <label htmlFor="feature-id">Id</label>
                    <div className="property-id">
                        <Textbox id="feature-id" value={id} onChange={e => setId(e.target.value)} />
                        <SpanButton className="reroll-icon" baseStyle="inverted" icon="replay" onClick={() => setId(crypto.randomUUID())} />
                    </div>
                </InputCombo>
            </div>
            <div className="buttons">
                <Button baseStyle="clear" size="big" label="Cancel" onClick={props.close} />
                <Button baseStyle="success" size="big" label="Add" onClick={evt_addPolygon} />
            </div>
        </Dialog>
    );
}

export default NewPolygonDialog;