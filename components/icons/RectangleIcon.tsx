import React from 'react';

const RectangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    {...props}
  >
    <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
  </svg>
);

export default RectangleIcon;