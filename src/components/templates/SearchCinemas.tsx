'use client'
import { SetCity } from '../organisms/HomeUtils'
import { Map } from '../organisms/Map'
import { Panel } from '../organisms/Map/Panel'
import { DefaultZoomControls } from '../organisms/Map/ZoomControls'

export interface ISearchCinemasProps {}

export const SearchCinemas = ({}: ISearchCinemasProps) => {
  return (
    <Map>
      <Panel position="right-center">
        <DefaultZoomControls />
      </Panel>

      <Panel position="left-top">
        <SetCity />
      </Panel>
    </Map>
  )
}
