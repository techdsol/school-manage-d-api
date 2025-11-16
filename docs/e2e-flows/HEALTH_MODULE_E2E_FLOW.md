# HEALTH MODULE - E2E FLOW DOCUMENTATION

## Quick Reference

| UX Action                  | API Endpoint     | Method | Step |
| -------------------------- | ---------------- | ------ | ---- |
| **Health Monitoring**      |                  |        |      |
| Comprehensive Health Check | `/health`        | GET    | 1.1  |
| Simple Health Check        | `/health/simple` | GET    | 1.2  |

---

## Overview

The **Health Module** provides application monitoring and health status endpoints for system administrators, DevOps teams, and monitoring tools. It enables real-time health assessment of the school management system.

### Key Characteristics

1. **Comprehensive Monitoring**: Memory, disk, and application health checks
2. **Simple Status Endpoint**: Lightweight health check for load balancers
3. **Standards-Based**: Uses NestJS Terminus for health checks
4. **Production-Ready**: Designed for monitoring tools (Prometheus, Datadog, etc.)
5. **No Authentication Required**: Public endpoints for system monitoring

### Health Check Components

```typescript
HealthCheckResult {
  status: string           // 'ok' or 'error'
  info?: object           // Successful health indicators
  error?: object          // Failed health indicators
  details: object         // All health indicators with status
}

SimpleHealthStatus {
  status: string          // 'ok'
  timestamp: string       // ISO 8601 timestamp
  uptime: number         // Process uptime in seconds
}
```

### Integration Points

- **DevOps Tools**: Prometheus, Grafana, Datadog monitoring
- **Load Balancers**: AWS ELB, NGINX health checks
- **Container Orchestration**: Kubernetes liveness/readiness probes
- **Alerting Systems**: PagerDuty, Opsgenie incident triggers

---

## STEP 1: Health Monitoring APIs

### STEP 1.1: Comprehensive Health Check

**Purpose**: Perform detailed health assessment of application including memory, disk, and custom application checks.

**API Endpoint**

```http
GET /health
```

**Sample Request**

```bash
curl -X GET http://localhost:3000/health
```

**Sample Response** (200 OK - Healthy)

```json
{
  "status": "ok",
  "info": {
    "memory_heap": {
      "status": "up"
    },
    "storage": {
      "status": "up"
    },
    "application": {
      "status": "up",
      "message": "Application is running normally"
    }
  },
  "error": {},
  "details": {
    "memory_heap": {
      "status": "up"
    },
    "storage": {
      "status": "up"
    },
    "application": {
      "status": "up",
      "message": "Application is running normally"
    }
  }
}
```

**Sample Response** (503 Service Unavailable - Unhealthy)

```json
{
  "status": "error",
  "info": {
    "memory_heap": {
      "status": "up"
    },
    "storage": {
      "status": "up"
    }
  },
  "error": {
    "application": {
      "status": "down",
      "message": "Database connection failed"
    }
  },
  "details": {
    "memory_heap": {
      "status": "up"
    },
    "storage": {
      "status": "up"
    },
    "application": {
      "status": "down",
      "message": "Database connection failed"
    }
  }
}
```

**Health Indicators**

1. **Memory Heap Check**
   - Threshold: 300MB
   - Ensures application doesn't exceed memory limits
   - Status: `up` if heap usage < 300MB

2. **Storage Check**
   - Threshold: 90% disk usage
   - Ensures sufficient disk space available
   - Path: System root `/`
   - Status: `up` if disk usage < 90%

3. **Application Check**
   - Custom health indicator
   - Checks database connectivity
   - Validates application initialization
   - Status: `up` if all systems operational

**UX Mockup** (Monitoring Dashboard)

```
┌─────────────────────────────────────────────────────┐
│ 🏥 School Management System - Health Dashboard     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Overall Status: ✅ HEALTHY                          │
│ Last Check: 2024-11-12 14:30:45                    │
│                                                     │
│ ┌──────────────────┬─────────┬──────────────────┐  │
│ │ Component        │ Status  │ Details          │  │
│ ├──────────────────┼─────────┼──────────────────┤  │
│ │ 🧠 Memory Heap   │ ✅ UP   │ 245 MB / 300 MB  │  │
│ │ 💾 Storage       │ ✅ UP   │ 65% used         │  │
│ │ 🔌 Application   │ ✅ UP   │ Running normally │  │
│ └──────────────────┴─────────┴──────────────────┘  │
│                                                     │
│ [Refresh]  [View Logs]  [Export Report]            │
└─────────────────────────────────────────────────────┘
```

**Use Cases**

