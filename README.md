# Message Queue Integration Testing Project

This project demonstrates testing of message-based microservices using TypeScript and Playwright. It focuses on testing the integration between a producer service, message queue (RabbitMQ), and a consumer service that processes messages and forwards them to an API endpoint.

## Project Structure

```
src/
├── components/
│   └── message-queue/
│       ├── ApiClientComponent.ts     # API client interface and mock implementation
│       ├── MessageQueueComponent.ts  # Message queue interface and mock implementation
│       ├── MessageHandler.ts         # Message processing logic
│       └── MessageTransformer.ts     # Message transformation logic
tests/
└── messageQueue.spec.ts              # Integration tests
```

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

```bash
# Run all tests with standard HTML report
npx playwright test

# Run message queue tests specifically
npx playwright test messageQueue.spec.ts

# Run tests in debug mode
npx playwright test --debug

# Run tests with Allure reporting
npm run test:allure

# Other Allure commands
npm run allure:test      # Run tests with Allure reporter
npm run allure:generate  # Generate Allure report
npm run allure:open      # Open Allure report in browser
```



## Design Patterns

1. **Page Object Model (POM)**
   - Components are modular and reusable
   - Clear separation of concerns
   - Easy to maintain and extend

2. **Interface-based Design**
   - Clear contracts for implementations
   - Type-safe operations
   - Easy to mock for testing

3. **Dependency Injection**
   - Loose coupling between components
   - Easy to test with mock implementations
   - Flexible component configuration

## Allure Reporting

### Viewing Reports
```bash
# Generate and view report
npm run test:allure

# Generate report only
npm run allure:generate

# Open existing report
npm run allure:open
```


