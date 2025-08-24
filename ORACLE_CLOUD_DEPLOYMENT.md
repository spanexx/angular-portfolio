# Oracle Cloud Deployment Guide

## 🌩️ Deploying Portfolio Backend to Oracle Cloud Infrastructure (OCI)

This guide walks you through deploying your Node.js portfolio backend to Oracle Cloud Infrastructure.

## 📋 Prerequisites

### Local Development
- [x] Node.js 18+ installed
- [x] Docker installed
- [x] OCI CLI installed (optional but recommended)
- [x] Oracle Cloud account with appropriate permissions

### Oracle Cloud Resources Needed
- Container Instance or OKE (Oracle Kubernetes Engine) cluster
- Load Balancer (for SSL and high availability)
- Virtual Cloud Network (VCN)
- Security Lists/Network Security Groups

## 🚀 Deployment Options

### Option 1: Oracle Container Instances (Recommended for simple deployments)

#### Step 1: Prepare the Environment
```bash
# Set environment variables
export OCI_REGION="us-ashburn-1"
export OCI_COMPARTMENT_ID="your-compartment-ocid"
export TENANCY_NAMESPACE="your-tenancy-namespace"
```

#### Step 2: Build and Push Docker Image
```bash
# Build the image
docker build -t portfolio-backend:latest .

# Tag for Oracle Container Registry (OCIR)
docker tag portfolio-backend:latest ${OCI_REGION}.ocir.io/${TENANCY_NAMESPACE}/portfolio-backend:latest

# Login to OCIR (use Auth Token as password)
docker login ${OCI_REGION}.ocir.io
# Username: ${TENANCY_NAMESPACE}/your-username
# Password: your-auth-token

# Push to OCIR
docker push ${OCI_REGION}.ocir.io/${TENANCY_NAMESPACE}/portfolio-backend:latest
```

#### Step 3: Create Container Instance
1. Navigate to **Container Instances** in OCI Console
2. Click **Create Container Instance**
3. Configure:
   - **Name**: `portfolio-backend`
   - **Compartment**: Your compartment
   - **Availability Domain**: Choose one
   - **Shape**: VM.Standard.E4.Flex (1 OCPU, 4GB RAM minimum)
   - **Image**: `${OCI_REGION}.ocir.io/${TENANCY_NAMESPACE}/portfolio-backend:latest`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=8080
     MONGODB_URI=mongodb+srv://spanexxvictor:********@cluster0.dmxeugw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
     FRONTEND_URL=https://spanexx.com
     JWT_SECRET=your-super-strong-production-jwt-secret
     ENCRYPTION_KEY=your-32-character-production-key
     OCI_REGION=us-ashburn-1
     ```

### Option 2: Oracle Kubernetes Engine (OKE)

#### Step 1: Create OKE Cluster
```bash
# Create cluster via OCI CLI
oci ce cluster create \
  --compartment-id $OCI_COMPARTMENT_ID \
  --name portfolio-backend-cluster \
  --kubernetes-version v1.28.2 \
  --vcn-id $VCN_OCID \
  --service-lb-subnet-ids '["$SERVICE_LB_SUBNET_OCID"]'
```

#### Step 2: Deploy with Kubernetes Manifests
Create `k8s-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio-backend
  labels:
    app: portfolio-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: portfolio-backend
  template:
    metadata:
      labels:
        app: portfolio-backend
    spec:
      containers:
      - name: portfolio-backend
        image: ${OCI_REGION}.ocir.io/${TENANCY_NAMESPACE}/portfolio-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "8080"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: portfolio-secrets
              key: mongodb-uri
        - name: FRONTEND_URL
          value: "https://spanexx.com"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: portfolio-backend-service
spec:
  selector:
    app: portfolio-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
```

## 🔐 Security Configuration

### 1. Create Secrets for Sensitive Data
```bash
# Create Kubernetes secret for MongoDB URI
kubectl create secret generic portfolio-secrets \
  --from-literal=mongodb-uri="mongodb+srv://spanexxvictor:********@cluster0.dmxeugw.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0" \
  --from-literal=jwt-secret="your-super-strong-production-jwt-secret"
```

### 2. Configure Security Lists
Allow inbound traffic on:
- Port 80 (HTTP) - will redirect to HTTPS
- Port 443 (HTTPS) - main application traffic
- Port 8080 (Container port) - internal use only

### 3. SSL Certificate Setup
1. Generate SSL certificate via Let's Encrypt or Oracle Cloud SSL
2. Configure Load Balancer with SSL certificate
3. Set up HTTP to HTTPS redirect

## 🌐 Load Balancer Configuration

### Create Load Balancer
1. Navigate to **Networking** > **Load Balancers**
2. Create Load Balancer:
   - **Type**: Network Load Balancer (for better performance)
   - **Visibility**: Public
   - **Subnet**: Public subnet
   - **Backend Set**: Point to your container instances
   - **Health Check**: `/api/health`

### SSL Configuration
```yaml
# SSL Policy for Load Balancer
ssl_configuration:
  certificate_name: "portfolio-ssl-cert"
  protocols: ["TLSv1.2", "TLSv1.3"]
  cipher_suites: ["ECDHE-RSA-AES128-GCM-SHA256", "ECDHE-RSA-AES256-GCM-SHA384"]
