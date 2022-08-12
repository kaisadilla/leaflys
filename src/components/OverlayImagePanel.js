import React, { useState } from 'react';
import Button from '../elements/Button';

function OverlayImagePanel (props) {
    const [loadedImage, setLoadedImage] = useState(null);

    if (loadedImage === null) {
        //return (
        //    <div className="overlay-image-panel">
        //        <Button baseStyle="success" label="Load image" />
        //    </div>
        //)
    }

    return (
        <div className="overlay-image-panel">
            <div className="content">
                <img className="thumbnail" src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg" alt="" />
            </div>
        </div>
    );
}

export default OverlayImagePanel;