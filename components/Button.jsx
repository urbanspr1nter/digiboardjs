import React from 'react';

export default class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='digiboard_control-panel-container'>
                <button type="button" id="clear-button" onClick={this.props.onClick}>
                    {this.props.label}
                </button>
            </div>
        );
    }
}