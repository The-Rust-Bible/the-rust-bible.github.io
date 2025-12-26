# Structs and Enums

Define custom types to model your domain.

## Structs

### Struct Definition

```rust
struct User {
    name: String,
    email: String,
    age: u32,
    active: bool,
}
```

### Creating Instances

```rust
let user = User {
    name: String::from("Alice"),
    email: String::from("alice@example.com"),
    age: 30,
    active: true,
};

println!("{}", user.name);
```

### Field Init Shorthand

```rust
let name = String::from("Bob");
let email = String::from("bob@example.com");

let user = User {
    name,
    email,
    age: 25,
    active: false,
};
```

### Struct Update Syntax

```rust
let user2 = User {
    email: String::from("bob2@example.com"),
    ..user
};  // copies other fields from user
```

## Tuple Structs

Lightweight structs with unnamed fields:

```rust
struct Point(i32, i32, i32);

let origin = Point(0, 0, 0);
println!("{}", origin.0);  // 0
```

## Unit Structs

Structs with no fields (used as markers):

```rust
struct Marker;

let m = Marker;
```

## Impl Blocks

Add methods to structs:

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }

    fn square(size: u32) -> Rectangle {
        Rectangle { width: size, height: size }
    }
}

let rect = Rectangle { width: 30, height: 50 };
println!("Area: {}", rect.area());

let square = Rectangle::square(10);
```

> "Methods on structs make data and behavior live together. This is the essence of object-oriented design in Rust."

## Enums

Define a type with multiple possible variants:

```rust
enum IpAddrKind {
    V4,
    V6,
}

let four = IpAddrKind::V4;
let six = IpAddrKind::V6;
```

### Enums with Data

```rust
enum IpAddr {
    V4(String),
    V6(String),
}

let localhost = IpAddr::V4(String::from("127.0.0.1"));
let ipv6 = IpAddr::V6(String::from("::1"));
```

Different data per variant:

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```

### Impl on Enums

```rust
impl Message {
    fn call(&self) {
        // method body
    }
}

let m = Message::Write(String::from("Hello"));
m.call();
```

## Option Enum

Built-in enum for values that may or may not exist:

```rust
enum Option<T> {
    Some(T),
    None,
}

let some_number = Some(5);
let some_string = Some("a string");
let absent_number: Option<i32> = None;
```

Match on Option:

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

let five = Some(5);
let six = plus_one(five);
let none = plus_one(None);
```

## Result Enum

Built-in enum for fallible operations:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

## Generic Structs and Enums

Create flexible types:

```rust
struct Point<T> {
    x: T,
    y: T,
}

let int_point = Point { x: 5, y: 10 };
let float_point = Point { x: 1.0, y: 4.0 };
```

Multiple type parameters:

```rust
struct Pair<T, U> {
    first: T,
    second: U,
}

let pair = Pair {
    first: 5,
    second: "hello",
};
```

Generic enums:

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

## Derive Traits

Auto-implement common traits:

```rust
#[derive(Debug, Clone, Copy)]
struct Point {
    x: i32,
    y: i32,
}

let p = Point { x: 1, y: 2 };
println!("{:?}", p);  // works because of Debug
```

Common derive traits:
- `Debug` - print with `{:?}`
- `Clone` - explicit copying
- `Copy` - implicit copying for small types
- `PartialEq` - equality comparison
- `Eq` - equality (reflexive)
- `PartialOrd` - ordering
- `Ord` - total ordering
- `Hash` - hashable
- `Default` - default values

## Practice

1. Define a struct representing a person with methods
2. Create an enum for different payment methods
3. Implement a method on your enum
4. Use generic structs to store different types
5. Derive Debug and print a struct
6. Use Option to represent optional fields
7. Match exhaustively on enum variants

> "Structs and enums are your tools for domain modeling. Build your types carefully, and let the compiler guide you."
