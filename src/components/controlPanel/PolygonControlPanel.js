import React, { useEffect, useState } from 'react';
import Button from '../../elements/Button';
import { useDocumentContext } from '../../logic/useDocumentContext';
import { useUIContext } from '../../logic/useUIContext';
import DrawToolOptions from '../toolOptions/DrawToolOptions';
import DeleteOverlapOptions from '../toolOptions/DeleteOverlapOptions';
import DeleteCornersOptions from '../toolOptions/DeleteCornersOptions';
import PolygonProperties from './PolygonProperties';
import PolygonToolbar from './PolygonToolbar';
import EditedPolygonData from './EditedPolygonData';
import DocumentUtil from '../../util/DocumentUtil';

function PolygonControlPanel () {
    const { document, updatePolygon } = useDocumentContext();
    const {
        editedFeatureIndex,
        editedFeatureSubpolygonIndex,
        editedFeature,
        editor,
        setEditedFeatureIndex,
        setEditedFeatureSubpolygonIndex,
        setEditedFeatureAndSubindex,
        setEditorSelectedTool,
    } = useUIContext();

    const $subPolygons = editedFeature.polygons.map((p, i) => (
        <Button
            label={i}
            key={i} // old one used p as key, for some reason.
            onClick={() => setEditedFeatureSubpolygonIndex(i)}
            selected={editedFeatureSubpolygonIndex === i}
        />
    ));

    // #region Events
    const evt_cancelEdit = () => {
        setEditedFeatureIndex(null);
    };
    const evt_saveEdit = () => {
        const baseFeature = document.features.polygons[editedFeatureIndex];
        const newFeature = DocumentUtil.savePolygonEdit(baseFeature, editedFeature);
        updatePolygon(editedFeature.originalId, newFeature);

        setEditorSelectedTool(null);
        setEditedFeatureIndex(null);
    };
    const evt_addSubpolygon = (evt) => {
        setEditedFeatureAndSubindex({
            ...editedFeature,
            polygons: [
                ...editedFeature.polygons,
                [[]],
            ]
        }, editedFeature.polygons.length);
    }
    // #endregion

    const $editHeaderText = editedFeature.polygons.length > 1
        ? "multipolygon"
        : "polygon";
    const $subpolygonText = editedFeature.polygons.length > 1
        ? "Subpolygons (MultiPolygon)"
        : "Subpolygons";

    return (
        <div className="editor-control-panel">
            <div className="panel-header">
                <div className="content">
                    <span className="header-title">
                        Edit {$editHeaderText}
                    </span>
                    <div className="control-collection">
                        <Button baseStyle="danger" label="Cancel" onClick={evt_cancelEdit} />
                        <Button baseStyle="success" label="Save" onClick={evt_saveEdit} />
                    </div>
                </div>
                <div className="shadow-border" />
            </div>
            <div className="control-panel control-panel-edit">
                <h2 className="control-panel-header">Properties</h2>
                <PolygonProperties />
                <h2 className="control-panel-header">{$subpolygonText}</h2>
                <div className="polygon-selector">
                    <div className="polygon-gallery">
                        {$subPolygons}
                        <Button baseStyle="success" label="+" onClick={evt_addSubpolygon} />
                    </div>
                </div>
                <PolygonToolbar />
                <>
                    <DrawToolOptions />
                    <DeleteCornersOptions />
                    <DeleteOverlapOptions />
                </>
                <h2 className="control-panel-header">Data</h2>
                <EditedPolygonData />
            </div>
        </div>
    );
}

export default PolygonControlPanel;