var GuySize = {"w": 10, "h": 10};

var images = {
  // "green": new Image("./img/ball_green.png"),
  // "red": new Image("./img/ball_red.png"),
};

function _getOrCreateGuyImageByType(type) {
  if (!images[type]) {
    images[type] = new Image();
    images[type].src = "./img/ball_" + type + ".png";
  }
  return images[type];
}

var GuysCounter = 0;
function Guy(type, station) {
  this.type = type;
  this.station = station;

  this.id = GuysCounter++;
  this.image = _getOrCreateGuyImageByType(this.type)

  this.position = {"x": 0, "y": 0}
  this.opacity = 1.0;
  this.visible = true;
}

Guy.prototype.move = function(x, y) {
  this.position = { "x": x, "y": y }
};

Guy.prototype.kill = function() {
  this.station._removeGuy(this);
};

Guy.prototype.repaint = function(ctx) {
  if (!this.visible) {
    return;
  }

  var savedAlpha = ctx.globalAlpha;
  ctx.globalAlpha = this.opacity;

  // console.debug("Repaint!", this.position.x, this.position.y);
  ctx.drawImage(this.image,
                this.position.x, this.position.y);

  ctx.globalAlpha = savedAlpha
}
