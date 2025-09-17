import React from 'react';

const BrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    {...props}
  >
    <path d="M13.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-.39.242l-5 2a1 1 0 0 1-1.22-1.22l2-5a1 1 0 0 1 .242-.39l9-9zM14 6.414l-8.293 8.293 1.293 1.293L15.293 7.707l-1.293-1.293zM5.914 15.5l-1.293-1.293L13.207 5.5l1.293 1.293L5.914 15.5z"/>
  </svg>
);

export default BrushIcon;