```

## 📊 Monitoring and Logging

### Set up Application Performance Monitoring
1. Enable **Application Performance Monitoring** in OCI
2. Configure logging to **OCI Logging Service**
3. Set up alerts for:
   - High CPU usage (>80%)
   - High memory usage (>90%)
   - Health check failures
   - Response time >2 seconds

### Monitoring Dashboard
Create custom dashboard with:
- API response times
- Request count
- Error rates
- Database connection status
- Memory and CPU usage

## 🔄 CI/CD Pipeline

### Using OCI DevOps
Create `buildspec.yml`:
```yaml
version: 0.1
component: build
timeoutInSeconds: 300
runAs: root

steps:
  - type: Command
    name: "Install Dependencies"
    command: |
      npm ci --only=production

  - type: Command
    name: "Build Docker Image"
    command: |
      docker build -t portfolio-backend:${OCI_BUILD_RUN_ID} .
      docker tag portfolio-backend:${OCI_BUILD_RUN_ID} ${OCI_REGION}.ocir.io/${TENANCY_NAMESPACE}/portfolio-backend:${OCI_BUILD_RUN_ID}
      docker tag portfolio-backend:${OCI_BUILD_RUN_ID} ${OCI_REGION}.ocir.io/${TENANCY_NAMESPACE}/portfolio-backend:latest

  - type: Command
    name: "Push to OCIR"
    command: |
      docker push ${OCI_REGION}.ocir.io/${TENANCY_NAMESPACE}/portfolio-backend:${OCI_BUILD_RUN_ID}
      docker push ${OCI_REGION}.ocir.io/${TENANCY_NAMESPACE}/portfolio-backend:latest

outputArtifacts:
  - name: portfolio-backend-image
    type: DOCKER_IMAGE
    location: ${OCI_REGION}.ocir.io/${TENANCY_NAMESPACE}/portfolio-backend:latest
```

## 🧪 Testing Deployment

### Health Check Endpoints
```bash
# Test health endpoint
curl https://your-oracle-cloud-backend.com/api/health

# Test API endpoints
curl https://your-oracle-cloud-backend.com/api/projects
curl https://your-oracle-cloud-backend.com/api/profile
```

### Load Testing
```bash
# Install Apache Bench for load testing
sudo apt-get install apache2-utils

# Run load test
ab -n 1000 -c 10 https://your-oracle-cloud-backend.com/api/health
```

## 🚨 Troubleshooting

### Common Issues

1. **Container won't start**
   - Check environment variables
   - Verify MongoDB connection string
   - Check logs: `docker logs <container-id>`

2. **Health check fails**
   - Verify port 8080 is exposed
   - Check network security groups
   - Verify database connectivity

3. **High latency**
   - Enable connection pooling
   - Check database location vs. app location
   - Review load balancer configuration

### Debug Commands
```bash
# Check container logs
oci logging-ingestion put-logs --log-id <log-ocid>

# Check container status
oci container-instances container list --compartment-id $OCI_COMPARTMENT_ID

# Test internal connectivity
kubectl exec -it <pod-name> -- curl localhost:8080/api/health
```

## 💰 Cost Optimization

### Recommended Configuration for Production
- **Container Instance**: VM.Standard.E4.Flex (1 OCPU, 4GB RAM)
- **Load Balancer**: Network Load Balancer (10 Mbps minimum)
- **Storage**: No additional storage needed
- **Estimated Monthly Cost**: $30-50 USD

### Auto-scaling Configuration
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: portfolio-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: portfolio-backend
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## 📝 Post-Deployment Checklist

- [ ] SSL certificate installed and working
- [ ] Domain name pointing to load balancer
- [ ] Health checks passing
- [ ] Environment variables configured
- [ ] Monitoring and alerting set up
- [ ] Backup strategy implemented
- [ ] Security groups properly configured
- [ ] Frontend updated with new API URL

## 🔄 Update Frontend

Once backend is deployed, update your frontend environment:

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-oracle-cloud-backend.com/api',
  baseUrl: 'https://your-oracle-cloud-backend.com'
};
```

## 📞 Support

For Oracle Cloud specific issues:
- [Oracle Cloud Documentation](https://docs.oracle.com/en-us/iaas/)
- [OCI Support](https://support.oracle.com/)
- [Container Instances Documentation](https://docs.oracle.com/en-us/iaas/Content/container-instances/)

## 🎉 Conclusion

Your portfolio backend is now ready for production deployment on Oracle Cloud! The setup provides:

- **High Availability**: Load balancer with multiple instances
- **Security**: SSL encryption and secure environment variables
- **Monitoring**: Comprehensive logging and alerting
- **Scalability**: Auto-scaling based on demand
- **Cost Efficiency**: Right-sized resources for your needs

Remember to regularly update your SSL certificates and monitor your application performance!