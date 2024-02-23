'use client'
import { Map } from '../organisms/Map'

import { Label } from '../atoms/label'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'

import { useFormContext, useWatch, useFieldArray } from 'react-hook-form'

import { Panel } from '../organisms/Map/Panel'
import { Marker } from '../organisms/Map/MapMarker'
import { CenterOfMap, DefaultZoomControls } from '../organisms/Map/ZoomControls'
import { useMap } from 'react-map-gl'

import { HtmlSelect } from '../atoms/select'

import {
  FormProviderCreateCinema,
  FormTypeCreateCinema,
} from '@/forms/createCinema'
import { BrandIcon } from '../atoms/BrandIcon'
import { useToast } from '../molecules/Toaster/use-toast'
import { TextArea } from '../atoms/textArea'
import { trpcClient } from '@/trpc/clients/client'
import { SimpleAccordion } from '../molecules/SimpleAccordion'
import { ProjectionType, SoundSystemType } from '@prisma/client'
import { Plus } from 'lucide-react'
import { SearchPlace } from '../organisms/SearchPlace'
import { useRouter } from 'next/navigation'
import { revalidatePath } from '@/util/actions/revalidatePath'
import { cn } from '@/util/styles'
import { Square } from '../organisms/ScreenUtils'
export interface ICreateCinemaProps {}

export const CreateCinema = () => (
  <FormProviderCreateCinema>
    <CreateCinemaContent />
  </FormProviderCreateCinema>
)

export const CreateCinemaContent = ({}: ICreateCinemaProps) => {
  const { register, handleSubmit, setValue, reset, control } =
    useFormContext<FormTypeCreateCinema>()
  const {
    isLoading,
    data,
    error,
    mutateAsync: createCinema,
  } = trpcClient.cinemas.createCinema.useMutation()

  const { toast } = useToast()
  const { replace } = useRouter()
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <form
        onSubmit={handleSubmit(
          async ({
            address: { address, lat, lng },
            cinemaName,
            screens,
            managerId,
          }) => {
            await createCinema({
              managerId,
              cinemaName,
              address: {
                address,
                lat,
                lng,
              },
              screens,
            })
            reset()
            toast({ title: 'Cinema created successfully.' })
            revalidatePath('admins/cinemas')
            replace('/admin/cinemas')
          },
        )}
      >
        <Label title="Cinema">
          <Input placeholder="Cinema name" {...register('cinemaName')} />
        </Label>
        <Label title="Manager ID">
          <Input placeholder="Manager ID" {...register('managerId')} />
        </Label>

        <Label title="Address">
          <TextArea placeholder="Address" {...register('address.address')} />
        </Label>
        <Label title="Location">
          <ShowLocation />
        </Label>
        <AddScreens />

        <Button type="submit" loading={isLoading}>
          Create cinema
        </Button>
      </form>
      <Map
        initialViewState={{
          longitude: 80.2,
          latitude: 12.9,
          zoom: 8,
        }}
      >
        <MapMarker />

        <Panel position="left-top">
          <SearchBox
            onChange={({ lat, lng }) => {
              setValue('address.lat', lat, { shouldValidate: true })
              setValue('address.lng', lng, { shouldValidate: true })
            }}
          />
          <DefaultZoomControls>
            <CenterOfMap
              onClick={(latLng) => {
                const lat = parseFloat(latLng.lat.toFixed(6))
                const lng = parseFloat(latLng.lng.toFixed(6))

                setValue('address.lat', lat, { shouldValidate: true })
                setValue('address.lng', lng, { shouldValidate: true })
              }}
            />
          </DefaultZoomControls>
        </Panel>
      </Map>
    </div>
  )
}

