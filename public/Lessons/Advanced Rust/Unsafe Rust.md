# Unsafe Rust

## Understanding Unsafe

Unsafe Rust allows you to perform operations that the borrow checker cannot verify as safe. It gives you access to raw pointers, calling unsafe functions, and implementing unsafe traits.

### When to Use Unsafe

- Calling C code via FFI
- Writing performance-critical code that needs raw pointer manipulation
- Implementing low-level abstractions
- Accessing hardware directly
- Creating new abstractions that the type system can't express

### The Safety Contract

When you use `unsafe`, you're telling the compiler: "I guarantee this code is safe." The responsibility is on you to ensure it doesn't cause undefined behavior.

## The Five Unsafe Superpowers

### 1. Dereference Raw Pointers

Raw pointers come in two types:

```rust
let x = 5;
let raw_const = &x as *const i32;
let mut y = 6;
let raw_mut = &mut y as *mut i32;

unsafe {
    println!("raw_const: {}", *raw_const);
    println!("raw_mut: {}", *raw_mut);
    *raw_mut = 10;
    println!("raw_mut after change: {}", *raw_mut);
}
```

### Raw Pointer Characteristics

- Can ignore borrow checker rules
- Aren't guaranteed to point to valid memory
- Can be null
- Don't clean up automatically
- May cause undefined behavior

### 2. Call Unsafe Functions

Functions marked `unsafe` contain operations the compiler can't verify:

```rust
unsafe fn dangerous() {
    let x = 5;
    let raw_ptr = &x as *const i32;
    println!("Dangerous: {}", *raw_ptr);
}

fn main() {
    unsafe {
        dangerous();
    }
}
```

### Creating Safe Abstractions Over Unsafe Code

```rust
fn split_at_mut(slice: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = slice.len();
    let ptr = slice.as_mut_ptr();
    
    assert!(mid <= len);
    
    unsafe {
        (
            std::slice::from_raw_parts_mut(ptr, mid),
            std::slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}

fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    let (left, right) = split_at_mut(&mut v, 2);
    println!("left: {:?}, right: {:?}", left, right);
}
```

### 3. Access or Modify Mutable Static Variables

Static variables are shared across all threads:

```rust
static mut COUNTER: u32 = 0;

fn add_to_counter(inc: u32) {
    unsafe {
        COUNTER += inc;
    }
}

fn main() {
    add_to_counter(3);
    unsafe {
        println!("COUNTER: {}", COUNTER);
    }
}
```

### Safer Pattern with Lazy_Static

```rust
use std::sync::Mutex;

lazy_static::lazy_static! {
    static ref COUNTER: Mutex<u32> = Mutex::new(0);
}

fn add_to_counter(inc: u32) {
    let mut counter = COUNTER.lock().unwrap();
    *counter += inc;
}

fn main() {
    add_to_counter(3);
    println!("COUNTER: {}", *COUNTER.lock().unwrap());
}
```

### 4. Implement Unsafe Traits

Some traits require `unsafe` because implementing them incorrectly could cause memory unsafety:

```rust
// Send and Sync are unsafe traits
unsafe trait Scary {
    fn scary_method(&self);
}

struct SafeStruct;

unsafe impl Scary for SafeStruct {
    fn scary_method(&self) {
        println!("Scary!");
    }
}
```

### 5. Use External Functions (FFI)

Call functions from other languages:

```rust
extern "C" {
    fn abs(input: i32) -> i32;
}

fn main() {
    unsafe {
        println!("Absolute value of -3 is: {}", abs(-3));
    }
}
```

## Common FFI Pattern

```rust
extern "C" {
    // C function signature
    fn strlen(s: *const u8) -> usize;
}

fn safe_strlen(s: &str) -> usize {
    unsafe {
        strlen(s.as_ptr())
    }
}

fn main() {
    let text = "hello";
    println!("Length: {}", safe_strlen(text));
}
```

## Unsafe Patterns

### Working with Extern Crates

```toml
[dependencies]
libc = "0.2"
```

```rust
extern "C" {
    pub fn malloc(size: usize) -> *mut libc::c_void;
    pub fn free(ptr: *mut libc::c_void);
}

fn main() {
    unsafe {
        let ptr = malloc(1024);
        // Use allocated memory
        free(ptr);
    }
}
```

### Creating a Safe Wrapper

```rust
struct Buffer {
    ptr: *mut u8,
    size: usize,
}

impl Buffer {
    fn new(size: usize) -> Self {
        unsafe {
            let ptr = libc::malloc(size) as *mut u8;
            Buffer { ptr, size }
        }
    }
    
    fn as_slice(&self) -> &[u8] {
        unsafe {
            std::slice::from_raw_parts(self.ptr, self.size)
        }
    }
}

impl Drop for Buffer {
    fn drop(&mut self) {
        unsafe {
            libc::free(self.ptr as *mut libc::c_void);
        }
    }
}
```

## Unsafe Code Best Practices

1. **Minimize unsafe blocks** - Use the smallest scope possible
2. **Document safety contracts** - Explain what assumptions you're making
3. **Write tests** - Unsafe code is more error-prone
4. **Use safe wrappers** - Encapsulate unsafe code

### Example with Documentation

```rust
/// Splits the slice at the given index.
///
/// # Safety
///
/// The caller must ensure that `mid` is less than or equal to the slice length.
/// Violating this condition results in undefined behavior.
pub unsafe fn split_at_unchecked(slice: &[i32], mid: usize) -> (&[i32], &[i32]) {
    let ptr = slice.as_ptr();
    (
        std::slice::from_raw_parts(ptr, mid),
        std::slice::from_raw_parts(ptr.add(mid), slice.len() - mid),
    )
}

pub fn split_at_checked(slice: &[i32], mid: usize) -> Result<(&[i32], &[i32]), String> {
    if mid > slice.len() {
        Err("Index out of bounds".to_string())
    } else {
        Ok(unsafe { split_at_unchecked(slice, mid) })
    }
}
```

## Common Unsafe Pitfalls

### Null Pointer Dereference

```rust
// WRONG - undefined behavior
unsafe {
    let ptr: *const i32 = std::ptr::null();
    println!("{}", *ptr); // Undefined behavior!
}

// RIGHT - check for null
unsafe {
    let ptr: *const i32 = std::ptr::null();
    if !ptr.is_null() {
        println!("{}", *ptr);
    }
}
```

### Use After Free

```rust
// WRONG
let ptr = Box::into_raw(Box::new(5));
unsafe {
    Box::from_raw(ptr);
}
unsafe {
    println!("{}", *ptr); // Use after free!
}

// RIGHT - only dereference before dropping
let ptr = Box::into_raw(Box::new(5));
unsafe {
    println!("{}", *ptr);
    Box::from_raw(ptr); // Now it's safe
}
```

## Tools for Working with Unsafe Code

### Miri: Undefined Behavior Detector

```bash
cargo +nightly miri test
```

Miri can detect many unsafe code errors during development.

## Unsafe Rust Summary

Unsafe Rust is a necessary escape hatch for performance-critical code and low-level abstractions. However, it shifts the burden of safety to you. Use it sparingly, document your assumptions, and always provide safe abstractions for consumers of your code.

The power of unsafe comes with responsibility. Wield it carefully, and respect the guarantees you're bypassing.
