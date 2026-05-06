# Markdown Editor

A modern Markdown editor that allows users to create, edit, and manage documents with real-time preview, persistent storage, and authentication-based workflows.

Built as part of a Frontend Mentor challenge, this project focuses on reducer-based state management, async workflow handling, and a scalable frontend architecture using vanilla JavaScript and TypeScript.

A key goal of this project was to go beyond a purely frontend-focused implementation and build a more realistic, production-like application. This included integrating a database layer and implementing authentication to support real user workflows.

The project uses Drizzle ORM with Turso (LibSQL) for data persistence and an OTP-based authentication flow using Better Auth and Resend. This allowed me to explore how frontend state management interacts with backend data, how to structure async data flows, and how to handle real-world concerns such as data consistency, error handling, and user session management.

By introducing authentication and database persistence, the application evolves from a simple editor into a more complete system that supports both guest usage and authenticated document management, closely reflecting how modern web applications are structured.

---

## Technologies used

- Astro
- SCSS
- TypeScript
- Turso (LibSQL)
- Drizzle ORM
- Better Auth (OTP email authentication)
- Resend
- Zod
- SortableJS
- LocalStorage
- Vitest

---

## Features

- Create new Markdown documents
- Edit document content with live preview
- Rename documents with validation
- Delete documents
- Drag & drop to reorder documents
- Automatic saving (debounced autosave)
- Guest mode (no login required)
- Persistent guest draft using LocalStorage
- Authenticated mode with database persistence
- Guest → authenticated document migration
- Accessible form validation
- Light and dark theme
- Preview only mode
- Responsive layout for all screen sizes
- Smooth UI transitions
- Reduced-motion support

---

## Architecture

The application follows a reducer-based architecture implemented using vanilla JavaScript, extended with async effects and persistence layers.

User Interaction → Event Layer → Store Dispatch → Reducer → State Update → Subscribers → UI Updates → Effects

---

### Reducer-Driven State Management

All application state is managed through a reducer-based state model with clearly separated concerns:
- documents: core domain data
- auth: user authentication state
- requests: async operation states (loading, saving, deleting)
- ui: presentation and interaction state
- editor: active document name state

Actions are grouped by domain (documents, auth, UI) and describe state transitions such as creating, deleting, updating, and reordering documents, as well as handling async request states.

Reducers are designed to be:

- Pure
- Deterministic
- Side-effect free

This keeps business logic isolated and easily testable.

---

### Selector Layer

Selectors derive data from state without mutating it.

Examples:
- `selectActiveDocument(state)`
- `selectCanPersistDocuments(state)`
- `selectIsSaving(state)`

This avoids duplicating derived values and keeps state minimal.

---

### Store and Subscription Lifecycle

The custom store implementation provides:

```ts
store.getState()
store.dispatch(action)
store.subscribe(listener)
```

Subscribers react to state changes and update different parts of the application.

Examples of subscribers:

- Rendering editor and preview
- Managing toast notifications
- Applying theme changes

Each subscription returns a cleanup function, enabling proper teardown when the feature is destroyed.

---

### Effects Layer

Side effects are isolated from the reducer and handled in dedicated effect modules.

Examples:

- `loadDocuments`
- `saveActiveDocument`
- `createNewDocument`
- `deleteDocument`
- `initAuthenticatedFlow`

--- 

### Authentication Architecture

Authentication is implemented with Better Auth using an email OTP flow.

The application supports two distinct usage modes:

- **Guest mode**: users can immediately use the editor without signing in
- **Authenticated mode**: users can persist and manage documents in the database

This keeps the editor accessible for quick use while still offering full document management for signed-in users.

#### Session-Aware Initial State

On page load, the server checks the current session and passes the initial auth state into the client application.

The reducer stores auth as part of the global application state, allowing the UI to derive permissions through selectors such as:

- `selectIsGuest`
- `selectIsAuthenticated`
- `selectCanPersistDocuments`
- `selectCanManageDocuments`

This keeps authorization-related UI logic centralized and avoids scattering auth checks throughout the DOM/event layer.

#### Capability-Based UI

Instead of checking authentication directly inside every UI interaction, the app derives capabilities from auth state.

For example:

- guests can edit a local draft
- authenticated users can create, rename, delete, reorder, and persist documents
- persistence actions are only available when the user is authenticated

This makes the UI easier to reason about because features are enabled based on application capabilities rather than repeated low-level auth checks.

#### Guest-to-Authenticated Migration

A key part of the auth flow is preserving guest work during sign-in.

When a guest signs in:

1. Existing database documents are loaded
2. The guest draft is read from LocalStorage
3. The guest draft is validated
4. The draft is migrated into application state
5. The migrated document is created in the database
6. The LocalStorage draft is removed only after successful database persistence

This prevents user-authored content from being lost if the migration request fails.

#### Auth and Persistence Separation

Authentication determines what persistence layer is used:

- guest documents are saved locally
- authenticated documents are saved to the database

The autosave system uses selectors to decide whether to persist through LocalStorage or through the database. This keeps the save workflow flexible while avoiding duplicated editor logic.

---

### Drag & Drop

Drag-and-drop functionality is implemented using SortableJS.

When a drag operation finishes:

1. The DOM order is read
2. A list of ordered IDs is dispatched
3. The reducer recalculates document order

Database persistence ensures order consistency across sessions.

---

### Persistence

#### LocalStorage

- Used for guest draft
- Validated with Zod before use

#### Database

- Documents stored in Turso (LibSQL)
- Managed through Drizzle ORM
- Enforces data integrity with constraints

---

### Async Workflow Handling

Saving is handled using a queued system to prevent race conditions:

- Only one save per document runs at a time
- Additional saves are queued
- Latest changes always win
- Stale responses are ignored

This ensures data consistency even with rapid edits or autosave triggers.

---

### Testing

The application includes:

- Unit tests for reducers and selectors
- Tests for async effects (save, load, delete)
- Integration test for guest migration

---

## What I learned

- Integrating a database layer (Drizzle + Turso) into a frontend-driven app
- Building a realistic authentication flow using OTP-based login
- Managing guest and authenticated states within one application
- Implementing safe data migration between persistence layers
- Handling async workflows and preventing race conditions
- Writing meaningful tests that focus on behavior and critical flows
- Using toast messages for error handling

---

## Live Demo

(Add your deployment link here)

## Preview

(Add screenshots or recording here)