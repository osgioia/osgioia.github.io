---
layout: post
title: "Saving F* Words"
date: 2026-10-27 13:21:00 -0300
categories:
  - backend
  - deployment
tags:
  - nestjs
  - typeorm
  - postgresql
  - supabase
  - vercel
  - serverless
description: "A practical guide to deploying NestJS, TypeORM, and PostgreSQL on Supabase and Vercel, with fewer surprises and hopefully fewer swear words."
---

*Deploying NestJS + TypeORM + PostgreSQL to Supabase and Vercel without losing your mind.*

Express wants a server. Guillermo Rauch wants a function.

And somehow, you're supposed to make everyone happy.

Express was designed around a long-running process that listens on a port, handles requests, and stays alive. Vercel prefers serverless functions that can be invoked independently and scaled when needed.

TypeORM, meanwhile, would appreciate it if everyone stopped changing the rules halfway through initialization.

And you? You just wanted to deploy an API.

What could possibly go wrong?

Plenty, apparently.

This is a practical guide to deploying a NestJS application using Express, TypeORM, and PostgreSQL hosted on Supabase, with Vercel handling the application runtime.

We'll cover the serverless adapter, database connections, migrations, environment variables, and the kind of deployment errors that make you question your career choices.

The examples assume NestJS 11, TypeORM, PostgreSQL, and a Vercel Node.js function. Exact runtime configuration may vary depending on the Vercel runtime and deployment setup you're using, so treat the configuration as a starting point rather than a universal incantation.

Let's save some F* words.

![Fry squinting suspiciously at the deployment](/blog/assets/images/futurama-fry-not-sure-if-futurama-fry-source-screenshot.webp)

## 0. The architecture: what are we building?

The setup is straightforward on paper:

```text
                    Client
                      |
                      v
             Vercel Serverless Function
                      |
                      v
               NestJS + Express
                      |
                      v
             Supabase Connection Pooler
                      |
                      v
                  PostgreSQL
```

The application runs as a serverless function on Vercel. PostgreSQL is hosted by Supabase, and the connection pooler helps manage database connections when multiple function instances are running.

Two principles explain most of the decisions in this guide:

1. **The application must work within the serverless execution model.** You don't simply start a permanent HTTP server and expect the platform to manage it like a traditional VM.
2. **Database migrations should run as a separate deployment step.** Don't let every application instance attempt to modify the database schema at startup.

That's the whole idea.

The rest is making sure the implementation actually follows it.

## 1. Why deploying NestJS + Express to serverless hurts

A conventional NestJS application usually starts like this:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}

bootstrap();
```

This is perfectly reasonable for a traditional server, container, or virtual machine.

The process starts, binds to port `3000`, and waits for incoming requests.

Vercel's serverless execution model is different. The platform invokes a function to handle incoming requests. You generally don't want your application entry point to call `app.listen()` and attempt to manage its own listening socket.

Instead, the platform handles the request lifecycle, and your function needs to expose a compatible request handler.

For an Express-based NestJS application, the `ExpressAdapter` gives us a way to connect the two.

### 1.1 Create a serverless entry point

Create `api/index.ts`:

```typescript
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from '../src/app.module';

export const config = {
  api: {
    bodyParser: false,
  },
};

let cachedServer: express.Express | undefined;

async function getServer(): Promise<express.Express> {
  if (!cachedServer) {
    const server = express();

    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    cachedServer = server;
  }

  return cachedServer;
}

export default async (req, res) => {
  const server = await getServer();

  return server(req, res);
};
```

There are a few important details here.

**`app.init()` instead of `app.listen()`**

NestJS needs to initialize its modules, providers, middleware, and routes. `app.init()` performs application initialization without attempting to open a listening port.

The serverless platform is responsible for receiving the request.

**Cache the initialized handler**

The `cachedServer` variable lets the function reuse its initialized Express application when the same warm runtime instance handles subsequent requests.

That can avoid repeating the NestJS bootstrap process on every invocation handled by that instance.

However, don't mistake this for a guarantee of a persistent process. Serverless platforms can create additional instances or replace existing ones whenever they need to.

**Be careful with request body parsing**

The `bodyParser: false` setting is relevant to Vercel's compatible function configurations where the platform's default body parser would otherwise consume the request stream before Express handles it.

This setting is not a universal requirement for every Vercel runtime. Check the runtime and request-handling behavior of your deployment before applying it blindly.

Because debugging an empty JSON body is fun exactly once.

### 1.2 Don't duplicate your NestJS bootstrap configuration

There's another problem hiding here.

Your local application may configure CORS, Helmet, validation pipes, interceptors, Swagger, and a global route prefix. If the serverless entry point initializes the application differently, your local and deployed environments can behave differently.

That's a fantastic way to discover that your production API has a personality of its own.

Extract the shared setup into a reusable function.

For example, `src/setup-app.ts`:

```typescript
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

