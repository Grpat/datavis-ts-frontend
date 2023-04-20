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
import { generateLayerId, getMinMaxValues, normalizeValue, timestampToYear } from '@/utils/commonUtils'
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
  const [layerAttributes, setLayerAttributes] = useState<Record<string, LayerAttribute>>({})
  const [filterCondition, setFilter] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | null>(2020)

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
    const maxElevation = 500000

    setLayerAttributes(prevAttributes => ({
      ...prevAttributes,
      [layerId]: {
        elevationRange,
        elevationPropertyExtractor,
        minElevation,
        maxElevation,
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
  const updateLayerVisibility = (layer: GeoJsonLayer, visible: boolean): GeoJsonLayer => {
    const clonedLayer = layer.clone({ visible })
    return clonedLayer
  }

  const handleVisibilityLayer = (layerId: string) => {
    setLayers(prevLayers => prevLayers.map(layer => (layer.id === layerId ? updateLayerVisibility(layer, !layer.props.visible) : layer)))
  }

  const handleCopyLayer = (layerId: string) => {
    setLayers(prevLayers => {
      const layerToCopy = prevLayers.find(layer => layer.id === layerId)
      return layerToCopy ? [...prevLayers, layerToCopy.clone({ id: layerToCopy.id.replace(/[^|]+$/, uuidv4()) })] : prevLayers
    })
  }
  const createGeoJsonLayer = (layerId: string) => {
    const layerAttribute = layerAttributes[layerId] || {
      elevationRange: [0, 1],
      elevationPropertyExtractor: () => 0,
      minElevation: 0,
      maxElevation: 500000,
    }
    return new GeoJsonLayer({
      id: layerId,
      data: layerData[layerId],
      opacity: 0.6,
      visible: true,
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
      updateTriggers: {
        getFilterValue: [selectedYear],
      },
      getElevation: (f: any) => {
        if (!f.properties) return 0
        const value = layerAttribute.elevationPropertyExtractor(f)
        return normalizeValue(
          value,
          layerAttribute.elevationRange[0],
          layerAttribute.elevationRange[1],
          layerAttribute.minElevation,
          layerAttribute.maxElevation,
        )
      },
      getFillColor: f => {
        if (!f.properties || !f.properties.country) return [0, 0, 0]
        return stringToColor(f.properties.country, 256)
      },
      getLineColor: [255, 255, 255],
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
        layers={layers}
      ></SelectMenu>
      <DeckGL
        layers={geoJsonData ? layers : []}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        /* getTooltip={getTooltip} */
        effects={[LIGHTNING_EFFECT]}
      >
        <Map {...mapOptions} />
      </DeckGL>
    </div>
  )
}

export default DeckGlMap
