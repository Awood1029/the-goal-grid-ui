### Project Overview

**The Goal Grid** is a Next.js project that uses a modern component-based architecture with Tailwind CSS for styling and React hooks to manage state and API calls. The project is structured into multiple directories covering pages, components, dialogs, hooks, services, context, types, and utilities. All API interactions are handled via Axios (in `apiClient.ts`) and services files (e.g. `authService.ts`, `boardService.ts`, etc.).

### Directory Structure

- **app/** – Contains Next.js pages (e.g. dashboard, login, register, groups, etc.) and global styles.
- **components/** – Reusable UI components (e.g. `Board.tsx`, `Goal.tsx`, `Navbar.tsx`) and UI primitives inside `components/ui/` (e.g. `card.tsx`, `alert.tsx`).
- **dialogs/** – Simple dialog components (e.g. create/rename board, join group) using Radix UI.
- **hooks/** – Custom React hooks for board management (`useBoard.ts`), authentication (`useAuth.ts`, `useLogin.ts`, `useRegister.ts`), and achievement/confetti logic (`useAchievement.ts`).
- **services/** – API calls using Axios (e.g. `authService.ts`, `boardService.ts`, `groupService.ts`, etc.).
- **context/** – Context providers. Notably, the `AuthContext` provides authentication state.
- **types/** – TypeScript definitions for data models (auth, board, group, leaderboard, user, etc.).
- **lib/** – Utility functions (e.g. `utils.ts` contains helper function for merging CSS classes).

### Coding and Styling Practices

- **Tailwind CSS:**  
  – Styling is done using Tailwind and CSS utilities are extended in `tailwind.config.ts`.  
  – UI primitives (e.g. buttons, cards, dialogs) are built using the `class-variance-authority` package and the utility helper `cn()` from `lib/utils.ts`.

- **Components & Hooks:**  
  – Use functional components with React hooks for state and effects.  
  – Custom hooks encapsulate API call logic and shared behaviors (e.g. `useBoard`, `useAuth`, `useLogin`).

- **Services:**  
  – API calls are centralized in service files so that pages and components can import and call functions like `authService.login()` or `boardService.bulkUpdateGoals()`.
  – The Axios instance in `apiClient.ts` automatically attaches the API base URL and authentication headers when available.

- **Authentication:**  
  – Authentication state is handled via an `AuthContext` that stores a JWT token in local storage and cookies.  
  – Pages that require authentication (all pages except for login, register, and the homepage) are protected via middleware using a cookie token check.

- **TypeScript:**  
  – Types are used extensively to enforce data integrity and reduce bugs.  
  – Ensure you follow the types defined in the `/types` directory when modifying any API or state-handling logic.

- **File Aliases:**  
  – The `components`, `hooks`, `context`, etc. folders are aliased in the project (see `components.json` and `tsconfig.json`). Use these aliases instead of relative paths.

### Best Practices

- **State & Effects:**  
  – Always use hooks (e.g. `useEffect`, `useCallback`) to avoid unnecessary re-renders.
- **Error Handling:**  
  – Service methods generally try/catch errors and log them. Handle errors appropriately in the UI.
- **Code Organization:**  
  – Keep API interactions in service files.
  – Reuse components whenever possible.
  – Write clean, easily testable code by isolating logic (custom hooks & utilities).

### Setup & Contribution Tips

1. **Clone the Repository** and run `npm install` (or your package manager) to set up dependencies.
2. **Run the Development Server** via `npm run dev`.
3. **Linting & Formatting:**  
   – Use `npm run lint` to check code style.
4. **Component Development:**  
   – Use the folder structure as a guide. Place new components under `/components` and hooks under `/hooks` if the functionality is reused.