- DevOps monitoring dashboards
- Kubernetes liveness probes
- Automated health alerts
- System diagnostics
- Pre-deployment health verification

---

### STEP 1.2: Simple Health Check

**Purpose**: Lightweight health check for basic system availability. Ideal for load balancers and frequent polling.

**API Endpoint**

```http
GET /health/simple
```

**Sample Request**

```bash
curl -X GET http://localhost:3000/health/simple
```

**Sample Response** (200 OK)

```json
{
  "status": "ok",
  "timestamp": "2024-11-12T14:30:45.123Z",
  "uptime": 3456.789
}
```

**Response Fields**

- `status`: Always "ok" if endpoint responds (string)
- `timestamp`: Current server time in ISO 8601 format (string)
- `uptime`: Process uptime in seconds (number)

**UX Mockup** (Status Badge)

```
┌───────────────────────────┐
│ System Status             │
├───────────────────────────┤
│ ✅ ONLINE                 │
│ Uptime: 57m 36s           │
│ Last Check: Just now      │
└───────────────────────────┘
```

**Use Cases**

- Load balancer health checks (AWS ELB, NGINX)
- Simple status page displays
- High-frequency polling (every 5-10 seconds)
- Minimal overhead monitoring
- Public status endpoints

---

## Integration Examples

### Integration 1: Kubernetes Liveness Probe

**Kubernetes Deployment Configuration**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: school-management-api
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: api
          image: school-management-api:latest
          ports:
            - containerPort: 3000
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /health/simple
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 3
```

**Explanation**:

- **Liveness Probe**: Uses `/health` for comprehensive checks every 10 seconds
- **Readiness Probe**: Uses `/health/simple` for faster startup validation every 5 seconds
- **Failure Handling**: Kubernetes restarts pod after 3 consecutive failures

---

### Integration 2: AWS Application Load Balancer

**ALB Target Group Health Check**

```json
{
  "HealthCheckProtocol": "HTTP",
  "HealthCheckPath": "/health/simple",
  "HealthCheckIntervalSeconds": 30,
  "HealthCheckTimeoutSeconds": 5,
  "HealthyThresholdCount": 2,
  "UnhealthyThresholdCount": 3,
  "Matcher": {
    "HttpCode": "200"
  }
}
```

**Explanation**:

- Checks `/health/simple` every 30 seconds
- Marks instance healthy after 2 consecutive successes
- Marks instance unhealthy after 3 consecutive failures
- Expects HTTP 200 status code

---

### Integration 3: Prometheus Monitoring

**Prometheus Scrape Configuration**

```yaml
scrape_configs:
  - job_name: 'school-management-api'
    metrics_path: '/health'
    scrape_interval: 30s
    static_configs:
      - targets: ['localhost:3000']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
