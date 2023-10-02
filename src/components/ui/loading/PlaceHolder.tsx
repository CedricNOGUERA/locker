import React from 'react'
import { Placeholder } from 'react-bootstrap'

interface placeHolderProps{
    paddingYFirst: string
}


const PlaceHolder: React.FC<placeHolderProps> = ({paddingYFirst} ) => {
  return (
    <>
      <Placeholder as='p' animation='glow' >
        <Placeholder xs={12} className='py-4 rounded'/>
      </Placeholder>
      <Placeholder as='p' animation='glow'>
        <Placeholder xs={12} className='py-4 rounded' />
      </Placeholder>
      <Placeholder as='p' animation='glow'>
        <Placeholder xs={12} className='py-4 rounded' />
      </Placeholder>
      <Placeholder as='p' animation='glow'>
        <Placeholder xs={12} className='py-4 rounded' />
      </Placeholder>
      <Placeholder as='p' animation='glow'>
        <Placeholder xs={12} className='py-4 rounded' />
      </Placeholder>
      <Placeholder as='p' animation='glow'>
        <Placeholder xs={12} className='py-4 rounded' />
      </Placeholder>
      <Placeholder as='p' animation='glow'>
        <Placeholder xs={12} className='py-4 rounded' />
      </Placeholder>
    </>
  )
}

export default PlaceHolder
