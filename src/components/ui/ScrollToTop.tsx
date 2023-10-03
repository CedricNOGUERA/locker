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
      if (window.scrollY > 160) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <div
    onClick={scrollToTop}
    className=' back-to-top text-center animate__animated animate__bounce mb-2'>
      {isVisible && (
        <i
          className='ri-arrow-up-s-line fs-1 text-green rounded-circle bg-light border-1 '
        ></i>
      )}
    </div>
  )
}

export default ScrollToTop
