# User Dashboard Components

This folder contains modular components for the User Dashboard feature, refactored from a single large component into clean, maintainable pieces.

## Structure

```
user-dashboard/
├── index.ts                 # Main export file
├── types.ts                 # TypeScript interfaces and types
├── Sidebar.tsx              # Dashboard sidebar navigation
├── OverviewSection.tsx      # Dashboard overview/home section
├── FavoritesSection.tsx     # User favorites management
├── ProfileSection.tsx       # User profile information
├── SettingsSection.tsx      # User settings and preferences
├── InquiriesSection.tsx     # User inquiries (placeholder)
├── OrdersSection.tsx        # User orders (placeholder)
├── Loading.tsx              # Loading state component
├── ErrorDisplay.tsx         # Error state component
└── README.md               # This file
```

## Components

### Core Sections
- **OverviewSection**: Dashboard home page with stats, recent activity, and quick actions
- **FavoritesSection**: Displays and manages user's favorite products
- **ProfileSection**: Shows user profile and company information
- **SettingsSection**: User preferences and account settings
- **InquiriesSection**: Placeholder for future inquiries functionality
- **OrdersSection**: Placeholder for future orders functionality

### UI Components
- **Sidebar**: Navigation sidebar with user info and section tabs
- **Loading**: Reusable loading spinner component
- **ErrorDisplay**: Reusable error display component

### Types
- **UserData**: Complete user data interface
- **DashboardStats**: Dashboard statistics interface
- **TabType**: Type definition for dashboard tabs

## Usage

Import components from the main index file:

```tsx
import {
  OverviewSection,
  FavoritesSection,
  ProfileSection,
  SettingsSection,
  InquiriesSection,
  OrdersSection,
  Sidebar,
  Loading,
  ErrorDisplay,
  UserData,
  DashboardStats,
  TabType
} from '../components/user-dashboard';
```

## Benefits

1. **Modularity**: Each section is now its own component
2. **Maintainability**: Easier to update individual sections
3. **Reusability**: Components can be reused elsewhere
4. **Type Safety**: Shared types ensure consistency
5. **Clean Code**: Much smaller, focused components
6. **Better Organization**: Clear separation of concerns
