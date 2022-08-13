import React, { useState } from 'react';
import Button from '../elements/Button';
import DraggableNumeric from '../elements/DraggableNumeric';
import { useDocumentContext } from '../logic/useDocumentContext';

/**
 * ValidProps:
 ** imageIndex — the index of the layout image in the document.
 */
function OverlayImagePanel (props) {
    const { imageIndex: index } = props;

    const {
        layoutImages,
        updateLayoutImageAt,
        removeLayoutImageAt
    } = useDocumentContext();

    const [loadedImage, setLoadedImage] = useState(null);

    const setPosVal = (point, axis, val) => {
        const newImage = structuredClone(layoutImages[index]);
        newImage[point][axis] = val;
        updateLayoutImageAt(index, newImage);
    }

    const setOpacity = (val) => {
        const newImage = structuredClone(layoutImages[index]);
        newImage.opacity = val;
        updateLayoutImageAt(index, newImage);
    }

    const evt_delete = (evt) => {
        removeLayoutImageAt(index);
    }

    return (
        <div className="overlay-image-panel">
            <div className="content">
                <div className="thumbnail-cell">
                    <img
                        id="test-thumbnail"
                        className="thumbnail"
                        src={`data:image/png;base64, ${layoutImages[index].base64}`}
                        alt=""
                    />
                </div>
                <div className="name-cell">
                    <span className="title">{layoutImages[index].name}</span>
                    <Button
                        className="delete-button"
                        size="small"
                        baseStyle="danger"
                        icon="delete"
                        iconStyle="g-outline"
                        title="Delete image"
                        onClick={evt_delete}
                    />
                </div>
                <div className="attr-cell-1 attr">
                    <DraggableNumeric
                        label="NE lat"
                        value={layoutImages[index].northEast.lat} 
                        setValue={(val) => setPosVal("northEast", "lat", val)}
                        min={-200}
                        max={200}
                        decimalPlaces={8}
                    />
                </div>
                <div className="attr-cell-2 attr">
                    <DraggableNumeric
                        label="NE lng"
                        value={layoutImages[index].northEast.lng} 
                        setValue={(val) => setPosVal("northEast", "lng", val)}
                        min={-200}
                        max={200}
                        decimalPlaces={8}
                    />
                </div>
                <div className="attr-cell-3 attr">
                    <DraggableNumeric
                        label="SW lat"
                        value={layoutImages[index].southWest.lat} 
                        setValue={(val) => setPosVal("southWest", "lat", val)}
                        min={-200}
                        max={200}
                        decimalPlaces={8}
                    />
                </div>
                <div className="attr-cell-4 attr">
                    <DraggableNumeric
                        label="SW lng"
                        value={layoutImages[index].southWest.lng} 
                        setValue={(val) => setPosVal("southWest", "lng", val)}
                        min={-200}
                        max={200}
                        decimalPlaces={8}
                    />
                </div>
                <div className="attr-cell-5 attr">
                    <DraggableNumeric
                        label="Opacity"
                        value={layoutImages[index].opacity} 
                        setValue={setOpacity}
                        min={0}
                        max={1}
                        decimalPlaces={4}
                        dragPerHundred={1}
                    />
                </div>
            </div>
        </div>
    );
}

export default OverlayImagePanel;