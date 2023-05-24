import React from 'react'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
import LayerComponent from '@/components/select-menu/layers-tab/LayerComponent'
import { LayerDataRecord } from '@/types/common/LayersTypes'
import { Option } from '@/types/common/Option'

interface LayersTabComponentProps {
  layers: GeoJsonLayer[]

  onDeleteLayer(layerId: string): void

  onToggleVisibilityLayer(layerId: string): void

  onCopyLayer(layerId: string): void

  onElevationRangeChange: (layerId: string, newElevationRange: number) => void
  onOpacityChange: (layerId: string, newOpacityValue: number) => void
  onColorScaleChange: (layerId: string, newOpacityValue: number) => void
  layersData: LayerDataRecord
  selectedElevationProp: Option | null
  setSelectedElevationProp: (option: Option | null) => void
  onPropertyElevationChange: (option: Option | null, layerId: string) => void
  selectedColorProp: Option | null
  setSelectedColorProp: (option: Option | null) => void

  onPropertyColorChange: (option: Option | null, layerId: string) => void
}

const LayersTab: React.FC<LayersTabComponentProps> = ({
  layers,
  onDeleteLayer,
  onToggleVisibilityLayer,
  onCopyLayer,
  onElevationRangeChange,
  onColorScaleChange,
  onOpacityChange,
  layersData,
  selectedElevationProp,
  setSelectedElevationProp,
  onPropertyElevationChange,
  selectedColorProp,
  setSelectedColorProp,
  onPropertyColorChange,
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
          layersData={layersData}
          selectedElevationProp={selectedElevationProp}
          setSelectedElevationProp={setSelectedElevationProp}
          onPropertyElevationChange={onPropertyElevationChange}
          selectedColorProp={selectedColorProp}
          setSelectedColorProp={setSelectedColorProp}
          onPropertyColorChange={onPropertyColorChange}
        />
      ))}
    </div>
  )
}
export default LayersTab
