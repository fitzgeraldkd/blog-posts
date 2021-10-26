---
title: Object References (Why ['this']!==['this'])
published: false
description: Exploring how JavaScript references arrays/objects when assigned to variables.
tags: javascript, webdev, beginners, programming
---

If you run `console.log(['this'] === ['this'])` in JavaScript, what would you expect to see? Well it would be perfectly rational to expect that `true` would be the result, but instead we see `false`. Let's take a look at a few tests:

```jsx
// Control Test
console.log('this' === 'this');
// => true

// Test 1
console.log(['this'] === ['this']);
// => false

// Test 2
const arr1 = ['this'];
const arr2 = ['this'];
console.log(arr1 === arr2);
// => false

// Test 3
const arr3 = ['this'];
const arr4 = arr3;
console.log(arr3 === arr4);
// => true
```

Our control test directly comparing two identical strings returns `true` as expected. The first two tests comparing seemingly identical arrays log `false`, but the third logs `true`. So what's really going on here? Let's take a look at how JavaScript assigns different data types to variables.

## Data Types

### Primitive

This potentially unexpected behavior will only occur for certain data types. In JavaScript, data can be classified as either primitive values or objects. [Primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) types include string, number, bigint, boolean, undefined, symbol, and null. When you assign a primitive type to a variable, the variable contains the value itself. This allows us to compare two primitive values and intuitively expect the correct response.

```jsx
console.log('this' === 'this');
// => true

console.log(1 === 1);
// => true

console.log(true === true);
// => true

const myString1 = 'this';
const myString2 = 'this';
console.log(myString1 === myString2);
// => true
```

### Objects

