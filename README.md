# 🧭 StudentCompass - AI-Powered Career Intelligence Platform

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.java.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docs.docker.com/compose/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Overview

StudentCompass is a comprehensive AI-powered platform designed to help college students discover personalized project recommendations, track their learning progress, and build impressive portfolios. The platform leverages advanced machine learning algorithms to match students with projects that align with their skills, interests, and career goals.

### ✨ Key Features

- **🤖 AI-Powered Recommendations**: Intelligent project suggestions based on skills, interests, and career goals
- **📊 Progress Tracking**: Comprehensive dashboard to monitor learning journey and achievements
- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **📱 Responsive Design**: Modern, mobile-first UI built with React and Tailwind CSS
- **🔄 Real-time Updates**: Live notifications and progress updates
- **📈 Analytics Dashboard**: Detailed insights into learning patterns and project completion rates
- **🌐 RESTful API**: Well-documented API for third-party integrations
- **🐳 Containerized Deployment**: Docker-based deployment for easy scaling

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Spring Boot    │    │     MySQL       │
│   (Port 80)     │◄──►│   Backend       │◄──►│   Database      │
│                 │    │   (Port 8081)   │    │   (Port 3306)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│     Redis       │◄─────────────┘
                        │     Cache       │
                        │   (Port 6379)   │
                        └─────────────────┘
```

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.0
- **Language**: Java 17
- **Database**: MySQL 8.0 with Flyway migrations
- **Cache**: Redis 7.0
- **Security**: Spring Security with JWT
- **AI Integration**: OpenAI GPT-4 API
- **Documentation**: OpenAPI 3.0 (Swagger)
- **Testing**: JUnit 5, Mockito
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18.2.0
- **Language**: TypeScript/JavaScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Build Tool**: Vite

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Monitoring**: Prometheus & Grafana
- **CI/CD**: GitHub Actions (planned)
- **Cloud**: AWS/Azure ready

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Java 17+ (for local development)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/StudentCompass.git
cd StudentCompass
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# OpenAI Configuration (Optional - fallback mode available)
OPENAI_API_KEY=your_openai_api_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure

# Database Configuration
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_PASSWORD=apppassword

# Redis Configuration (Optional)
REDIS_PASSWORD=redispassword
```

### 3. Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 4. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8081/api
- **API Documentation**: http://localhost:8081/swagger-ui.html
- **Database**: localhost:3306
- **Redis**: localhost:6379

## 🔧 Development Setup

### Backend Development

```bash
cd whatto-build-college

# Install dependencies
./mvnw clean install

# Run with development profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Run tests
./mvnw test
```

### Frontend Development

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 📊 Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users**: Student and admin user management
- **Skills**: Normalized skill taxonomy
- **Projects**: Project catalog with metadata
- **Recommendations**: AI-generated project suggestions
- **Progress**: User learning progress tracking
- **Reviews**: Project ratings and feedback

### Running Migrations

```bash
# Migrations run automatically on startup
# To run manually:
./mvnw flyway:migrate -Dflyway.configFiles=src/main/resources/application.properties
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Student, Instructor, and Admin roles
- **Password Encryption**: BCrypt with salt rounds
- **CORS Configuration**: Secure cross-origin resource sharing
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers

## 🤖 AI Integration

The platform integrates with OpenAI's GPT-4 for intelligent recommendations:

- **Fallback Mode**: Works without API key using rule-based algorithms
- **Circuit Breaker**: Automatic fallback on API failures
- **Retry Logic**: Exponential backoff for transient failures
- **Caching**: Redis-based response caching
- **Rate Limiting**: API usage optimization

## 📈 Monitoring & Observability

### Health Checks

```bash
# Application health
curl http://localhost:8081/actuator/health

# Detailed health info
curl http://localhost:8081/actuator/health/liveness
curl http://localhost:8081/actuator/health/readiness
```

### Metrics

- **Prometheus**: http://localhost:9090 (with monitoring profile)
- **Grafana**: http://localhost:3000 (admin/admin123)

## 🧪 Testing

### Backend Tests

```bash
# Unit tests
./mvnw test

# Integration tests
./mvnw verify

# Test coverage
./mvnw jacoco:report
```

### Frontend Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 🚀 Deployment

### Production Deployment

```bash
# Build and deploy with production profile
docker-compose --profile production up -d

# Scale services
docker-compose up -d --scale backend=3
```

### Environment-Specific Configurations

- **Development**: `application-dev.properties`
- **Docker**: `application-docker.properties`
- **Production**: `application-prod.properties`

## 📚 API Documentation

The API is fully documented using OpenAPI 3.0. Access the interactive documentation at:

- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8081/v3/api-docs

### Key Endpoints

```
POST /api/auth/signin          # User authentication
POST /api/auth/signup          # User registration
GET  /api/recommendations      # Get AI recommendations
GET  /api/projects            # Browse project catalog
POST /api/projects/{id}/start # Start a project
GET  /api/profile             # User profile management
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **Backend**: Google Java Style Guide
- **Frontend**: Prettier + ESLint configuration
- **Commits**: Conventional Commits specification

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 80, 8081, 3306, 6379 are available
2. **Memory Issues**: Increase Docker memory allocation to 4GB+
3. **Database Connection**: Check MySQL container health status
4. **API Key Issues**: Application works in fallback mode without OpenAI key

### Getting Help

- 📧 Email: support@studentcompass.dev
- 💬 Discord: [StudentCompass Community](https://discord.gg/studentcompass)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/StudentCompass/issues)

## 🎯 Roadmap

- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with GitHub for automatic project tracking
- [ ] Collaborative features and team projects
- [ ] Machine learning model improvements
- [ ] Multi-language support
- [ ] Gamification features

---

**Built with ❤️ by the StudentCompass Team**
#   s i d e p r o j e c t 2 1  
 