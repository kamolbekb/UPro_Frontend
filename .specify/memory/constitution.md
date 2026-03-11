<!--
  Sync Impact Report:
  Version Change: Initial version → 1.0.0
  Added Principles:
    - I. Clean Architecture & Separation of Concerns
    - II. Cross-Platform Compatibility
    - III. Security-First Development
    - IV. Consistent API Response Patterns
    - V. Discussion Before Implementation
    - VI. Audit Trail & Observability
    - VII. Validation & Error Handling
  Added Sections:
    - Technology Standards
    - Development Workflow
  Templates Requiring Updates:
    - ✅ plan-template.md (Constitution Check section aligned)
    - ✅ spec-template.md (Requirements section aligned with principles)
    - ✅ tasks-template.md (Task phases aligned with architecture layers)
  Follow-up TODOs: None
-->

# UPro Backend Constitution

## Core Principles

### I. Clean Architecture & Separation of Concerns

The project MUST adhere to Clean Architecture principles with clear layer boundaries:

- **Domain Layer** (`UPro.Domain`): Contains entities, enums, and core business rules. MUST have zero external dependencies.
- **Application Layer** (`UPro.Application`): Contains business logic, services, DTOs, and interfaces. May reference Domain only.
- **Infrastructure Layer** (`UPro.Infrastructure`): Contains data access (EF Core), external services, and cross-cutting concerns. May reference Domain and Application.
- **Presentation Layer** (`UPro.API`): Contains controllers, middleware, and API configuration. May reference all layers.

**Rationale**: Clean Architecture ensures maintainability, testability, and allows business logic to remain independent of frameworks and external dependencies. Each layer has a clear responsibility, making the codebase easier to understand and modify.

### II. Cross-Platform Compatibility (NON-NEGOTIABLE)

ALL code MUST work on Windows, Linux, and macOS without modification:

