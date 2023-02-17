import React from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div
      onClick={scrollToTop}
      className=" back-to-top animate__animated animate__bounce "
    >
      {isVisible && 

      <i className="ri-arrow-up-circle-fill fs-1 text-info border border-3 rounded-circle border-secondary"></i>
      }
    </div>
  );
};

export default ScrollToTop ;
