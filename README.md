# 2023 Dynamic Layout Scouting App

This repository contains **Team 624’s 2023 Scouting Web App**, a Vue 3 and TypeScript project that showcases **modular component management**, **real-time syncing**, and **Firebase** integration. The goal is to allow an administrator to dynamically add, remove, and rearrange UI components—without redeploying the site—so that non-admin users see layout changes instantly. This approach is designed to streamline **FRC scouting** while demonstrating an advanced web architecture.

---

## Table of Contents

- [2023 Dynamic Layout Scouting App](#2023-dynamic-layout-scouting-app)
  - [Table of Contents](#table-of-contents)
  - [Key Features](#key-features)
  - [Project Structure](#project-structure)
  - [Highlights:](#highlights)
    - [Technologies Used](#technologies-used)
- [Installation \& Setup](#installation--setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Firebase](#3-configure-firebase)
  - [4. Run the Development Server](#4-run-the-development-server)
  - [5. Build for Production](#5-build-for-production)
- [Conceptual Overview](#conceptual-overview)
  - [Centralized Component Manager](#centralized-component-manager)
  - [Dynamic Rendering](#dynamic-rendering)
  - [Real-Time Sync \& Offline Capability](#real-time-sync--offline-capability)
  - [Authentication \& Permissions](#authentication--permissions)
  - [Core Modules](#core-modules)
    - [ComponentManager (componentManager.ts)](#componentmanager-componentmanagerts)
    - [Component Store (componentStore.ts)](#component-store-componentstorets)
  - [Purpose:](#purpose)
  - [Forms \& Data Collection (e.g., `formStore.ts`, `ScoutingPage.vue`)](#forms--data-collection-eg-formstorets-scoutingpagevue)
    - [Purpose:](#purpose-1)
  - [UI Components (e.g., `Dropdown.vue`, `Textfield.vue`)](#ui-components-eg-dropdownvue-textfieldvue)
    - [Purpose:](#purpose-2)
- [Workflow \& Usage](#workflow--usage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Questions or Feedback?](#questions-or-feedback)

---

## Key Features

1. **Dynamic Component Management**  
   - A centralized **ComponentManager** handles adding, updating, or removing components.  
   - **Pinia** is used to store component metadata (type, label, constraints, etc.) in real time.

2. **Real-Time Database Sync**  
   - Utilizes **Firebase Firestore** with offline persistence.  
   - When an admin adds or edits a component, changes are immediately reflected for all users.

3. **Firebase Authentication**  
   - Supports email/password, Google, and custom domain (KatyISD) sign-in flows.  
   - Comprehensive error handling and user state management.

4. **Responsive & Modular UI**  
   - Various dynamic components (e.g., dropdowns, text fields, forms) can be easily created or removed.  
   - **Vue 3 Composition API** combined with **Pinia** ensures reactive and easily maintainable code.  
   - The **useBreakpoints** composable makes the app responsive across devices.

5. **FRC Scouting-Focused**  
   - Captures and submits match data (e.g., team number, match number, alliance, etc.) to Firestore.  
   - Demonstrates how advanced dynamic layouts can be tailored for data collection.

---

## Project Structure

Below is a simplified overview of the repository’s **key directories** and files, focusing on dynamic component handling and Firebase integration:

```plaintext
src
├── components
│   ├── Dropdown.vue         # Example dynamic dropdown component
│   ├── Textfield.vue        # Example dynamic textfield component
│   └── ...
├── composables
│   ├── database.ts          # Firebase config & Firestore initialization
│   ├── useAuth.ts           # Firebase Auth composable
│   ├── useBreakpoints.ts    # Responsive breakpoints composable
│   └── componentManager.ts  # Class-based manager for adding/updating/removing components
├── state_management
│   ├── componentStore.ts    # Pinia store for dynamic components
│   ├── formStore.ts         # Pinia store for form data & validation
│   └── ...
├── views
│   ├── AdminPage.vue        # Planned admin interface for drag-and-drop layout edits
│   └── ScoutingPage.vue     # Main layout for non-admin scouting
├── App.vue
├── main.ts
└── ...
package.json
```

## Highlights:

- `componentManager.ts` – Orchestrates all component additions/updates/deletions (backed by Firestore).
- `componentStore.ts` – Reactively holds the list of components, syncs with Firestore, and sorts them by index.
- `Dropdown.vue` & `Textfield.vue` – Reusable dynamic components that read their metadata from the store.
- `AdminPage.vue` – Allows admins to insert new components (buttons call `componentManager.addComponent()`).

### Technologies Used

- **Vue 3** (Composition API)
- **Pinia** (State management)
- **TypeScript** (Static typing & improved developer experience)
- **Firebase**
  - **Firestore** (Real-time & offline caching)
  - **Auth** (Email/password, Google sign-in)
  - **Analytics** (Optional usage)
- **CSS / SCSS** (Or your preferred styling approach)
- **HTML5** (Semantic markup & structure)
# Installation & Setup

## 1. Clone the Repository
```
git clone https://github.com/YourUsername/YourRepo.git
cd YourRepo
```
## 2. Install Dependencies

Using npm:
```
npm install
```
Or using yarn:
```
yarn
```

## 3. Configure Firebase
```
Rename or copy your .env.example to .env, or set environment variables in your hosting platform.
Update **VITE_FIREBASE_API_KEY**, VITE_FIREBASE_PROJECT_ID, and other keys in .env to match your Firebase project.
```
## 4. Run the Development Server

Using npm:


```
npm run dev
```
Or using yarn:


```
yarn dev
```

Open the local URL (e.g., http://localhost:5173) to view the project.
## 5. Build for Production

```
npm run build
```

# Conceptual Overview

## Centralized Component Manager

- `componentManager.ts` generates unique IDs for new components and writes them to Firestore.
- The Pinia `componentStore` listens to changes in Firestore’s components collection, reindexing and re-sorting on every snapshot.

## Dynamic Rendering

- In `AdminPage.vue`, admin users can call `componentManager.addComponent()` with a specific component type (e.g., `DynamicTextField`, `DynamicDropdown`) and custom metadata (label, constraints, options, etc.).
- In `ScoutingPage.vue` (or any other page), the layout is generated by looping over `componentStore.components`. Each element is rendered via the `<component :is="..." />` syntax, which dynamically pulls its "type" from the store data.

## Real-Time Sync & Offline Capability

- Firestore triggers `onSnapshot` in `componentStore.ts`, ensuring all clients see changes in near real-time.
- Local persistence ensures that if a device goes offline, it can still display existing components, syncing updates once the connection is restored.

## Authentication & Permissions

- `useAuth.ts` handles sign-in with email, Google accounts, password resets, and sign-out logic.
- The completed admin interface would restrict certain routes (like `AdminPage.vue`) to authenticated users with admin privileges.

## Core Modules 
### ComponentManager (componentManager.ts)
``` Typescript
class ComponentManager {
  // addComponent, updateComponent, removeComponent
  // Uses Firestore to create/update documents,
  // then the store syncs the changes automatically
}
```
Purpose:
Provide a class-based API to manipulate dynamic components.
### Component Store (componentStore.ts)
``` Typescript
export const useComponentStore = defineStore('component', {
  state: () => ({ components: [] }),
  actions: {
    // ...
  }
})

```
## Purpose:

- Maintain a reactive array of component objects (e.g., `{ id, type, metadata, index }`).
- Listen to Firestore's `onSnapshot` to keep the local state in sync with the remote database.
- Automatically reindex components by sorting them based on the `index` field.

## Forms & Data Collection (e.g., `formStore.ts`, `ScoutingPage.vue`)

### Purpose:
- Provide a dynamic store for various input fields (text fields, dropdowns, boolean fields).
- Validate and submit match data to Firestore (e.g., saving data in a matches collection).
- Keep track of partially completed forms when offline.

## UI Components (e.g., `Dropdown.vue`, `Textfield.vue`)

### Purpose:
- Read metadata (label, constraints, max length, etc.) from the store.
- Update the store (or form store) based on user interactions.
- Offer flexible styling and default behaviors (such as resetting on submit and enforcing custom constraints).

# Workflow & Usage

1. **Admin Adds a Component**

- In `AdminPage.vue`:
  ```ts
  componentManager.addComponent('DynamicTextField', {
    label: 'Team Number',
    constraints: 'Numbers',
    maxlength: 4
  })

- A new document is created in Firestore’s `components` collection.
- `componentStore` picks up the change and appends a new “DynamicTextField” to `components`.

2. **Scouting Page Renders Components**
   - `ScoutingPage.vue` loops over `componentStore.components`, using `<component :is="getComponentType(component.type)" />`.
  - Each dynamic component references its own props from the `metadata` stored in Firestore.

3. **Scouter Fills Out Data**
   - The user interacts with text fields, dropdowns, etc.
   - The components use local watchers to update `formStore` or their own metadata inside `componentStore`.

4. **Submit & Reset**
   - When the scouter presses “Submit to Database,” the data is validated (`formStore.validate()`).
   - If valid, it’s sent to Firestore under the relevant match/team documents.
   - The UI can reset fields as specified by `metadata` constraints.

# Future Enhancements

1. **Drag-and-Drop Admin UI**
   - Implement a truly interactive layout with libraries like **Vue Draggable** or **VueUse Motion**.
   - Reordering updates `component.index` in the store, ensuring the public scouting page sees the new layout.

2. **Permission Control**
   - Restrict admin routes to certain user roles.
   - Possibly integrate a custom claims system with Firebase Auth or a separate user database.

3. **Analytics & Visualization**
   - Provide charts or dashboards of scouting data (team performance, scoring breakdowns, etc.).
   - Real-time analytics for drive team strategy or post-match review.

4. **Theming & Reusability**
   - Expand the library of dynamic components (counters, toggles, photo upload, etc.).
   - Provide theming options in `metadata` (light vs. dark, color-coded input states, etc.).

---

# Contributing

We welcome contributions that **add new dynamic components, improve admin workflows, or enhance the overall user experience**. To contribute:

1. **Fork** this repository.
2. **Create** a feature branch (e.g., `feature/drag-and-drop-admin`).
3. **Commit** your changes with clear, descriptive messages.
4. **Open** a Pull Request against the `main` branch detailing your enhancements.

Please ensure your code follows the existing style guidelines, passes all lint checks (`npm run lint`), and remains consistent with the app's offline-first, real-time sync philosophy.

# License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use and adapt it for your own **FRC** or other dynamic forms/scouting needs. We’d love to see any improvements you make—please consider contributing back!

---

# Questions or Feedback?

Open an [issue](https://github.com/) or reach out to **Team 624** directly. We appreciate any input on how to enhance this dynamic layout approach, especially for **FIRST Robotics** competitions.

> **Thank you for checking out our advanced dynamic scouting system!**
