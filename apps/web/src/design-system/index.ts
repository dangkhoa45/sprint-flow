// Design System - Main Entry Point
// This file exports all design system components and utilities

// Atoms - Basic building blocks
export { default as Button } from './atoms/Button';
export { default as Input } from './atoms/Input';
export { default as Badge } from './atoms/Badge';
export { default as Icon } from './atoms/Icon';

// Molecules - Composite components
export { default as Card } from './molecules/Card';
export { default as Modal } from './molecules/Modal';
export { default as Form } from './molecules/Form';
export { default as Navigation } from './molecules/Navigation';

// Organisms - Complex components
export { default as Header } from './organisms/Header';
export { default as Sidebar } from './organisms/Sidebar';
export { default as DataGrid } from './organisms/DataGrid';
export { default as Kanban } from './organisms/Kanban';

// Templates - Page layouts
export { default as DashboardLayout } from './templates/DashboardLayout';
export { default as ProjectLayout } from './templates/ProjectLayout';

// Utilities
export * from './utils/theme';
export * from './utils/spacing';
export * from './utils/typography';
export * from './utils/colors'; 