'use client'

import React, { useState, useEffect } from 'react'
import Map from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import DeckGL from '@deck.gl/react/typed'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
import { DataFilterExtension } from '@deck.gl/extensions/typed'

import { MAP_STYLE, MAP_STYLE2, LIGHTNING_EFFECT, MATERIAL, INITIAL_VIEW_STATE, COLOR_RANGE } from '@/lib/mapconfig'

import { GeoJSON } from '@/types/common/GeojsonTypes'
import SelectMenu from '@/components/select-menu/SelectMenu'
import useHttp from '@/hooks/use-http'
import { stringToColor } from '@/utils/DeckGlUtils'
import { createColorScale, generateLayerId, getMinMaxValues, normalizeValue, timestampToYear } from '@/utils/commonUtils'
import { v4 as uuidv4 } from 'uuid'
import { LayerAttribute, LayerDataRecord, ValueExtractor } from '@/types/common/LayersTypes'

const mapOptions = {
  reuseMaps: true,
  mapLib: maplibregl,
  mapStyle: MAP_STYLE,
  preventStyleDiffing: true,
} as any

interface ChildComponentProps {}

const DeckGlMap: React.FC<ChildComponentProps> = ({}) => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null)
  const [layers, setLayers] = useState<GeoJsonLayer[]>([])
  const [layerData, setLayerData] = useState<LayerDataRecord>({})
  const [recentlyAddedLayerId, setRecentlyAddedLayerId] = useState<string | null>(null)
  const [recentlyUpdatedLayerId, setRecentlyUpdatedLayerId] = useState<string | null>(null)
  const [layerAttributes, setLayerAttributes] = useState<Record<string, LayerAttribute>>({})
  const [filterCondition, setFilter] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | null>(2020)
  const [hoverInfo, setHoverInfo] = useState<any | null>(null)

  const {
    isLoading: isLoadingCountryBoundaries,
    error: errorCountryBoundaries,
    sendRequest: fetchCountryBoundaries,
  } = useHttp<GeoJSON.FeatureCollection>()

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
    const elevationPropertyExtractor: ValueExtractor = feature => feature.properties?.value as number
    const elevationRange = getMinMaxValues(newLayer, elevationPropertyExtractor)
    const minElevation = 0
    const maxElevation = 10000
    const visible = true
    const opacity = 0.5
    const colorScale = 50
    const colorPropertyExtractor: ValueExtractor = feature => feature.properties?.value as number

    setLayerAttributes(prevAttributes => ({
      ...prevAttributes,
      [layerId]: {
        elevationRange,
        elevationPropertyExtractor,
        colorPropertyExtractor,
        minElevation,
        maxElevation,
        visible,
        opacity,
        colorScale,
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

  const handleDeleteLayer = (layerId: string) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId))
    setLayerData(prevLayerData => {
      const updatedLayerData = { ...prevLayerData }
      delete updatedLayerData[layerId]
      return updatedLayerData
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

    // Copy layer attributes
    setLayerAttributes(prevLayerAttributes => ({
      ...prevLayerAttributes,
      [newLayerId]: {
        ...prevLayerAttributes[layerId],
        visible: true,
      },
    }))

    // Copy layer data
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

  const createGeoJsonLayer = (layerId: string) => {
    const colorScale = createColorScale(
      layerAttributes[layerId].elevationRange[0],
      layerAttributes[layerId].elevationRange[1],
      layerAttributes[layerId].colorScale,
    )
    return new GeoJsonLayer({
      id: layerId,
      data: layerData[layerId],
      opacity: layerAttributes[layerId].opacity,
      visible: layerAttributes[layerId].visible,
      stroked: true,
      filled: true,
      extruded: true,
      wireframe: false,
      getFilterValue: (f: any) => {
        if (!f.properties || !f.properties.timestamp) return 0
        const featureYear = timestampToYear(f.properties.timestamp)
        return featureYear === selectedYear ? 1 : 0
      },
      filterRange: [1, 1],
      extensions: [new DataFilterExtension({ filterSize: 1 })],

      getElevation: (f: any) => {
        if (!f.properties) return 0
        return normalizeValue(
          layerAttributes[layerId].elevationPropertyExtractor(f),
          layerAttributes[layerId].elevationRange[0],
          layerAttributes[layerId].elevationRange[1],
          layerAttributes[layerId].minElevation,
          layerAttributes[layerId].maxElevation,
        )
      },
      // @ts-ignore
      getFillColor: (f: any) => {
        if (!f.properties) return [0, 0, 0]
        const colorPropertyValue = layerAttributes[layerId].colorPropertyExtractor(f)
        const fillColor = colorScale(colorPropertyValue)
        return fillColor
      },
      updateTriggers: {
        getFilterValue: [selectedYear],
        getElevation: [layerAttributes[layerId].maxElevation],
        getFillColor: [layerAttributes[layerId].colorScale],
      },
      onHover: info => setHoverInfo(info),
      pickable: true,
    })
  }

  useEffect(() => {
    console.log(geoJsonData)
  }, [geoJsonData])
  useEffect(() => {
    console.log('layers changed')
  }, [layers])

  useEffect(() => {
    console.log(layers)
  }, [layers])
  useEffect(() => {
    console.log(layerAttributes)
  }, [layerAttributes])

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
        layers={layers}
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
              <strong>{key}:</strong> {value as string}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DeckGlMap
