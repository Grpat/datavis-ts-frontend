import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core/typed'

export const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
export const MAP_STYLE2 = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
export const AMBIENT_LIGHT = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
})

export const POINT_LIGHT_1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000],
})

export const POINT_LIGHT_2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000],
})

export const LIGHTNING_EFFECT = new LightingEffect({
  AMBIENT_LIGHT,
  POINT_LIGHT_1,
  POINT_LIGHT_2,
})

export const MATERIAL = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51],
}

export const INITIAL_VIEW_STATE = {
  longitude: 19.134378,
  latitude: 51.9189,
  zoom: 6.8,
  minZoom: 2,
  maxZoom: 15,
  pitch: 40.5,
  bearing: -27,
}

export const COLOR_RANGE = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
]
