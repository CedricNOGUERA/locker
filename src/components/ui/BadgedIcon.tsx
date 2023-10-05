import {_iconFilter3 } from '../../utils/functions'

const BadgedIcon = ({ slot, borderColor, imgSize }: any) => {
  return (
    <span>
      <img
        alt='zone'
        src={_iconFilter3(slot?.slot?.temperatureZone?.name)}
        style={{ width: `${imgSize}`, height: `${imgSize}` }}
      />
      <div className={`size-indicator border-${borderColor} font-65 fw-bold text-secondary`}>
        {slot?.slot?.size}
      </div>
    </span>
  )
}

export default BadgedIcon
