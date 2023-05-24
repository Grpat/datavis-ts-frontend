'use client'

import React, { useState, useEffect } from 'react'
import Map from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import DeckGL from '@deck.gl/react/typed'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
import { DataFilterExtension } from '@deck.gl/extensions/typed'

import { MAP_STYLE, LIGHTNING_EFFECT, INITIAL_VIEW_STATE } from '@/lib/mapconfig'

import { GeoJSON } from '@/types/common/GeojsonTypes'
import SelectMenu from '@/components/select-menu/SelectMenu'
import useHttp from '@/hooks/use-http'
import { stringToColor } from '@/utils/DeckGlUtils'
import { createColorScale, generateLayerId, getMinMaxValues, normalizeValue } from '@/utils/commonUtils'
import { v4 as uuidv4 } from 'uuid'
import { LayerAttribute, LayerDataRecord, ValueExtractor } from '@/types/common/LayersTypes'
import { Paginated, Topic } from '@/types/worldbankdata-types/WorldBankData'
import { Option } from '@/types/common/Option'

const mapOptions = {
  reuseMaps: true,
  mapLib: maplibregl,
  mapStyle: MAP_STYLE,
  preventStyleDiffing: true,
} as any

interface MapProps {}

const DeckGlMap: React.FC<MapProps> = ({}) => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null)
  const [layers, setLayers] = useState<GeoJsonLayer[]>([])
  const [layerData, setLayerData] = useState<LayerDataRecord>({})
  const [recentlyAddedLayerId, setRecentlyAddedLayerId] = useState<string | null>(null)
  const [recentlyUpdatedLayerId, setRecentlyUpdatedLayerId] = useState<string | null>(null)
  const [layerAttributes, setLayerAttributes] = useState<Record<string, LayerAttribute>>({})
  const [hoverInfo, setHoverInfo] = useState<any | null>(null)
  const [filters, setFilters] = useState<Record<string, Array<{ property: string | null; min: number; max: number; filterIndex: number }>>>(
    {},
  )

  const {
    isLoading: isLoadingCountryBoundaries,
    error: errorCountryBoundaries,
    sendRequest: fetchCountryBoundaries,
  } = useHttp<GeoJSON.FeatureCollection>()
  const calculateFilterValue = (feature: any, layerId: string) => {
    if (!feature.properties || layerAttributes[layerId].filterConditions.length === 0) return 1
    const layerFilterConditions = layerAttributes[layerId].filterConditions
    const isFilterConditionMet = layerFilterConditions.every(filterCondition => {
      return (
        feature.properties[filterCondition.selectedProperty] >= filterCondition.minValue &&
        feature.properties[filterCondition.selectedProperty] <= filterCondition.maxValue
      )
    })
    return isFilterConditionMet ? 1 : 0
  }
  const calculateFillColor = (feature: any, layerId: string) => {
    const colorScale = createColorScale(
      layerAttributes[layerId].colorRange[0],
      layerAttributes[layerId].colorRange[1],
      layerAttributes[layerId].colorScale,
    )
    if (!feature.properties) return [0, 0, 0]
    const colorPropertyValue = layerAttributes[layerId].colorPropertyExtractor(feature)
    let fillColor
    if (typeof colorPropertyValue === 'number') {
      fillColor = colorScale(colorPropertyValue)
    } else if (typeof colorPropertyValue === 'string') {
      fillColor = stringToColor(colorPropertyValue)
    } else {
      fillColor = [0, 0, 0]
    }
    return fillColor
  }

  useEffect(() => {
    const setCountryBoundaries = (data: GeoJSON.FeatureCollection) => {
      setGeoJsonData(data)
    }
    fetchCountryBoundaries(
      {
        url: 'http://localhost:8080/v1/countryBoundaries',
      },
      setCountryBoundaries,
    )
  }, [fetchCountryBoundaries])

  const handleAddLayer = (newLayer: GeoJSON.FeatureCollection) => {
    const layerId = generateLayerId(newLayer)

    const elevationPropertyExtractor: ValueExtractor = feature => {
      const value = feature.properties?.value
      return typeof value === 'number' || typeof value === 'string' ? value : 0
    }
    const colorPropertyExtractor: ValueExtractor = feature => {
      const value = feature.properties?.value
      return typeof value === 'number' || typeof value === 'string' ? value : 0
    }

    const colorRange = getMinMaxValues(newLayer, colorPropertyExtractor)
    const elevationRange = getMinMaxValues(newLayer, elevationPropertyExtractor)
    const minElevation = 0
    const maxElevation = 10000
    const visible = true
    const opacity = 0.5
    const colorScale = 50

    setLayerAttributes(prevAttributes => ({
      ...prevAttributes,
      [layerId]: {
        elevationRange,
        colorRange,
        elevationPropertyExtractor,
        colorPropertyExtractor,
        minElevation,
        maxElevation,
        visible,
        opacity,
        colorScale,
        filterConditions: [],
      },
    }))
    setLayerData(prevLayerData => ({
      ...prevLayerData,
      [layerId]: newLayer,
    }))
    setRecentlyAddedLayerId(layerId)
  }
  useEffect(() => {
    if (recentlyAddedLayerId) {
      const newLayer = createGeoJsonLayer(recentlyAddedLayerId)
      setLayers(prevLayers => [...prevLayers, newLayer])
    }
  }, [recentlyAddedLayerId])

  const handleFilterConditionSliderChange = (layerId: string, selectedProperty: string | null, newSliderValue: number[] | number) => {
    setLayerAttributes(prevLayerAttributes => {
      const updatedLayerAttributes = { ...prevLayerAttributes }
      const filterConditions = updatedLayerAttributes[layerId].filterConditions

      const filterConditionIndex = filterConditions.findIndex(condition => condition.selectedProperty === selectedProperty)

      if (Array.isArray(newSliderValue)) {
        const [minValue, maxValue] = newSliderValue
        filterConditions[filterConditionIndex].sliderValue = [minValue, maxValue]
        filterConditions[filterConditionIndex].minValue = minValue
        filterConditions[filterConditionIndex].maxValue = maxValue
      } else {
        filterConditions[filterConditionIndex].sliderValue = [newSliderValue, newSliderValue]
        filterConditions[filterConditionIndex].minValue = newSliderValue
        filterConditions[filterConditionIndex].maxValue = newSliderValue
      }
      return updatedLayerAttributes
    })
    setRecentlyUpdatedLayerId(layerId)
  }

  const handleDeleteLayer = (layerId: string) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId))
    setLayerData(prevLayerData => {
      const updatedLayerData = { ...prevLayerData }
      delete updatedLayerData[layerId]
      return updatedLayerData
    })
    setLayerAttributes(prevLayerAttributes => {
      const updatedLayerAttributes = { ...prevLayerAttributes }
      delete updatedLayerAttributes[layerId]
      return updatedLayerAttributes
    })
  }

  const handleVisibilityLayer = (layerId: string) => {
    setLayerAttributes(prevLayerAttributes => ({
      ...prevLayerAttributes,
      [layerId]: {
        ...prevLayerAttributes[layerId],
        visible: !prevLayerAttributes[layerId].visible,
      },
    }))
    setRecentlyUpdatedLayerId(layerId)
  }
  const handleColorScaleChange = (layerId: string, newColorScaleValue: number) => {
    setLayerAttributes(prevLayerAttributes => ({
      ...prevLayerAttributes,
      [layerId]: {
        ...prevLayerAttributes[layerId],
        colorScale: newColorScaleValue,
      },
    }))
    setRecentlyUpdatedLayerId(layerId)
  }
  useEffect(() => {
    if (!recentlyUpdatedLayerId) return

    setLayers(prevLayers => {
      return prevLayers.map(layer => {
        if (layer.id === recentlyUpdatedLayerId) {
          return createGeoJsonLayer(recentlyUpdatedLayerId)
        }
        return layer
      })
    })
    setRecentlyUpdatedLayerId(null)
  }, [layerAttributes])

  const handleCopyLayer = (layerId: string) => {
    const layerToCopy = layers.find(layer => layer.id === layerId)
    if (!layerToCopy) return

    const newLayerId = layerToCopy.id.replace(/[^|]+$/, uuidv4())

    setLayerAttributes(prevLayerAttributes => ({
      ...prevLayerAttributes,
      [newLayerId]: {
        ...prevLayerAttributes[layerId],
        visible: true,
      },
    }))

    setLayerData(prevLayerData => ({
      ...prevLayerData,
      [newLayerId]: layerData[layerId],
    }))
    setRecentlyAddedLayerId(newLayerId)
  }
  const handleElevationRangeChange = (layerId: string, newMaxElevation: number) => {
    setLayerAttributes(prevLayerAttributes => ({
      ...prevLayerAttributes,
      [layerId]: {
        ...prevLayerAttributes[layerId],
        maxElevation: newMaxElevation * 20000,
      },
    }))
    setRecentlyUpdatedLayerId(layerId)
  }
  const handleOpacityChange = (layerId: string, newOpacityValue: number) => {
    setLayerAttributes(prevLayerAttributes => ({
      ...prevLayerAttributes,
      [layerId]: {
        ...prevLayerAttributes[layerId],
        opacity: newOpacityValue,
      },
    }))
    setRecentlyUpdatedLayerId(layerId)
  }
  const handleAddNewFilter = (selectedProperty: string | null, layerId: string | null, min: number, max: number, filterIndex: number) => {
    if (!layerId || !selectedProperty) return
    addFilterCondition(layerId, selectedProperty, min, max, filterIndex)
    setRecentlyUpdatedLayerId(layerId)
  }
  const addFilterCondition = (layerId: string, selectedProperty: string, minValue: number, maxValue: number, filterIndex: number) => {
    setLayerAttributes((prevLayerAttributes: Record<string, LayerAttribute>): Record<string, LayerAttribute> => {
      const existingFilterConditions = prevLayerAttributes[layerId]?.filterConditions || []
      const updatedLayerAttributes: Record<string, LayerAttribute> = {
        ...prevLayerAttributes,
        [layerId]: {
          ...prevLayerAttributes[layerId],
          filterConditions: [
            ...existingFilterConditions,
            {
              index: filterIndex,
              selectedProperty,
              minValue,
              maxValue,
              sliderValue: [minValue, maxValue],
            },
          ],
        },
      }
      return updatedLayerAttributes
    })
    setRecentlyUpdatedLayerId(layerId)
  }
  const handleFilterConditionDelete = (layerId: string, filterIndex: number) => {
    setLayerAttributes(prevLayerAttributes => {
      const newFilterConditions = prevLayerAttributes[layerId].filterConditions.filter(condition => condition.index !== filterIndex)

      return {
        ...prevLayerAttributes,
        [layerId]: {
          ...prevLayerAttributes[layerId],
          filterConditions: newFilterConditions,
        },
      }
    })
    setRecentlyUpdatedLayerId(layerId)
  }
  const handleClearAllFilters = (layerId: string) => {
    setLayerAttributes(prevLayerAttributes => {
      return {
        ...prevLayerAttributes,
        [layerId]: {
          ...prevLayerAttributes[layerId],
          filterConditions: [],
        },
      }
    })
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        [layerId]: [],
      }
    })
    setRecentlyUpdatedLayerId(layerId)
  }
  const handleElevationPropertyChange = (layerId: string, newElevationProperty: string) => {
    setLayerAttributes(prevLayerAttributes => {
      const newElevationPropertyExtractor: ValueExtractor = feature => {
        const value = feature.properties?.[newElevationProperty]
        return typeof value === 'number' || typeof value === 'string' ? value : 0
      }
      const newElevationRange = getMinMaxValues(layerData[layerId], newElevationPropertyExtractor)
      return {
        ...prevLayerAttributes,
        [layerId]: {
          ...prevLayerAttributes[layerId],
          elevationPropertyExtractor: newElevationPropertyExtractor,
          elevationRange: newElevationRange,
        },
      }
    })
    setRecentlyUpdatedLayerId(layerId)
  }
  const handleColorPropertyChange = (layerId: string, newColorProperty: string) => {
    setLayerAttributes(prevLayerAttributes => {
      const newColorPropertyExtractor: ValueExtractor = feature => {
        const value = feature.properties?.[newColorProperty]
        return typeof value === 'number' || typeof value === 'string' ? value : 0
      }

      const newColorRange = getMinMaxValues(layerData[layerId], newColorPropertyExtractor)
      return {
        ...prevLayerAttributes,
        [layerId]: {
          ...prevLayerAttributes[layerId],
          colorPropertyExtractor: newColorPropertyExtractor,
          colorRange: newColorRange,
        },
      }
    })
    setRecentlyUpdatedLayerId(layerId)
  }

  const createGeoJsonLayer = (layerId: string) => {
    return new GeoJsonLayer({
      id: layerId,
      data: layerData[layerId],
      opacity: layerAttributes[layerId].opacity,
      visible: layerAttributes[layerId].visible,
      stroked: true,
      filled: true,
      extruded: true,
      wireframe: false,
      getFilterValue: (feature: any) => calculateFilterValue(feature, layerId),
      filterRange: [1, 1],
      extensions: [new DataFilterExtension({ filterSize: 1 })],

      getElevation: (feature: any) => {
        if (!feature.properties) return 0
        return normalizeValue(
          layerAttributes[layerId].elevationPropertyExtractor(feature) as number,
          layerAttributes[layerId].elevationRange[0],
          layerAttributes[layerId].elevationRange[1],
          layerAttributes[layerId].minElevation,
          layerAttributes[layerId].maxElevation,
        )
      },
      // @ts-ignore
      getFillColor: (feature: any) => calculateFillColor(feature, layerId),
      updateTriggers: {
        getFilterValue: [layerAttributes[layerId].filterConditions, Math.random(), layerAttributes[layerId].elevationPropertyExtractor],
        getElevation: [layerAttributes[layerId].maxElevation, layerAttributes[layerId].elevationPropertyExtractor],
        getFillColor: [
          layerAttributes[layerId].colorScale,
          layerAttributes[layerId].elevationPropertyExtractor,
          layerAttributes[layerId].colorPropertyExtractor,
        ],
      },
      onHover: info => setHoverInfo(info),
      pickable: true,
    })
  }

  return (
    <div>
      <SelectMenu
        geoJsonData={geoJsonData}
        errorCountryBoundaries={errorCountryBoundaries}
        isLoadingCountryBoundaries={isLoadingCountryBoundaries}
        onAddLayer={handleAddLayer}
        onDeleteLayer={handleDeleteLayer}
        onToggleVisibilityLayer={handleVisibilityLayer}
        onCopyLayer={handleCopyLayer}
        onElevationRangeChange={handleElevationRangeChange}
        onOpacityChange={handleOpacityChange}
        onColorScaleChange={handleColorScaleChange}
        layersData={layerData}
        layers={layers}
        onPropertySelected={handleAddNewFilter}
        onSliderChange={handleFilterConditionSliderChange}
        filters={filters}
        setFilters={setFilters}
        layerAttributes={layerAttributes}
        onFilterConditionDelete={handleFilterConditionDelete}
        onClearAllFilters={handleClearAllFilters}
        onPropertyElevationChange={handleElevationPropertyChange}
        onPropertyColorChange={handleColorPropertyChange}
      ></SelectMenu>
      <DeckGL layers={geoJsonData ? layers : []} initialViewState={INITIAL_VIEW_STATE} controller={true} effects={[LIGHTNING_EFFECT]}>
        <Map {...mapOptions} />
      </DeckGL>
      {hoverInfo?.object && (
        <div
          style={{
            position: 'fixed',
            zIndex: 1,
            pointerEvents: 'none',
            left: hoverInfo.x,
            top: hoverInfo.y,
            backgroundColor: '#27272a',
            padding: '8px',
            borderRadius: '4px',
          }}
        >
          {Object.entries(hoverInfo.object.properties).map(([key, value], index) => (
            <div key={index}>
              <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DeckGlMap
