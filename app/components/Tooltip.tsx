// components/Tooltip.tsx
import React, { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  return (
    <div className="relative group">
      {children}
      <div className="w-[200px] absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 -mt-2 -ml-2">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;