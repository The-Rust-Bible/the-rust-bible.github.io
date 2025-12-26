# Variables and Data Types

Master the foundations of Rust's type system.

## Declaring Variables

All variables are immutable by default in Rust. To declare a mutable variable, use the `mut` keyword:

```rust
let x = 5;              // immutable
let mut y = 5;          // mutable
y = 6;                  // allowed
```

> "Immutability by default is not a limitation, but a blessing. It forces you to think about what truly needs to change."

## Type Annotations

Rust can infer types, but you can explicitly annotate them:

```rust
let age: i32 = 25;
let pi: f64 = 3.14159;
let name: &str = "Rustacean";
```

## Scalar Types

### Integers

| Type | Size | Range |
|------|------|-------|
| `i8` | 8-bit | -128 to 127 |
| `i16` | 16-bit | -32,768 to 32,767 |
| `i32` | 32-bit | -2,147,483,648 to 2,147,483,647 |
| `i64` | 64-bit | Very large negative to positive |
| `u8`, `u16`, `u32`, `u64` | Same as above but unsigned (no negative) |
| `isize`, `usize` | Depends on architecture | For memory addresses |

```rust
let signed: i32 = -10;
let unsigned: u32 = 10;
let default_int = 42;     // defaults to i32
```

### Floating-Point Numbers

```rust
let f32_val: f32 = 3.14;
let f64_val: f64 = 2.71828;
let default_float = 3.14;  // defaults to f64
```

### Booleans

```rust
let active: bool = true;
let inactive: bool = false;
```

### Characters

```rust
let letter: char = 'a';
let emoji: char = '🦀';
let newline: char = '\n';
```

## Compound Types

### Tuples

Group values of different types:

```rust
let pair: (i32, f64) = (500, 6.4);
let (x, y) = pair;  // destructuring
```

### Arrays

Homogeneous collections with fixed size:

```rust
let array: [i32; 5] = [1, 2, 3, 4, 5];
let all_fives: [i32; 5] = [5; 5];  // [5, 5, 5, 5, 5]
let first = array[0];
```

## Constants

Constants are always immutable and must have explicit types:

```rust
const HOLY_NUMBER: u32 = 42;
const PI: f64 = 3.14159;
```

## Shadowing

You can declare a new variable with the same name as a previous one:

```rust
let x = 5;
let x = x + 1;      // x is now 6
let x = "Rust";     // x can change type!
```

This is different from mutation because a new variable is created.

## Practice

1. Declare three variables of different types
2. Try reassigning them (what errors do you get?)
3. Use `mut` to fix the errors
4. Create a tuple with mixed types and destructure it
5. Create an array and access elements by index

> The compiler is your teacher. Listen to its lessons, and you will master Rust.
