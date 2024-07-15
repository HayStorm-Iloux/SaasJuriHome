import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface CheckboxItemProps {
  name: string;
  label: string;
  totalShares: number;
  onCheckChange?: (name: string, checked: boolean) => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ name, label, totalShares, onCheckChange }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [adoptedShares, setAdoptedShares] = useState(0);

  const handleAdoptedSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setAdoptedShares(isNaN(value) ? 0 : Math.min(value, totalShares));
  };

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    if (onCheckChange) {
      onCheckChange(name, checked);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input 
        type="checkbox" 
        name={name} 
        className="w-5"
        checked={isChecked}
        onChange={handleCheckChange}
      />
      <label
        htmlFor={name}
        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      {isChecked && (
        <label
          htmlFor={name}
          className="text-sm pl-6 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Adopté à 
          <input 
            className="border border-1 w-12 mx-1 text-center"
            type="number"
            min="0"
            name={`${name}-shares`}
            max={totalShares}
            value={adoptedShares}
            onChange={handleAdoptedSharesChange}
          />
          /{totalShares}
        </label>
      )}
    </div>
  );
};

export default CheckboxItem;