export interface ISeatNumberProps {
  row: number
  column: number
}

export const SeatNumber = ({ row, column }: ISeatNumberProps) => {
  return (
    <div className="inline-flex items-center justify-center px-1 py-1 text-sm font-semibold rounded shadow-lg hover:bg-indigo-600">
      {`${row}.${column}`}
    </div>
  )
}