export function setupApp(app: INestApplication) {
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Configure CORS, Helmet, interceptors,
  // filters, and other shared behavior here.

  return app;
}
```

Your conventional entry point can then use it:

```typescript
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupApp(app);

  await app.listen(3000);
}

bootstrap();
```

And the serverless entry point can use the same configuration:

```typescript
const app = await NestFactory.create(
  AppModule,
  new ExpressAdapter(server),
);

setupApp(app);

await app.init();
```

The goal is simple: **share application configuration, but keep the runtime-specific startup logic separate.**

### 1.3 Configure routing

A minimal `vercel.json` might look like this:

```json
{
  "buildCommand": "npm run build",
  "functions": {
    "api/index.ts": {
      "maxDuration": 60,
      "memory": 1024
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api"
    }
  ]
}
```

This illustrates the intended routing and function resource configuration. Confirm that the options and rewrite behavior match the Vercel runtime and project configuration you're actually using.

In particular, don't assume that `outputDirectory: "dist"` is appropriate for every NestJS deployment. Vercel needs to build and package the function correctly; a directory containing your compiled NestJS application isn't automatically a valid static output directory.

Also, make sure the rewrite behavior preserves the routes NestJS expects. If your application uses the global prefix `api`, verify that a request to `/api/users` reaches the correct NestJS route rather than accidentally producing `/api/api/users`.

Congratulations. You now have an application that can be initialized by a serverless function.

Only a few dozen more things can go wrong.

## 2. Prerequisites

Before continuing, make sure you have:

- A NestJS project with TypeORM configured.
- The PostgreSQL driver installed: `pg`.
- A Supabase project with a PostgreSQL database.
- A Vercel account and a working project configuration.
- A compatible Node.js runtime.
- A migration workflow that you can run independently of application startup.

If you already have a working NestJS application locally, that's a good start.

If it doesn't work locally, deploying it to another platform won't magically improve the situation.

It will, however, give you more logs to read.

## 3. Set up PostgreSQL on Supabase

Create a project in Supabase and open the database connection settings.

Supabase provides connection details for connecting directly to PostgreSQL and for using its connection pooler, Supavisor.

For a serverless application, the pooler is worth considering because serverless platforms can run multiple function instances concurrently. Each instance may create its own database connection pool.

Without appropriate limits, the number of database connections can grow quickly.

For example:

```text
20 function instances × 5 connections each = 100 connections
```

That is a simplified illustration, but it demonstrates the problem.

Now imagine each instance opens dozens of connections.

PostgreSQL will eventually remind you that connections are a finite resource.

### 3.1 Use the appropriate connection string

Supabase's transaction-mode pooler commonly uses port `6543`. Your exact hostname, username, and connection string should come from your Supabase dashboard.

A connection string may look similar to this:

```text
postgresql://postgres.<project-ref>:<password>@<pooler-host>:6543/postgres
```

Use the actual values provided by Supabase rather than copying the placeholders.

Transaction pooling is useful for applications that open many short-lived connections, but it has limitations. Features that depend on a persistent database session may behave differently, so verify compatibility with your database driver and application.

Don't assume that the direct connection and the pooler are interchangeable in every scenario.

### 3.2 Keep your database credentials private

Never commit your production connection string to Git.

Use environment variables or your platform's secret-management mechanism. If a real credential has already been committed to a repository, removing it from the latest commit isn't enough: rotate the credential.

The old value may still exist in Git history.

Yes, even if the repository is private.

Especially if the repository is private and you keep forgetting that other people can have access to it.

![I'm in danger](/blog/assets/images/ralph-wiggum-im-in-danger-meme.webp)

## 4. Database schema: migrations, not `synchronize`

TypeORM provides a convenient option:

```typescript
synchronize: true
```

During local development, this can be useful for quickly iterating on an entity model.

In production, it's not a substitute for a controlled schema migration strategy.

Your application schema is important data infrastructure. You should know which changes are being applied, when they're applied, and whether they can safely be rolled back.

A safer production configuration is:

```typescript
synchronize: false
```

Use migrations to create and modify database structures.

### 4.1 Run migrations separately

A typical deployment workflow looks like this:

```text
1. Build and test the application
2. Run database migrations
3. Deploy the application
4. Verify the deployment
```

The migration command might look like:

```bash
DATABASE_URL='<your-database-url>' \
DATABASE_TYPE=postgres \
npm run migration:run
```

This is an example of passing environment variables to a command in a Unix-like shell. In a real project, use the configuration and scripts you've defined for your environment.

The important part is that migrations run as an explicit deployment step, not automatically in every serverless invocation.

Why?

Because multiple application instances shouldn't independently race to change the schema during startup.

And because production database changes deserve a little more respect than a checkbox in a configuration file.

### 4.2 Configure TypeORM for the CLI

TypeORM's CLI runs outside NestJS's dependency injection system. A standalone `DataSource` configuration is therefore useful.

For example, `src/database/data-source.ts`:

```typescript
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',

  url: process.env.DATABASE_URL,

  host: process.env.DATABASE_HOST,

  port: process.env.DATABASE_PORT
    ? Number.parseInt(process.env.DATABASE_PORT, 10)
    : 5432,

  username: process.env.DATABASE_USERNAME,

  password: process.env.DATABASE_PASSWORD,

  database: process.env.DATABASE_NAME,

  synchronize: false,

  entities: [
    // Import or configure your entity classes here.
  ],

  migrations: [
    // Configure the migration files produced by your build.
  ],
});
```

If `DATABASE_URL` is set, make sure the remaining connection settings are handled consistently with your configuration and driver.

The migration paths must match your actual project structure and the files available to the CLI. TypeScript source paths and compiled JavaScript paths aren't necessarily the same.

### 4.3 Configure TypeORM at runtime

NestJS can use `TypeOrmModule` and a configuration service to initialize the database connection.

A simplified example:

```typescript
import {
  Injectable,
} from '@nestjs/common';

