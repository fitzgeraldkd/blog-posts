class StackNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Stack {
  constructor(value) {
    this.top = value === undefined ? null : new StackNode(value);
  }

  pop() {
    const poppedItem = this.top.value;
    this.top = this.top.next;
    return poppedItem;
  }

  push(item) {
    const newTop = new StackNode(item);
    newTop.next = this.top;
    this.top = newTop;
  }

  peek() {
    return this.top.value;
  }

  isEmpty() {
    return this.top === null;
  }
}

// export the class so the test file can access it
module.exports = { Stack };