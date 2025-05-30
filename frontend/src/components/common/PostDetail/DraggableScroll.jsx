import React, { useRef, useState } from 'react';
import '../../../index.css';

const DraggableScroll = ({ data, renderItem }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef();


  return (
    <div ref={containerRef} className="overflow-x-scroll">
        {data}
        
    </div>
  );
};

export default DraggableScroll;
