#!/bin/bash

# Oracle Cloud Deployment Script for Portfolio Backend
# This script helps deploy the backend to Oracle Cloud Infrastructure

set -e

echo "🚀 Starting Oracle Cloud deployment for Portfolio Backend..."

# Configuration
PROJECT_NAME="portfolio-backend"
REGION=${OCI_REGION:-"us-ashburn-1"}
COMPARTMENT_ID=${OCI_COMPARTMENT_ID}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v oci &> /dev/null; then
        print_warning "OCI CLI is not installed. You may need it for advanced operations."
    fi
    
    print_status "Prerequisites check completed."
}

# Build Docker image
build_image() {
    print_status "Building Docker image..."
    
    # Get version from package.json
    VERSION=$(node -p "require('./package.json').version")
    IMAGE_NAME="$PROJECT_NAME:$VERSION"
    
    docker build -t $IMAGE_NAME . --no-cache
    docker tag $IMAGE_NAME $PROJECT_NAME:latest
    
    print_status "Docker image built successfully: $IMAGE_NAME"
}

# Test image locally
test_image() {
    print_status "Testing Docker image locally..."
    
    # Stop any existing container
    docker stop $PROJECT_NAME-test 2>/dev/null || true
    docker rm $PROJECT_NAME-test 2>/dev/null || true
    
    # Run container for testing
    docker run -d \
        --name $PROJECT_NAME-test \
        -p 3000:8080 \
        -e NODE_ENV=production \
        -e MONGODB_URI="$MONGODB_URI" \
        -e FRONTEND_URL="https://spanexx.com" \
        $PROJECT_NAME:latest
    
    # Wait for container to start
    sleep 10
    
    # Test health endpoint
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_status "Health check passed!"
    else
        print_error "Health check failed!"
        docker logs $PROJECT_NAME-test
        exit 1
    fi
    
    # Clean up test container
    docker stop $PROJECT_NAME-test
    docker rm $PROJECT_NAME-test
    
    print_status "Local testing completed successfully."
}

# Deploy to Oracle Cloud
deploy_to_oracle() {
    print_status "Deploying to Oracle Cloud..."
    
    # This is a template - actual deployment depends on your Oracle Cloud setup
    print_warning "Oracle Cloud deployment requires manual configuration."
    print_status "Follow these steps:"
    echo ""
    echo "1. Push image to Oracle Container Registry (OCIR):"
    echo "   docker tag $PROJECT_NAME:latest <region>.ocir.io/<tenancy>/$PROJECT_NAME:latest"
    echo "   docker push <region>.ocir.io/<tenancy>/$PROJECT_NAME:latest"
    echo ""
    echo "2. Create Container Instance or Kubernetes deployment"
    echo "3. Set environment variables in Oracle Cloud console:"
    echo "   - NODE_ENV=production"
    echo "   - MONGODB_URI=<your-mongodb-uri>"
    echo "   - FRONTEND_URL=https://spanexx.com"
    echo "   - PORT=8080"
    echo ""
    echo "4. Configure load balancer and SSL certificate"
}

# Main execution
main() {
    echo "🌟 Portfolio Backend Deployment to Oracle Cloud"
    echo "=============================================="
    
    check_prerequisites
    build_image
    test_image
    deploy_to_oracle
    
    print_status "Deployment preparation completed!"
    print_status "Don't forget to set up environment variables in Oracle Cloud console."
}

# Help function
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  --build-only   Only build the Docker image"
    echo "  --test-only    Only test the Docker image"
    echo ""
    echo "Environment Variables:"
    echo "  MONGODB_URI       MongoDB connection string"
    echo "  OCI_REGION        Oracle Cloud region (default: us-ashburn-1)"
    echo "  OCI_COMPARTMENT_ID Oracle Cloud compartment ID"
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    --build-only)
        check_prerequisites
        build_image
        ;;
    --test-only)
        test_image
        ;;
    *)
        main
        ;;
esac