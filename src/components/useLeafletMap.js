import { useEffect, useState } from "react";
import { useDocumentContext } from "../logic/useDocumentContext";
import { useUIContext } from "../logic/useUIContext";
import { GeoJSON } from "react-leaflet";

const useLeafletMap = () => {
    const { featureEdited } = useUIContext();
    const { document } = useDocumentContext();

    const [$drawablePolygons, setDrawablePolygons] = useState([]);

    useEffect(() => {
        if (featureEdited === null) {
            const polys = getEnabledPolygons().map(p => <GeoJSON key={p.id} data={p} />);
            setDrawablePolygons(polys);
        }
    }, [document, featureEdited]);

    /**
     * Returns an array with the polygons in the document that are not disabled.
     */
    function getEnabledPolygons () {
        return document.features.polygons.filter(p => p.properties.leaflys?.disabled === undefined || !p.properties.leaflys.disabled);
    }

    return {
        $drawablePolygons,
        getEnabledPolygons,
    }
}

export default useLeafletMap;