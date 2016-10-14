function World(canvas) {
  this.canvas = $(canvas);
  this.context = this.canvas.get(0).getContext("2d");
  this.tmpCanvas = document.createElement("canvas");
  this.tmpCanvas.width = this.canvas.width();
  this.tmpCanvas.height = this.canvas.height();

  this.stations = [];
  this._stationName2station = {};

  this.background = new Image();
  this.background.src = "./img/background.png";

  this.pipkas = new Image();
  this.pipkas.src = "./img/pipkas.png";

  this.time = 0;
  this.timerId = null;
}

World.prototype.addStation = function(station) {
  this.stations.push(station);
  this._stationName2station[station.name] = station;
};

World.prototype.getStationByName = function(name) {
  return this._stationName2station[name];
};

World.prototype.setTime = function(time) {
  this.time = time;
  for (var i = 0; i < this.stations.length; ++i) {
    var station = this.stations[i];
    var item = data_inout[time][station.name]
    if (!item) {
      console.warn("No station named " + station.name)
      continue;
    }

    station.inpIntensity = Math.ceil(Math.pow(item.in/2, 1/2));
    station.outpIntensity = Math.ceil(Math.pow(item.out/2, 1/2));
  }
}

World.prototype.runRenderTimer = function(interval) {
  this.stopRenderTimer()

  interval = interval || 100;
  var self = this;
  this.timerId = setInterval(function() { self.repaint(); }, interval);
}

World.prototype.stopRenderTimer = function() {
  if (this.timerId) {
    clearInterval(this.timerId);
    this.timerId = undefined;
  }
};

World.prototype.repaint = function() {
  var tmpContext = this.tmpCanvas.getContext("2d");
  tmpContext.drawImage(this.background, 0, 0, this.canvas.width(), this.canvas.height());
  // if (!this.draw12) {
  //   this.draw12 = true;
  // }

  for (var i = 0; i < this.stations.length; ++i) {
    this.stations[i].repaint(tmpContext);
  }

  tmpContext.drawImage(this.pipkas, 0, 0, this.canvas.width(), this.canvas.height());

  this.context.drawImage(this.tmpCanvas, 0, 0);
}
