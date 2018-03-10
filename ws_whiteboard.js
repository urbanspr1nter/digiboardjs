var width = 640;
var height = 640;

function WsWhiteboard(socket) {
  this.penColor = null;
  this.penWidth = 1;
  this.socket = socket;

  this.canvas = document.getElementsByTagName('canvas')[0];
  this.canvas.width = width;
  this.canvas.height = height;

  this.context = this.canvas.getContext('2d');
  this.mouseClicked = false;
  this.x = 0;
  this.y = 0;

  var self = this;

  this.init(self);
}

WsWhiteboard.prototype.init = function(self) {
  self.penColor = this.makeColor();
  self.context.strokeStyle = this.getRgbCss(this.penColor);
  self.context.lineWidth = this.penWidth;

  self.canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();

    self.x = Math.floor(e.pageX - self.canvas.offsetLeft);
    self.y = Math.floor(e.pageY - self.canvas.offsetTop);

    self.mouseClicked = true;
    self.context.beginPath();
    self.context.moveTo(self.x, self.y);

    self.socket.emit('push', JSON.stringify({
      type: 'move',
      x: self.x,
      y: self.y,
      color: {
        r: self.penColor.r,
        g: self.penColor.g,
        b: self.penColor.b
      },
      name: $('#name').val()
    }));
  });

  self.canvas.addEventListener('mouseup', function(e) {
    e.preventDefault();

    self.mouseClicked = false;
    self.x = 0;
    self.y = 0;

    var h1 = document.getElementsByTagName('h1')[0];
    h1.innerHTML = 'No one is drawing.';
  });

  self.canvas.addEventListener('mousemove', function(e) {
    e.preventDefault();

    if(self.mouseClicked) {
      self.x = Math.floor(e.pageX - self.canvas.offsetLeft);
      self.y = Math.floor(e.pageY - self.canvas.offsetTop);

      self.context.lineTo(self.x, self.y);
      self.context.stroke();

      self.socket.emit('push', JSON.stringify({
        type: 'draw',
        x: self.x,
        y: self.y,
        color: {
          r: self.penColor.r,
          g: self.penColor.g,
          b: self.penColor.b
        },
        name: $('#name').val()
      }));
    }
  });

  self.socket.on('receive', function(data) {
    data = JSON.parse(data);
    if(parseInt(data.color.r) === 255
      && parseInt(data.color.g === 255)
      && parseInt(data.color.b === 255)) {
      self.setPenWidth(self, 8);
    } else {
      self.setPenWidth(self, 1);
    }

    self.context.strokeStyle = self.getRgbCss({
      r: data.color.r,
      g: data.color.g,
      b: data.color.b
    });
    if(data.type === 'move') {
      self.context.beginPath();
      self.context.moveTo(data.x, data.y);
    } else {
      self.context.lineTo(data.x, data.y);
      self.context.stroke();
    }

    var h1 = document.getElementsByTagName('h1')[0];
    h1.innerHTML = data.name + ' is drawing...';
  });

  self.socket.on('clear', function(data) {
    self.context.fillStyle = 'rgb(255, 255, 255)';
    self.context.fillRect(0, 0, width, height);

    self.context.beginPath();
    self.context.moveTo(0, 0);
  });

  var clearButton = document.getElementById('clear-button');
  clearButton.addEventListener('click', function() {
    self.context.fillStyle = 'rgb(255, 255, 255)';
    self.context.fillRect(0, 0, width, height);

    self.socket.emit('clear', JSON.stringify({
      type: 'clear',
      x: 0,
      y: 0
    }));
  });
};

WsWhiteboard.prototype.makeColor = function() {
  var r = Math.round(Math.random() * 75 + 100);
  var g = Math.round(Math.random() * 100 + 100);
  var b = Math.round(Math.random() * 75 + 100);

  return {
    r: r,
    g: g,
    b: b
  };
};

WsWhiteboard.prototype.setColor = function(self, color) {
  self.penColor = color;
};

WsWhiteboard.prototype.setPenWidth = function(self, width) {
  self.penWidth = width;
  self.context.lineWidth = self.penWidth;
};

WsWhiteboard.prototype.getRgbCss = function(color) {
  return 'rgb(' + color.r + ',' + color.g + ','  + color.b + ')'
};










