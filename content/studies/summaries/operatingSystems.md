---
slug: operatingSystems
title: "Operating Systems A. Maier (S3)"
description: A summary containing the most important information from the lecture in semester 3 (theory block 4)
img: https://web-notes.me/Logo.png
date: 28 March 2022
---

# Summary Operating Systems

## Content of the exam

- [x] General Introduction and History (6 points)
  - [x] history (no years!)
  - [x] differences unix linux
  - [x] how windows came to be

- [x] Processes (3 points)
  - [x] general
  - [x] state model
  - [x] system load (CPU Utilization)
  - [ ] priorities (not found)
    - don't need to know nice command

- [x] Scheduling (9 points)
  - algorithms
    - [x] how they work
    - [x] advantages/disadvantages
    - [x] draw diagrams -> learning by doing
    - [x] how algorithm handle the processes

- [x] Interrupts, Exceptions, and System Calls (3 points)
  - [x] concept
  - only smaller questions
  - don't have to know interupt table

- [x] Interprocess Communication (4 points)
  - [x] most common forms
  - [x] semaphore, ...
  - not: shared memory, sleeping barbers, dining philosophers, cigerets
  - but the general mechanism
  - (he was not sure about the others)

- [x] Memory Management (5 points)
  - [x] basic natur of types
  - [x] hierarchy
  - [x] swaping
  - [x] problems
  - [x] algorithms

## General Introduction and History
- OS
  - set of programs that enables multiple users to concurrently use a computer system in a convenient way
  - main functions: **abstraction**, **resource management**

### History
- ENIAC (Electronic Numerical Integrator And Computer)
- 1st generation
  - plug boards / card decks to load program
  - machine language
- 2nd generation
  - mainframes
  - Assembler, FORTRAN
  - efficient use of hardware -> batch system
  - Batch system: punch card -> magnetic tape (use to do things) -> paper
- 3rd generation
  - ICs
  - multiprogramming -> memory partitioning
  - timesharing -> MULTICS
  - UNIX
- 4th generation
  - large scale IC
  - smaller + cheaper 
  - user-friendliness -> Macintosh, Windows
- 5th generation
  - mobile phones
  - voice + data network
  - IOS, Android

### Characteristics of an OS
- purpose
  - self-organization of computer systems
- approach
  - abstraction from hardware
    - number of processors/cores
    - size of RAM
    - connected devices
- objective
  - utilize processing power and peripherals efficient
  - run programs independently from hardware
  
### Components of an OS
- abstract processor architecture
- process management
  - concurrency, threads, scheduling, interaction between processes
- process synchronization
  - non-blocking, semaphore, monitors, synchronization errors
- memory management
  - static/dynamic allocation
- address spacing
  - page swapping
  - virtual addressing
- exception handling
- I/O
  - abstract devices
- file and user management
  - security mechanisms

### Difference Unix/Linux
- MULTICS (Multiplexed Information and Computing Service)
  - experimental, multi-user, too complex
  - GE-645 mainframe
- UNIX/UNICS (Uniplexed Information and Computing Service)
  - based on MULTICS experience
  - last survivor: MacOS
  - each program do one thing well
- Linux 
  - kernel by Linus Torvalds
  - concepts of UNIX
