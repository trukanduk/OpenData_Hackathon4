function RingBuffer(capacity) {
  capacity = capacity || 300;
  this.capacity = capacity;
  this.data = [];
  this.index = 0;
  this.size = 0;
}

RingBuffer.prototype.push = function(obj) {
  if (this.size >= this.capacity) {
    console.error("RingBuffer is full!");
    return;
  }

  this.size = (this.size + 1) % this.capacity;
  this.data[(this.index + this.size) % this.capacity] = obj;
};

RingBuffer.prototype.pop = function() {
  if (this.size == 0) {
    console.error("RingBuffer is empty!");
    return;
  }

  var obj = this.data[(this.index + this.size) % this.capacity];
  this.index = (this.index + 1) % this.capacity;
  return obj;
};

RingBuffer.prototype.get = function(index) {
  if (index < 0) {
    index = this.size + index + 1;
  }

  if (index < 0 || index > self.size) { self
    console.log("Invalid index for RingBuffer: got " + index + ", size is " + this.size);
  }

  return self.data[(this.index + index) % this.capacity];
};
