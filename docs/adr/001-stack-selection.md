# ADR-001: Core Tech Stack and Architecture Strategy

- Status: Accepted

## Context
Need a modular monolith for the Knowledge Agent using TypeScript and React.

## Decision
Selected Hono for the backend framework over NestJS/Express, paired with Vite + React for the frontend in a pnpm monorepo.

## Consequences
Hono provides zero built-in architectural opinions, requiring explicit manual setup of dependency injection and layered boundaries. In return, code remains portable to serverless/edge environments using standard Web APIs.