- GNU (GNU's not UNIX)
  - free / open source
- GNU + Linux
  - complete OS
- Linux distributions
  - Linux + GNU + proprietary software (not free)
  - Debian, Slackware, Red Hat

| Linux | UNIX |
| - | - |
| free/open-source | proprietary AT&T |
| free community support | payed commercial support |
| wide compatibility | limited |
| common kernel within distributions | no common kernel within distributions |
| frequent bug fixes | infrequent bug fixes |
[by J. Brandenburger](https://f.brandenburger.dev/operating-systems/summary.md.html)

### How Windows came to be
- Need for user-friendly operating system

## Processes
### general
- instance of program that is being executed
- one or more child processes + has parent
- executed by one/multiple threads
- program is the code, process is the executing part

### context switching
- context = processes current state of execution
  - program counter, register, virtual address space
- switching
  - process execution suspended
  - context stored
  - load next context
  - resume execution
  - hardware
    - performed by CPU
  - software
    - by OS
    - \+ performance, + portability
  - dispatcher (part of scheduler)
    - handles switching
    - alters flow of execution

### Process vs Thread
- single process can have multiple threads
- thread = separate independent path of execution
- all threads of process share address space of process
- separate execution stacks
- \+ less context switching time
- \+ efficient communication between threads
- \+ concurrency within process

### Process-related OS Objectives
- maximize processor utilization
- allocate resources to processor
- prioritize execution
- user creation of process
- mechanism for synchronization + inter-process communication

### state model
<img src="https://henry-schuler.vercel.app/images/studies/operatingsystems/process_states.png" alt="process_states.png missing">

*image by A. Maier*

### system load (CPU Utilization)
- **utilization = burst time / period time**
- 100% Utilization on single core -> 1.0
- 100% Utilization on quad core -> 4.0
- Linux: top or uptime show -> 1min, 5min, 15min 
  - Example (quad core): 7.12, 2.02, 0.83

### priorities (not found)

## Scheduling
- maximize utilization
- fair CPU allocation
- minimize turn around time
- minimize waiting time
- maximize throughput (processes that complete execution / time unit)

### Times
- arrival time 
  - process arrives in ready queue
- completion time
  - time at witch process completes
- burst time
  - required CPU time for execution
- turnaround time
  - completion time - arrival time
- waiting time
  - time waiting in the ready queue

### Algorithms
- non-preemptive scheduling
  - process holdes CPU until completed or turns to waiting state
- preemptive scheduling
  - process can be taken from CPU in favour of other process
  
<img src="https://henry-schuler.vercel.app/images/studies/operatingsystems/scheduling_queue.png" alt="scheduling_queue.png missing">

*image by A. Maier*

- scheduling strategy

<img src="https://henry-schuler.vercel.app/images/studies/operatingsystems/scheduling_strategy.png" alt="scheduling_strategy.png missing">

*image by A. Maier*

- first come first serve
  - \+ simple to implement
  - \+ no starvation
  - \- no priority
  - \- low throughput

<img src="https://henry-schuler.vercel.app/images/studies/operatingsystems/first_come_first_serve.png" alt="first_come_first_serve.png missing">

*image by A. Maier*

- shortest job first
  - \+ priority is inverse of predicted burst time
  - \- burst time must be known
  - \- risk of starvation

<img src="https://henry-schuler.vercel.app/images/studies/operatingsystems/shortest_job_first.png" alt="shortest_job_first.png missing">

*image by A. Maier*

- shortest remaining time first
  - \- overhead due to context starvation
  - \- starvation possible

<img src="https://henry-schuler.vercel.app/images/studies/operatingsystems/shortest_remaining_time_first.png" alt="shortest_remaining_time_first.png missing">

*image by A. Maier*

- highest response ratio next
  - **response ration = 1 + (waiting time / estimated run time)**
  - \+ lowers possibility of starvation

- round robin
  - fixed time quantum
  - \+ process rescheduling if not finished within quantum
  - \+ no starvation
  - \- overhead due to context switching
    - quantum should be significantly higher than context switching time (e.g. 100ms; 10µs)

<img src="https://henry-schuler.vercel.app/images/studies/operatingsystems/round_robin.png" alt="round_robin.png missing">

*image by A. Maier*

- priority based scheduling
  - \- same priority -> second scheduling algorithm
  - \- risk of starvation in preemptive scheduling

<img src="https://henry-schuler.vercel.app/images/studies/operatingsystems/priority_based.png" alt="priority_based.png missing">

*image by A. Maier*

- multilevel queue scheduling
  - processes sorted in different groups with own algorithms
  - additional scheduling between queues

<img src="https://henry-schuler.vercel.app/images/studies/operatingsystems/multilevel_queue.png" alt="multilevel_queue.png missing">

*image by A. Maier*

- multilevel feedback queue scheduling
  - processes move between queues based on spent CPU time
    - too much time -> queue with less priority
    - long waiting -> moved up in queue
  - \+ most general scheduler
  - \- most complex to implement

- completely fair scheduler
  - used by Linux kernel
  - every process gets 1/n CPU time
  - sleeping process earns CPU time -> i.e. boost on wake up
  - virtual runtime
    - **vruntime = (runtime / weight)**
    - runtime = time in CPU
    - weight = priority
    - slower increase of vruntime for process with high priority
    - **choose process with lowest vruntime**

- earliest deadline first
  - deadlines can be met if enough computing resources available
  - \- requires system clock
  - \- overload -> missing deadline (unpredictable)
  - \- difficult to implement in hardware

### Real time operating system
- guarantee certain behavior within predictable time constraint
- hard
  - deadline must always be met (collision avoidance system in aircraft)
- soft
  - occasionally can miss deadlines (decoder for media streaming)

## Interrupts, Exceptions, System Calls
- react on internal events (CPU might be bussy)
  - mouse movement, key pressing, network package arrives

### Polling
- periodically check each potential source
  - \- between two polls -> miss
  - \- inefficient, high latency
  
### Interrupts
- notification on occurrence
  - CPU alters flow of execution in order to handle interrupt
- \+ time critical events
- \+ infrequent events

#### Types
- Hardware
  - signal from external device
  - interrupt controller maps to one interrupt pin
- Software
  - processor (i.e. divide by zero, interruption instruction (INT))

#### Interrupt Vector Table
- maps exception/interrupt event to address of handler (Interrupt Service Routine)
- first 32: CPU specific

#### Triggers
- Level
  - get interrupt as long as signal is there
- Edge
  - only one interrupt at each edge (rising/falling)

#### Spurious Interrupt
- CPU gets notified that Interrupt has occurred
  - waiting for information
  - notification ends before information is there
    - spurious (falsch)
- should be handled with lowest priority

#### Latency
- Hardware (APICs, CPU), Software (Operating System)
- state of current program needs to be stored
- OS completes atomic operations first
- RTOS must guarantee interrupt latency lower than certain value

#### System Calls
- request services from kernel
- processor switch from user mode to kernel mode
- implemented via software interrupts (trap)

## Interprocess Communication
- intercommunicate and synchronize processes
- IPC applications: server - client

### Approaches
- file
- signal / asynchronous system trap (AST)
- socket
- message queue
- pipe
- shared memory
- message passing
- memory-mapped file 

### Signals
- asynchronous signal sent from one process to another
- target process interrupted
- signal numbers / mnemonics
- signals do not carry arguments
- default signal handler
  - ignores signal or causes target process to die
- signal handler defined by process
  - customized signal code
  - programmers cannot catch signals that are important for system integrity (SIGKILL)

### Named Pipes
- UNIX FIFOs -> mapped into file system
- look like normal files
- mkfifo / mkfifo()

### Message Passing
- two processes can communicate via send() and receive()
- direct
  - knows receivers identity -> send directly
- indirect
  - sent to mailbox (port)
  - stored until receiving process receives it
    - buffering system

### Message Queue
- linked list within kernels' addressing space
- send message to queue in order
- retrieved in several different ways

### Common problems
- Synchronization
  - critical section, bounded buffer, dining philosophers, readers-writers, sleeping barber, cigarette smoker
- semaphore
  - data structure
  - reserve (wait()) and free (signal()) certain spaces
    - counter not 0 -> -1 and map resource
    - counter is 0 -> process waits
    - process finished -> +1
- mutual exclusion (MUTEX)
  - preserve multiple processes to access memory if other access already
- spinlock
  - lock spaces, other processes cannot access this space
- monitor 
  - MUTEX and LOCK

## Memory Management
- want to be fast, dense, cheap, energy-saving
- different type of memories (hierarchy)
  - fast to slow
  - small to large
  - expensive to cheap
  - energy consuming to saving
- register -> L1 (KiB) -> L2 (hundred KiB) -> L3 (MiB) -> DRAM (GiB)
- L3 is mostly shared, register, L1, L2 per CPU

### Allocation of Processes
- Static
  - low layers of OS can be assigned to fix location in memory
- dynamic
  - higher layers have limited life span
  - require dynamic allocation (process)
  - memory management
    - allocate() and free() from kernel
  - segmentation with paging
  - segmentation without paging
  
### Simple Memory Segmentation
- processes split into three parts
  - Stack, Data, Code
  - no need to be contiguous
  - segments of arbitrary size
    - placed by placement algorithm
- segment size = requested memory size
  - may not fit precisely into any region
- no internal fragmentation
  - exact size is requested
- external fragmentation may occur
  - areas of unused memory too small is inevitable
- OS maintains segment table
  - keep track of stored segments
- Logical address
  - segment number
  - offset
- Physical address
  - base address
  - offset (offset less than segment size)

### Simple Paging
- physical memory 
  - divided into fixed chunks (frames)
  - frame size is power of 2 (between 512 bytes and 16 MiB)
- logical memory
  - divided into fixed blocks (pages)
  - process execution -> its pages are loaded into available memory frames
  - only whole frames can be assigned to process
- releasing processes
  - non-contiguous frames occur
  - address space non-contiguous
- page table 
  - keeps track of where pages of processes are located
  - one for each process
  - table stored in memory

### Virtual Memory

<img src="https://henry-schuler.vercel.app/images/studies/operatingsystems/virtual_memory.png" alt="virtual_memory.png missing">

*image by A. Maier*

- parts of address space can be mapped to disk space
- not needed memory -> write to disk, retrieved to RAM when necessary
- \+ security
  - each program has his own page table
  - process cannot directly access another process' physical RAM
- \+ contiguous address space per program/process
  - virtual address contiguous, physical memory fragmented
  - OS in charge of memory management, not programmer
- \- program performance
  - hard drives slower than RAM (-> buy more RAM)
- \- memory isolation
  - more difficult to share data between programs
  - mapping and OS have to provide functionality

### Page Table
- Problem: map to convert virtual to physical address needs one entry for each address
- Solution: pages
- no address ranges
  - base address + offset (can be same in virtual and physical)

<img src="https://henry-schuler.vercel.app/images/studies/operatingsystems/page_in_memory.png" alt="page_in_memory.png missing">

*image by A. Maier*

### Swapping
- requested page is on disk -> **page fault** exception
- page fault handler (OS)
  - free RAM for page
  - page replacement algorithm decides which page is swapped
  - dirty page (modified while on disk) -> need to be written back to disk
  - page in RAM, page table updated
  
### Page Replacement Algorithms
- Optimal algorithm
  - page whose next occurrence is farthest in the future is swapped
  - cannot be implemented, unforeseeable
- FIFO
  - picks oldest page in memory to swap
  - \+ simple to implement
  - \- performs poorly
- Least Recently Used (LRU)
  - assume: frequently used pages will be used again soon
  - \- high implementation cost
