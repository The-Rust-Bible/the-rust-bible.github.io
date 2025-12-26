# Concurrency and Threads

## Understanding Concurrency

Concurrency allows your program to handle multiple tasks at the same time. Rust provides multiple models for safe concurrent programming.

### Concurrency vs Parallelism

- **Concurrency** - Multiple tasks making progress (may or may not run simultaneously)
- **Parallelism** - Multiple tasks running simultaneously on multiple cores

## Threads

A thread is a sequence of instructions executed independently within a program.

### Creating Threads

```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        for i in 0..5 {
            println!("hi number {} from the spawned thread!", i);
        }
    });
    
    for i in 0..3 {
        println!("hi number {} from the main thread!", i);
    }
    
    handle.join().unwrap(); // Wait for thread to finish
}
```

### Thread Lifetimes

Spawned closures must have a `'static` lifetime:

```rust
use std::thread;

fn main() {
    let v = vec![1, 2, 3];
    
    // This won't compile - v doesn't live long enough
    // let handle = thread::spawn(|| {
    //     println!("{:?}", v);
    // });
    
    // Use move to transfer ownership
    let handle = thread::spawn(move || {
        println!("{:?}", v); // OK
    });
    
    handle.join().unwrap();
}
```

## Message Passing (Channels)

Channels allow threads to communicate safely:

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    
    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });
    
    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

### Multiple Producers

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    
    // Clone transmitter for multiple threads
    let tx1 = tx.clone();
    
    thread::spawn(move || {
        tx1.send("Message from thread 1").unwrap();
    });
    
    thread::spawn(move || {
        tx.send("Message from thread 2").unwrap();
    });
    
    for msg in rx {
        println!("Received: {}", msg);
    }
}
```

### Non-blocking Receive

```rust
use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();
    
    // Send a message
    tx.send(5).unwrap();
    
    // Non-blocking receive
    match rx.try_recv() {
        Ok(value) => println!("Got: {}", value),
        Err(e) => println!("No message: {:?}", e),
    }
}
```

## Shared Memory (Mutex)

Mutex allows safe shared access to data:

```rust
use std::sync::Mutex;

fn main() {
    let counter = Mutex::new(0);
    
    {
        let mut num = counter.lock().unwrap();
        *num += 1;
    } // Lock is released here
    
    println!("Counter: {}", counter.lock().unwrap());
}
```

### Sharing Across Threads with Arc

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
    
    println!("Result: {}", *counter.lock().unwrap());
}
```

## Synchronization Primitives

### RwLock: Multiple Readers, Single Writer

```rust
use std::sync::RwLock;

fn main() {
    let data = RwLock::new(vec![1, 2, 3]);
    
    // Multiple readers
    let r1 = data.read().unwrap();
    let r2 = data.read().unwrap();
    println!("{:?}, {:?}", &*r1, &*r2);
    drop(r1);
    drop(r2);
    
    // Single writer
    let mut w = data.write().unwrap();
    w.push(4);
}
```

### Once: Execute Code Once

```rust
use std::sync::Once;

static INIT: Once = Once::new();
static mut VALUE: usize = 0;

fn main() {
    unsafe {
        INIT.call_once(|| {
            VALUE = 42;
        });
        
        println!("VALUE = {}", VALUE);
    }
}
```

## Thread Pooling

For managing multiple worker threads efficiently:

```rust
use std::sync::{Arc, Mutex, mpsc};
use std::thread;

pub struct ThreadPool {
    workers: Vec<Worker>,
    sender: mpsc::Sender<Message>,
}

type Job = Box<dyn FnOnce() + Send + 'static>;

enum Message {
    NewJob(Job),
    Terminate,
}

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>,
}

impl ThreadPool {
    pub fn new(size: usize) -> ThreadPool {
        let (sender, receiver) = mpsc::channel();
        let receiver = Arc::new(Mutex::new(receiver));
        
        let mut workers = Vec::with_capacity(size);
        for id in 0..size {
            workers.push(Worker::new(id, Arc::clone(&receiver)));
        }
        
        ThreadPool { workers, sender }
    }
    
    pub fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        let job = Box::new(f);
        self.sender.send(Message::NewJob(job)).unwrap();
    }
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Message>>>) -> Worker {
        let thread = thread::spawn(move || {
            loop {
                let message = receiver.lock().unwrap().recv().unwrap();
                
                match message {
                    Message::NewJob(job) => {
                        job();
                    }
                    Message::Terminate => break,
                }
            }
        });
        
        Worker {
            id,
            thread: Some(thread),
        }
    }
}
```

## Common Patterns

### Producer-Consumer

```rust
use std::sync::{Arc, Mutex};
use std::thread;
use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();
    
    // Producer
    thread::spawn(move || {
        for i in 0..10 {
            tx.send(i).unwrap();
        }
    });
    
    // Consumer
    for value in rx {
        println!("Received: {}", value);
    }
}
```

### Thread Barrier

```rust
use std::sync::{Arc, Barrier};
use std::thread;

fn main() {
    let barrier = Arc::new(Barrier::new(3));
    let mut handles = vec![];
    
    for i in 0..3 {
        let barrier = Arc::clone(&barrier);
        let handle = thread::spawn(move || {
            println!("Thread {} before barrier", i);
            barrier.wait(); // All threads wait here
            println!("Thread {} after barrier", i);
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.join().unwrap();
    }
}
```

## Best Practices

1. **Prefer channels for message passing** - More ergonomic than shared state
2. **Use Arc for shared ownership** - Prevents data races
3. **Use Mutex for shared mutable state** - Provides interior mutability
4. **Minimize lock scope** - Hold locks for as short as possible
5. **Avoid deadlocks** - Always acquire locks in the same order
6. **Use RwLock for read-heavy workloads** - Allows multiple readers
7. **Consider thread pooling** - For many short-lived tasks

## Common Pitfalls

### Deadlock

```rust
// Can deadlock if not careful with locking order
let a = Mutex::new(1);
let b = Mutex::new(2);

thread::spawn(move || {
    let _a = a.lock();
    let _b = b.lock(); // May deadlock
});
```

### Panic in Thread

```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        panic!("Thread panicked!");
    });
    
    // The main thread continues even if the spawned thread panics
    match handle.join() {
        Ok(_) => println!("Thread finished"),
        Err(_) => println!("Thread panicked"),
    }
}
```

## Concurrency and Threads Summary

Rust's concurrency model eliminates entire classes of bugs—data races, race conditions, and deadlocks—at compile time. With threads, channels, and smart synchronization primitives, you can write fearlessly concurrent code that scales across multiple cores.

The Borrow Checker watches over your concurrent code, ensuring that shared data is accessed safely. This is fearless concurrency in action.
