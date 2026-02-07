---
title: "Mastering TypeScript: Advanced Types and Patterns"
date: "2026-02-03"
excerpt: "Dive deep into TypeScript's advanced type system and learn powerful patterns for building type-safe applications."
author: "Michael Rodriguez"
tags: ["TypeScript", "Programming", "Type Safety", "Best Practices"]
coverImage: "/images/posts/typescript-advanced.svg"
published: true
---

# Mastering TypeScript: Advanced Types and Patterns

TypeScript's type system is incredibly powerful. In this article, we'll explore advanced types and patterns that will take your TypeScript skills to the next level.

## Conditional Types

Conditional types allow you to create types that depend on other types:

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
```

This becomes especially powerful when combined with generics:

```typescript
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type AsyncString = Unwrap<Promise<string>>;  // string
type SyncNumber = Unwrap<number>;            // number
```

## Mapped Types

Mapped types allow you to transform existing types:

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
```

## Template Literal Types

Template literal types enable sophisticated string manipulation:

```typescript
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = 'users' | 'posts' | 'comments';

type APIRoute = `/${Lowercase<Endpoint>}`;
// type APIRoute = "/users" | "/posts" | "/comments"

type Handler = `handle${Capitalize<HTTPMethod>}`;
// type Handler = "handleGet" | "handlePost" | "handlePut" | "handleDelete"
```

## Discriminated Unions

Discriminated unions are perfect for handling different states:

```typescript
type LoadingState = {
  status: 'loading';
};

type SuccessState<T> = {
  status: 'success';
  data: T;
};

type ErrorState = {
  status: 'error';
  error: Error;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function handleState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading':
      console.log('Loading...');
      break;
    case 'success':
      console.log('Data:', state.data);
      break;
    case 'error':
      console.log('Error:', state.error.message);
      break;
  }
}
```

## Brand Types

Brand types help prevent mixing up similar types:

```typescript
type Brand<K, T> = K & { __brand: T };

type UserId = Brand<string, 'UserId'>;
type PostId = Brand<string, 'PostId'>;

const userId = 'user-123' as UserId;
const postId = 'post-456' as PostId;

// This would be a type error:
// const wrong: UserId = postId;

function getUser(id: UserId) {
  // Implementation
}

getUser(userId);    // OK
// getUser(postId); // Error
```

## Recursive Types

TypeScript supports recursive types for complex data structures:

```typescript
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

const validJSON: JSONValue = {
  name: 'John',
  age: 30,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'New York',
    coordinates: {
      lat: 40.7128,
      lng: -74.0060,
    },
  },
};
```

## Utility Type Combinations

Combining utility types creates powerful patterns:

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

interface Config {
  server: {
    port: number;
    host: string;
  };
  database: {
    url: string;
    maxConnections: number;
  };
}

type PartialConfig = DeepPartial<Config>;
type ImmutableConfig = DeepReadonly<Config>;
```

## Conclusion

TypeScript's advanced type system provides powerful tools for building robust, type-safe applications. By mastering these patterns, you can catch more bugs at compile time and create more maintainable code.

The key is to use these features judiciously—not every situation requires advanced types, but when you need them, they're invaluable.
