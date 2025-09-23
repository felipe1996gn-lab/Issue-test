# Overview

This is a FreeCodeCamp Issue Tracker project - a web application that allows users to create, view, update, and delete issues for different projects. The application serves as a basic project management tool where issues can be tracked with details like title, description, creator, assignee, and status. It's built as a boilerplate project for learning purposes with comprehensive testing support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Framework
- **Express.js**: RESTful API server handling HTTP requests and serving static files
- **Node.js**: Runtime environment for server-side JavaScript execution
- **Body-parser middleware**: Processes incoming request bodies for form data and JSON
- **CORS enabled**: Allows cross-origin requests for FreeCodeCamp testing purposes

## API Design
- **RESTful architecture**: Single endpoint `/api/issues/:project` with HTTP methods (GET, POST, PUT, DELETE)
- **Project-based routing**: Issues are organized by project name passed as URL parameter
- **Query parameter filtering**: GET requests support filtering by issue properties
- **JSON response format**: Standardized data exchange using JSON

## Frontend Architecture
- **Static HTML pages**: Simple server-side rendered views without frontend frameworks
- **jQuery integration**: Client-side JavaScript for dynamic interactions and AJAX calls
- **Responsive design**: Basic CSS styling with mobile-friendly viewport settings
- **Form-based interactions**: HTML forms for creating and updating issues

## Data Storage
- **No database implementation**: Current boilerplate contains empty route handlers requiring database integration
- **In-memory storage anticipated**: Suitable for development and testing phases
- **Structured data model**: Issues contain fields like _id, issue_title, issue_text, created_by, assigned_to, open status, timestamps

## Testing Framework
- **Mocha**: Test runner for automated testing suite
- **Chai**: Assertion library with HTTP testing capabilities via chai-http
- **Custom test runner**: Specialized test execution system for FreeCodeCamp requirements
- **TDD approach**: Test-driven development structure with separate functional test files

## File Organization
- **Routes separation**: API routes isolated in `/routes/api.js` for modularity
- **Public assets**: Static files (CSS, images) served from `/public` directory
- **View templates**: HTML files organized in `/views` directory
- **Test isolation**: Testing files contained in `/tests` directory

# External Dependencies

## Core Dependencies
- **Express.js (^4.17.1)**: Web application framework for Node.js
- **Body-parser (^1.19.0)**: Middleware for parsing request bodies
- **CORS (^2.8.5)**: Cross-Origin Resource Sharing middleware
- **Dotenv (^8.2.0)**: Environment variable management from .env files

## Testing Dependencies
- **Mocha (^8.1.3)**: JavaScript testing framework
- **Chai (^4.2.0)**: Assertion library for testing
- **Chai-HTTP (^4.3.0)**: HTTP integration testing plugin for Chai

## Development Tools
- **jQuery (2.2.1)**: Client-side JavaScript library loaded via CDN
- **FreeCodeCamp testing suite**: Custom testing infrastructure for project validation

## Missing Integrations
- **Database system**: No database connection configured (MongoDB, PostgreSQL, or similar would be typical)
- **Authentication system**: No user authentication or session management
- **Logging system**: No structured logging implementation
- **Process management**: No production-grade process management (PM2, Forever, etc.)