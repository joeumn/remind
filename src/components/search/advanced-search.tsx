'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  Flag, 
  Clock,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface SearchFilters {
  query: string
  status: string[]
  priority: string[]
  category: string[]
  tags: string[]
  dateRange: {
    start?: string
    end?: string
  }
  type: string[]
}

interface SearchResult {
  id: string
  title: string
  description?: string
  due_at?: string
  priority: string
  status: string
  category?: string
  tags: string[]
  type: 'reminder' | 'event'
  created_at: string
}

export function AdvancedSearch() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    status: [],
    priority: [],
    category: [],
    tags: [],
    dateRange: {},
    type: []
  })
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  const statusOptions = ['pending', 'completed', 'cancelled', 'snoozed']
  const priorityOptions = ['low', 'medium', 'high', 'urgent']
  const typeOptions = ['reminder', 'event']
  const categoryOptions = ['work', 'personal', 'health', 'finance', 'shopping', 'travel']

  useEffect(() => {
    if (filters.query || hasActiveFilters()) {
      performSearch()
    }
  }, [filters])

  const hasActiveFilters = () => {
    return filters.status.length > 0 || 
           filters.priority.length > 0 || 
           filters.category.length > 0 || 
           filters.tags.length > 0 || 
           filters.type.length > 0 ||
           filters.dateRange.start ||
           filters.dateRange.end
  }

  const performSearch = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (filters.query) params.append('search', filters.query)
      if (filters.status.length > 0) params.append('status', filters.status.join(','))
      if (filters.priority.length > 0) params.append('priority', filters.priority.join(','))
      if (filters.category.length > 0) params.append('category', filters.category.join(','))
      if (filters.type.length > 0) params.append('type', filters.type.join(','))
      if (filters.dateRange.start) params.append('start_date', filters.dateRange.start)
      if (filters.dateRange.end) params.append('end_date', filters.dateRange.end)

      // Search both reminders and events
      const [remindersResponse, eventsResponse] = await Promise.all([
        fetch(`/api/reminders?${params.toString()}`),
        fetch(`/api/events?${params.toString()}`)
      ])

      const remindersData = remindersResponse.ok ? await remindersResponse.json() : { reminders: [] }
      const eventsData = eventsResponse.ok ? await eventsResponse.json() : { events: [] }

      const combinedResults = [
        ...remindersData.reminders.map((r: any) => ({ ...r, type: 'reminder' as const })),
        ...eventsData.events.map((e: any) => ({ ...e, type: 'event' as const }))
      ]

      setResults(combinedResults)
      setTotalResults(combinedResults.length)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: 'status' | 'priority' | 'category' | 'type', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }))
  }

  const addTag = (tag: string) => {
    if (tag && !filters.tags.includes(tag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const removeTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      status: [],
      priority: [],
      category: [],
      tags: [],
      dateRange: {},
      type: []
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Advanced Search
            </CardTitle>
            <CardDescription>
              Find reminders and events with powerful filters
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Query */}
        <div className="space-y-2">
          <Label htmlFor="search-query">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-query"
              placeholder="Search reminders and events..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Active Filters */}
        {(hasActiveFilters() || filters.query) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Active Filters</Label>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.query && (
                <Badge variant="secondary" className="gap-1">
                  Query: {filters.query}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('query', '')} />
                </Badge>
              )}
              {filters.status.map(status => (
                <Badge key={status} variant="secondary" className="gap-1">
                  Status: {status}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter('status', status)} />
                </Badge>
              ))}
              {filters.priority.map(priority => (
                <Badge key={priority} variant="secondary" className="gap-1">
                  Priority: {priority}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter('priority', priority)} />
                </Badge>
              ))}
              {filters.category.map(category => (
                <Badge key={category} variant="secondary" className="gap-1">
                  Category: {category}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => toggleArrayFilter('category', category)} />
                </Badge>
              ))}
              {filters.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  Tag: {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <Button
                      key={status}
                      variant={filters.status.includes(status) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayFilter('status', status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex flex-wrap gap-2">
                  {priorityOptions.map(priority => (
                    <Button
                      key={priority}
                      variant={filters.priority.includes(priority) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayFilter('priority', priority)}
                    >
                      {priority}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map(type => (
                    <Button
                      key={type}
                      variant={filters.type.includes(type) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayFilter('type', type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Category</Label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map(category => (
                    <Button
                      key={category}
                      variant={filters.category.includes(category) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleArrayFilter('category', category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  placeholder="Start date"
                  value={filters.dateRange.start || ''}
                  onChange={(e) => updateFilter('dateRange', { 
                    ...filters.dateRange, 
                    start: e.target.value 
                  })}
                />
                <Input
                  type="date"
                  placeholder="End date"
                  value={filters.dateRange.end || ''}
                  onChange={(e) => updateFilter('dateRange', { 
                    ...filters.dateRange, 
                    end: e.target.value 
                  })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Results ({totalResults})</Label>
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              )}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.map(result => (
                <div key={result.id} className="p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{result.title}</h4>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className={getPriorityColor(result.priority)}>
                        <Flag className="h-3 w-3 mr-1" />
                        {result.priority}
                      </Badge>
                      <Badge variant="secondary">{result.type}</Badge>
                    </div>
                  </div>
                  
                  {result.description && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {result.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {result.due_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(parseISO(result.due_at), 'MMM d, h:mm a')}
                      </div>
                    )}
                    
                    {result.category && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {result.category}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(parseISO(result.created_at), 'MMM d')}
                    </div>
                  </div>
                  
                  {result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
