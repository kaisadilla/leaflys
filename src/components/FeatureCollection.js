import React from 'react';
import Button from '../elements/Button';
import { useDocumentContext } from '../logic/useDocumentContext';
import FeatureCollection_Feature from './FeatureCollection.Feature';

function FeatureCollection (props) {
    const { document } = useDocumentContext();

    const $features = document.features.polygons.map((p, i) => {
        // true if this feature is excluded by the type filter.
        const filteredOutByType = props.typeFilter &&
                              Array.isArray(props.typeFilter) &&
                              !props.typeFilter.includes(p.geometry.type);
        // true if this feature is excluded by the category filter.
        const filteredOutByCategory = props.categoryFilter &&
                                  Array.isArray(props.categoryFilter) &&
                                  !props.categoryFilter.includes(p.properties.category);
        
        if (!filteredOutByType && !filteredOutByCategory) {
            return (
                <FeatureCollection_Feature key={p.id} index={i} geojson={p} />
            );
        }
        else {
            return <></>
        }
    });

    return (
        <div className="feature-collection">
            {$features}
            {
                props.addButton &&
                <Button baseStyle="success" icon="add" />
            }
        </div>
    );
}

FeatureCollection.Feature = FeatureCollection_Feature;

export default FeatureCollection;