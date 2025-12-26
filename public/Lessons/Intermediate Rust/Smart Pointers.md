# Smart Pointers

## What Are Smart Pointers?

Smart pointers are data structures that act like pointers but have additional metadata and capabilities. They manage memory automatically and enforce Rust's ownership rules at compile time.

### Smart Pointer vs Raw Pointer

```rust
// Raw pointer (unsafe)
let x = 5;
let raw_ptr: *const i32 = &x as *const i32;

// Smart pointer (safe)
let x = Box::new(5);
// x is a smart pointer that owns the data on the heap
```

## Box<T>: Heap Allocation

`Box<T>` allocates a value on the heap instead of the stack.

### When to Use Box

- When you have a type whose size can't be known at compile time
- When you want to transfer ownership of large data without copying
- For recursive types (with size known at compile time)

### Basic Usage

```rust
fn main() {
    let b = Box::new(5);
    println!("b = {}", b); // Prints: 5
    
    // b is automatically deallocated when it goes out of scope
}
```

### Recursive Types with Box

Without `Box`, recursive types would be infinitely sized:

```rust
// This won't compile
// enum List {
//     Cons(i32, List),
//     Nil,
// }

// With Box, it has a known size
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let list = Cons(1,
        Box::new(Cons(2,
            Box::new(Cons(3,
                Box::new(Nil))))));
}
```

### Deref and DerefMut

`Box` implements `Deref`, allowing it to be dereferenced:

```rust
let b = Box::new(5);
println!("b = {}", *b); // Dereference to get the value

// Deref coercion happens automatically
fn print_value(val: &i32) {
    println!("{}", val);
}

print_value(&b); // Coerced from &Box<i32> to &i32
```

## Rc<T>: Reference Counting

`Rc<T>` enables multiple ownership of the same data. It's single-threaded and only allows immutable borrows.

### When to Use Rc

- When you need multiple owners of the same data
- When you can't determine ownership at compile time
- In single-threaded code only

### Basic Usage

```rust
use std::rc::Rc;

fn main() {
    let a = Rc::new(5);
    let b = Rc::clone(&a);
    let c = Rc::clone(&a);
    
    println!("count after creating b and c: {}", Rc::strong_count(&a)); // 3
}
```

### Rc with Enums

```rust
use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    let b = Cons(3, Rc::clone(&a));
    let c = Cons(4, Rc::clone(&a));
    
    // Both b and c share ownership of a
}
```

## RefCell<T>: Interior Mutability

`RefCell<T>` provides interior mutability—allowing you to mutate data even through immutable references. Borrow checking happens at runtime instead of compile time.

### When to Use RefCell

- When you need to mutate data through an immutable reference
- When the borrow rules are too restrictive
- In single-threaded code only

### Basic Usage

```rust
use std::cell::RefCell;

fn main() {
    let value = RefCell::new(5);
    
    *value.borrow_mut() += 1;
    println!("value = {}", *value.borrow()); // Prints: 6
}
```

### Runtime Borrow Checking

```rust
use std::cell::RefCell;

let value = RefCell::new(String::from("hello"));

let r1 = value.borrow();
let r2 = value.borrow();
println!("{}, {}", r1, r2); // OK - multiple immutable borrows

// let w = value.borrow_mut(); // This would panic!
```

## Combining Rc and RefCell

For shared mutable ownership:

```rust
use std::rc::Rc;
use std::cell::RefCell;

struct Person {
    name: String,
    age: RefCell<u32>,
}

fn main() {
    let person = Rc::new(Person {
        name: String::from("Alice"),
        age: RefCell::new(30),
    });
    
    let person_clone = Rc::clone(&person);
    
    // Mutate through shared reference
    *person.age.borrow_mut() += 1;
    println!("Age: {}", *person_clone.age.borrow()); // Prints: 31
}
```

## Mutex<T>: Thread-Safe Interior Mutability

For multithreaded code, use `Mutex<T>` instead of `RefCell<T>`:

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    
    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.join().unwrap();
    }
    
    println!("Result: {}", *counter.lock().unwrap()); // Prints: 10
}
```

## Arc<T>: Atomic Reference Counting

`Arc<T>` is the thread-safe version of `Rc<T>`. Use it when sharing data across threads.

```rust
use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(vec![1, 2, 3]);
    
    let handles: Vec<_> = (0..3)
        .map(|i| {
            let data = Arc::clone(&data);
            thread::spawn(move || {
                println!("Thread {}: {:?}", i, data);
            })
        })
        .collect();
    
    for handle in handles {
        handle.join().unwrap();
    }
}
```

## Smart Pointer Comparison

| Pointer | Ownership | Single/Multi | Mutability | Thread-Safe |
|---------|-----------|--------------|------------|------------|
| `Box<T>` | Single | Single | Exclusive | Yes |
| `Rc<T>` | Shared | Multi | Shared | No |
| `RefCell<T>` | Single | Single | Interior | No |
| `Mutex<T>` | Single | Single | Interior | Yes |
| `Arc<T>` | Shared | Multi | Shared | Yes |

## Best Practices

1. **Start with stack allocation** - Use `Box` only when needed
2. **Use `Rc` for shared ownership** - In single-threaded code
3. **Use `Arc` for shared ownership** - In multithreaded code
4. **Use `RefCell` sparingly** - Only when necessary for interior mutability
5. **Combine `Arc<Mutex<T>>`** - For thread-safe shared mutable data

## Smart Pointers Summary

Smart pointers are the Borrow Checker's instruments for managing complex ownership scenarios. They extend Rust's safety guarantees beyond simple stack allocation, giving you fine-grained control over where your data lives and who owns it.

Master them, and you'll handle the most complex memory scenarios with confidence.
