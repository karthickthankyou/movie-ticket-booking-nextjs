export const ProgressBar = ({ value }: { value: number }) => {
  return (
    <div className="w-full h-1 bg-gray-200 rounded">
      <div
        style={{ width: `${value}%` }}
        className="h-full bg-primary rounded"
      />
    </div>
  )
}