```

**Sample Alert Rule**

```yaml
groups:
  - name: school_management_alerts
    rules:
      - alert: ApplicationDown
        expr: up{job="school-management-api"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: 'School Management API is down'
          description: 'API has been unreachable for 2 minutes'

      - alert: HighMemoryUsage
        expr: memory_heap_used_bytes / memory_heap_limit_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: 'High memory usage detected'
          description: 'Memory usage is above 90% for 5 minutes'
```

---

### Integration 4: Uptime Monitoring (UptimeRobot)

**Monitor Configuration**

```
Monitor Type: HTTP(s)
URL: https://api.school-management.com/health/simple
Monitoring Interval: 5 minutes
Alert Contacts: admin@school.com
```

**Expected Response**: HTTP 200 with JSON body containing `"status": "ok"`

---

## Monitoring Workflows

### Workflow 1: Production Deployment Health Verification

**Pre-Deployment Check**

```bash
# Step 1: Check current production health
curl -s http://prod-api.school.com/health | jq .

# Step 2: Deploy new version
kubectl apply -f deployment.yaml

# Step 3: Wait for rollout
kubectl rollout status deployment/school-management-api

# Step 4: Verify health of new pods
for pod in $(kubectl get pods -l app=school-api -o name); do
  echo "Checking $pod"
  kubectl exec $pod -- curl -s localhost:3000/health/simple
done

# Step 5: Confirm all health checks passing
curl -s http://prod-api.school.com/health | jq '.status'
```

---

### Workflow 2: Incident Response

**Automated Alert Flow**

1. **Alert Triggered**: Prometheus detects `/health` returning 503
2. **PagerDuty Notification**: On-call engineer receives alert
3. **Initial Assessment**:
   ```bash
   curl -v http://api.school.com/health
   ```
4. **Check Individual Components**:
   - Memory: Check if heap exceeded 300MB
   - Storage: Verify disk space availability
   - Application: Check database connectivity
5. **Resolution Actions**:
   - High Memory: Restart pods or scale up
   - Disk Full: Clear logs or increase volume
   - DB Down: Check database service status
6. **Verification**:
   ```bash
   curl -s http://api.school.com/health | jq '.status'
   # Should return "ok"
   ```

---

## Error Handling

### Health Check Failures

**Scenario 1: Memory Threshold Exceeded**

```json
{
  "status": "error",
  "error": {
    "memory_heap": {
      "status": "down",
      "message": "Used heap size exceeds threshold"
    }
  }
}
```

**Resolution**: Scale up resources or investigate memory leaks

---

**Scenario 2: Disk Space Low**

```json
{
  "status": "error",
  "error": {
    "storage": {
      "status": "down",
      "message": "Disk usage exceeds 90%"
    }
  }
}
```

**Resolution**: Clear logs, increase volume size, or enable log rotation

---

**Scenario 3: Database Connection Failed**

```json
{
  "status": "error",
  "error": {
    "application": {
      "status": "down",
      "message": "Database connection failed"
    }
  }
}
```

**Resolution**: Check database service, network connectivity, credentials

---

## Testing Scenarios

### Test Case 1: Healthy System

```typescript
describe('Health Module', () => {
  it('should return healthy status', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.info).toHaveProperty('memory_heap');
    expect(response.body.info).toHaveProperty('storage');
    expect(response.body.info).toHaveProperty('application');
  });

  it('should return simple health status', async () => {
    const response = await request(app).get('/health/simple').expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(typeof response.body.uptime).toBe('number');
  });
});
```

### Test Case 2: Response Time

```typescript
describe('Health Check Performance', () => {
  it('simple check should respond within 100ms', async () => {
    const start = Date.now();
    await request(app).get('/health/simple').expect(200);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });

  it('full check should respond within 1000ms', async () => {
    const start = Date.now();
    await request(app).get('/health').expect(200);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(1000);
  });
});
```

---

## Best Practices

### 1. Health Check Design

**Comprehensive Check (`/health`)**

- Use for: Detailed monitoring dashboards
- Frequency: Every 30-60 seconds
- Timeout: 5 seconds
- Include: Memory, disk, database, external services

**Simple Check (`/health/simple`)**

- Use for: Load balancers, high-frequency polls
- Frequency: Every 5-10 seconds
- Timeout: 1-2 seconds
- Include: Minimal logic, just uptime confirmation

### 2. Monitoring Strategy

**Three-Tier Approach**:

1. **Load Balancer**: Uses `/health/simple` for traffic routing
2. **Orchestrator (K8s)**: Uses `/health` for liveness/readiness
3. **Monitoring Tools**: Uses `/health` for detailed metrics

### 3. Alert Configuration

**Critical Alerts** (Immediate Response):

- Application health check failing
- All pods unhealthy
- Response time > 5 seconds

**Warning Alerts** (Investigation Required):

- Memory usage > 80%
- Disk usage > 85%
- Response time > 2 seconds

### 4. Response Time Targets

| Endpoint         | Target  | Maximum | Action if Exceeded       |
| ---------------- | ------- | ------- | ------------------------ |
| `/health/simple` | < 50ms  | 100ms   | Investigate slow startup |
| `/health`        | < 500ms | 1000ms  | Check database queries   |

---

## Database Schema

**Note**: The Health Module does NOT use database tables. It performs runtime checks only.

---

## Summary

The **Health Module** provides essential system monitoring capabilities:

### ✅ Implemented Features

- Comprehensive health check with multiple indicators
- Simple lightweight health check
- Memory heap monitoring (300MB threshold)
- Disk storage monitoring (90% threshold)
- Custom application health verification
- Standards-based implementation (NestJS Terminus)

### 🎯 Use Cases Covered

- Kubernetes liveness and readiness probes
- AWS/Azure load balancer health checks
- Prometheus/Grafana monitoring integration
- Uptime monitoring services
- DevOps incident response
- Pre-deployment verification

### 🔒 Monitoring Guarantees

- Public endpoints (no authentication required)
- Fast response times (< 100ms for simple, < 1s for full)
- Standardized response format
- Production-grade reliability

### 🔗 Integration Points

- Container orchestration (Kubernetes, Docker Swarm)
- Load balancers (AWS ELB, NGINX, HAProxy)
- Monitoring tools (Prometheus, Datadog, New Relic)
- Alerting systems (PagerDuty, Opsgenie)

This module ensures system reliability and enables proactive monitoring of the school management platform.
