# Pattern Matching

Destructure and handle data with Rust's most powerful feature.

## Basic Pattern Matching

Match against different patterns and extract values:

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn process_message(msg: Message) {
    match msg {
        Message::Quit => println!("Quit"),
        Message::Move { x, y } => println!("Move to ({}, {})", x, y),
        Message::Write(text) => println!("Text: {}", text),
        Message::ChangeColor(r, g, b) => println!("Color: ({}, {}, {})", r, g, b),
    }
}
```

## Destructuring Structs

Extract values from struct fields:

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let point = Point { x: 0, y: 7 };
    
    let Point { x, y } = point;
    println!("Point: ({}, {})", x, y);
    
    // or with match
    match point {
        Point { x: 0, y } => println!("On Y-axis at {}", y),
        Point { x, y: 0 } => println!("On X-axis at {}", x),
        Point { x, y } => println!("At ({}, {})", x, y),
    }
}
```

## Destructuring Tuples

Extract tuple elements:

```rust
let tup = (500, 6.4, 1);
let (x, y, z) = tup;
println!("{}, {}, {}", x, y, z);
```

## Destructuring Arrays

```rust
let arr = [1, 2, 3, 4, 5];
let [first, second, ..] = arr;  // rest pattern
println!("{}, {}", first, second);
```

## Match Guards

Add conditions to patterns:

```rust
let num = Some(4);

match num {
    Some(x) if x < 5 => println!("Less than 5: {}", x),
    Some(x) if x >= 5 => println!("Greater or equal to 5: {}", x),
    _ => println!("Not a number"),
}
```

## Ignoring Values

Use `_` to ignore parts of a pattern:

```rust
let point = (1, 2, 3);

// ignore middle value
let (x, _, z) = point;
println!("{}, {}", x, z);

// ignore remaining values
let slice = &[1, 2, 3, 4, 5];
if let [first, .., last] = slice {
    println!("First: {}, Last: {}", first, last);
}
```

## If Let Pattern

Match a single pattern without the exhaustiveness requirement:

```rust
let some_value = Some(3);

if let Some(x) = some_value {
    println!("Value is: {}", x);
} else {
    println!("No value");
}
```

Equivalent to:

```rust
match some_value {
    Some(x) => println!("Value is: {}", x),
    _ => println!("No value"),
}
```

## While Let Pattern

Loop while a pattern matches:

```rust
let mut stack = vec![1, 2, 3];

while let Some(top) = stack.pop() {
    println!("{}", top);  // prints 3, 2, 1
}
```

## Let Else Pattern

Destructure or else branch (requires `#![feature(let_else)]` or newer Rust):

```rust
let Some(x) = some_value else {
    println!("No value!");
    return;
};
println!("Value: {}", x);
```

## Range Patterns

Match against ranges:

```rust
let number = 7;

match number {
    1..=3 => println!("One to three"),
    4..=6 => println!("Four to six"),
    7..=9 => println!("Seven to nine"),
    _ => println!("Other"),
}
```

## Multiple Patterns

Match multiple patterns with the same behavior:

```rust
let x = 1;

match x {
    1 | 2 => println!("One or two"),
    3 | 4 => println!("Three or four"),
    _ => println!("Other"),
}
```

## Binding with `@`

Capture matched values while also testing a pattern:

```rust
enum Message {
    Hello { id: i32 },
}

let msg = Message::Hello { id: 5 };

match msg {
    Message::Hello { id: id_var @ 3..=7 } => {
        println!("ID in range: {}", id_var);
    }
    Message::Hello { id } => {
        println!("ID outside range: {}", id);
    }
}
```

## Practice

1. Create an enum with multiple variants and match against all of them
2. Destructure a struct in a match expression
3. Use a match guard to test conditions within patterns
4. Use `if let` to simplify a match with a single pattern
5. Destructure a tuple and ignore some values with `_`
6. Use a range pattern to match intervals

> "Pattern matching is pattern completion. The compiler ensures you handle every possibility."
