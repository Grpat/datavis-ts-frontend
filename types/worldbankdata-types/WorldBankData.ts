import { PaginationInfo } from '@/types/common/PaginationInfo'

export interface Topic {
  id: string
  value: string
  sourceNote: string
}

export type Paginated<T> = [PaginationInfo, T[]]

interface Source {
  id: string
  value: string
}

export interface IndicatorTopic {
  id: string
  value: string
}

export interface Indicator {
  id: string
  name: string
  unit: string
  source: Source
  sourceNote: string
  sourceOrganization: string
  topics: IndicatorTopic[]
}

export interface IndicatorData {
  indicator: {
    id: string
    value: string
  }
  country: {
    id: string
    value: string
  }
  countryiso3code: string
  date: string
  value: number
  unit: string
  obs_status: string
  decimal: number
}