import {
  TypeOrmOptionsFactory,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService
  implements TypeOrmOptionsFactory
{
  constructor(
    private readonly configService: ConfigService,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      url: this.configService.get<string>(
        'database.url',
      ),

      synchronize: false,

      entities: [
        // Explicit entity imports go here.
      ],

      migrations: [
        // Match your compiled migration files.
      ],

      extra: {
        max: 5,
      },
    };
  }
}
```

This is deliberately simplified. Adapt it to your project's actual configuration schema, SSL requirements, migration setup, and entity list.

The `max: 5` setting is an example, not a magic number. Choose a pool size based on the database connection budget, the number of concurrently running instances, and the workload.

The CLI and runtime configurations serve different purposes. Keeping them separate makes the behavior easier to understand and troubleshoot.

## 5. Configure environment variables in Vercel

Your application may work locally because your `.env` file contains everything it needs.

Vercel doesn't automatically inherit your local environment.

You need to configure the variables in the appropriate Vercel project and deployment environment.

Typical variables include:

```text
DATABASE_URL
DATABASE_SYNCHRONIZE
DATABASE_MAX_CONNECTIONS
DATABASE_SSL_ENABLED

AUTH_JWT_SECRET
AUTH_REFRESH_SECRET

APP_CORS_ORIGINS
THROTTLER_TTL
THROTTLER_LIMIT
```

The exact names depend on your application's configuration.

For example, if your application reads `database.url` through NestJS's `ConfigService`, verify that the configuration layer actually maps it to `DATABASE_URL`.

Adding a variable to Vercel doesn't help if your application is looking for a completely different name.

### 5.1 Environment variable checklist

| Variable | Example | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Supabase connection string | Database connectivity |
| `DATABASE_SYNCHRONIZE` | `false` | Prevent automatic schema synchronization |
| `DATABASE_MAX_CONNECTIONS` | `5` | Limit connections per application instance |
| `DATABASE_SSL_ENABLED` | `true` | Enable TLS where required |
| `AUTH_JWT_SECRET` | Generated secret | Sign access tokens |
| `AUTH_REFRESH_SECRET` | Separate generated secret | Sign refresh tokens |
| `APP_CORS_ORIGINS` | Your frontend origin | Restrict permitted browser origins |

Generate strong, unique secrets for authentication. Never reuse the same secret for unrelated purposes.

You can generate a random hexadecimal value locally with:

```bash
openssl rand -hex 32
```

Don't put the generated value in your repository or paste it into a public issue.

### 5.2 Be careful with SSL settings

You may find examples that use:

```typescript
ssl: {
  rejectUnauthorized: false,
}
```

This disables normal certificate verification. It can appear to solve a TLS connection error, but it also weakens protection against connecting to an untrusted endpoint.

Don't copy it blindly into production.

Prefer a configuration that validates the server certificate correctly. If your environment has a certificate-chain problem, identify and fix the underlying issue where possible.

A successful connection is not automatically a secure connection.

That's a lesson worth learning before someone else teaches it to you.

## 6. TypeORM in serverless: three details that can break everything

The database connection string is only part of the story. TypeORM also needs to discover entities, manage connections sensibly, and avoid relying on process state that may disappear.

### 6.1 Entity discovery: be careful with globs

A common TypeORM configuration uses a glob:

```typescript
entities: [
  __dirname + '/**/*.entity{.ts,.js}',
]
```

This can work well in conventional Node.js deployments, depending on the build output and directory structure.

With serverless bundling, however, runtime file discovery and file inclusion can become more complicated. A bundler may not include files that are only discovered dynamically.

The result can be an error such as:

```text
No metadata for "UserEntity" was found.
```

Or another variation of the classic:

```text
Everything compiled successfully.
Why is production broken?
```

One approach is to import the entity classes explicitly:

```typescript
import { UserEntity } from '../users/entities/user.entity';
import { ProductEntity } from '../products/entities/product.entity';

