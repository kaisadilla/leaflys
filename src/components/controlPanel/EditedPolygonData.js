import React, { useEffect, useState } from 'react';
import { MathUtil } from '../../util/MathHelper';
import { useUIContext } from '../../logic/useUIContext';
import { calculateEditedArea, calculateEditedVertices } from '../../util/Util';

function EditedPolygonData () {
    const { editedFeature } = useUIContext();

    const [ area, setArea ] = useState(0);
    const [ vertexCount, setVertexCount ] = useState(0);

    useEffect(() => {
        setArea(calculateEditedArea(editedFeature.polygons));
        setVertexCount(calculateEditedVertices(editedFeature.polygons));
    }, [editedFeature]);

    return (
        <div className="data">
            <div className="data-piece">
                <span className="name">Area: </span>
                <span className="value">
                    {MathUtil.toString(area / 1_000_000)} km²
                </span>
            </div>
            <div className="data-piece">
                <span className="name">Vertices: </span>
                <span className="value">
                    {MathUtil.toString(vertexCount)} vertices
                </span>
            </div>
        </div>
    );
}

export default EditedPolygonData;