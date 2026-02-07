---
title: "Building Scalable APIs with Node.js"
date: "2026-02-01"
excerpt: "Learn best practices and patterns for building high-performance, scalable REST APIs using Node.js and Express."
author: "Emma Thompson"
tags: ["Node.js", "API", "Backend", "Express", "Performance"]
coverImage: "/images/posts/nodejs-api.svg"
published: true
---

# Building Scalable APIs with Node.js

Building APIs that can handle thousands of requests while maintaining performance requires careful architecture and best practices. Let's explore how to build scalable APIs with Node.js.

## Project Structure

A well-organized project structure is crucial for scalability:

```
src/
├── controllers/    # Request handlers
├── services/       # Business logic
├── models/         # Data models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── utils/          # Helper functions
├── config/         # Configuration
└── app.ts          # Application entry
```

## Setting Up Express with TypeScript

Start with a solid foundation:

```typescript
// src/app.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Performance middleware
app.use(compression());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

export default app;
```

## Service Layer Pattern

Separate business logic from controllers:

```typescript
// src/services/userService.ts
import { User, UserCreateInput } from '../models/user';
import { DatabaseError } from '../errors';

export class UserService {
  async createUser(data: UserCreateInput): Promise<User> {
    try {
      const user = await User.create(data);
      return user;
    } catch (error) {
      throw new DatabaseError('Failed to create user');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    return await User.findById(id);
  }

  async updateUser(id: string, data: Partial<UserCreateInput>): Promise<User> {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }
}
```

## Controller Pattern

Keep controllers thin and focused:

```typescript
// src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';

const userService = new UserService();

export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
  }
);

export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return next(new NotFoundError('User not found'));
    }
    res.json({
      success: true,
      data: user,
    });
  }
);
```

## Error Handling

Centralized error handling improves maintainability:

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
```

## Request Validation

Use middleware for validation:

```typescript
// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const userCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8),
});

export const validateUserCreate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    userCreateSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }
    next(error);
  }
};
```

## Rate Limiting

Protect your API from abuse:

```typescript
// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 failed requests per hour
  skipSuccessfulRequests: true,
});
```

## Caching Strategy

Implement caching for better performance:

```typescript
// src/middleware/cache.ts
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const originalSend = res.json.bind(res);
      res.json = (data: any) => {
        redis.setex(key, duration, JSON.stringify(data));
        return originalSend(data);
      };

      next();
    } catch (error) {
      next();
    }
  };
};
```

## Performance Monitoring

Track API performance:

```typescript
// src/middleware/metrics.ts
import { Request, Response, NextFunction } from 'express';

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
    });
  });

  next();
};
```

## Conclusion

Building scalable APIs requires attention to architecture, error handling, validation, and performance. By following these patterns and best practices, you can create APIs that handle growth gracefully.

Remember:
- Separate concerns with a service layer
- Implement comprehensive error handling
- Validate all inputs
- Use caching strategically
- Monitor performance continuously

With these foundations in place, your Node.js APIs will be ready to scale from prototype to production.
