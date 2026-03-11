# Quick Start Guide: UPro Frontend

**Feature**: UPro Frontend Application
**Date**: 2026-03-10

## Prerequisites

Before starting development, ensure you have:

- **Node.js**: v18.0.0 or higher (LTS recommended)
- **Package Manager**: npm (comes with Node) or pnpm (faster alternative)
- **Git**: For version control
- **Code Editor**: VS Code recommended (with extensions listed below)
- **Browser**: Chrome/Firefox with React DevTools extension

### Verify Prerequisites

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check Git installation
git --version
```

---

## Project Setup

### Step 1: Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd UPro_Frontend

# Create feature branch
git checkout -b 001-frontend-app
```

---

### Step 2: Initialize Vite Project

Since this is a new frontend project, initialize it with Vite:

```bash
# Create Vite React TypeScript project
npm create vite@latest . -- --template react-ts

# Or use pnpm (faster)
pnpm create vite . -- --template react-ts
```

**Note**: Use `.` to create in current directory (UPro_Frontend)

---

### Step 3: Install Dependencies

```bash
# Install base dependencies
npm install

# Install required libraries (run all together or one by one)
npm install \
  react-router-dom \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  zustand \
  axios \
  @microsoft/signalr \
  react-hook-form \
  @hookform/resolvers \
  zod \
  react-hot-toast \
  lucide-react \
  date-fns

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install shadcn/ui CLI
npx shadcn-ui@latest init
# Follow prompts:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - Import alias: @/

# Install development tools
npm install -D \
  @types/node \
  @vitejs/plugin-react \
  eslint \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  prettier \
  vitest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  happy-dom
```

---

### Step 4: Configure TypeScript

Update `tsconfig.json` with strict mode and path aliases:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Strict Type-Checking */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    /* Module Resolution */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@features/*": ["./src/features/*"],
      "@shared/*": ["./src/shared/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

### Step 5: Configure Vite

Update `vite.config.ts` with path aliases:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 5173,
    open: true, // Auto-open browser on start
  },
});
```

---

### Step 6: Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors from design system
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

---

### Step 7: Create Environment Variables

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your values
```

`.env.example` content:
```bash
# Backend API URL
VITE_API_BASE_URL=https://uprobackend-production-8628.up.railway.app

# SignalR Hub URL
VITE_SIGNALR_HUB_URL=https://uprobackend-production-8628.up.railway.app/hubs/chat

# Feature flags (optional)
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_DARK_MODE=true
```

`.env.local` for local development:
```bash
VITE_API_BASE_URL=http://localhost:5150
VITE_SIGNALR_HUB_URL=http://localhost:5150/hubs/chat
```

---

### Step 8: Create Folder Structure

```bash
# Create folder structure
mkdir -p src/app/providers
mkdir -p src/features/{auth,tasks,executors,chat,notifications}/{api,components,hooks,schemas,types,pages}
mkdir -p src/shared/{api,components/{ui,layout,feedback,guards},hooks,utils,constants}
mkdir -p src/assets
```

---

## Development Workflow

### Start Development Server

```bash
# Start Vite dev server (hot reload enabled)
npm run dev

# Or with pnpm
pnpm dev
```

Open browser at `http://localhost:5173`

---

### Build for Production

```bash
# Type-check first
npm run tsc

# Build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

### Run Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:ci

# Generate coverage report
npm run test:coverage
```

---

## VS Code Setup

### Recommended Extensions

Install these extensions for best developer experience:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",          // ESLint
    "esbenp.prettier-vscode",          // Prettier
    "bradlc.vscode-tailwindcss",       // Tailwind IntelliSense
    "dsznajder.es7-react-js-snippets", // React snippets
    "usernamehw.errorlens",            // Inline error highlighting
    "eamodio.gitlens",                 // Git integration
    "christian-kohler.path-intellisense" // Path autocomplete
  ]
}
```

### Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^\"'`]*)(?:'|\"|`)"]
  ]
}
```

---

## Project Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ci": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Code Quality Setup

### ESLint Configuration

Create `.eslintrc.cjs`:

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
```

---

### Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Create `.prettierignore`:
```
dist
node_modules
*.html
```

---

## Git Hooks (Optional but Recommended)

Install Husky for pre-commit hooks:

```bash
# Install Husky
npm install -D husky lint-staged

# Initialize Husky
npx husky-init

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,md}": [
      "prettier --write"
    ]
  }
}
```

---

## Testing Setup

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
});
```

Create `src/test/setup.ts`:

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

---

## Debugging

### Browser DevTools

1. **React DevTools**:
   - Install React DevTools extension
   - Inspect component hierarchy
   - View props and state

2. **TanStack Query DevTools**:
   - Automatically available in development
   - Access at `http://localhost:5173` (floating icon)
   - View query cache, mutations, invalidations

3. **Zustand DevTools**:
   ```typescript
   // Enable in store definition
   import { devtools } from 'zustand/middleware';

   const useAuthStore = create(
     devtools((set) => ({ /* state */ }), { name: 'AuthStore' })
   );
   ```

---

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    }
  ]
}
```

