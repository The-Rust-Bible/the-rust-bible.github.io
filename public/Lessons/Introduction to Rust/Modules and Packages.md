# Modules and Packages

## Understanding the Module System

Rust's module system allows you to organize code into logical units and control visibility. It's a powerful way to structure larger projects and create reusable libraries.

### What Are Modules?

Modules are namespaced containers for code. They help you organize related functionality and control which parts of your code are public or private.

```rust
mod greetings {
    pub fn hello() {
        println!("Hello, Rustacean!");
    }

    fn private_helper() {
        // This function is private by default
    }
}

fn main() {
    greetings::hello(); // OK
    // greetings::private_helper(); // Error!
}
```

## Visibility and Privacy

In Rust, items are private by default. Use the `pub` keyword to make them public.

### Privacy Rules

- Items in a module are private by default
- Parent modules cannot access private items in child modules
- Child modules can access private items in parent modules

```rust
mod outer {
    pub mod inner {
        pub fn public_function() {
            println!("I'm public!");
        }

        fn private_function() {
            println!("I'm private!");
        }
    }

    pub fn parent_function() {
        inner::public_function(); // OK
        // inner::private_function(); // Error!
    }
}

fn main() {
    outer::inner::public_function(); // OK
}
```

## Declaring Modules

### Inline Modules

Define modules directly in your code:

```rust
mod utils {
    pub fn add(a: i32, b: i32) -> i32 {
        a + b
    }

    pub fn multiply(a: i32, b: i32) -> i32 {
        a * b
    }
}

fn main() {
    println!("{}", utils::add(5, 3));
    println!("{}", utils::multiply(5, 3));
}
```

### File-Based Modules

For larger projects, separate modules into files:

```
project/
├── src/
│   ├── main.rs
│   ├── utils.rs
│   └── math/
│       ├── mod.rs
│       ├── arithmetic.rs
│       └── geometry.rs
```

In `main.rs`:
```rust
mod utils;
mod math;

fn main() {
    utils::greet();
    math::arithmetic::add(5, 3);
}
```

## Understanding Packages

A package is a collection of one or more crates that work together.

### Package Structure

A package must contain:
- One library crate (`src/lib.rs`) OR
- One binary crate (`src/main.rs`)
- Multiple binary crates (in `src/bin/`)

```
my_package/
├── Cargo.toml
└── src/
    ├── lib.rs      # Library crate
    ├── main.rs     # Binary crate
    └── bin/
        └── cli.rs  # Another binary
```

## Using `use` to Bring Paths Into Scope

Instead of writing full paths repeatedly, use the `use` keyword:

```rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();
    map.insert("name", "Rustacean");
}
```

### Re-exporting with `pub use`

Make items public through your module:

```rust
pub use std::io::Result;

pub fn read_file(path: &str) -> Result<String> {
    std::fs::read_to_string(path)
}
```

### Using Globs

Bring all public items into scope:

```rust
use std::collections::*;

fn main() {
    let map = HashMap::new();
    let vec = Vec::new();
}
```

## Practical Example: Organizing a Library

```rust
// lib.rs
pub mod auth {
    pub mod login {
        pub fn authenticate(user: &str, pass: &str) -> bool {
            // Authentication logic
            true
        }
    }

    pub mod logout {
        pub fn sign_out(user: &str) {
            println!("User {} signed out", user);
        }
    }
}

pub mod database {
    pub fn connect() -> &'static str {
        "Connected to database"
    }
}

// Usage
use my_lib::auth::login;
use my_lib::database;

fn main() {
    if login::authenticate("user", "pass") {
        println!("{}", database::connect());
    }
}
```

## Best Practices

1. **Keep module hierarchy shallow** - Deep nesting makes code harder to navigate
2. **Group related functionality** - Put similar code in the same module
3. **Use public APIs wisely** - Hide implementation details
4. **Consider module size** - Split large modules into separate files
5. **Document public interfaces** - Use doc comments for public items

## Module System Summary

The module system in Rust is the Borrow Checker's friend, keeping your code organized and safe. Each module is a sanctuary of related functionality, and visibility rules ensure that only what should be public is exposed.

Remember: A well-organized module structure is like a well-organized library—easy to navigate and easy to find what you need.
