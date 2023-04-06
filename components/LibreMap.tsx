'use client'

import React, { useState, useEffect, useCallback, FC } from 'react'
import Map from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import DeckGL from '@deck.gl/react/typed'
import { GeoJsonLayer } from '@deck.gl/layers/typed'

import {
  MAP_STYLE,
  MAP_STYLE2,
  LIGHTNING_EFFECT,
  MATERIAL,
  INITIAL_VIEW_STATE,
  COLOR_RANGE,
} from '@/lib/mapconfig'

import { GeoJSON } from '@/types/common/GeojsonTypes'
import SelectMenu from '@/components/SelectMenu'

const mapOptions = {
  reuseMaps: true,
  mapLib: maplibregl,
  mapStyle: MAP_STYLE,
  preventStyleDiffing: true,
} as any

const DeckGlMap = () => {
  const [geoJsonData, setGeoJsonData] =
    useState<GeoJSON.FeatureCollection | null>(null)
  const [error, setError] = useState<any>(null)

  const fetchGeoJsonData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/v1/countryBoundaries')
      if (!response.ok) {
        throw new Error('Something went wrong!')
      }
      const data: GeoJSON.FeatureCollection = await response.json()
      console.log(data)
      setGeoJsonData(data)
    } catch (error: any) {
      setError(error.message)
    }
  }, [])

  useEffect(() => {
    fetchGeoJsonData()
  }, [fetchGeoJsonData])

  return (
    <div>
      <SelectMenu></SelectMenu>
      <DeckGL
        /* layers={geoJsonData ? layers : []} */
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
