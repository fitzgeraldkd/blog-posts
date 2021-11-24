// import the Stack class
const { Stack } = require('./Stack.js');

describe('Stack class', () => {

  describe('Can instantiate a Stack', () => {
    test('Can instantiate an empty stack', () => {
      const emptyStack = new Stack();
      expect(emptyStack.top).toBe(null);
    });

    test ('Can instantiate a stack with a node', () => {
      const stackWithNode = new Stack(5);
      expect(stackWithNode.top.value).toBe(5);
    });
  });

  describe('Can pop from Stack', () => {
    test('Pop removes the top item from the stack', () => {
      const stackToPop = new Stack('foo');
      stackToPop.push('bar');
      expect(stackToPop.top.value).toBe('bar');
      stackToPop.pop();
      expect(stackToPop.top.value).toBe('foo');
    });

    test('Pop returns the value of the returned item', () => {
      const stackToPop = new Stack(42);
      expect(stackToPop.pop()).toBe(42);
    });
  });

  describe('Can push items into stack', () => {
    test ('The value of the stack\'s top changes after push', () => {
      const stackToPush = new Stack('foo');
      expect(stackToPush.top.value).toBe('foo');
      stackToPush.push('bar');
      expect(stackToPush.top.value).toBe('bar');
    });

    test('The new top item has its \'next\' property point to the original top', () => {
      const stackToPush = new Stack('foo');
      const originalTop = stackToPush.top;
      stackToPush.push('bar');
      expect(stackToPush.top.next).toBe(originalTop);
    })
  });

  describe('Can peek at top item of stack', () => {
    test ('Returns the value of the top item', () => {
      const stackToPeek = new Stack(42);
      expect(stackToPeek.peek()).toBe(42);
    });
  });

  describe('Can check if stack is empty', () => {
    test('Return true if the stack is empty', () => {
      const emptyStack = new Stack();
      expect(emptyStack.isEmpty()).toBe(true);
    });

    test('Return false if the stack is not empty', () => {
      const stackWithValue = new Stack(1);
      expect(stackWithValue.isEmpty()).toBe(false);
    });
  })
});