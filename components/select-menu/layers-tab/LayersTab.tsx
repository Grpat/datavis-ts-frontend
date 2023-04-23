import React, { useState } from 'react'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
import LayerComponent from '@/components/select-menu/layers-tab/LayerComponent'

interface LayersTabComponentProps {
  layers: GeoJsonLayer[]

  onDeleteLayer(layerId: string): void

  onToggleVisibilityLayer(layerId: string): void

  onCopyLayer(layerId: string): void

  onElevationRangeChange: (layerId: string, newElevationRange: number) => void
  onOpacityChange: (layerId: string, newOpacityValue: number) => void
  onColorScaleChange: (layerId: string, newOpacityValue: number) => void
}

const LayersTab: React.FC<LayersTabComponentProps> = ({
  layers,
  onDeleteLayer,
  onToggleVisibilityLayer,
  onCopyLayer,
  onElevationRangeChange,
  onColorScaleChange,
  onOpacityChange,
}) => {
  return (
    <div className='mt-8'>
      {layers.map((layer, index) => (
        <LayerComponent
          key={index}
          layer={layer}
          onDeleteLayer={onDeleteLayer}
          onToggleVisibilityLayer={onToggleVisibilityLayer}
          onCopyLayer={onCopyLayer}
          onElevationRangeChange={onElevationRangeChange}
          onOpacityChange={onOpacityChange}
          onColorScaleChange={onColorScaleChange}
          visibility={layer.props.visible}
        />
      ))}
    </div>
  )
}
export default LayersTab
