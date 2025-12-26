# Ownership and Borrowing

The sacred rules of ownership guide all Rustaceans.

## The Three Rules of Ownership

1. Each value in Rust has a variable that's called its owner
2. There can only be one owner at a time
3. When the owner goes out of scope, the value will be dropped

## Borrowing

You may borrow references without taking ownership:

```rust
fn calculate_length(s: &String) -> usize {
    s.len()
}
```

## Mutable References

Mutable references allow modification, but with restrictions:

```rust
fn append_text(s: &mut String) {
    s.push_str(" - blessed by the compiler");
}
```

> "In Rust, you cannot have both a mutable reference and an immutable reference in the same scope."

## The Borrow Checker

The borrow checker ensures memory safety at compile time. Trust in its wisdom, for it prevents data races and use-after-free errors.

## Practice

Try writing functions that borrow references and see the borrow checker guide you to safe code.