const AddScreens = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormTypeCreateCinema>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `screens`,
  })

  const { screens } = useWatch<FormTypeCreateCinema>()

  return (
    <div>
      {fields.map((item, screenIndex) => (
        <SimpleAccordion title={screenIndex + 1 || '[Empty]'} key={item.id}>
          <div className={`flex justify-end my-2`}>
            <Button
              variant="link"
              size="sm"
              className="text-xs text-gray-600 underline underline-offset-2"
              onClick={() => {
                remove(screenIndex)
              }}
            >
              remove screen
            </Button>
          </div>

          <div className={`flex flex-col gap-2`}>
            <div className="grid grid-cols-2 gap-2">
              <Label
                title="Projection type"
                error={errors.screens?.[screenIndex]?.type?.toString()}
              >
                <HtmlSelect
                  placeholder="projection type"
                  {...register(`screens.${screenIndex}.projectionType`)}
                >
                  {Object.values(ProjectionType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </HtmlSelect>
              </Label>
              <Label
                title="Sound system type"
                error={errors.screens?.[screenIndex]?.type?.toString()}
              >
                <HtmlSelect
                  placeholder="sound system type"
                  {...register(`screens.${screenIndex}.soundSystemType`)}
                >
                  {Object.values(SoundSystemType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </HtmlSelect>
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Label
                title="Rows"
                error={errors.screens?.[screenIndex]?.rows?.message}
              >
                <Input
                  placeholder="Enter the name"
                  {...register(`screens.${screenIndex}.rows`, {
                    valueAsNumber: true,
                  })}
                />
              </Label>
              <Label
                title="Columns"
                error={errors.screens?.[screenIndex]?.columns?.message}
              >
                <Input
                  type="number"
                  placeholder="Enter the name"
                  {...register(`screens.${screenIndex}.columns`, {
                    valueAsNumber: true,
                  })}
                />
              </Label>
              <Label
                title="Price"
                error={errors.screens?.[screenIndex]?.price?.message}
              >
                <Input
                  type="number"
                  placeholder="Enter the price"
                  {...register(`screens.${screenIndex}.price`, {
                    valueAsNumber: true,
                  })}
                />
              </Label>
            </div>
            <Grid
              rows={screens?.[screenIndex]?.rows || 0}
              columns={screens?.[screenIndex]?.columns || 0}
            />
          </div>
        </SimpleAccordion>
      ))}
      <div>
        <Button
          className="flex items-center justify-center w-full py-2 text-xs border border-dashed"
          size="sm"
          variant="link"
          onClick={() =>
            append({
              columns: 0,
              rows: 0,
              price: 0,
              projectionType: ProjectionType.STANDARD,
              soundSystemType: SoundSystemType.DOLBY_ATMOS,
            })
          }
        >
          <Plus className="w-4 h-4" /> Add screen
        </Button>
      </div>
    </div>
  )
}

const ShowLocation = () => {
  const { address } = useWatch<FormTypeCreateCinema>()

  return (
    <div>
      <span className="px-2 py-1 text-xs rounded bg-gray-50">
        {address?.lat?.toFixed(4)}
      </span>{' '}
      <span className="px-2 py-1 text-xs rounded bg-gray-50">
        {address?.lng?.toFixed(4)}
      </span>
    </div>
  )
}

export const SearchBox = ({
  onChange,
}: {
  onChange: ({ lat, lng }: { lat: number; lng: number }) => void
}) => {
  const { current: map } = useMap()
  return (
    <SearchPlace
      onLocationChange={(locationInfo) => {
        const lat = locationInfo.latitude
        const lng = locationInfo.longitude
        onChange({ lat, lng })

        map?.flyTo({
          center: { lat, lng },
          essential: true,
        })
      }}
    />
  )
}

const MapMarker = () => {
  const { address } = useWatch<FormTypeCreateCinema>()
  const { setValue } = useFormContext<FormTypeCreateCinema>()

  return (
    <Marker
      pitchAlignment="auto"
      longitude={address?.lng || 0}
      latitude={address?.lat || 0}
      draggable
      onDragEnd={({ lngLat }) => {
        const { lat, lng } = lngLat
        setValue('address.lat', lat || 0)
        setValue('address.lng', lng || 0)
      }}
    >
      <BrandIcon />
    </Marker>
  )
}

export const StaightMovieScreen = () => {
  return (
    <div className="mb-4">
      <div className="h-0.5 bg-gray rounded"></div>
      <div className="flex ">
        <div className="flex-1 h-4 bg-gradient-to-tr from-transparent via-transparent to-gray" />
        <div className="flex-1 h-4 bg-gradient-to-tl from-transparent via-transparent to-gray" />
      </div>
      <div className="text-xs text-center text-gray-500">Eyes this way</div>
    </div>
  )
}
export const CurvedScreen = ({ width = 300, height = 10 }) => {
  const curveOffset = height * 0.9 // Controls the curvature of the screen

  return (
    <svg
      width={'100%'}
      className="mt-6"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path
        d={`M 0,${height} L 0,0 Q ${
          width / 2
        },${curveOffset} ${width},0 L ${width},${height} Z`}
        fill="black"
      />
    </svg>
  )
}

export const Grid = ({ rows, columns }: { rows: number; columns: number }) => {
  const renderRows = () => {
    const rowElements = []

    for (let i = 0; i < rows; i++) {
      const columnElements = []
      for (let j = 0; j < columns; j++) {
        columnElements.push(<Square key={`${i}-${j}`} />)
      }
      rowElements.push(
        <div key={`row-${i}`} className="flex gap-2">
          {columnElements}
        </div>,
      )
    }

    return (
      <div className="flex flex-col items-center gap-2 px-2 overflow-x-auto">
        {rowElements}
      </div>
    )
  }

  return (
    <div className="w-full ">
      {renderRows()}

      <CurvedScreen />
    </div>
  )
}
