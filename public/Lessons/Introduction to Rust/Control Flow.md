# Control Flow

Guide your program's execution through conditions and repetition.

## If Expressions

`if` statements in Rust are expressions that return values:

```rust
let number = 6;

if number % 2 == 0 {
    println!("Even");
} else {
    println!("Odd");
}
```

### If as an Expression

```rust
let condition = true;
let value = if condition { 5 } else { 6 };
println!("{}", value);  // prints 5
```

All branches must return the same type:

```rust
let x = if true { 5 } else { "six" };  // ERROR!
```

## Else If

Chain multiple conditions:

```rust
let number = 6;

if number % 4 == 0 {
    println!("Divisible by 4");
} else if number % 2 == 0 {
    println!("Divisible by 2");
} else {
    println!("Not divisible by 2 or 4");
}
```

## Loops

### Infinite Loops

Use `loop` for infinite repetition:

```rust
let mut count = 0;

loop {
    count += 1;
    println!("Count: {}", count);
    
    if count == 5 {
        break;  // exit the loop
    }
}
```

### Loop Labels and Breaking

Return values from loops:

```rust
let result = loop {
    // do something
    break 42;  // exit loop and return 42
};
```

Break from nested loops with labels:

```rust
'outer: loop {
    loop {
        break 'outer;  // breaks from outer loop
    }
}
```

### While Loops

Continue while a condition is true:

```rust
let mut number = 3;

while number != 0 {
    println!("{}", number);
    number -= 1;
}
println!("LIFTOFF!");
```

### For Loops

Iterate over a collection:

```rust
let arr = [10, 20, 30, 40, 50];

for num in arr {
    println!("Value: {}", num);
}
```

Iterate over a range:

```rust
for i in 1..=5 {
    println!("{}", i);  // prints 1, 2, 3, 4, 5
}
```

Iterate in reverse:

```rust
for i in (1..5).rev() {
    println!("{}", i);  // prints 4, 3, 2, 1
}
```

## Continue and Break

Control loop flow:

```rust
for i in 1..5 {
    if i == 2 {
        continue;  // skip to next iteration
    }
    if i == 4 {
        break;  // exit loop
    }
    println!("{}", i);  // prints 1, 3
}
```

## Match Expressions

Exhaustive pattern matching:

```rust
let number = 3;

match number {
    1 => println!("One"),
    2 => println!("Two"),
    3 => println!("Three"),
    _ => println!("Other"),
}
```

Match with multiple conditions:

```rust
match number {
    1 | 2 | 3 => println!("One, two, or three"),
    4..=6 => println!("Four to six"),
    _ => println!("Something else"),
}
```

Match as an expression:

```rust
let value = match number {
    1 => "one",
    2 => "two",
    _ => "other",
};
```

## Practice

1. Write a program that prints numbers 1-10 using a for loop
2. Write a while loop that counts down from 10 to 1
3. Create a match expression that handles different number values
4. Write nested loops and use a labeled break to exit the outer loop
5. Use an if expression to assign a value to a variable based on a condition

> "Match the compiler's request for exhaustiveness. Every possibility must be handled."
