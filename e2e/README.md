# End-to-End Test Suite for AnythingLLM

## Overview
This directory contains the end-to-end test suite for AnythingLLM, specifically focused on testing the embedding provider integration with Ollama. The test suite ensures that the embedding provider selection works correctly and that all expected models appear in the dropdown when Ollama is configured.

## Project Structure
```
e2e/
├── README.md                    # This file - project overview and setup
├── package.json                 # Test dependencies and scripts
├── playwright.config.js         # Playwright configuration
├── tests/
│   ├── embedding-providers.spec.js    # Main embedding provider tests
│   └── fixtures/
│       └── ollama-models.json         # Mock Ollama model data
├── fixtures/
│   ├── ollama-setup.js         # Ollama seeding utilities
│   └── test-data.js            # Test data generators
├── utils/
│   ├── ollama-client.js        # Ollama API client for test setup
│   └── browser-utils.js        # Browser automation utilities
└── docker/
    └── docker-compose.test.yml  # Test environment setup
```

## Test Strategy

### Scope
- **Primary Focus**: Embedding provider selection and model dropdown functionality  
- **Secondary Focus**: Ollama integration and model discovery
- **Test Level**: End-to-end integration testing

### Test Cases
1. **Provider Selection**: Test selecting Ollama as embedding provider
2. **Model Discovery**: Verify that seeded models appear in dropdown
3. **Model Selection**: Test selecting different embedding models
4. **Settings Persistence**: Verify settings are saved correctly
5. **Error Handling**: Test behavior with invalid Ollama configurations

### Test Data Management
- Mock Ollama instances with predefined models
- Dummy embedding models for consistent testing
- Test database isolation

## Setup Instructions

### Prerequisites
- Node.js >= 18
- Docker and Docker Compose
- AnythingLLM development environment

### Installation
```bash
cd e2e
npm install
```

### Running Tests
```bash
# Run all tests
npm test

# Run with UI mode for debugging  
npm run test:ui

# Run specific test file
npm run test -- embedding-providers.spec.js

# Generate test report
npm run test:report
```

### CI Integration
The test suite is integrated with GitHub Actions to run on every PR that touches embedding-related logic. See `.github/workflows/e2e-tests.yml` for configuration.

## Development Guidelines

### Writing Tests
- Follow the Page Object Model pattern
- Use data-testid attributes for element selection
- Implement proper test isolation and cleanup
- Include both positive and negative test scenarios

### Mock Data
- Use consistent, realistic test data
- Version control all mock responses
- Document any external dependencies

### Debugging
- Use Playwright's trace viewer for test debugging
- Take screenshots on test failures
- Log relevant application state during tests

## Maintenance

### Regular Tasks
- Update test data when new Ollama models are released
- Refresh mock responses to match API changes
- Review and update test coverage

### Integration Points
- Monitor embedding provider API changes
- Update tests when UI components change
- Coordinate with backend team on API modifications

## Dependencies
- `@playwright/test`: E2E testing framework
- `ollama`: Ollama client library for test setup  
- `docker-compose`: Container orchestration for test environment

## Contributing
1. Follow existing test patterns and naming conventions
2. Add tests for new embedding providers when added
3. Update documentation when making structural changes
4. Ensure all tests pass before submitting PRs

---
*This test suite supports the AnythingLLM embedding provider functionality and ensures reliable model selection across different provider integrations.*
