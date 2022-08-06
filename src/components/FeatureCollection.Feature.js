import React from 'react';
import SpanButton from '../elements/SpanButton';
import Switch from '../elements/Switch';
import DormantTextbox from '../elements/DormantTextbox';
import Button from '../elements/Button';
import { toHaveFormValues } from '@testing-library/jest-dom/dist/matchers';
import Helpers from '../logic/Helpers';

function FeatureCollection_Feature(props) {
    const geojson = props.geojson;
    const index = props.index;

    const name = geojson.properties.name;
    const id = geojson.id;

    const empty = geojson.geometry.coordinates.length === 0 || geojson.geometry.coordinates[0].length === 0;
    const disabled = geojson.properties.leaflys ? geojson.properties.leaflys.disabled : false;

    const copyButton = () => copyFeature(geojson);
    const exportButton = () => exportFeature(name, geojson);

    return (
        <div className={`feature ${disabled ? "disabled-feature" : ""}`}>
            <div className="feature-row name-row">
                <Switch className="toggle-feature" checked={!disabled} />
                <div className="feature-name">
                    <DormantTextbox
                        className="feature-name-textbox"
                        value={name}
                        onChange={e => geojson.properties.name = e.target.value}
                    />
                </div>
                {
                    disabled ?
                    <div className="feature-buttons-placeholder"></div> :
                    <div className="feature-buttons">
                        <Button baseStyle="clear" icon="edit" iconStyle="g-outline" />
                        <Button baseStyle="danger" icon="delete" iconStyle="g-outline" />
                    </div>
                }
            </div>
            {
                !disabled &&
                <div className="feature-row">
                    <div className="feature-id">{id}</div>
                    <div className="feature-quick-actions">
                        <SpanButton label="copy" onClick={copyButton} />
                        <span> | </span>
                        <SpanButton label="export" onClick={exportButton} />
                        <span> | </span>
                        <SpanButton label="raw" />
                    </div>
                </div>
            }
        </div>
    );
}

function copyFeature (geojson) {
    Helpers.copyToClipboard(encodedGeojson(geojson));
}

function exportFeature (fileName, geojson) {
    Helpers.saveAsFile(`${fileName}.geojson`, encodedGeojson(geojson));
}

function encodedGeojson (geojson) {
    const rawJson = JSON.stringify(geojson, null, 4);
    return Helpers.formatGeojsonCoords(rawJson);
}

export default FeatureCollection_Feature;