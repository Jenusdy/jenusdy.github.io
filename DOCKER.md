# Docker Setup for Gatsby Portfolio

This project includes Docker configuration to run your Gatsby portfolio website in containers for both development and production environments.

## Files Created

- `Dockerfile` - Production build
- `Dockerfile.dev` - Development build with hot reloading
- `docker-compose.yml` - Orchestration for both environments
- `.dockerignore` - Optimizes build by excluding unnecessary files

## Quick Start

### Development (with hot reloading)

```bash
# Start development environment
docker-compose up gatsby-dev

# Or run in background
docker-compose up -d gatsby-dev
```

Your site will be available at: http://localhost:8000

### Production

```bash
# Build and start production environment
docker-compose up gatsby-prod

# Or run in background
docker-compose up -d gatsby-prod
```

Your site will be available at: http://localhost:9000

## Manual Docker Commands

### Development

```bash
# Build development image
docker build -f Dockerfile.dev -t gatsby-portfolio-dev .

# Run development container
docker run -p 8000:8000 -v $(pwd):/app -v /app/node_modules gatsby-portfolio-dev
```

### Production

```bash
# Build production image
docker build -t gatsby-portfolio-prod .

# Run production container
docker run -p 9000:9000 gatsby-portfolio-prod
```

## Useful Commands

```bash
# Stop all services
docker-compose down

# Rebuild and start services
docker-compose up --build

# View logs
docker-compose logs gatsby-dev
docker-compose logs gatsby-prod

# Clean up Docker resources
docker-compose down --volumes --remove-orphans
docker system prune -a
```

## Environment Variables

You can set environment variables in the `docker-compose.yml` file or create a `.env` file:

```bash
# .env file
NODE_ENV=development
GATSBY_API_URL=your_api_url
```

## Troubleshooting

1. **Port already in use**: Change the port mapping in `docker-compose.yml`
2. **Permission issues**: On Linux/Mac, you might need to adjust file permissions
3. **Node modules issues**: Try `docker-compose down --volumes` and rebuild

## Notes

- The development setup includes volume mounting for live code changes
- Production build creates an optimized static site
- Both containers run on Alpine Linux for smaller image sizes
- The site is configured to accept connections from any host (0.0.0.0)