const entities = [
  UserEntity,
  ProductEntity,
];
```

Then configure TypeORM:

```typescript
entities,
```

Explicit imports make dependencies easier for bundlers to detect and make the entity list easier to inspect.

They're not mandatory in every deployment setup, but they're a useful troubleshooting option when dynamic discovery fails.

### 6.2 Keep the connection pool under control

Consider this configuration:

```typescript
extra: {
  max: 5,
},
```

For the PostgreSQL driver, this controls the maximum size of the connection pool passed to the underlying driver.

The correct value depends on your workload and connection limits.

If each function instance can open five connections and the platform starts twenty instances, the theoretical combined limit is one hundred connections.

That doesn't mean all those connections will always be open, but it illustrates why per-instance settings matter.

Also, don't assume that keeping the NestJS application initialized guarantees that a database connection will remain available forever. Network interruptions, database restarts, and runtime lifecycle changes still happen.

Design for reconnection and failure where appropriate.

### 6.3 Don't rely on process memory for shared state

This is perfectly valid JavaScript:

```typescript
const cache = new Map();
```

But it is not a distributed cache.

Each running function instance has its own memory. Another instance won't automatically see the same map, and an instance can disappear at any time.

The same warning applies to:

- In-memory rate limiters.
- Sessions stored only in process memory.
- Application caches that need to be shared.
- Background jobs that must run reliably.
- Cron-like tasks tied to a process that may stop.
- WebSocket connections that require a persistent connection model.

If the data must be shared or survive beyond a particular instance, use an appropriate external service, such as Redis or PostgreSQL, or a dedicated job-processing system.

Serverless doesn't mean you can't use state.

It means you need to be explicit about where that state lives.

![The "This is fine" dog surrounded by fire](/blog/assets/images/This-is-Fine-Maximum-Cope-meme-plataforma-Img3.webp)


## 7. Deploy and verify

Before deploying, make sure your application builds successfully and your database schema is up to date.

A simplified workflow might look like this:

```bash
# 1. Run migrations from your deployment environment
npm run migration:run

