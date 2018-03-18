import React from 'react';

export default class WsWhiteboard extends React.Component {
    constructor(props) {
        super(props);

        this.clearHandler = this.clearHandler.bind(this);
        this.addPaletteHandlers = this.addPaletteHandlers.bind(this);

        this.state = {
            canvasWidth: this.props.width,
            canvasHeight: this.props.height,
            canvas: null,
            canvasContext : null,
            penColor: null,
            penWidth: 1,
            mouseClicked: false,
            x: 0,
            y: 0,
            statusMessage: 'No one is drawing.',
            user: {
                name: 'No one'
            }
        };
    }

    mouseDown(event) {
        const e = event;
        const currX = Math.floor(e.pageX - this.state.canvas.offsetLeft);
        const currY = Math.floor(e.pageY - this.state.canvas.offsetTop);

        this.setState({
            x: currX,
            y: currY,
            mouseClicked: true,
            statusMessage: `${this.state.user.name} is drawing.`
        }, () => {
            this.state.canvasContext.beginPath();
            this.state.canvasContext.moveTo(this.state.x, this.state.y);

            const data = JSON.stringify({
                type: 'move',
                x: this.state.x,
                y: this.state.y,
                color: {
                    r: this.state.penColor.r,
                    g: this.state.penColor.g,
                    b: this.state.penColor.b
                }
            });

            // socket emit
            this.props.socket.emit('push', data);
        });
    }

    mouseUp(event) {
        const e = event;
        this.setState({
            mouseClicked: false,
            x: 0,
            y: 0,
            statusMessage: 'No one is drawing.'
        })
    }

    mouseMove(event) {
        const e = event;

        event.preventDefault();

        if(this.state.mouseClicked) {
            const currX = Math.floor(e.pageX - this.state.canvas.offsetLeft);
            const currY = Math.floor(e.pageY - this.state.canvas.offsetTop);

            this.setState({
                x: currX,
                y: currY
            }, () => {
                this.state.canvasContext.lineTo(this.state.x, this.state.y);
                this.state.canvasContext.stroke();

                const data = JSON.stringify({
                    type: 'draw',
                    x: this.state.x,
                    y: this.state.y,
                    color: {
                        r: this.state.penColor.r,
                        g: this.state.penColor.g,
                        b: this.state.penColor.b
                    },
                    name: this.state.user.name
                });

                this.props.socket.emit('push', data);
            });
        }
    }

    clearHandler() {
        this.state.canvasContext.fillStyle = 'rgb(255, 255, 255)';
        this.state.canvasContext.fillRect(0, 0, this.state.canvasContext.width, this.state.canvasContext.height);

        this.props.socket.emit('clear', JSON.stringify({
            type: 'clear',
            x: 0,
            y: 0
        }));
    }

    makeColor() {
        const r = Math.round(Math.random() * 75 + 100);
        const g = Math.round(Math.random() * 100 + 100);
        const b = Math.round(Math.random() * 75 + 100);

        return {
            r: r,
            g: g,
            b: b
        };
    }

    setColor(color, callback) {
        this.setState({
            penColor: color
        }, () => {
            this.state.canvasContext.strokeStyle = this.getRgbCss(this.state.penColor);

            if(typeof callback !== 'undefined') {
                callback();
            }
        });
    }

    setPenWidth(width, callback) {
        this.setState({
            penWidth: width
        }, () => {
            this.state.canvasContext.lineWidth = this.state.penWidth;

            if(typeof callback !== 'undefined') {
                callback();
            }
        });
    }

    getRgbCss(color) {
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }

