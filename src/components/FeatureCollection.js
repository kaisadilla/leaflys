import React, { useEffect, useState } from 'react';
import Button from '../elements/Button';
import { useDocumentContext } from '../logic/useDocumentContext';
import FeatureCollection_Feature from './FeatureCollection.Feature';

function FeatureCollection (props) {
    const { document, addNewPolygon } = useDocumentContext();
    const [isGroupEnabled, setGroupEnabled] = useState(true);

    const featuresContained = document.features.polygons.filter((p, i) => {
        // true if this feature is excluded by the type filter.
        const filteredOutByType = props.typeFilter &&
                                  Array.isArray(props.typeFilter) &&
                                  !props.typeFilter.includes(p.geometry.type);
        // true if this feature is excluded by the category filter.
        const filteredOutByCategory = props.categoryFilter &&
                                      Array.isArray(props.categoryFilter) &&
                                      !props.categoryFilter.includes(p.properties.category);
        
        return !filteredOutByType && !filteredOutByCategory;
    });

    const addFeatureToCategory = () => {
        addNewPolygon("New shape", props.categoryFilter[0], crypto.randomUUID());
    }

    useEffect(() => {
        const enabledCount = featuresContained.filter(f => {
            return f.properties.leaflys?.enabled ?? true;
        }).length;

        setGroupEnabled(enabledCount !== featuresContained.length);
    }, [featuresContained]);

    const $features = featuresContained.map((p, i) => {
        return <FeatureCollection.Feature key={p.id} index={i} feature={p} />
    });

    return (
        <div className="feature-collection">
            {$features}
            {
                props.addButton &&
                <div className="control-collection align-right">
                    <Button baseStyle="success" icon="add" onClick={addFeatureToCategory} />
                </div>
            }
        </div>
    );
}

FeatureCollection.Feature = FeatureCollection_Feature;

export default FeatureCollection;