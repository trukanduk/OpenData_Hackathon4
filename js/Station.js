var inBasketOffset = [17, 7];
var outBasketOffset = [38, 30];
var jiff = 100;

var StationsCounter = 0;
function Station(map, name, coords, offset) {
  var self = this;

  self.name = name;
  self.id = StationsCounter++;
  self.coords = coords;
  self.offset = offset || [10, -25];
  // self.dataflow = [];

  map.append("<div id='pipka_" + self.id + "' class='pipka'></div>");
  self.element = map.find("#pipka_" + self.id);
  // console.log(self.element, self.element.append);

  var perc = attlong2perc(self.coords);
  self.percX = perc[0];
  self.percY = perc[1];

  self.element.css("top", "calc(" + self.percY + "% + (" + self.offset[1] + "px))");
  self.element.css("left", "calc(" + self.percX + "% + (" + self.offset[0] + "px))");

  self.inpIntensity = 0;
  self.outIntensity = 0;

  self.guys = {};

  var inpCounter = 0;
  var outpCounter = 0;
  var divider = 10; // const
  self.guysSpawner = setInterval(function() {
    if (self.inpIntensity > 0) {
      ++inpCounter;
      var spawningInpGuysNum = Math.floor((self.inpIntensity + inpCounter)/divider);
      if (Math.floor(self.inpIntensity/divider) != spawningInpGuysNum) {
        inpCounter = 0;
      }

      // console.log("Spawing " + spawningInpGuysNum + " guys..");
      for (var i = 0; i < spawningInpGuysNum; ++i) {
        var guy = new Guy("green", self);
        self.guys[guy.id] = guy;
        guy.element.hide();

        // guy.move(0, 0);
        self.moveInpGuyToBasket(guy);
      }
    }

    if (self.outpIntensity > 0) {
      ++outpCounter;
      var spawningOutpGuysNum = Math.floor((self.outpIntensity + outpCounter)/divider);
      if (Math.floor(self.outpIntensity/divider) != spawningOutpGuysNum) {
        outpCounter = 0;
      }

      // console.log("Spawing " + spawningOutpGuysNum + " guys..");
      for (var i = 0; i < spawningOutpGuysNum; ++i) {
        var guy = new Guy("red", self);
        self.guys[guy.id] = guy;
        guy.element.hide();

        // guy.move(0, 0);
        self.fadeInOutpGuy(guy);
      }
    }
  }, second/divider);
}

Station.prototype.moveInpGuyToBasket = function(guy) {
  var station = this;

  var dist = 40;
  var ticks = 0;
  // var totalTicks = Math.floor(Math.random()*60 + 40);
  var totalTicks = second/jiff;
  var radius = Math.max(40, Math.min(30 / Math.random(), 1000));
  radius *= (Math.random() > 0.5 ? +1 : -1);
  var totalAngle = dist/Math.abs(radius); // dist = angle*r => angle = dist/r
  // var totalAngle = (Math.random()*0.3 + 0.2) * 3.1416;

  // guy.move(x + inBasketOffset[0], y + inBasketOffset[1]);

  var intId = setInterval(function() {
    ticks++;
    var ratio = ticks / totalTicks;
    var angle = totalAngle * (1 - ratio);

    var x = Math.cos(angle)*radius - radius;
    var y = -Math.sin(angle)*Math.abs(radius);
    guy.move(x + inBasketOffset[0], y + inBasketOffset[1]);
    guy.element.show();
    guy.setOpacity(Math.min(1, ratio + 0.3));

    if (ticks >= totalTicks){
      clearInterval(intId);
      station.fadeOutInpGuy(guy, totalAngle*Math.abs(radius) / (totalTicks));
    }
  }, jiff);
}

Station.prototype.fadeOutInpGuy = function(guy) {
  // console.log("v=", velocity);

  var ticks = 0;
  var totalTicks = second/jiff;
  var yMoveDist = Math.random()*10 + 25;
  var xMoveDist = 0.3*yMoveDist*(Math.random() - 0.5);

  var intId = setInterval(function() {
    ticks++;
    var ratio = ticks / totalTicks;
    guy.setOpacity(1 - ratio);
    guy.move(inBasketOffset[0] + ratio*xMoveDist, inBasketOffset[1] + ratio*yMoveDist);

    if (ticks >= totalTicks) {
      clearInterval(intId);
      guy.setOpacity(0);
      guy.kill();
    }
  }, jiff);
}

Station.prototype.moveOutpGuyFromBasket = function(guy) {
  var station = this;

  var dist = 40;
  var ticks = 0;
  // var totalTicks = Math.floor(Math.random()*60 + 40);
  var totalTicks = second/jiff;
  var radius = Math.max(40, Math.min(30 / Math.random(), 1000));
  radius *= (Math.random() > 0.5 ? +1 : -1);
  console.log(radius)
  var totalAngle = dist/Math.abs(radius); // dist = angle*r => angle = dist/r
  // var totalAngle = (Math.random()*0.3 + 0.2) * 3.1416;

  // guy.move(x + inBasketOffset[0], y + inBasketOffset[1]);

  var intId = setInterval(function() {
    ticks++;
    var ratio = ticks / totalTicks;
    var angle = totalAngle * ratio;

    var x = Math.cos(angle)*radius - radius;
    var y = Math.sin(angle)*Math.abs(radius);
    guy.move(x + outBasketOffset[0], y + outBasketOffset[1]);
    guy.element.show();
    guy.setOpacity(Math.min(1, 1.3 - ratio));

    if (ticks >= totalTicks){
      clearInterval(intId);
      guy.kill();
    }
  }, jiff);
}

Station.prototype.fadeInOutpGuy = function(guy) {
  var station = this;

  var ticks = 0;
  var totalTicks = second/jiff;
  var yMoveDist = Math.random()*10 + 30;
  var xMoveDist = yMoveDist*0.3*(Math.random()-0.5);

  var zero = [guy.dx, guy.dy];
  var intId = setInterval(function() {
    guy.element.show();
    ticks++;
    var ratio = ticks / totalTicks;
    guy.setOpacity(ratio);
    guy.move(outBasketOffset[0] - (1 - ratio)*xMoveDist,
             outBasketOffset[1] - (1 - ratio)*yMoveDist);

    if (ticks >= totalTicks) {
      clearInterval(intId);
      guy.setOpacity(1);

      // console.error("wow!");
      station.moveOutpGuyFromBasket(guy);
    }
  }, jiff);
}

Station.prototype._removeGuy = function(guyOrGuyId) {
  var id = guyOrGuyId;
  if (guyOrGuyId instanceof Guy) {
    id = guyOrGuyId.id;
  }

  var guy = this.guys[id];
  delete this.guys[id];

  guy.element.remove();
}
