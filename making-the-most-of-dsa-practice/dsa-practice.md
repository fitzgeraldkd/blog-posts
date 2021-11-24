# Making the Most of DSA Practice

The words "data structures and algorithms" can bring up certain feelings in many engineers. Practicing these skills can be especially daunting for newer developers looking for their first role. While I am also facing this same intimidation, I've been reframing it to make it a more enjoyable experience.

So instead of asking:

> How can I get through this practice as quickly as possible?

I've been asking myself:

> **How can I make the most of this practice?**

After changing the way I view this practice, I've noticed some great benefits. Not only am I more excited to work on these tasks, but I'm also using this as an opportunity to build up other skills that will help me down the line. I'll be graduating from Flatiron School's software engineering course in a few weeks, so I'm doing what I can to set myself up for success as I prepare for my first career in this field!

*Outline:*
- [My Goals](#my-goals)
- [My Process](#my-process)
    - [Writing Tests](#writing-tests)
    - [Writing Code](#writing-code)
    - [Refactoring](#refactoring)
- [My Takeaways](#my-takeaways)
    - [Time and Space Complexity](#time-and-space-complexity)
    - [Test-Driven Development](#test-driven-development)
    - [General Language Familiarity](#general-language-familiarity)
- [Conclusion](#conclusion)
- [Resources](#resources)

## My Goals

In order to get the most out of my practice, I needed to decide what I wanted to do. 

- First I decided that JavaScript would be my language of choice for this practice as it's the language I think I'll be most successful with. Down the line I could always translate to another language if I want to practice get familiar with another language's syntax.
- Next I decided that I want to **create my own classes** for things like stacks, trees, linked lists, etc. (data structures not available in vanilla JS).
- Last, and possibly the most important, I decided to write my own tests using a **testing framework**. 

When practicing with a service like LeetCode or HackerRank, the classes and tests are usually given to you. While it would be quicker to rely on those, writing my own classes and tests gives me a better understanding of how data structures work. 

## My Process

With decisions made, I came up with a process on how I tackle an algorithm problem:

- *If a new class is needed to represent a data structure I don't have:*
    1. Write tests for the class and its methods
    1. Write the code for the class and its methods, testing along the way
    1. Refactor until satisfied with the code
    1. Think of new edge cases, write additional tests as needed, and repeat!
<!-- -->
- *For the algorithm:*
    1. Write tests for the algorithm
    1. Write code to solve the algorithm, testing along the way
    1. Refactor until satisfied with the code
    1. Think of new edge cases, write additional tests as needed, and repeat!

Notice how both lists are nearly identical? That wasn't an accident, and we'll look a little bit into where the steps came from!

### Writing Tests

First you need to determine what needs to be tested. If you're building a class, which methods does it need to have? If you're writing an algorithm, what are some different test cases that you need to anticipate? If you're working on a task assigned to you, read the deliverables **carefully**. Make sure you have a solid understanding of what is expected before you write anything.

Next, what are the expected inputs and outputs? For example, say we are building a Stack class. When we run the `pop` method there are two things that should happen:

1. The top element should be removed from the stack
1. The value of the top element should be returned

Once you know what your code is expected to do, you can start writing tests. The tests will fail for now since none of the code has been written yet, but that's part of the process! Here's what those tests could look like:

```jsx
describe('Can pop from Stack', () => {
  test('Pop removes the top item from the stack', () => {
    const stackToPop = new Stack('foo');
    stackToPop.push('bar');

    // verify before popping: stackToPop.top.value === 'bar'
    expect(stackToPop.top.value).toBe('bar');
    stackToPop.pop();

    // verify after popping: stackToPop.top.value === 'foo'
    expect(stackToPop.top.value).toBe('foo');
  });
  test('Pop returns the value of the returned item', () => {
    const stackToPop = new Stack(42);

    // verify: stackToPop.pop() === 42
    expect(stackToPop.pop()).toBe(42);
  });
});
```

> Note: I used [Jest](https://jestjs.io/) as my testing framework, though there are many options out there and the process should be similar regardless.

One of my favorite things about using a test framework is that tests can be automatically re-run every time the files are saved. As I'm coding, I keep an eye on the terminal in case any changes I made have unexpected results (good or bad).

### Writing Code

The time it takes to write tests can give you some time to think about the task at hand and ponder possible solutions. By the time I finish writing tests I typically have an idea of how to start my code, but if not I take more time to think on it. For complex problems, either drawing diagrams or sketching out notes can help a lot too! If the tests can be tackled piecemeal, focus on one task at a time to get closer to your end goal.

Let's say I'm working on the `pop` method of the stack class that we wrote tests for above. This method has two separate tests it needs to pass. For the first test we need to remove the top item of the stack, so let's start there: 

```jsx
class Stack {
  /* ... */

  pop() {
    this.top = this.top.next;
  }

  /* ... */
}
```
<figcaption>The pop method will now pass the first test</figcaption>

The code above replaces the top item with the next item in the stack. That's all that's needed to remove the top item so we've passed the first test! To pass the next test we need to return the value of the top item, so we just need to add a couple more lines to the method we just started:

```jsx
class Stack {
  /* ... */

  pop() {
    const poppedItem = this.top.value;
    this.top = this.top.next;
    return poppedItem
  }

  /* ... */
}
```
<figcaption>The pop method will now pass both tests</figcaption>

After I have working code, I will take a closer look the time and space complexity. While I try to be mindful of this throughout the process, sometimes it's more important to get the code functional first before optimizing it. That's where refactoring comes in!

### Refactoring

After I get my code to work, I take a second look at my process and look for improvements. Are there variables I've assigned that are unnecessary? Is my time complexity reasonable for the task? Are there any **edge cases** that I haven't considered? Refactoring gets easier with practice, and sometimes the improvements may not be obvious right away. If you're not on a time crunch, this may be a good opportunity to step away from the code for a minute!

One important thing to keep in mind when optimizing your code is that it is very rare for there to be a single optimal case. For example, below is a table summarizing a couple ways to optimize a simple algorithm that checks if duplicate characters exist in a string:

|             | Time Complexity | Space Complexity |
|:-----------:|:---------------:|:----------------:|
| Optimizing Time | `O(n)` | `O(n)` |
| Optimizing Space | `O(n^2)`* | `O(1)` |
<figcaption>* Could possibly be reduced to O(n log n) if the string could be sorted in place without splitting into an array</figcaption>

There are often trade-offs between optimizing time or space complexity. The goal should be to keep both at a minimum wherever possible, but sometimes decisions need to be made on which is the priority. When I'm practicing, I will sometimes solve an algorithm multiple times trying to optimize different aspects. Luckily the same tests can be used for both solutions!

## My Takeaways

### Time and Space Complexity

This is probably the most obvious skill that is developed from these exercises. Writing code that works is easy; writing code that works *efficiently* is much more challenging. Starting with a brute-force algorithm will get the job done, but **developing that awareness for when things feel inefficient is crucial**. With more practice I find myself being able to recognize what the time and space complexities of algorithms are much easier, and also possible routes to improve them.

### Test-Driven Development

Before starting my practice here I had very little experience writing tests. I know test-driven development is common and provides a lot of benefits, so I was looking for opportunities to get some exposure to working with tests. The processes I described earlier for writing a data structure class or an algorithm is taken from the **red, green, refactor** process that guides test-driven development:

1. Red: write tests (no code has been written yet, so these tests should fail)
1. Green: write code to get the tests to pass
1. Refactor: improve/optimize the code you've written

Refactoring isn't necessarily the end of the process. Sometimes after the code is optimized for the tests already in place, more tests should be added for any additional edge cases. Or maybe there's additional features that can be implemented. That's why this process is typically shown as a cycle:

![Red, Green, Refactor process](https://i.imgur.com/5BxpMxZ.jpg)

### General Language Familiarity

Of course writing code of any kind will help you get more familiar with the language! With the process I've set for myself, I find myself noticably improving in these areas (among others):

- Creating classes
- Writing tests
- Using built-in methods for strings, numbers, arrays, objects, etc.

## Conclusion



What else do you do to make the most out of this practice? 

*Thanks for reading!*

## Resources

- [Big O Cheat Sheet](https://www.bigocheatsheet.com/)
- [Test-Driven Development](https://www.agilealliance.org/glossary/tdd)