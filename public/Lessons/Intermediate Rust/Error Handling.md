# Error Handling

Embrace Rust's philosophy: errors are not exceptional, they are expected.

## The Result Type

Most fallible operations return `Result<T, E>`:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

### Unwrap

Extract the value or panic:

```rust
let file = std::fs::File::open("hello.txt").unwrap();
```

> Warning: `unwrap()` will panic if the Result is an Err. Use only when you're certain it will succeed or panic is acceptable.

### Expect

Unwrap with a custom panic message:

```rust
let file = std::fs::File::open("hello.txt")
    .expect("Failed to open file");
```

### Is Ok / Is Err

Check without unwrapping:

```rust
let result = std::fs::File::open("hello.txt");

if result.is_ok() {
    println!("File opened successfully");
}

if result.is_err() {
    println!("Failed to open file");
}
```

## Match on Result

Handle both cases explicitly:

```rust
let result = std::fs::File::open("hello.txt");

match result {
    Ok(file) => println!("File opened"),
    Err(error) => println!("Error: {}", error),
}
```

## Propagating Errors with `?`

The `?` operator returns early if an error occurs:

```rust
fn read_file(path: &str) -> Result<String, std::io::Error> {
    let mut file = std::fs::File::open(path)?;
    let mut contents = String::new();
    std::io::Read::read_to_string(&mut file, &mut contents)?;
    Ok(contents)
}
```

Instead of:

```rust
fn read_file(path: &str) -> Result<String, std::io::Error> {
    let mut file = match std::fs::File::open(path) {
        Ok(f) => f,
        Err(e) => return Err(e),
    };
    let mut contents = String::new();
    match std::io::Read::read_to_string(&mut file, &mut contents) {
        Ok(_) => {},
        Err(e) => return Err(e),
    }
    Ok(contents)
}
```

> "The `?` operator makes error handling concise without losing control. Use it liberally."

## The Option Type

For values that may or may not exist:

```rust
enum Option<T> {
    Some(T),
    None,
}
```

### Using Option

```rust
fn divide(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}

match divide(10, 2) {
    Some(result) => println!("Result: {}", result),
    None => println!("Cannot divide by zero"),
}
```

### Option Methods

```rust
let value = Some(42);

// Map transforms the value inside
let doubled = value.map(|x| x * 2);  // Some(84)

// And_then chains operations that return Option
let result = value.and_then(|x| if x > 40 { Some(x) } else { None });

// Or_else provides a default
let fallback = None.or_else(|| Some(0));

// Unwrap_or provides a default without panicking
let default = None.unwrap_or(0);  // 0
```

## Custom Error Types

Define your own error types:

```rust
use std::fmt;

#[derive(Debug)]
enum CustomError {
    FileNotFound,
    ParseError,
}

impl fmt::Display for CustomError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            CustomError::FileNotFound => write!(f, "File not found"),
            CustomError::ParseError => write!(f, "Parse error"),
        }
    }
}

impl std::error::Error for CustomError {}

fn might_fail() -> Result<i32, CustomError> {
    Err(CustomError::FileNotFound)
}
```

## Converting Between Error Types

Use `.map_err()` to convert errors:

```rust
fn parse_number(s: &str) -> Result<i32, CustomError> {
    s.parse::<i32>()
        .map_err(|_| CustomError::ParseError)
}
```

Or use the `?` operator with `From`:

```rust
impl From<std::num::ParseIntError> for CustomError {
    fn from(_: std::num::ParseIntError) -> Self {
        CustomError::ParseError
    }
}

fn parse_number(s: &str) -> Result<i32, CustomError> {
    Ok(s.parse::<i32>()?)
}
```

## Recoverable vs Unrecoverable Errors

- **Recoverable**: Use `Result` (file not found, invalid input)
- **Unrecoverable**: Use `panic!` (bugs, invariants violated)

```rust
// Recoverable
let file = std::fs::File::open("config.txt")?;

// Unrecoverable
if config_is_invalid {
    panic!("Configuration is corrupted!");
}
```

## Practice

1. Write a function that returns `Result<i32, String>` and handles division by zero
2. Use the `?` operator to propagate errors
3. Create a custom error type with a Display implementation
4. Use `Option` to handle a value that might not exist
5. Chain Option methods with `map()` and `and_then()`

> "Errors are data. Treat them with respect, and your code will be robust."
