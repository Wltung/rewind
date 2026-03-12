export const shakeVariant = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };
  
  export const bookFlipVariant = {
    closed: { rotateY: 0 },
    opened: { 
      rotateY: -160, 
      transition: { duration: 1.5, ease: "easeInOut" } 
    }
  };
  
  export const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };