# Functions

Functions are the building blocks of organized Rust code.

## Defining Functions

Functions are declared with `fn`:

```rust
fn greet() {
    println!("Hello, Rustacean!");
}

fn main() {
    greet();  // call the function
}
```

## Parameters

Functions can accept parameters:

```rust
fn add(a: i32, b: i32) {
    println!("Sum is: {}", a + b);
}

fn main() {
    add(5, 3);
}
```

## Return Values

Functions can return values using `->` syntax:

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b  // no semicolon! This is an expression
}

fn main() {
    let result = add(5, 3);
    println!("Result: {}", result);
}
```

> "In Rust, the last expression in a function is its return value. Expressions return values; statements do not."

### Statements vs. Expressions

Statements end with semicolons and return nothing:

```rust
let x = (let y = 6);  // ERROR! let y = 6 is a statement
```

Expressions do not end with semicolons and return a value:

```rust
let y = {
    let x = 3;
    x + 1  // returns 4, no semicolon!
};
```

## Multiple Parameters and Return Types

```rust
fn calculate(x: i32, y: i32) -> (i32, i32) {
    (x + y, x * y)
}

fn main() {
    let (sum, product) = calculate(5, 3);
    println!("Sum: {}, Product: {}", sum, product);
}
```

## Functions with References

Pass references to avoid moving ownership:

```rust
fn len_of_string(s: &String) -> usize {
    s.len()
}

fn main() {
    let text = String::from("Rust");
    let length = len_of_string(&text);
    println!("Length: {}", length);
    println!("Text: {}", text);  // still valid!
}
```

## Mutable References in Functions

```rust
fn append_exclamation(s: &mut String) {
    s.push_str("!");
}

fn main() {
    let mut msg = String::from("Hello");
    append_exclamation(&mut msg);
    println!("{}", msg);  // "Hello!"
}
```

## Early Returns

Use `return` to exit early:

```rust
fn check_age(age: u32) -> &'static str {
    if age < 18 {
        return "Too young";
    }
    "Adult"
}
```

## Never Type

Functions that never return use `!`:

```rust
fn panic_forever() -> ! {
    panic!("This function never returns");
}
```

## Practice

1. Write a function that takes two `i32` parameters and returns their difference
2. Write a function that takes a mutable string reference and modifies it
3. Write a function that takes two integers and returns a tuple of (sum, difference)
4. Create a function that returns early based on a condition
5. Call your functions from main and test them

> "Clear function signatures are documentation. Make your intent evident through types."