Non-primitive data types behave differently. These data types are classified as [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#objects) and include things like objects, arrays, and functions: data types that store a collection of values. Per MDN, regarding why functions and arrays are included in the category of *objects*:

> [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#normal_objects_and_functions) are regular objects with the additional capability of being *callable*.

<!-- -->

> [Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#indexed_collections_arrays_and_typed_arrays) are regular objects for which there is a particular relationship between integer-keyed properties and the `length` property.

When you assign these data types to a variable, the collection itself is not stored into the variable. Instead, a reference to the collection is stored. Let's take a closer look at one of the tests from earlier:

```jsx
const arr1 = ['this'];
const arr2 = ['this'];
console.log(arr1 === arr2);
// => false
```

In this example when `arr1` is assigned, the array `['this']` is stored somewhere in memory, and the variable itself is now the address of the memory location. When `arr2` is initialized, the array is stored into another location in memory (separate from the first array) and this second address is stored in the variable. Since `arr1` and `arr2` have two separate addresses to two separate arrays, comparing the two variables will result in `false`.

![Diagram showing why arr1 and arr2 are not equal](https://i.imgur.com/TmVK9r0.png)

Let's look at another example:

```jsx
const arr3 = ['this'];
const arr4 = arr3;
console.log(arr3 === arr4);
// => true
```

Here we are assigning `arr3` to `arr4`. By doing this, both variables are pointing to the same array in memory. Both variables have the address to the same array in memory, so comparing the two variables will result in `true`.

![Diagram showing why arr3 and arr4 are equal](https://i.imgur.com/g2ZSheO.png)

The examples here covered arrays, but this principle also applies to other non-primitive data types:

```jsx
const obj1 = {this: 'that'};
const obj2 = {this: 'that'};
console.log(obj1 === obj2);
// => false

const obj3 = {this: 'that'};
const obj4 = obj3;
console.log(obj3 === obj4);
// => true

const func1 = () => {};
const func2 = () => {};
console.log(func1 === func2);
// => false

const func3 = () => {};
const func4 = func3;
console.log(func3 === func4);
// => true
```

## Destructive Modifications

There's another important concept to understand that builds off of the fact that variables that store references to objects in memory. Since multiple variables can point to the same data in memory, it is important to exercise caution when making **destructive modifications**. Take a look at this example:

```jsx
const arr3 = ['this'];
const arr4 = arr3;
arr4[0] = 'that';
console.log(arr3);
// => ['that']
console.log(arr4);
// => ['that']
```

In the example both `arr3` and `arr4` are pointing to the same array in memory. When an element in `arr4` is changed, it changes the array in the memory. Since both variables point to the same array in memory, this change can be seen by logging `arr3` even though `arr3` was not directly modified. This example directly modified an element in the array, but it's important to note that **many array and object methods are destructive and modify the original object**. I recommend reviewing the documentation for [arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) and [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) if you need to know which methods are destructive.

If you need to assign an array or object to a new variable and make modifications without affecting the original, then you need to make a copy. If there's only a single level of data, a shallow copy will suffice and is easy to accomplish. With ES6, a shallow copy can be quickly created with the spread operator (`...`):

```jsx
const arr5 = [1, 2, 3];
const arr6 = [...arr5];
console.log(arr5 === arr6);
// => false
arr6[1] = 'b';
console.log(arr5);
// => [1, 2, 3]
console.log(arr6);
// => [1, 'b', 3]
```

Since we made a copy, `arr5` and `arr6` now point to two different arrays in memory. We can confirm this by comparing the two arrays and logging the result (`false`). Changes can be made to the array associated with one variable without affecting the other.

## Deep Objects

Objects with nested levels are a little more complex. We can still create a shallow copy to separate the top level elements, but anything nested inside will be kept as a reference to some object in memory. Here's a demonstration:

```jsx
const arr7 = [1, 2, [3, 4]];
const arr8 = [...arr7];
console.log(arr7 === arr8);
// => false
console.log(arr7[2] === arr8[2]);
// => true
arr8[1] = 'b';
arr8[2][1] = 'd';
console.log(arr7);
// => [1, 2, [3, 'd']]
console.log(arr8);
// => [1, 'b', [3, 'd']]
```

So we can demonstrate that `arr7` and `arr8` are pointing to two different arrays with the first `console.log`. However, when we compare the sub-array at index 2 in each array, we find that they are both pointing to the same array in memory. Mutating elements in the top level of one array will not affect the other, but mutating elements in the sub-array will affect **both**. This may be a little confusing, so here's a simple diagram:

![Diagram showing how arr7 and arr8 point to two separate arrays but have a shared sub-array](https://i.imgur.com/FJ5Nw2g.png)

Both variables point to a different array at the top level, but these two arrays still point to the same array for one of the elements. To completely separate our two variables we will need to make a deep copy. 

## Deep Copying

### With JSON

There are a few ways to make a deep copy of an object or array. One way is to use the JSON `stringify` and `parse` methods:

```jsx
const arr9 = [1, 2, [3, 4]];
const arr10 = JSON.parse(JSON.stringify(arr9));
console.log(arr9 === arr10);
// => false
console.log(arr9[2] === arr10[2]);
// => false
arr10[1] = 'b';
arr10[2][1] = 'd';
console.log(arr9);
// => [1, 2, [3, 4]]
console.log(arr10);
// => [1, 'b', [3, 'd']]
```

This works well enough in many situations, but it doesn't perfectly copy all data types. Any `undefined` values in the object will be replaced with `null`. In addition, any `Date` objects will be converted to a string representation. So the copied array will be completely independent of the original, but it may not be an *exact* copy.

```jsx
// undefined values are replaced with null
console.log(JSON.parse(JSON.stringify([undefined])));
// => [null]
```

```jsx
// Date objects are replaced with the string representation
const myDate = new Date();
console.log(typeof myDate);
// => object
const myDateCopy = JSON.parse(JSON.stringify(myDate));
console.log(typeof myDateCopy);
// => string
```

### With Libraries

Some JavaScript libraries provide methods on creating deep copies. One example of this would be the [lodash `cloneDeep` method](https://lodash.com/docs/4.17.15#cloneDeep). If you're using a library that has a method like this, check the documentation to ensure it works the way you need it to.

### With Recursion

You can build your own function to make a deep copy as well! Here's a recursive function I've written to do this:

```jsx
function deepCloner(target) {
  if (Array.isArray(target)) {
    return target.map(deepCloner);
  } else if (target instanceof Date) {
    return new Date(target);
  } else if (typeof target === 'object' && target !== null) {
    const newObj = {};
    for (const key in target) {
      newObj[key] = deepCloner(target[key])
    }
    return newObj;
  }
  return target;
}
```

To explain what it's doing:

1. If the input is an array, iterate through the array with the `map` method, pass each element into the `deepCloner` function recursively, and return a new array.
1. If the input is a date object, create a copy of the date object with `new Date()`.
1. If the input is an object (but not the value `null`), iterate through the key/value pairs and pass the values recursively into the `deepCloner` function.
1. If the input does not meet any of the above criteria, return the input itself without modification.

I believe this function should be suitable for most situations, but there could be other edge cases that I don't have accounted for yet. One such situation I can think of is if a function reference is stored in the original object. The deep copy will still reference the same function in memory, though I don't foresee this being an issue. Leave a comment if you can think of any data types that this may not cover! I've also included a Replit at the bottom of this post that shows this function in action.

## Conclusion

The way objects are referenced in variables may not be intuitive for newcomers to JavaScript. The first time I noticed that changing an element in an array associated with one variable could affect other variables I was completely dumbfounded. Without knowing what JavaScript does behind the scenes with objects, it's difficult to get a grasp on why some of these behaviors occur. Now that I have a better understanding of why this happens, it's much easier for me to write code to avoid this from being an issue. Hopefully this helps you too! *Thanks for reading!*

{% replit @fitzgeraldkd/DeepClonerDemo %}