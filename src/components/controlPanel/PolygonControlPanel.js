import React, { useEffect, useState } from 'react';
import Button from '../../elements/Button';
import { useDocumentContext } from '../../logic/useDocumentContext';
import { useUIContext } from '../../logic/useUIContext';
import DrawToolOptions from '../toolOptions/DrawToolOptions';
import DeleteCornersOptions from '../toolOptions/DeleteVerticesOptions';
import PolygonProperties from './PolygonProperties';
import PolygonToolbar from './PolygonToolbar';
import EditedPolygonData from './EditedPolygonData';
import DocumentUtil from '../../util/DocumentUtil';
import DifferenceOptions from '../toolOptions/DifferenceOptions';
import UnionOptions from '../toolOptions/UnionOptions';
import IntersectOptions from '../toolOptions/IntersectOptions';
import { POLYGON_TOOLS } from '../../global';

function PolygonControlPanel () {
    const { document, updatePolygon, getPolygonById } = useDocumentContext();
    const {
        editedFeatureIndex,
        editedFeatureSubpolygonIndex,
        editedFeature,
        editor,
        setEditedFeatureIndex,
        setEditedFeatureSubpolygonIndex,
        setEditedFeatureAndSubindex,
        setEditorSelectedTool,
        mapData,
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
        const baseFeature = getPolygonById(editedFeature.originalId);
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
                <span>zoom: {mapData.zoom}</span>
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
                    {editor.selectedTool === POLYGON_TOOLS.union && <UnionOptions />}
                    {editor.selectedTool === POLYGON_TOOLS.difference && <DifferenceOptions />}
                    {editor.selectedTool === POLYGON_TOOLS.intersect &&  <IntersectOptions />}
                </>
                <h2 className="control-panel-header">Data</h2>
                <EditedPolygonData />
            </div>
        </div>
    );
}

export default PolygonControlPanel;