- MUST use `Path.Combine()` for all file path operations (never hard-code `\` or `/` for file system paths)
- MUST use .NET Standard APIs only (avoid platform-specific libraries)
- MUST test file operations, path handling, and system dependencies across platforms
- MUST NOT assume case-sensitive or case-insensitive file systems
- Use forward slashes `/` for URLs only; let .NET handle file system paths

**Rationale**: The application must be deployable to any platform (Azure, AWS Linux, Docker containers, local Windows development) without code changes. Cross-platform compatibility is essential for modern .NET applications.

### III. Security-First Development

Security MUST be built into every feature from the start:

- JWT authentication MUST be used for all protected endpoints
- Permission-based authorization MUST be enforced using custom `[Authorize(ApplicationPermissionCode.X)]` attributes
- Input validation MUST be implemented using FluentValidation for all DTOs
- SQL injection protection MUST be ensured by using parameterized queries (EF Core LINQ)
- Sensitive data (passwords, tokens) MUST NEVER be logged or returned in API responses
- File uploads MUST be validated for type, size, and content
- API keys and secrets MUST be stored in configuration files (never hard-coded)

**Rationale**: Security vulnerabilities can be catastrophic. Building security into the foundation prevents OWASP Top 10 vulnerabilities and ensures compliance with security best practices.

### IV. Consistent API Response Patterns

All API endpoints MUST return `ApiResult<T>` for consistency:

- Success responses: `ApiResult<T>.Success(data, message)`
- Error responses: `ApiResult<T>.Failure(errorMessage)`
- HTTP status codes MUST be consistent (200 for success, 400 for validation, 401 for unauthorized, 404 for not found, 500 for server errors)
- Error messages MUST be user-friendly and never expose internal implementation details
- Validation errors MUST be returned with field-level detail

**Rationale**: Consistent API responses make integration easier for frontend clients, improve debugging, and provide predictable error handling patterns.

### V. Discussion Before Implementation (NON-NEGOTIABLE)

Before implementing ANY significant change:

- MUST discuss solution approaches with the team or architect
- MUST present multiple options when available
- MUST explain trade-offs and implications
- MUST get approval before making architectural changes
- MUST update documentation when new patterns are established

**What qualifies as "significant":**
- New architecture patterns or layers
- New external dependencies or frameworks
- Changes to authentication/authorization
- Database schema changes affecting multiple features
- Breaking changes to existing APIs

**Rationale**: Premature implementation leads to technical debt, inconsistency, and rework. Discussion ensures alignment with project goals, considers existing patterns, and evaluates impact on other components.

### VI. Audit Trail & Observability

All data changes MUST be traceable and debuggable:

- All entities inheriting from `BaseEntity` MUST have audit fields (`CreatedAt`, `CreatedBy`, `ModifiedAt`, `ModifiedBy`)
- Audit fields MUST be populated automatically via `AuditableEntityInterceptor` (NO manual management)
- Structured logging MUST be used for debugging (using built-in `ILogger`)
- All critical operations (authentication, authorization failures, data changes) MUST be logged
- Logs MUST NOT contain sensitive data (passwords, tokens, PII)

**Rationale**: Audit trails provide accountability, enable debugging, support compliance requirements, and help diagnose production issues without requiring breakpoint debugging.

### VII. Validation & Error Handling

Input validation and error handling MUST be comprehensive and consistent:

- FluentValidation MUST be used for all DTO validation
- Model validation MUST occur before business logic execution
- Exceptions MUST be handled by global exception middleware
- User-facing error messages MUST be clear and actionable
- Technical error details MUST be logged but not exposed to clients

**Rationale**: Proper validation prevents invalid data from entering the system, reduces bugs, and provides better user experience. Consistent error handling simplifies debugging and improves system reliability.

## Technology Standards

### Required Technologies

- **.NET 8**: Latest LTS version for long-term support and performance
- **Entity Framework Core 8.0.4**: ORM for database access
- **PostgreSQL**: Primary database (via Npgsql.EntityFrameworkCore.PostgreSQL 8.0.4)
- **JWT Bearer Authentication**: For secure API access
- **FluentValidation**: For model validation
- **Mapster**: For object mapping (preferred over AutoMapper for performance)
- **Swagger & Scalar**: For API documentation

### Database Management

- All EF migrations MUST be run from `src/UPro.API` directory (startup project)
- Migration command format: `dotnet ef migrations add <Name> --project ../UPro.Infrastructure`
- Database update command: `dotnet ef database update`
- Migration names MUST be descriptive and follow PascalCase convention

### Dependency Injection

- All services MUST be registered in `Program.cs` or extension methods
- Service lifetimes MUST be appropriate: Singleton for stateless, Scoped for per-request, Transient for stateful
- Interface-based registration MUST be used (avoid concrete class registration)

## Development Workflow

### Code Style & Conventions

- Follow standard C# naming conventions (PascalCase for public members, camelCase for private)
- Use async/await patterns consistently (all I/O operations MUST be async)
- Use LINQ for collection operations (avoid imperative loops when LINQ is clearer)
- Keep methods focused and small (single responsibility principle)
- Add XML documentation comments for public APIs

### Common Patterns (MUST Follow)

- **API Result Pattern**: All endpoints return `ApiResult<T>`
- **Service Layer Pattern**: Business logic in Application layer services
- **Repository Pattern**: Data access through EF Core DbContext
- **Builder Pattern**: Use for complex object creation (e.g., `NotificationBuilder`)
- **Dependency Injection**: Constructor injection for all dependencies

### Anti-Patterns (MUST Avoid)

- ❌ Over-engineering: Don't add features, refactor code, or make "improvements" beyond what was asked
- ❌ Premature abstraction: Don't create helpers, utilities, or abstractions for one-time operations
- ❌ Future-proofing: Don't design for hypothetical future requirements (YAGNI principle)
- ❌ Backwards-compatibility hacks: Don't use `_var` renaming, re-exports, or `// removed` comments; delete unused code
- ❌ Excessive error handling: Don't validate scenarios that can't happen; trust internal code and framework guarantees
- ❌ Manual audit management: Don't manually set audit fields; let `AuditableEntityInterceptor` handle it

### Git Workflow

- **Main Branch**: `main` (production-ready code)
- **Development Branch**: `dev` (integration branch for features)
- **Feature Branches**: `feature/<feature-name>` or `###-<feature-name>`
- Commit messages MUST be clear and descriptive
- Pull requests MUST reference related issues/tasks

### Testing Standards

- Unit tests: Test business logic in isolation
- Integration tests: Test API endpoints and database interactions
- Validation tests: Ensure FluentValidation rules work correctly
- Manual testing: Use Swagger/Scalar for API testing during development
- **Note**: Test project not yet available (TODO: Add test project)

## Governance

### Amendment Process

1. Propose changes via discussion with team/architect
2. Document rationale and impact analysis
3. Update constitution and increment version according to semantic versioning
4. Update all dependent templates and documentation
5. Communicate changes to all team members

### Version Control

**Version**: 1.0.0 | **Ratified**: 2025-12-08 | **Last Amended**: 2025-12-08

Version numbering follows semantic versioning:
- **MAJOR**: Backward-incompatible governance/principle removals or redefinitions
- **MINOR**: New principle/section added or materially expanded guidance
- **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements

### Compliance Requirements

- All code reviews MUST verify compliance with these principles
- Architecture decisions MUST be justified and documented
- Deviations from constitution MUST be explicitly approved and documented in the Complexity Tracking section of plan.md
- Constitution supersedes all other practices; when in conflict, constitution wins

### Runtime Guidance

For day-to-day development guidance, refer to `CLAUDE.md` in the repository root. That file contains:
- Quick start instructions
- Development commands
- API endpoint documentation
- Common troubleshooting
- Configuration details

The constitution defines WHAT MUST be done; `CLAUDE.md` provides HOW to do it.
