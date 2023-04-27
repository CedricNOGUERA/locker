import React from 'react'
import { Placeholder } from 'react-bootstrap'

interface placeHolderProps{
    paddingYFirst: string
}


const PlaceHolder: React.FC<placeHolderProps> = ({paddingYFirst} ) => {
  return (
    <>
      <Placeholder as='p' animation='glow'>
        <Placeholder xs={12} className={`py-${paddingYFirst} rounded-pill`} />
      </Placeholder>
      <Placeholder as='p' animation='glow'>
        <Placeholder xs={12} className='py-5 rounded' />
      </Placeholder>
      <Placeholder as='p' animation='glow'>
        <Placeholder xs={12} className='py-5 rounded' />
      </Placeholder>
      <Placeholder as='p' animation='glow'>
        <Placeholder xs={12} className='py-5 rounded' />
      </Placeholder>
      <Placeholder as='p' animation='glow'>
        <Placeholder xs={12} className='py-5 rounded' />
      </Placeholder>
      <Placeholder as='p' animation='glow'>
        <Placeholder xs={12} className='py-5 rounded' />
      </Placeholder>
    </>
  )
}

export default PlaceHolder
