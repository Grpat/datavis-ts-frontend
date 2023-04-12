'use client'

import React, { useState, useEffect, useCallback, FC } from 'react'
import Map from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import DeckGL from '@deck.gl/react/typed'
import { GeoJsonLayer } from '@deck.gl/layers/typed'

import { MAP_STYLE, MAP_STYLE2, LIGHTNING_EFFECT, MATERIAL, INITIAL_VIEW_STATE, COLOR_RANGE } from '@/lib/mapconfig'

import { GeoJSON } from '@/types/common/GeojsonTypes'
import SelectMenu from '@/components/select-menu/SelectMenu'
import useHttp from '@/hooks/use-http'
import { Option } from '@/types/common/Option'

const mapOptions = {
  reuseMaps: true,
  mapLib: maplibregl,
  mapStyle: MAP_STYLE,
  preventStyleDiffing: true,
} as any

interface ChildComponentProps {}

const DeckGlMap: React.FC<ChildComponentProps> = ({}) => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null)
  const [worldBankDataLayer, setWorldBankDataLayer] = useState<GeoJSON.FeatureCollection | null>(null)

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

  useEffect(() => {
    console.log(geoJsonData)
  }, [geoJsonData])

  useEffect(() => {
    console.log(worldBankDataLayer)
  }, [worldBankDataLayer])

  return (
    <div>
      <SelectMenu
        geoJsonData={geoJsonData}
        setWorldBankDataLayer={setWorldBankDataLayer}
        errorCountryBoundaries={errorCountryBoundaries}
        isLoadingCountryBoundaries={isLoadingCountryBoundaries}
      ></SelectMenu>
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