# 2. Deploy
vercel --prod
```

The migration command assumes your CLI configuration and environment variables are already set up correctly. Don't run it against production until you've verified the target database and reviewed the migrations.

After deployment, test the actual endpoints.

For example:

```bash
curl https://your-app.vercel.app/api
```

If your application exposes Swagger, you may also have endpoints such as:

```text
https://your-app.vercel.app/docs
https://your-app.vercel.app/docs-json
```

These paths depend on your NestJS configuration. They won't exist unless you've enabled and configured them.

### Post-deployment checklist

- [ ] The deployment completes successfully.
- [ ] The application initializes without module or dependency errors.
- [ ] A basic health endpoint responds as expected.
- [ ] Database queries work against the intended Supabase project.
- [ ] Authentication returns the expected tokens.
- [ ] Validation and error handling behave correctly.
- [ ] Swagger works, if enabled.
- [ ] Logs don't show repeated connection failures or missing entity metadata.
- [ ] Production uses `synchronize: false`.
- [ ] Database credentials and authentication secrets aren't exposed.

Don't stop at "Vercel says the deployment succeeded."

A successful deployment means the platform deployed something. It doesn't prove that your database works, your routes are correct, or your application can handle real requests.

Test the application, not the green checkmark.

## 8. Troubleshooting: the errors you'll probably meet

Here's a quick reference for some common problems.

| Symptom | Possible cause | What to check |
| --- | --- | --- |
| JSON request body is empty | Request body was parsed or consumed before Express handles it | Verify the Vercel runtime's body-parsing behavior |
| `EADDRINUSE` or startup problems | Application attempts to manage a listening socket in a function environment | Review the entry point and use the appropriate initialization lifecycle |
| Repeated cold-start delays | Application bootstrap runs repeatedly across invocations | Reuse initialized state within warm instances where appropriate |
| `too many clients` | Too many connections across instances or an unsuitable connection strategy | Review pool sizes, concurrency, and Supabase pooler configuration |
| SSL connection errors | TLS settings or certificate verification are incorrect | Check the connection string and certificate configuration |
| `No metadata for Entity was found` | Entity classes weren't registered or included correctly | Verify imports, entity configuration, and build output |
| Production schema differs from local | Migrations weren't applied or schema management is inconsistent | Review migration status and disable automatic synchronization |
| Function timeout | Request performs too much work or waits too long | Profile the request, review platform limits, and move long jobs to a suitable worker |
| Missing templates or static files | Required files weren't included in the deployment bundle | Inspect the generated function package and configure file inclusion if supported |
| Works locally, fails after deployment | Different environment variables, paths, runtime behavior, or dependencies | Compare the actual deployment configuration with local settings |

The important word here is *possible*.

An error message is a clue, not a diagnosis. Check the actual logs and configuration before applying a fix from a blog post written by someone who has never seen your project.

Including me.

## 9. The minimum viable recipe

If you just want the checklist without the existential crisis, here it is.

1. Create a PostgreSQL database in Supabase.
2. Choose the appropriate database connection method; consider the Supabase pooler for serverless workloads.
3. Configure NestJS to initialize correctly in the Vercel runtime.
4. Avoid starting a conventional listening server inside a function entry point unless the runtime explicitly requires that model.
5. Share your NestJS configuration between local and serverless entry points.
6. Set `synchronize: false` in production.
7. Run migrations as a separate deployment step.
8. Configure the database URL, authentication secrets, and other environment variables in Vercel.
9. Register entities explicitly if dynamic discovery causes bundling problems.
10. Keep connection pools appropriately small and account for concurrent function instances.
11. Verify TLS configuration rather than blindly disabling certificate verification.
12. Test the deployed API, database connectivity, authentication, and logs.

That's the technical part.

The real challenge is understanding the difference between a conventional Node.js server and a serverless function. Once that clicks, most of the configuration choices become easier to explain.

Not necessarily easier to debug.

Let's not get carried away.

## 10. Why Vercel Instead of Render?


<!-- MEME:  -->
![Bender looking smug, preferably with a deployment dashboard in the background](/blog/assets/images/everybody-was-doing-it-i-just-wanted-to-be-popular-v0-rKtqtFbNrucx6OvY-nb4b2IsR3lnZwcpLRFWmHnXJBU.webp)


Was Vercel the only reasonable choice? No.

Would another hosting platform have made some parts of this setup simpler? Quite possibly.

Did I choose Vercel partly because I wanted to try it and see what all the fuss was about?

Absolutely.

Sometimes the best reason to try a technology is curiosity. Sometimes it's the ecosystem. Sometimes you want to learn a deployment model you've never used before.

And sometimes everybody on the internet seems to be using a platform, and you don't want to be the only person at the party who brought a virtual machine.

There's nothing wrong with experimenting. Just be honest about the trade-offs.

Vercel's serverless model can be convenient, but it also introduces constraints around execution time, process lifecycle, connection management, and background work. A conventional application host may offer a simpler model for a long-running NestJS API.

Choose the platform that fits your application, not the one with the most fashionable dashboard.

Or don't.

I'm not your manager.

## Final thoughts

Express expects a server.

Vercel expects a function.

TypeORM expects its entities to exist.

PostgreSQL expects you not to open an unreasonable number of connections.

And you expect `npm run build` to be the end of your problems.

One of those expectations is clearly unrealistic.

The good news is that NestJS, TypeORM, Supabase, and Vercel can work together when the runtime, database configuration, and deployment process are designed with their constraints in mind.

The less good news is that you'll probably discover at least one configuration issue that wasn't mentioned in this article.

When you do, document it.

Future you will be grateful. Other developers might be grateful, too.

And if nothing else, you'll have one more reason to write a blog post.

**Saving F* Words:** because sometimes the most valuable thing a developer can save isn't a line of code.

It's an afternoon of debugging.

And a few thousand swear words.
