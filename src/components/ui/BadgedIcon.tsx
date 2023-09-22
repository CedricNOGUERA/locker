import React from 'react'
import { _iconFilter, _iconFilter2, _iconFilter3, _imgFilter2 } from '../../utils/functions'

const BadgedIcon = ({ slot, borderColor, imgSize }: any) => {
  console.log(slot?.slot?.temperatureZone.locker['@id'])
  return (
    <span>
      {/* {slot?.slot?.temperatureZone.locker['@id'] === '/api/lockers/1' ? (
        <img
          alt='zone'
          src={
            'https://img.icons8.com/color/52/' +
            _imgFilter2(slot?.slot?.temperatureZone?.myKey) +
            '.png'
          }
          style={{ width: `${imgSize}`, height: `${imgSize}` }}
        />
      ) : ( */}
        <img
          alt='zone'
          src={_iconFilter3(slot?.slot?.temperatureZone?.name)}
          style={{ width: `${imgSize}`, height: `${imgSize}` }}
        />
      {/* // )} */}
      <div className={`size-indicator border-${borderColor} font-65 fw-bold text-secondary`}>
        {slot?.slot?.size}
      </div>
    </span>
  )
}

export default BadgedIcon
