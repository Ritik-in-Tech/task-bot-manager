# Task Bot Manager

A modern, responsive dashboard for managing and simulating warehouse robots. Built with React, Redux Toolkit, and Three.js.

**🚀 Live Demo:** [https://task-bot-manager.vercel.app/](https://task-bot-manager.vercel.app/)

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (recommended) or npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd task-bot-manager
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    # or
    npm install
    ```

3.  **Start the development server**
    ```bash
    pnpm dev
    # or
    npm run dev
    ```

4.  **Open in Browser**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

## 🛠️ Tech Stack

-   **Frontend Framework**: React 19 (Vite)
-   **Language**: TypeScript
-   **State Management**: Redux Toolkit
-   **Styling**: Tailwind CSS v4
-   **Animations**: Framer Motion
-   **3D Visualization**: Three.js / React Three Fiber / Drei
-   **Form Handling**: React Hook Form + Zod
-   **Notifications**: Sonner
-   **Charts**: Recharts

## 🏗️ Component Architecture

The project follows a **Layered Architecture** to ensure separation of concerns and scalability.

```
src/
├── components/   # Reusable UI elements (Buttons, Inputs, Layouts, 3D Scene)
├── hooks/        # Custom React hooks (e.g., useSimulation)
├── pages/        # Route components (Views for Dashboard, Map, etc.)
├── slices/       # Redux State Slices (Auth, Bots, Tasks)
├── thunks/       # Complex Async Logic (Simulation Engine)
├── lib/          # Utilities and Helper functions
└── store.ts      # Redux Store Configuration
```

-   **Pages**: Act as the main views and connect to the Redux store to fetch data.
-   **Components**: Pure UI components that receive data via props (mostly).
-   **Slices**: Handle synchronous state updates.
-   **Thunks**: Handle the core simulation logic (the "brain" of the bots).

## 🔄 Data Flow Explanation

1.  **Simulation Engine (`useSimulation` + `simulationThunk`)**:
    -   The `useSimulation` hook sets up a **10-second interval**.
    -   Every tick, it dispatches the `runSimulationTick` thunk.
    -   **Atomic Update**: The thunk calculates the next state for *all* bots simultaneously (battery drain, movement, task assignment) and dispatches a single update to the store. This ensures the UI is always consistent.

2.  **User Interaction**:
    -   **Task Creation**: When a user adds a task (via `TaskAllocationPage`), it is dispatched to the `tasksSlice`.
    -   **Immediate Assignment**: The simulation logic immediately checks for idle bots and assigns the new task if possible.

3.  **UI Updates**:
    -   Components like `DashboardPage` and `BotStatusPage` subscribe to the Redux store using `useSelector`.
    -   When the store updates (every 10s or on user action), these components re-render automatically.

## 🧠 State Management Reasoning

**Why Redux Toolkit?**

1.  **Complex Global State**: The application needs to track the state of multiple bots and a shared task queue across many different pages (Dashboard, Map, Status, Analytics). Prop drilling would be unmanageable.
2.  **Predictable Simulation**: The simulation requires a deterministic way to update state. Redux's reducer pattern makes it easy to test and debug the simulation logic (e.g., "Bot A should lose 20% battery when busy").
3.  **Scalability**: As features like "Bulk Task Creation" or "3D Map" were added, Redux made it easy to plug these new consumers into the existing data stream without refactoring the core logic.
4.  **DevTools**: Redux DevTools allow for time-travel debugging, which is invaluable for verifying the simulation sequences.

## 🎨 UI/UX Features

-   **Modern Aesthetics**: Violet/Indigo color palette with glassmorphism effects.
-   **Responsive Design**: Fully optimized for mobile and desktop.
-   **Interactive 3D Map**: A realistic warehouse view using Three.js.
-   **Smooth Animations**: Page transitions and staggered entry animations using Framer Motion.
-   **User Feedback**: Consolidated toast notifications for form validation.