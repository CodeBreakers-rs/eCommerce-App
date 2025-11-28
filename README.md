# CommerceTools E-Commerce Platform

## Project Overview

A modern, responsive Single Page Application (SPA) that replicates a real-world online store experience. Users can browse products, view detailed information, register or log in, manage a shopping basket, and explore various pages — all powered by the CommerceTools API and built entirely from scratch without templates.
Developed as a team project for the Rolling Scopes School Front-End course, the app uses modern technologies and follows professional development practices.

### Development Highlights

- Modular and responsive UI, optimized for screens starting from 390px wide
- Custom data model in CommerceTools, including categories, product types, and localized attributes
- Clear code quality rules and clean Git history, supported by ESLint, Prettier, and Husky hooks
- Team-based workflow with GitHub PR templates, task tracking in Trello, and SCRUM-like collaboration

## Tech Stack

### Core Technologies

- React (SPA architecture)
- TypeScript
- Tailwind CSS

### Dev Tools & Workflow

- Vite (bundler)
- Redux Toolkit (state management)
- ESLint & Prettier (linting & formatting)
- GitHub (version control, pull requests)
- Husky (Git hooks)
- Cloudflare Pages (deployment)

### CommerceTools Integration

- OAuth 2.0 authentication
- Product and cart management
- Custom dataset via CommerceTools API

### Testing

The project uses **Vitest** for unit testing, with coverage reporting powered by the **v8** coverage tool. Tests are organized in `tests` folders located next to the source files they cover (e.g., `src/pages/tests` for `src/pages`), promoting modular and maintainable test code.

- **Coverage**: Approximately 60% line coverage across the codebase.
- **Strong coverage areas** include pages, navigation, and catalog components.
- **Areas needing improvement** include some services, Redux slices, and authentication components.
- **Some utilities, layout components, and type definitions** currently have limited or no test coverage.

## Deployment

- **Live App**: [ecommerce-app-4sh.pages.dev](https://ecommerce-app-4sh.pages.dev)
- **Deployment Branch**: `release/basket-about_us`
- **Vite Config**: `base: '/'` is set in `vite.config.ts` for proper asset resolution.
- **Deployment Type**: Automatic deployments are enabled for the production branch.

> ⚠️ **Note**: API access is currently limited due to CommerceTools trial expiration. Functionality may be restricted.

## Code Quality & Automation

This project uses a set of tools and automated workflows to ensure consistent code quality, maintainability, and developer productivity.

- **ESLint** enforces code style and best practices.
- **Prettier** formats code automatically based on defined style rules.
- **Vitest** handles unit testing and tracks test coverage (~60%).
- **Husky** manages Git hooks to automate quality checks at key Git lifecycle events:
  - **pre-commit**: Runs `lint-staged` to lint and format staged files before committing.
  - **pre-push**: Runs tests to prevent broken code from being pushed.
  - **post-merge**: Installs dependencies and runs tests with coverage after merging branches.

### Key npm Scripts

| Command                 | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| `npm run dev`           | Starts the Vite development server                                |
| `npm run build`         | Runs TypeScript build (`tsc -b`) and builds the production bundle |
| `npm run preview`       | Serves the production build locally using Vite                    |
| `npm run lint`          | Lints all project files with ESLint                               |
| `npm run format`        | Formats all code files using Prettier                             |
| `npm test`              | Runs all unit tests headlessly with Vitest                        |
| `npm run test:coverage` | Runs all tests with coverage reporting (using v8 engine)          |
| `npm run prepare`       | Sets up Husky Git hooks on install (npm lifecycle script)         |

These scripts, combined with automated Git hooks, help catch issues early and keep the codebase clean and consistent throughout development.

## Project Management

This project was developed using Agile SCRUM methodology.

- Led collaboration and code reviews in a SCRUM-based front-end team (3→2 developers)
- Used Git and GitHub PRs for version control and code reviews
- Organized and tracked tasks in Trello: [Trello Board (private)](https://trello.com/b/yoJ1bPla/ecommerce)

> Note: The Trello board is currently private. It includes task breakdowns, sprint planning, and issue tracking used during development.

## Features

- Login & Registration
- Main Page
- Catalog Page
- Product Details Page
- User Profile Page
- Basket Page
- About Us Page
- Responsive design (min width: 390px)

> ⚠️ **Checkout process is not implemented** – only product management in the cart is available..

## Getting Started

This project requires access to private CommerceTools API credentials to run locally.

If you are a contributor or team member, please contact the maintainers for environment setup instructions.

For general usage, you can explore the live deployed version here: [Live App](https://ecommerce-app-4sh.pages.dev)

## Team & Credits

Project developed as part of the Rolling Scopes School Front-End course.

Meet the team on the [About Us](https://ecommerce-app-4sh.pages.dev/about) page of the deployed project.
