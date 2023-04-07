import React from 'react'
import HexagonIcon from '@mui/icons-material/Hexagon'
import { styled } from '@mui/material'

const HexagonLogo = styled(HexagonIcon)({
  color: '#5eead4',
})
const Header: React.FC = () => {
  return (
    <div className='h-[10%] bg-zinc-800 rounded overflow-hidden flex items-center'>
      <div className='inline-flex items-center pl-5 z-10'>
        <HexagonLogo></HexagonLogo>
        <h1 className='text-teal-400 pl-1 text-sm font-bold uppercase'>Data Visualization</h1>
      </div>
    </div>
  )
}
export default Header
