# Collections

Organize data at scale with Rust's powerful collection types.

## Vectors

Dynamic arrays that grow and shrink:

```rust
let mut v: Vec<i32> = Vec::new();
v.push(5);
v.push(6);
v.push(7);

println!("{}", v[0]);  // 5
```

Macro shorthand:

```rust
let v = vec![1, 2, 3];
```

### Vector Methods

```rust
let mut v = vec![1, 2, 3, 4, 5];

v.len();              // 5
v.is_empty();         // false
v.push(6);            // add to end
v.pop();              // remove last, returns Option
v.remove(2);          // remove at index

for i in &v {         // iterate by reference
    println!("{}", i);
}

for i in &mut v {     // iterate by mutable reference
    *i += 1;
}

for i in v {          // iterate, consuming the vector
    println!("{}", i);
}
```

### Indexing and Bounds

```rust
let v = vec![1, 2, 3];

// Index access (panics if out of bounds)
println!("{}", v[0]);  // 1

// Safe access (returns Option)
match v.get(0) {
    Some(value) => println!("{}", value),
    None => println!("Index out of bounds"),
}
```

## Strings

Two string types in Rust:

### String (Owned)

```rust
let mut s = String::new();
s.push_str("Hello");
s.push(' ');
s.push_str("World");

let s = "Hello".to_string();
let s = String::from("Hello");
```

### &str (String Slice)

```rust
let s: &str = "Hello, World";
let s = "Hello, World";  // defaults to &str
```

### String Methods

```rust
let s = String::from("Hello");

s.len();                      // 5 (bytes)
s.chars().count();            // 5 (characters)
s.is_empty();                 // false
s.contains("ell");            // true
s.starts_with("He");          // true
s.ends_with("lo");            // true

let s = s + " World";         // concatenation (consumes s)
let s = format!("{}{}", "Hello", " World");  // formatting

let words: Vec<&str> = s.split(' ').collect();  // split
let s = s.trim();             // remove whitespace
let upper = s.to_uppercase();
let lower = s.to_lowercase();
```

> "Understand the distinction: String is mutable and owned; &str is immutable and borrowed. Choose wisely."

## HashMaps

Key-value storage:

```rust
use std::collections::HashMap;

let mut map = HashMap::new();
map.insert("blue", 10);
map.insert("yellow", 50);

println!("{}", map["blue"]);  // 10

// Safe access
match map.get("blue") {
    Some(value) => println!("{}", value),
    None => println!("Key not found"),
}
```

### HashMap Methods

```rust
let mut scores = HashMap::new();
scores.insert("Blue", 10);
scores.insert("Yellow", 50);

scores.len();           // 2
scores.is_empty();      // false
scores.contains_key("Blue");  // true
scores.remove("Blue");  // remove key

// Entry API for conditional insertion
scores.entry("Blue")
    .or_insert(10);     // insert only if key doesn't exist

// Iterate
for (key, value) in &scores {
    println!("{}: {}", key, value);
}
```

### From Iterator

```rust
let teams = vec![("Blue", 10), ("Yellow", 50)];
let map: HashMap<_, _> = teams.into_iter().collect();
```

## HashSets

Unique values:

```rust
use std::collections::HashSet;

let mut set = HashSet::new();
set.insert(1);
set.insert(2);
set.insert(2);  // duplicate, ignored

println!("{}", set.len());  // 2

set.contains(&1);  // true
set.remove(&1);
```

## VecDeque

Double-ended queue (fast at both ends):

```rust
use std::collections::VecDeque;

let mut deque = VecDeque::new();
deque.push_back(1);
deque.push_front(0);

deque.pop_back();
deque.pop_front();
```

## BTreeMap and BTreeSet

Sorted alternatives (slower but ordered):

```rust
use std::collections::BTreeMap;

let mut map = BTreeMap::new();
map.insert(3, "three");
map.insert(1, "one");
map.insert(2, "two");

// Iterates in sorted order: 1, 2, 3
for (key, value) in &map {
    println!("{}: {}", key, value);
}
```

## Choosing Collections

| Type | Use When |
|------|----------|
| `Vec<T>` | You need a growable array |
| `String` | You need owned, mutable text |
| `HashMap<K, V>` | You need fast key-value lookup (unordered) |
| `HashSet<T>` | You need unique values (unordered) |
| `BTreeMap<K, V>` | You need ordered key-value pairs |
| `BTreeSet<T>` | You need ordered unique values |
| `VecDeque<T>` | You need fast operations on both ends |

## Practice

1. Create a vector and add elements with `push()`
2. Iterate over a vector with different methods
3. Create a HashMap and insert/retrieve values
4. Use the entry API to conditionally insert values
5. Create strings and use string methods
6. Implement a word frequency counter using a HashMap

> "Collections are the muscle of programs. Master them, and you master data organization."
