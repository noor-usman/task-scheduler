# Design for a Distributed Task Scheduler

This design document outlines a distributed task scheduler system which includes task management, and execution with specific execution times or using Cron syntax. This design aims for high availability, durability, and cost-effectiveness.

## Core Components

These are the core components of our monolithic prototype deployed with multiple instances to make it a highly available distributed system.

1. **Client Interface**
2. **Task Scheduler**
3. **Task Executor**
4. **In-Memory Database**

### Client Interface

- **Technology**: React.js with TypeScript for frontend
- **Features**:
  - Schedule a task (One-time or recurring task)
  - List down scheduled tasks (with editing and deleting options)
  - List of executed tasks

### Task Scheduler

- **Technology**: Node.js and Express.js with TypeScript to create a backend server
- **Architecture**: Implemented REST API architecture for CRUD operations
- **Functionality**:
  - Store task metadata in an in-memory database
  - Handle execution times for recurring tasks

### Task Executor

- **Functionality**:
  - Set a worker thread to keep iterating over the executable tasks
  - Fetch tasks from in-memory database
  - Worker thread will execute tasks within a 10-second window
  - Log executed tasks

### In-Memory Database

- **Technology**: SQLite as an in-memory database
- **Functionality**:
  - Store task metadata
  - Support Read/Write/Delete/Update operations

## High Availability and Durability

- **Data Durability**: Use a durable database with backup and restore capabilities.
- **High Availability**: Deploy the application with replication and load balancing.
- **Fault Tolerance**: Implement retries, fallbacks, and logging for error handling.

## Chokepoints and Mitigations

- **Database Performance**: As the number of tasks grows, database queries might become a bottleneck. Mitigation includes indexing based on "status" or "scheduleTime", and using replicas for read/write operations.
- **Thread Management**: Ensure proper management of worker threads to prevent resource exhaustion.

## Scaling Up and Down

- **Vertical Scaling**: Increase resources (CPU, RAM) of the monolithic application instance.
- **Database Scaling**: Use read replicas and partitioning if necessary.
- **Load Distribution**: Use horizontal scaling for the Task API to handle more client requests.
- **Expansion**: Current monolithic application is covering our requirements but in case of expansion, we can make a shift to microservices architecture in the early stages.

## Expansion to Microservices

We can expand our current monolithic system into a microservices backend to make it a distributed system. Below are listed services:

1. **API Gateway**: For user authentication and to receive client-side requests and redirect to relevant services.
2. **Task Scheduler Service**: Handles task registration and scheduling.
3. **Task Executor Service**: Handles executing a scheduled task.
4. **Task Storage Service**: Store task metadata and execution logs.
5. **Task Monitor Service**: To make retries in case a task is not executed or failed.

## Overall Flow Diagram


![Distributed Task Scheduler](https://github.com/noor-usman/task-scheduler/assets/170473170/72aac7e7-35d7-4077-9304-af1ce7f4f235)
