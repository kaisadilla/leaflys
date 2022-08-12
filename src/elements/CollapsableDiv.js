import React, { useEffect, useRef, useState } from 'react';

// https://codepen.io/aluis92/pen/gKYdmb

function CollapsableDiv (props) {
    const { children, isOpen } = props;

    const [childHeight, setChildHeight] = useState();
    let content = useRef();

    const className = props.innerClassName ?? "";

    useEffect(() => {
        const pxChildHeight = content.clientHeight;
        //const childHeight = `${pxChildHeight / 16}rem`;
        const childHeight = `${pxChildHeight}px`;

        setChildHeight(childHeight);
    }, [children]);

    return (
        <div className={`collapsable-div ${props.className}`} style={{maxHeight: isOpen ? childHeight : 0}}>
            <div ref={c => content = c} className={className}>{children}</div>
        </div>
    );
}

export default CollapsableDiv;