    componentDidMount() {
        this.setState({
            canvas: document.getElementById('mainCanvas')
        }, () => {
            this.state.canvas.width = this.state.canvasWidth;
            this.state.canvas.height = this.state.canvasHeight;

            this.setState({
                canvasContext: this.state.canvas.getContext('2d'),
                penColor: this.makeColor()
            }, () => {
                this.state.canvasContext.strokeStyle = this.getRgbCss(this.state.penColor);
                this.state.canvasContext.lineWidth = this.state.penWidth;
            });
        });

        this.props.socket.on('receive', (data) => {
            data = JSON.parse(data);

            const red = parseInt(data.color.r);
            const green = parseInt(data.color.g);
            const blue = parseInt(data.color.b);

            this.state.canvasContext.strokeStyle = this.getRgbCss({
                r: red,
                g: green,
                b: blue
            });

            if(data.type === 'move') {
                this.state.canvasContext.beginPath();
                this.state.canvasContext.moveTo(data.x, data.y);
            } else {
                this.state.canvasContext.lineTo(data.x, data.y);
                this.state.canvasContext.stroke();
            }
        });

        this.props.socket.on('clear', (data) => {
            this.state.canvasContext.fillStyle = 'rgb(255, 255, 255)';
            this.state.canvasContext.fillRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);

            this.state.canvasContext.beginPath();
            this.state.canvasContext.moveTo(0, 0);
        });
    }

    addPaletteHandlers(event) {
        const e = event;
        const color = e.target.dataset['color'];
        this.setPenWidth(1);
        switch(color) {
            case 'red':
                this.setColor({
                    r: 255,
                    g: 0,
                    b: 0
                });
                break;
            case 'orange':
                this.setColor({
                    r: 255,
                    g: 140,
                    b: 0
                });
                break;
            case 'yellow':
                this.setColor({
                    r: 255,
                    g: 255,
                    b: 0
                });
                break;
            case 'green':
                this.setColor({
                    r: 0,
                    g: 187,
                    b: 0
                });
                break;
            case 'blue':
                this.setColor({
                    r: 0,
                    g: 0,
                    b: 187
                });
                break;
            case 'purple':
                this.setColor({
                    r: 128,
                    g: 0,
                    b: 128
                });
                break;
            case 'black':
                this.setColor({
                    r: 0,
                    g: 0,
                    b: 0
                });
                break;
            case 'white':
                this.setColor({
                    r: 255,
                    g: 255,
                    b: 255
                });
                this.setPenWidth(8);
                break;
        }
    }

    render() {
        return (
            <div>
                <div className='grid'>
                    <div className='col-7'>
                        <h1>{this.state.statusMessage}</h1>
                    </div>
                </div>
                <div className='grid'>
                    <div className='col-3'>
                        <label>Name</label>
                    </div>
                    <div className='col-3'>
                        <input type='text' name='name' id='name' defaultValue='YOUR NAME' />
                    </div>
                </div>
                <div className='grid'>
                    <div className='col-7'>
                        <canvas id='mainCanvas' 
                            onMouseDown={this.mouseDown.bind(this)} 
                            onMouseUp={this.mouseUp.bind(this)} 
                            onMouseMove={this.mouseMove.bind(this)}>
                        </canvas>
                    </div>
                </div>
                <div className='grid'>
                    <div className='col-5'>
                        <div className="color" data-color="red" onClick={this.addPaletteHandlers}></div>
                        <div className="color" data-color="orange" onClick={this.addPaletteHandlers}></div>
                        <div className="color" data-color="yellow" onClick={this.addPaletteHandlers}></div>
                        <div className="color" data-color="green" onClick={this.addPaletteHandlers}></div>
                        <div className="color" data-color="blue" onClick={this.addPaletteHandlers}></div>
                        <div className="color" data-color="purple" onClick={this.addPaletteHandlers}></div>
                        <div className="color" data-color="black" onClick={this.addPaletteHandlers}></div>
                        <div className="color" data-color="white" onClick={this.addPaletteHandlers}></div>
                    </div>
                    <div className="col-3">
                        <button type="button" id="clear-button" onClick={this.clearHandler}>Clear Whiteboard</button>
                    </div>
                </div>
            </div>
        );

    }
}