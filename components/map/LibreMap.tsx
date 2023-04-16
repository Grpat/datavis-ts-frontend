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
import { timestampToYear } from '@/utils/commonUtils'

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
  const [filterCondition, setFilter] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | null>(2021)

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
    const layer = createGeoJsonLayer(newLayer)
    setLayers(prevLayers => [...prevLayers, layer])
  }
  const createGeoJsonLayer = (data: GeoJSON.FeatureCollection) => {
    console.log('Creating Layer')
    return new GeoJsonLayer({
      id: `layer-${Date.now()}`,
      data: data,
      opacity: 0.6,
      stroked: true,
      filled: true,
      extruded: true,
      wireframe: false,
      /*  getFilterValue: (f: any) => {
        if (!f.properties || !f.properties.timestamp) return 0
        const featureYear = timestampToYear(f.properties.timestamp)
        return featureYear === selectedYear ? 1 : 0
      },
      filterRange: [1, 1],
      extensions: [new DataFilterExtension({ filterSize: 1 })],
      updateTriggers: {
        getFilterValue: [selectedYear],
      },*/
      getElevation: f => {
        if (!f.properties) return 0
        return f.properties.value
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
