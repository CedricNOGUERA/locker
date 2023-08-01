import React from 'react'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 60) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <div onClick={scrollToTop} className=' back-to-top animate__animated animate__bounce  mb-2'>
      {isVisible && (
        <i className='ri-arrow-up-s-line fs-1 text-info rounded-circle bg-light border-1 '></i>
        // <i className='ri-arrow-up-circle-fill fs-1 text-info border-3 border-secondary rounded-circle '></i>
      )}
    </div>
  )
}

export default ScrollToTop
