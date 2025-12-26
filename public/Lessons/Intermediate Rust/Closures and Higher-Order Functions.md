# Closures and Higher-Order Functions

## Introduction to Closures

Closures are anonymous functions that can capture variables from their surrounding scope. They're a powerful feature of Rust that enables functional programming patterns.

```rust
let add_one = |x: i32| -> i32 { x + 1 };
println!("{}", add_one(5)); // Prints: 6
```

### What Makes Closures Special?

Unlike regular functions, closures can:
- Capture variables from their environment
- Have inferred parameter and return types
- Use shorthand syntax for single expressions

## Closure Syntax

### Type Annotations (Optional)

```rust
// With type annotations
let add = |x: i32, y: i32| -> i32 { x + y };

// Without type annotations (inferred)
let add = |x, y| x + y;

// Single expression (no braces needed)
let square = |x| x * x;
```

### Capturing Variables

Closures can capture variables from their environment in three ways:

#### 1. By Reference (`Fn`)

```rust
let value = 5;
let add_value = |x| x + value; // Borrows value

println!("{}", add_value(10)); // Prints: 15
println!("{}", value);         // value is still accessible
```

#### 2. By Mutable Reference (`FnMut`)

```rust
let mut counter = 0;
let mut increment = || {
    counter += 1;
    counter
};

println!("{}", increment()); // Prints: 1
println!("{}", increment()); // Prints: 2
// println!("{}", counter);   // Error! counter is mutably borrowed
```

#### 3. By Value (`FnOnce`)

```rust
let value = String::from("hello");
let consume = || {
    println!("{}", value); // Takes ownership
};

consume(); // OK
// consume(); // Error! value was moved
// println!("{}", value); // Error! value was consumed
```

### Move Closures

Use `move` to force ownership transfer:

```rust
let value = vec![1, 2, 3];
let closure = move || {
    println!("{:?}", value); // Takes ownership
};

closure();
// println!("{:?}", value); // Error! value was moved
```

## Higher-Order Functions

Functions that take closures as parameters or return them are called higher-order functions.

### Functions That Accept Closures

```rust
fn apply<F>(closure: F, x: i32) -> i32
where
    F: Fn(i32) -> i32,
{
    closure(x)
}

fn main() {
    let square = |x| x * x;
    println!("{}", apply(square, 5)); // Prints: 25
}
```

### Trait Bounds for Closures

Rust provides three traits for closures:

- `Fn` - Borrows variables immutably, can be called multiple times
- `FnMut` - Borrows variables mutably, can be called multiple times
- `FnOnce` - Takes ownership, can only be called once

```rust
fn execute<F: Fn()>(closure: F) {
    closure();
    closure(); // Can call multiple times
}

fn execute_mut<F: FnMut(i32)>(mut closure: F) {
    closure(1);
    closure(2); // Can call multiple times with mutation
}

fn execute_once<F: FnOnce()>(closure: F) {
    closure();
    // closure(); // Error! Can only call once
}
```

## Working with Iterators

Closures shine when working with iterators:

### Map

Transform each element:

```rust
let numbers = vec![1, 2, 3, 4, 5];
let doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect();
println!("{:?}", doubled); // [2, 4, 6, 8, 10]
```

### Filter

Select elements that match a condition:

```rust
let numbers = vec![1, 2, 3, 4, 5];
let evens: Vec<i32> = numbers.iter().filter(|x| *x % 2 == 0).collect();
println!("{:?}", evens); // [2, 4]
```

### Fold

Accumulate a single value:

```rust
let numbers = vec![1, 2, 3, 4, 5];
let sum = numbers.iter().fold(0, |acc, x| acc + x);
println!("{}", sum); // 15
```

### Chain

Combine multiple operations:

```rust
let numbers = vec![1, 2, 3, 4, 5];
let result: Vec<i32> = numbers
    .iter()
    .filter(|x| x % 2 == 0)
    .map(|x| x * x)
    .collect();
println!("{:?}", result); // [4, 16]
```

## Returning Closures

You can return closures from functions, but you need to use trait objects or `impl`:

### Using `impl Trait`

```rust
fn make_adder(x: i32) -> impl Fn(i32) -> i32 {
    move |y| x + y
}

fn main() {
    let add_five = make_adder(5);
    println!("{}", add_five(10)); // Prints: 15
}
```

### Using Trait Objects

```rust
fn make_operation(op: &str) -> Box<dyn Fn(i32, i32) -> i32> {
    match op {
        "add" => Box::new(|x, y| x + y),
        "multiply" => Box::new(|x, y| x * y),
        _ => Box::new(|x, y| x - y),
    }
}

fn main() {
    let add = make_operation("add");
    println!("{}", add(5, 3)); // Prints: 8
}
```

## Practical Example: Function Composition

```rust
fn compose<F, G, A, B, C>(f: F, g: G) -> impl Fn(A) -> C
where
    F: Fn(A) -> B,
    G: Fn(B) -> C,
{
    move |x| g(f(x))
}

fn main() {
    let add_one = |x| x + 1;
    let double = |x| x * 2;
    
    let composed = compose(add_one, double);
    println!("{}", composed(5)); // (5 + 1) * 2 = 12
}
```

## Best Practices

1. **Use closures for short, focused operations** - Keep them simple and readable
2. **Let the compiler infer types** - Only add annotations when needed
3. **Use `move` when passing to threads** - Ensures the closure owns its data
4. **Chain iterator methods** - More readable than nested loops
5. **Consider trait bounds** - Be explicit about what your functions need

## Closures and Higher-Order Functions Summary

Closures are the Rustacean's tool for functional programming. They capture their environment, transform data through iterators, and enable elegant, composable code. Master them, and you unlock the true power of Rust's expressive type system.

The higher-order function is not a stranger to Rust—it's a citizen of the first class, welcome in any type signature.
