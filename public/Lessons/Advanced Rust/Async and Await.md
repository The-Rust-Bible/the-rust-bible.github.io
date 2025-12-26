# Async and Await

## Understanding Asynchronous Programming

Async/await allows you to write asynchronous code that looks and feels like synchronous code. It enables your program to handle multiple tasks concurrently without blocking threads.

### Sync vs Async

```rust
// Synchronous - blocks thread
fn fetch_data() -> String {
    std::thread::sleep(std::time::Duration::from_secs(2));
    "data".to_string()
}

// Asynchronous - doesn't block thread
async fn fetch_data_async() -> String {
    tokio::time::sleep(std::time::Duration::from_secs(2)).await;
    "data".to_string()
}
```

## The Future Trait

All async functions return a `Future`, which represents a value that will be available at some point in the future.

```rust
// This async function returns an impl Future
async fn example() -> i32 {
    5
}

// Equivalent to:
fn example_expanded() -> impl Future<Output = i32> {
    async { 5 }
}
```

### Polling Futures

A `Future` is polled repeatedly until it's ready:

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

struct MyFuture {
    counter: u32,
}

impl Future for MyFuture {
    type Output = String;
    
    fn poll(mut self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<Self::Output> {
        self.counter += 1;
        if self.counter >= 3 {
            Poll::Ready(String::from("Done!"))
        } else {
            Poll::Pending
        }
    }
}
```

## Async/Await Syntax

### Basic Async Function

```rust
async fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

// Usage requires a runtime
#[tokio::main]
async fn main() {
    let greeting = greet("Rustacean").await;
    println!("{}", greeting); // Prints: Hello, Rustacean!
}
```

### Await Points

The `.await` keyword suspends execution until the future is ready:

```rust
async fn fetch_data() -> String {
    "data".to_string()
}

async fn process() {
    let data = fetch_data().await; // Awaits the future
    println!("Got: {}", data);
}
```

## Tokio: The Async Runtime

Rust's standard library doesn't include an async runtime. Tokio is the most popular choice.

### Setting Up Tokio

Add to `Cargo.toml`:
```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

### Basic Example

```rust
#[tokio::main]
async fn main() {
    println!("Start");
    
    let task1 = async {
        tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
        println!("Task 1 done");
    };
    
    let task2 = async {
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        println!("Task 2 done");
    };
    
    // Run tasks concurrently
    tokio::join!(task1, task2);
    println!("All done");
}
```

## Spawning Concurrent Tasks

### Using `tokio::spawn`

```rust
#[tokio::main]
async fn main() {
    let mut handles = vec![];
    
    for i in 0..5 {
        let handle = tokio::spawn(async move {
            println!("Task {} started", i);
            tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
            println!("Task {} finished", i);
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.await.unwrap();
    }
}
```

### Using `tokio::join!` for Concurrent Execution

```rust
async fn task1() { /* ... */ }
async fn task2() { /* ... */ }
async fn task3() { /* ... */ }

#[tokio::main]
async fn main() {
    tokio::join!(task1(), task2(), task3());
}
```

## Async Channels

Transfer data between concurrent tasks:

```rust
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    let (tx, mut rx) = mpsc::channel(100);
    
    tokio::spawn(async move {
        for i in 0..5 {
            tx.send(i).await.unwrap();
        }
    });
    
    while let Some(value) = rx.recv().await {
        println!("Received: {}", value);
    }
}
```

## Async Traits and Dyn Async

Working with async trait methods requires special handling:

```rust
use async_trait::async_trait;

#[async_trait]
trait DataFetcher {
    async fn fetch(&self, url: &str) -> String;
}

struct HttpClient;

#[async_trait]
impl DataFetcher for HttpClient {
    async fn fetch(&self, url: &str) -> String {
        format!("Fetched from {}", url)
    }
}

#[tokio::main]
async fn main() {
    let client = HttpClient;
    let data = client.fetch("http://example.com").await;
    println!("{}", data);
}
```

## Error Handling in Async Code

### Using Result<T, E>

```rust
async fn fallible_operation() -> Result<String, String> {
    Err("Something went wrong".to_string())
}

#[tokio::main]
async fn main() {
    match fallible_operation().await {
        Ok(data) => println!("Success: {}", data),
        Err(e) => println!("Error: {}", e),
    }
}
```

## Select Multiple Futures

Wait for the first future to complete:

```rust
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    let task1 = sleep(Duration::from_secs(2));
    let task2 = sleep(Duration::from_secs(1));
    
    tokio::select! {
        _ = task1 => println!("Task 1 completed"),
        _ = task2 => println!("Task 2 completed"),
    }
}
```

## Common Patterns

### Timeout

```rust
use tokio::time::timeout;

#[tokio::main]
async fn main() {
    let result = timeout(
        tokio::time::Duration::from_secs(1),
        async { /* long operation */ }
    ).await;
    
    match result {
        Ok(value) => println!("Success: {:?}", value),
        Err(_) => println!("Timeout!"),
    }
}
```

### Retries

```rust
async fn operation() -> Result<String, String> {
    Err("Failed".to_string())
}

#[tokio::main]
async fn main() {
    let mut attempts = 0;
    loop {
        attempts += 1;
        match operation().await {
            Ok(result) => {
                println!("Success: {}", result);
                break;
            }
            Err(e) => {
                if attempts >= 3 {
                    println!("Failed after 3 attempts: {}", e);
                    break;
                }
                tokio::time::sleep(
                    tokio::time::Duration::from_millis(100)
                ).await;
            }
        }
    }
}
```

## Best Practices

1. **Use `#[tokio::main]`** - Simplifies runtime setup
2. **Spawn tasks for independent work** - They run concurrently
3. **Use channels for communication** - Keep tasks decoupled
4. **Handle errors properly** - Result types are your friend
5. **Be careful with `.await`** - It's a suspension point
6. **Avoid blocking calls** - Use async-friendly libraries
7. **Use `select!` wisely** - For racing futures

## Async and Await Summary

Async/await is the gateway to concurrent programming in Rust. It lets you write code that feels synchronous but runs concurrently, all without spawning new threads. This is the power of zero-cost abstractions—the performance of manual task scheduling with the ergonomics of simple code.

The future is async. Master it, and you'll build systems that scale.
