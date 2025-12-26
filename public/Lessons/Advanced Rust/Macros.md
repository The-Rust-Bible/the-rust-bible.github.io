# Macros

## Understanding Macros

Macros are a form of metaprogramming that allows you to write code that generates code. They're one of Rust's most powerful features.

### Why Use Macros?

- Reduce boilerplate code
- Create domain-specific languages (DSLs)
- Implement compile-time verification
- Generate type-safe code

## Declarative Macros (macro_rules!)

Declarative macros use pattern matching to generate code based on how they're invoked.

### Basic Syntax

```rust
macro_rules! say_hello {
    () => {
        println!("Hello!");
    };
}

fn main() {
    say_hello!(); // Prints: Hello!
}
```

### Macros with Arguments

```rust
macro_rules! print_many {
    ($($arg:expr),*) => {
        $(
            println!("{}", $arg);
        )*
    };
}

fn main() {
    print_many!(1, "hello", 3.14);
    // Prints:
    // 1
    // hello
    // 3.14
}
```

### Pattern Matching in Macros

```rust
macro_rules! test {
    ($x:expr) => {
        println!("$x is {}", $x);
    };
    ($x:expr, $y:expr) => {
        println!("$x is {}, $y is {}", $x, $y);
    };
}

fn main() {
    test!(5);           // Pattern: ($x:expr)
    test!(5, 10);       // Pattern: ($x:expr, $y:expr)
}
```

### Repetition

Use `$(...)*` or `$(...)+` for repetition:

```rust
macro_rules! vec_init {
    ($($elem:expr),*) => {
        {
            let mut vec = Vec::new();
            $(
                vec.push($elem);
            )*
            vec
        }
    };
}

fn main() {
    let v = vec_init!(1, 2, 3, 4, 5);
    println!("{:?}", v); // [1, 2, 3, 4, 5]
}
```

## Procedural Macros

Procedural macros take code as input and produce code as output. They're more powerful than declarative macros.

### Three Types of Procedural Macros

1. **Custom Derive** - `#[derive(...)]`
2. **Attribute Macros** - `#[...]`
3. **Function-like Macros** - `macro_name!(...)`

### Creating a Custom Derive Macro

First, create a proc-macro crate:

```toml
[package]
name = "my_derive"
version = "0.1.0"

[lib]
proc-macro = true

[dependencies]
syn = "2.0"
quote = "1.0"
proc-macro2 = "1.0"
```

In the macro crate:

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(Debug)]
pub fn debug_derive(input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as DeriveInput);
    let name = &input.ident;
    
    let expanded = quote! {
        impl std::fmt::Debug for #name {
            fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                f.debug_struct(stringify!(#name)).finish()
            }
        }
    };
    
    TokenStream::from(expanded)
}
```

### Attribute Macros

```rust
#[proc_macro_attribute]
pub fn my_attribute(args: TokenStream, input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as ItemFn);
    let name = &input.sig.ident;
    
    let expanded = quote! {
        #input
        
        fn #name() {
            println!("Executing {}", stringify!(#name));
        }
    };
    
    TokenStream::from(expanded)
}
```

## Common Built-in Macros

### println! and print!

```rust
println!("Hello, {}", "world");
print!("No newline");
```

### assert! Macros

```rust
assert!(true);
assert_eq!(2 + 2, 4);
assert_ne!(2 + 2, 5);
```

### panic! Macro

```rust
panic!("This is a panic: {}", "error message");
```

### vec! Macro

```rust
let v = vec![1, 2, 3, 4];
let v = vec![0; 10]; // 10 zeros
```

## Building a Custom Macro

### Simple Builder Pattern Macro

```rust
macro_rules! build {
    ($name:ident { $($key:ident: $value:expr),* $(,)? }) => {
        {
            let mut obj = String::new();
            $(
                obj.push_str(&format!("{}: {}\n", stringify!($key), $value));
            )*
            obj
        }
    };
}

fn main() {
    let output = build!(config {
        host: "localhost",
        port: 8080,
        debug: true
    });
    println!("{}", output);
}
```

### DSL: HTML Builder

```rust
macro_rules! html {
    ($tag:ident($($content:expr),*)) => {
        {
            let mut s = format!("<{}>", stringify!($tag));
            $(
                s.push_str(&format!("{}", $content));
            )*
            s.push_str(&format!("</{}>", stringify!($tag)));
            s
        }
    };
}

fn main() {
    let page = html!(div(
        html!(h1("Title")),
        html!(p("Paragraph"))
    ));
    println!("{}", page);
}
```

## Macro Debugging

### Using `cargo expand`

See what macros expand to:

```bash
cargo install cargo-expand
cargo expand
```

### Manual Inspection

```rust
// Run with:
// rustc --pretty=expanded file.rs
```

## Best Practices

1. **Use macros sparingly** - Regular functions are usually clearer
2. **Document thoroughly** - Macro behavior can be surprising
3. **Keep them simple** - Complex macros are hard to debug
4. **Test extensively** - Macro bugs manifest in generated code
5. **Use meaningful names** - Indicate what the macro does
6. **Provide examples** - Show common use cases

## Macro Pitfalls

### Variable Shadowing

```rust
macro_rules! bad {
    ($x:expr) => {
        let x = $x + 1;
        x
    };
}

// Calling with a variable named x can shadow it
let x = 5;
bad!(x); // Creates a new x
```

### Hygiene Issues

```rust
macro_rules! counter {
    () => {
        let mut count = 0; // This count is in the macro's scope
        count += 1;
        count
    };
}
```

## Macros Summary

Macros are the meta-tools of Rust programming. They let you write code that generates code, eliminate boilerplate, and create elegant abstractions. From simple declarative macros to powerful procedural macros, they unlock Rust's full expressive potential.

Use them wisely, and they become your most powerful allies.
