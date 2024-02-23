import { cn } from '@/util/styles'

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
      width={width}
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

export const Square = ({ booked = false, selected = false }) => {
  return (
    <div
      className={cn(
        'w-5 transition-all h-5 border border-black/50 rounded shadow-md',
        booked ? 'bg-gray-200 shadow-inner border-0 ' : null,
        selected
          ? 'bg-primary-500 p-1 border-0 shadow-black/30 shadow-lg'
          : null,
      )}
    />
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
        <div key={`row-${i}`} className="flex gap-1">
          {columnElements}
        </div>,
      )
    }

    return rowElements
  }

  return (
    <div className="w-full ">
      <div className="flex flex-col items-center gap-1 px-2 overflow-x-auto">
        {renderRows()}
        <CurvedScreen />
      </div>
    </div>
  )
}
