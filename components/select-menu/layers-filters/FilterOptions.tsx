import React from 'react'

interface FilterOptionsProps {
  layerId: string
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ layerId }) => {
  return (
    <div className='flex justify-center flex-col items-center'>
      <div className='mt-4 w-10/12'></div>
      <div className='mt-4 w-10/12'></div>
      <div className='mt-4 w-10/12'></div>
    </div>
  )
}
export default FilterOptions
