# Lifetimes

Master the borrow checker's way of preventing use-after-free errors.

## Lifetime Basics

Lifetimes track how long references are valid:

```rust
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

This won't compile. The compiler doesn't know how long the returned reference lives:

```
error[E0106]: missing lifetime specifier
```

## Explicit Lifetime Annotations

Use `'a` to denote a lifetime:

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

This says: "The returned reference lives as long as both input references."

### Using the Function

```rust
let s1 = String::from("Hello");
let s2 = String::from("World");

let result = longest(&s1, &s2);
println!("{}", result);  // s1 and s2 still valid
```

This fails because the returned reference outlives the inputs:

```rust
let s1 = String::from("Hello");
let result;

{
    let s2 = String::from("World");
    result = longest(&s1, &s2);  // ERROR: s2 doesn't live long enough
}

println!("{}", result);
```

> "Lifetimes don't change runtime behavior. They're annotations that help the compiler verify safety."

## Multiple Lifetimes

```rust
fn first_string<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {
    x  // returns reference with lifetime 'a
}
```

## Lifetime in Structs

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_word = novel.split(' ').next().unwrap();
    
    let excerpt = ImportantExcerpt {
        part: first_word,
    };
    
    println!("Excerpt: {}", excerpt.part);
}
```

The struct can't outlive the reference it holds:

```rust
let excerpt;
{
    let s = String::from("Hello");
    excerpt = ImportantExcerpt { part: &s };
}  // s is dropped here
println!("{}", excerpt.part);  // ERROR: s no longer valid
```

## Lifetime in Impl Blocks

```rust
impl<'a> ImportantExcerpt<'a> {
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention: {}", announcement);
        self.part
    }
}
```

## Lifetime Elision

Rust has rules that allow you to omit lifetime annotations:

### Rule 1: Each parameter gets its own lifetime

```rust
fn first(x: &str) -> &str {
    // Expanded to: fn first<'a>(x: &'a str) -> &'a str
    x
}
```

### Rule 2: If one input lifetime, assign to output

```rust
fn longest(x: &str, y: &str) -> &str {
    // Ambiguous - can't apply rule
    x
}
```

This still requires explicit lifetimes because there are two inputs.

### Rule 3: If &self, its lifetime is assigned to output

```rust
struct MyStruct;

impl MyStruct {
    fn get_ref(&self) -> &String {
        // The output lifetime is &self's lifetime
    }
}
```

## Lifetime Bounds

Use lifetime bounds with trait objects:

```rust
struct Context<'a> {
    message: &'a str,
}

trait Logger {
    fn log(&self);
}

impl<'a> Logger for Context<'a> {
    fn log(&self) {
        println!("{}", self.message);
    }
}
```

## Static Lifetime

`'static` means the reference lives for the entire program:

```rust
let s: &'static str = "Hello";  // string literals are 'static

const GREETING: &'static str = "Welcome";
```

Functions returning `'static`:

```rust
fn get_greeting() -> &'static str {
    "Hello"  // string literals are 'static
}
```

## Higher-Ranked Trait Bounds

```rust
fn call_twice<F>(f: F)
where
    F: for<'a> Fn(&'a str),
{
    f("Hello");
    f("World");
}

call_twice(|s| println!("{}", s));
```

The `for<'a>` means: "This function works for any lifetime you choose."

## Variance

Lifetimes are covariant:

```rust
fn assign_refs<'a, 'b: 'a>(r: &'a i32, s: &'b i32) {
    let _: &'a i32 = s;  // OK: 'b lives at least as long as 'a
}
```

## Common Patterns

### Owned Data is Easiest

```rust
fn process(s: String) -> String {
    // No lifetime issues with owned data
    s
}
```

### Returning References Requires Care

```rust
fn process(s: &str) -> &str {
    // Must be explicit about which input's lifetime
    s
}
```

### Returning Owned Data from References

```rust
fn process(s: &str) -> String {
    // No lifetime needed - owned data
    s.to_string()
}
```

## Practice

1. Write a function that takes two string slices and returns the longer one
2. Add explicit lifetime annotations to the function
3. Create a struct holding a reference and verify lifetime constraints
4. Implement a method on a struct with references
5. Understand why you can't return a local reference
6. Compare code with owned vs borrowed data
7. Use the `'static` lifetime in a function

> "Lifetimes aren't about complexity; they're about clarity. They document relationships between references in your code."
