import React from 'react';
import ReactDOM from 'react-dom';

const Tooltip = ({ content, top, left, visible }) => {
  if (!visible) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      {content}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 translate-y-full"
        style={{
          bottom: '0px',
          width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: '4px solid rgb(31, 41, 55)',
        }}
      />
    </div>,
    document.getElementById('tooltip-portal')
  );
};

export default Tooltip; 