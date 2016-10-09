var trainsCounter = 0
function Train(map, trainInfo) {
  this.id = trainsCounter++;
  this.map = map;
  map.append("<div id='train_" + this.id + "' class='train'></div>");
  this.element = map.find("#train_" + this.id);

  this.timetable = trainInfo.stations;
  // console.debug("Train created: ", timetable.length);
}

Train.prototype.findSegment = function(t) {
  console.log(t, this.timetable[0].time, this.timetable[this.timetable.length - 1].time)
  if (this.timetable[0].time > t) {
    return Number.NEGATIVE_INFINITY;
  } else if (this.timetable[this.timetable.length - 1].time <= t) {
    return Number.POSITIVE_INFINITY;
  }

  var l = 0, r = this.timetable.length;
  while (r - l > 1) {
    var m = Math.floor((r + l)/2);
    if (this.timetable[m].time >= t) {
      l = m;
    } else {
      r = m;
    }
  }

  if (l + 1 >= this.timetable.length) {
    return Number.POSITIVE_INFINITY;
  }
  console.log(t, " in ", this.timetable[l].time);
  return l;
};

Train.prototype.setTime = function(t) {
  var segmIndex = this.findSegment(t);
  if (segmIndex == Number.POSITIVE_INFINITY || segmIndex == Number.NEGATIVE_INFINITY) {
    this.element.hide();
    return;
  }

  this.element.show();
  var srcStationInfo = this.timetable[segmIndex];
  var dstStationInfo = this.timetable[segmIndex + 1];

  if (!dstStationInfo) {
    console.warn("time", t, srcStationInfo.time);
    return;
  }
  // console.log(this.timetable, segmIndex, srcStationInfo, dstStationInfo);
  var ratio = (dstStationInfo.time - t) / (dstStationInfo.time - srcStationInfo.time);
  var srcStation = getStationByName(srcStationInfo.station);
  var dstStation = getStationByName(dstStationInfo.station);

  if (!srcStation || !dstStation) {
    console.warn("no station: ", srcStationInfo.name, dstStationInfo.name);
  }
  var coords = [
    srcStation.coords[0]*ratio + dstStation.coords[0]*(1 - ratio),
    srcStation.coords[1]*ratio + dstStation.coords[1]*(1 - ratio)
  ];

  var perc = attlong2perc(coords);
  this.element.css("left", perc[0] + '%');
  this.element.css("top", perc[1] + '%');
};
