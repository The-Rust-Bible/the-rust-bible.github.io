# Traits

Enable polymorphism and code reuse through shared behavior.

## Defining Traits

```rust
pub trait Draw {
    fn draw(&self);
}
```

### Implementing Traits

```rust
struct Button {
    width: u32,
    height: u32,
    label: String,
}

impl Draw for Button {
    fn draw(&self) {
        println!("Drawing button: {}", self.label);
    }
}

struct SelectBox {
    options: Vec<String>,
}

impl Draw for SelectBox {
    fn draw(&self) {
        println!("Drawing select box with {} options", self.options.len());
    }
}
```

## Using Trait Bounds

### With Generic Functions

```rust
fn notify<T: Draw>(item: T) {
    item.draw();
}
```

### With Multiple Traits

```rust
fn notify<T: Draw + Clone>(item: T) {
    item.draw();
}
```

### Where Clauses

```rust
fn notify<T>(item: T)
where
    T: Draw + Clone,
{
    item.draw();
}
```

## Trait Objects

Dynamic dispatch with `dyn`:

```rust
let components: Vec<Box<dyn Draw>> = vec![
    Box::new(Button {
        width: 50,
        height: 40,
        label: String::from("Click me"),
    }),
    Box::new(SelectBox {
        options: vec![String::from("Option 1")],
    }),
];

for component in components {
    component.draw();
}
```

> "Trait objects trade compile-time polymorphism for runtime flexibility. Use when you need dynamic behavior."

## Default Implementations

```rust
pub trait Animal {
    fn speak(&self) {
        println!("Some generic sound");
    }

    fn move_around(&self);  // no default
}

struct Dog;

impl Animal for Dog {
    fn move_around(&self) {
        println!("Dog runs");
    }
}

let dog = Dog;
dog.speak();        // uses default: "Some generic sound"
dog.move_around();  // uses implementation
```

## Associated Types

```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;
}

struct Counter {
    count: u32,
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        self.count += 1;
        Some(self.count)
    }
}
```

## Traits as Parameters

### Impl Trait (Static Dispatch)

```rust
fn returns_iterator() -> impl Iterator {
    Counter { count: 0 }
}
```

### Trait Objects (Dynamic Dispatch)

```rust
fn returns_iterator() -> Box<dyn Iterator<Item = i32>> {
    Box::new(Counter { count: 0 })
}
```

## Operator Overloading

Traits for operators:

```rust
use std::ops::Add;

#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

impl Add for Point {
    type Output = Point;

    fn add(self, other: Point) -> Point {
        Point {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

let p1 = Point { x: 1, y: 2 };
let p2 = Point { x: 3, y: 4 };
let p3 = p1 + p2;  // (4, 6)
```

## Common Standard Traits

### Display and Debug

```rust
use std::fmt;

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

impl fmt::Debug for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.debug_struct("Point")
            .field("x", &self.x)
            .field("y", &self.y)
            .finish()
    }
}

println!("{}", point);   // uses Display
println!("{:?}", point); // uses Debug
```

### Clone and Copy

```rust
#[derive(Clone)]
struct Expensive {
    data: Vec<i32>,
}

#[derive(Copy, Clone)]
struct Point {
    x: i32,
    y: i32,
}

let p1 = Point { x: 1, y: 2 };
let p2 = p1;  // p1 still valid (Copy)

let e1 = Expensive { data: vec![1, 2, 3] };
let e2 = e1.clone();  // explicit copy
// e1 is now invalid
```

### From and Into

```rust
impl From<&str> for String {
    fn from(s: &str) -> String {
        String::from(s)
    }
}

let s = String::from("hello");

// Into is automatically implemented for From
let s: String = "hello".into();
```

## Blanket Implementations

Implement a trait for all types that implement another trait:

```rust
impl<T: Display> ToString for T {
    fn to_string(&self) -> String {
        format!("{}", self)
    }
}

// Now all types that implement Display automatically get ToString
```

## Supertraits

Require implementing another trait:

```rust
trait Drawable: Display {
    fn draw(&self);
}

// Anything implementing Drawable must also implement Display
```

## Practice

1. Define a trait with multiple methods
2. Implement the trait for two different types
3. Write a function that uses trait bounds
4. Use trait objects to store different types
5. Implement the Display trait for a custom type
6. Create a blanket implementation
7. Use associated types in a trait

> "Traits are contracts. When you define a trait, you define a promise of behavior. When you implement it, you fulfill that promise."
