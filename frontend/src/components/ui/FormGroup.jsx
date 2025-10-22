import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const FormGroup = ({
  children,
  className,
  spacing = 'normal',
  animate = true,
  ...props
}) => {
  const spacings = {
    none: 'space-y-0',
    tight: 'space-y-3',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
    loose: 'space-y-8',
  };

  const classes = clsx(
    spacings[spacing],
    className
  );

  if (animate) {
    return (
      <motion.div
        className={classes}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const FormRow = ({
  children,
  className,
  columns = 1,
  gap = 'normal',
  align = 'stretch',
  ...props
}) => {
  const gaps = {
    none: 'gap-0',
    tight: 'gap-3',
    normal: 'gap-4',
    relaxed: 'gap-6',
    loose: 'gap-8',
  };

  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const classes = clsx(
    'grid',
    gridCols[columns],
    gaps[gap],
    alignments[align],
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const FormSection = ({
  children,
  className,
  title,
  description,
  divider = false,
  ...props
}) => {
  return (
    <div className={clsx('space-y-4', className)} {...props}>
      {(title || description) && (
        <div className={clsx('space-y-1', { 'pb-4 border-b border-secondary-200': divider })}>
          {title && (
            <h3 className="text-lg font-semibold text-secondary-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-secondary-600">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

FormGroup.Row = FormRow;
FormGroup.Section = FormSection;

export default FormGroup;