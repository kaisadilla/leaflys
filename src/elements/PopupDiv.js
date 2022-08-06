import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * A div that contains the necessary logic to detect when the user clicks outside of it.
 * Valid props:
 ** onClickOutside — a function to be called when the component detects a click outside.
 ** className — the class(es) of the component.
 */
export default class PopupDiv extends Component {
    constructor (props) {
        super(props);

        this.wrapperRef = React.createRef();
        //this.setWrapperRef = this.setWrapperRef.bind(this);
        this.onClickOutside = this.onClickOutside.bind(this);
    }

    componentDidMount () {
        document.addEventListener("mousedown", this.onClickOutside);
    }

    componentWillUnmount () {
        document.removeEventListener("mousedown", this.onClickOutside);
    }

    onClickOutside (e) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(e.target)) {
            this.props.onClickOutside();
        }
    }

    render () {
        return <div className={this.props.className ?? ""} ref={this.wrapperRef}>{this.props.children}</div>
    }
}

PopupDiv.propTypes = {
    children: PropTypes.element.isRequired,
};