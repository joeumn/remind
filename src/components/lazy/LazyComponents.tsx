'use client'

import { lazy } from 'react'

// Lazy load heavy components for better initial page load
export const LazyAdvancedSearch = lazy(() => 
  import('../search/AdvancedSearch').then(module => ({ default: module.AdvancedSearch }))
)

export const LazyBulkOperations = lazy(() => 
  import('../bulk/BulkOperations').then(module => ({ default: module.BulkOperations }))
)

export const LazySmartTemplates = lazy(() => 
  import('../templates/SmartTemplates').then(module => ({ default: module.SmartTemplates }))
)

export const LazyBooth = lazy(() => 
  import('../ui/Booth').then(module => ({ default: module.Booth }))
)

// Lazy load the dashboard view
export const LazyDashboardView = lazy(() => 
  import('../dashboard/DashboardView').then(module => ({ default: module.DashboardView }))
)
