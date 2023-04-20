import React, { useState } from 'react'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
import LayerComponent from '@/components/select-menu/layers-tab/LayerComponent'

interface LayersTabComponentProps {
  layers: GeoJsonLayer[]

  onDeleteLayer(layerId: string): void

  onToggleVisibilityLayer(layerId: string): void

  onCopyLayer(layerId: string): void
}

const LayersTab: React.FC<LayersTabComponentProps> = ({ layers, onDeleteLayer, onToggleVisibilityLayer, onCopyLayer }) => {
  return (
    <div className='mt-8'>
      {layers.map((layer, index) => (
        <LayerComponent
          key={index}
          layer={layer}
          onDeleteLayer={onDeleteLayer}
          onToggleVisibilityLayer={onToggleVisibilityLayer}
          onCopyLayer={onCopyLayer}
        />
      ))}
    </div>
  )
}
export default LayersTab
