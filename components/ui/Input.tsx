import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">{label}</label>}
      <input
        id={id}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 placeholder-gray-400 leading-tight focus:outline-none focus:shadow-outline bg-white"
        {...props}
      />
    </div>
  );
};

export default Input;