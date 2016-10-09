function World(canvas) {
  this.canvas = $(canvas);
  this.ctx = this.canvas.getContext("2d");

  this.stations = [];
  this.backround = new Image("./Белорусское-.png");
}

World.prototype.repaint = function() {
  for (var i = 0; i < this.stations.length; ++i) {
    stations[i].repaint(this.ctx);
  }
};
