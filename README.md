# 🤖 Botsify MCP Server

A modular, maintainable, and future-proof Model Context Protocol (MCP) server for Botsify API integration. This server provides a clean interface for managing chatbot settings through both stdio and HTTP transports.

## 🏗️ Architecture

The refactored codebase follows a modular architecture with clear separation of concerns:

```
src/
├── config/          # Configuration management
├── types/           # TypeScript type definitions
├── services/        # Business logic services
├── tools/           # MCP tool implementations
├── controllers/     # HTTP request handlers
├── middleware/      # Express middleware
├── utils/           # Utility functions
└── index.ts         # Main server entry point
```

### Key Features

- **Modular Design**: Clean separation of concerns with dedicated modules
- **Type Safety**: Full TypeScript support with strict type checking
- **Error Handling**: Comprehensive error handling with custom error types
- **Logging**: Structured logging with Winston and context support
- **Validation**: Input validation using Zod schemas
- **Security**: Helmet, CORS, rate limiting, and other security measures
- **Testing**: Jest configuration with coverage reporting
- **Documentation**: Comprehensive API documentation
- **Dual Transport**: Support for both stdio and HTTP transports

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd MCP
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your Botsify API credentials
```

4. Build the project:

```bash
npm run build
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Botsify API Configuration
BOTSIFY_API_BASE_URL=https://dev.botsify.com/api
BOTSIFY_API_KEY=your_api_key_here

# Server Configuration
PORT=3000
LOG_LEVEL=info
NODE_ENV=development
```

## 🛠️ Usage

### Stdio Mode (Default)

Run the server in stdio mode for MCP client integration:

```bash
npm start
```

### HTTP Mode

Run the server in HTTP mode for REST API access:

```bash
# Default port (3000)
npm start -- --http

# Custom port
npm start -- --http --port 8080
```

### Development Mode

Run in development mode with hot reloading:

```bash
npm run dev
```

## 📚 API Documentation

### HTTP Endpoints

#### Health Check

```http
GET /health
```

#### List Available Tools

```http
GET /api/tools/list
```

#### Call a Tool

```http
POST /api/tools/call
Content-Type: application/json

{
  "tool": "get-bot-settings",
  "args": {
    "key": "website-chatbot-primary-color"
  }
}
```

#### Get Tool Documentation

```http
GET /api/tools/docs/:tool
```

### Available Tools

#### 1. get-bot-settings

Retrieve bot settings by key or value.

**Parameters:**

- `key` (optional): Setting key to retrieve
- `value` (optional): Value filter for the setting

**Example:**

```json
{
  "tool": "get-bot-settings",
  "args": {
    "key": "website-chatbot-primary-color"
  }
}
```

#### 2. update-bot-settings

Update a specific bot setting.

**Parameters:**

- `key` (required): The setting key to update
- `value` (required): The new value for the setting

**Example:**

```json
{
  "tool": "update-bot-settings",
  "args": {
    "key": "website-chatbot-primary-color",
    "value": "#007cba"
  }
}
```

#### 3. delete-bot-setting

Delete a specific bot setting.

**Parameters:**

- `key` (required): The setting key to delete

**Example:**

```json
{
  "tool": "delete-bot-setting",
  "args": {
    "key": "website-chatbot-primary-color"
  }
}
```

#### 4. test-bot-api-connection

Test the connection to the Botsify API.

**Parameters:** None

**Example:**

```json
{
  "tool": "test-bot-api-connection",
  "args": {}
}
```

#### 5. smart-bot-settings

Process natural language instructions to manage bot settings.

**Parameters:**

- `text` (required): Natural language instruction
- `value` (optional): Value for update operations

**Example:**

```json
{
  "tool": "smart-bot-settings",
  "args": {
    "text": "Change the chatbot primary color to blue",
    "value": "#0000ff"
  }
}
```

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Build

```bash
# Build for production
npm run build

# Clean build artifacts
npm run clean
```

## 📦 Project Structure

### Core Modules

#### Configuration (`src/config/`)

- Environment variable validation
- Server and API configuration
- Environment-specific settings

#### Types (`src/types/`)

- TypeScript interfaces and types
- Zod validation schemas
- Custom error classes

#### Services (`src/services/`)

- Bot API service for HTTP requests
- Error handling and logging
- Request/response processing

#### Tools (`src/tools/`)

- MCP tool implementations
- Natural language processing
- Fuzzy search for settings

#### Controllers (`src/controllers/`)

- HTTP request handlers
- Input validation
- Response formatting

#### Middleware (`src/middleware/`)

- Error handling middleware
- Request processing
- Security middleware

#### Utils (`src/utils/`)

- Logging utilities
- Helper functions
- Common utilities

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Zod schema validation
- **Error Handling**: Secure error responses
- **Request ID**: Request tracing

## 📊 Monitoring & Logging

### Log Levels

- `error`: Error messages
- `warn`: Warning messages
- `info`: Informational messages
- `debug`: Debug messages

### Log Format

```
2024-01-15 10:30:45 [INFO] Server started on port 3000 [{"service":"Server","port":3000}]
```

### Request Tracing

Each request gets a unique ID for tracing:

```
X-Request-ID: req_1705311045000_abc123def
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start -- --http --port 8080
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8080
CMD ["npm", "start", "--", "--http", "--port", "8080"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Use proper error handling
- Add JSDoc comments for public APIs
- Follow the existing code style

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the API documentation at `/` when running in HTTP mode
- Review the health check endpoint at `/health`

## 🔄 Migration from Legacy Code

The refactored codebase maintains backward compatibility while providing:

- **Better Error Handling**: Custom error types and proper error responses
- **Improved Logging**: Structured logging with context
- **Enhanced Security**: Multiple security layers
- **Type Safety**: Full TypeScript support
- **Modularity**: Clean separation of concerns
- **Testability**: Comprehensive testing infrastructure
- **Documentation**: Complete API documentation

The original functionality is preserved while making the codebase more maintainable and future-proof.
