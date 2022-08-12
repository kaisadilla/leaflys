import React, { useState } from 'react';
import CollapsableDiv from './CollapsableDiv';

/**
 * Valid props
 * header — text to show in the header of the block.
 * headerClass — a class for the container of header.
 */
function CollapsableBlock (props) {
    const [isOpen, setCollapsed] = useState(false);

    const headerClass = props.headerClass ?? "";
    const collapsedClass = isOpen ? "expanded" : "collapsed";

    return (
        <div className={`collapsable-block ${collapsedClass}`}>
            <div
                className={`collapsable-block-header ${headerClass}`}
                onClick={() => setCollapsed(!isOpen)}
            >
                <span className="header-text">{props.header}</span>
                <span className="collapse-button material-icons">expand_more</span>
            </div>
            <CollapsableDiv className="collapsable-block-body" innerClassName={props.className} isOpen={isOpen}>
                {props.children}
            </CollapsableDiv>
        </div>
    );
}

export default CollapsableBlock;