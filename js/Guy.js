var GuysCounter = 0;
function Guy(type, station) {
  var self = this;

  self.type = type;
  self.station = station;

  self.id = GuysCounter++;
  station.element.append("<div id='guy_" + self.id + "' class='guy guy-" + self.type + "'></div>")
  self.element = station.element.find("#guy_" + self.id);

  self.alive = true;
}

Guy.prototype.move = function(x, y) {
  this.dx = x;
  this.dy = y;

  this.element.css("left", this.dx + "px");
  this.element.css("top", this.dy + "px");
};

Guy.prototype.setOpacity = function(value) {
  this.element.css("opacity", value);
};

Guy.prototype.kill = function() {
  this.alive = false;
  this.station._removeGuy(this);
};
