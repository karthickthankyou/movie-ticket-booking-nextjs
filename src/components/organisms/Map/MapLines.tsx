import { Layer, Source } from 'react-map-gl'
type Location = {
  latitude: number
  longitude: number
}
export const MapLines = ({ coordinates }: { coordinates?: Location[] }) => {
  console.log('coordinates ', coordinates)
  const dataOne: GeoJSON.Feature<GeoJSON.LineString> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates:
        coordinates?.map((location) => [
          location.longitude,
          location.latitude,
        ]) || [],
    },
  }
  return (
    <Source type="geojson" data={dataOne}>
      <Layer
        id="lineLayer"
        type="line"
        source="my-data"
        paint={{
          'line-color': 'rgb(0,0,0)',
          'line-width': 1.5,
          'line-dasharray': [6, 2], // This creates a dashed pattern
        }}
      />
      {/* Circle Layer for Dots */}
      <Layer
        id="circleLayer"
        type="circle"
        source="my-data"
        paint={{
          'circle-radius': 4, // Size of the circle
          'circle-color': 'rgb(0,0,0)', // Color of the circle
        }}
      />
    </Source>
  )
}
