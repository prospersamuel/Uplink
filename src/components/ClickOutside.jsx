// components/ClickOutside.jsx
import { useEffect, useRef } from 'react';

export const ClickOutside = ({ children, onClickOutside, as = 'div', className = '', style = {} }) => {
  const wrapperRef = useRef();
  const Component = as;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClickOutside]);

  return (
    <Component ref={wrapperRef} className={className} style={style}>
      {children}
    </Component>
  );
};