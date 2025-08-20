import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Input = forwardRef(({
  className,
  type = 'text',
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  placeholder,
  showPasswordToggle = false,
  animate = true,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  const inputClasses = clsx(
    'input',
    {
      'pl-10': LeftIcon,
      'pr-10': RightIcon || (type === 'password' && showPasswordToggle),
      'border-error-500 focus:border-error-500 focus:ring-error-500': error,
    },
    className
  );
  
  const InputComponent = animate ? motion.input : 'input';
  const inputProps = animate ? {
    whileFocus: { scale: 1.01 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  } : {};
  
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-secondary-400" />
          </div>
        )}
        
        <InputComponent
          ref={ref}
          type={inputType}
          className={inputClasses}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...inputProps}
          {...props}
        />
        
        {(RightIcon || (type === 'password' && showPasswordToggle)) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {type === 'password' && showPasswordToggle ? (
              <button
                type="button"
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            ) : RightIcon ? (
              <RightIcon className="h-5 w-5 text-secondary-400" />
            ) : null}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx('mt-1 text-sm', {
            'text-error-600': error,
            'text-secondary-600': helperText && !error,
          })}
        >
          {error || helperText}
        </motion.div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;