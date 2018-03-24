import React from 'react';

export default class PenBoard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='digiboard_control-panel-container'>
                <div className='color' data-color='red' onClick={this.props.onClick}></div>
                <div className='color' data-color='orange' onClick={this.props.onClick}></div>
                <div className='color' data-color='yellow' onClick={this.props.onClick}></div>
                <div className='color' data-color='green' onClick={this.props.onClick}></div>
                <div className='color' data-color='blue' onClick={this.props.onClick}></div>
                <div className='color' data-color='purple' onClick={this.props.onClick}></div>
                <div className='color' data-color='black' onClick={this.props.onClick}></div>
                <div className='color' data-color='white' onClick={this.props.onClick}></div>
            </div>
        );
    }
}