import { IndicatorData } from '@/types/worldbankdata-types/WorldBankData'
import { Option } from '@/types/common/Option'
import { GeoJSON } from '@/types/common/GeojsonTypes'

export function getMinMaxYears(data: IndicatorData[]): { minYear: number; maxYear: number } {
  if (data.length === 0) {
    throw new Error('Empty dataset provided')
  }
  return data.reduce(
    (acc, item) => {
      const year = parseInt(item.date)

      if (year < acc.minYear) {
        acc.minYear = year
      }

      if (year > acc.maxYear) {
        acc.maxYear = year
      }

      return acc
    },
    {
      minYear: parseInt(data[0].date),
      maxYear: parseInt(data[0].date),
    },
  )
}

export const allCountries = {
  id: 'all_id',
  value: 'All',
}

export function extractUniqueCountries(data: IndicatorData[]): { id: string; value: string }[] {
  return data.reduce(
    (acc: { id: string; value: string }[], item) => {
      const countryExists = acc.some(country => country.id === item.country.id)

      if (!countryExists) {
        acc.push(item.country)
      }

      return acc
    },
    [allCountries],
  )
}

export const filterIndicators = (
  countriesOptions: Option[],
  indicatorsData: IndicatorData[],
  startDate: number,
  endDate: number,
): IndicatorData[] => {
  const allCountries = countriesOptions.some(option => option.value.toLowerCase() === 'all')

  if (countriesOptions.length === 0 || allCountries) {
    return indicatorsData.filter(indicator => {
      const indicatorYear = parseInt(indicator.date)
      return indicatorYear >= startDate && indicatorYear <= endDate
    })
  }

  const countryNamesSet = new Set(countriesOptions.map(option => option.value))

  const filtered = indicatorsData.filter(indicator => {
    const indicatorYear = parseInt(indicator.date)
    return countryNamesSet.has(indicator.country.value) && indicatorYear >= startDate && indicatorYear <= endDate
  })

  return filtered
}

export function combineData(
  geoJsonData: GeoJSON.FeatureCollection | null,
  indicatorData: IndicatorData[],
): GeoJSON.FeatureCollection | null {
  const indicatorDataByIsoCode: Record<string, IndicatorData[]> = {}

  if (!geoJsonData) {
    return null
  }
  indicatorData.forEach(data => {
    const countryCode = data.countryiso3code || data.country.id

    if (!indicatorDataByIsoCode[countryCode]) {
      indicatorDataByIsoCode[countryCode] = []
    }
    indicatorDataByIsoCode[countryCode].push(data)
  })

  const combinedFeatures: GeoJSON.Feature[] = []

  geoJsonData.features.forEach(feature => {
    if (feature.properties) {
      const matchingIndicatorDataArray = indicatorDataByIsoCode[feature.properties.isoCode as string]

      if (matchingIndicatorDataArray) {
        matchingIndicatorDataArray.forEach(matchingIndicatorData => {
          const timestamp = new Date(matchingIndicatorData.date).getTime()

          const updatedProperties: Record<string, unknown> = {
            ...feature.properties,
            indicatorValue: matchingIndicatorData.indicator.value,
            indicatorId: matchingIndicatorData.indicator.id,
            value: matchingIndicatorData.value,
            timestamp,
          }

          const updatedFeature: GeoJSON.Feature = {
            ...feature,
            properties: updatedProperties,
          }

          combinedFeatures.push(updatedFeature)
        })
      }
    }
  })

  return {
    ...geoJsonData,
    features: combinedFeatures,
  }
}
