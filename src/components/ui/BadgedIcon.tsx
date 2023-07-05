import React from 'react'
import { _imgFilter } from '../../utils/functions'

const BadgedIcon = ({ slot, borderColor, imgSize }: any) => {
  return (
    <span>
      <img
        alt='zone'
        src={
          'https://img.icons8.com/color/52/' +
          _imgFilter(slot?.slot?.temperatureZone?.keyTemp) +
          '.png'
        }
        style={{ width: `${imgSize}`, height: `${imgSize}` }}
      />
      <div className={`size-indicator border-${borderColor} font-65 fw-bold text-secondary`}>
        {slot?.slot?.size}
      </div>
    </span>
  )
}

export default BadgedIcon