---

## Common Issues & Solutions

### Issue 1: Path Aliases Not Working

**Solution**: Ensure `tsconfig.json` and `vite.config.ts` both define the same path aliases. Restart VS Code TypeScript server (`Cmd+Shift+P` → "Restart TS Server").

---

### Issue 2: CORS Errors

**Solution**: Backend must allow your frontend origin. For development:
- Frontend: `http://localhost:5173`
- Backend must set CORS header: `Access-Control-Allow-Origin: http://localhost:5173`

---

### Issue 3: Environment Variables Not Loading

**Solution**: Environment variables must be prefixed with `VITE_` to be exposed to client. Restart dev server after changing `.env.local`.

---

### Issue 4: SignalR Connection Fails

**Solution**:
1. Check backend SignalR hub is running at `/hubs/chat`
2. Verify access token is being sent in `accessTokenFactory`
3. Check browser console for WebSocket errors
4. Ensure backend allows CORS for SignalR (headers + hub endpoint)

---

## Next Steps

After setup is complete:

1. ✅ **Verify setup**: Run `npm run dev` and open `http://localhost:5173`
2. ✅ **Create basic structure**: Implement folder structure from plan.md
3. ✅ **Set up providers**: AuthProvider, QueryProvider, SignalRProvider
4. ✅ **Implement router**: Define all routes in `router.tsx`
5. ✅ **Create API client**: Axios instance with interceptors in `shared/api/client.ts`
6. ✅ **Start with Phase 1**: Begin implementing authentication feature

---

## Resources

### Documentation

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Vite**: https://vitejs.dev/guide
- **React Router**: https://reactrouter.com
- **TanStack Query**: https://tanstack.com/query/latest
- **Zustand**: https://docs.pmnd.rs/zustand
- **SignalR**: https://learn.microsoft.com/en-us/aspnet/core/signalr/javascript-client
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

### Community

- **Stack Overflow**: Tag questions with [reactjs], [typescript], [vite]
- **Discord**: Join React, Vite, TanStack communities
- **GitHub Issues**: Report bugs in respective library repositories

---

## Troubleshooting Checklist

Before asking for help, verify:

- [ ] Node.js version is 18+ (`node --version`)
- [ ] All dependencies installed (`npm install` ran successfully)
- [ ] Environment variables set in `.env.local`
- [ ] Dev server running (`npm run dev` no errors)
- [ ] Browser console checked for errors (F12)
- [ ] TypeScript compiling (`npm run type-check` passes)
- [ ] ESLint passing (`npm run lint` no errors)

---

**Setup Complete!** 🎉

You're ready to start implementing the UPro Frontend. Follow the implementation plan in `plan.md` and use `/speckit.tasks` to generate actionable tasks.
