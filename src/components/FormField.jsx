import React from 'react';
import { useController } from 'react-hook-form';

const FormField = ({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  options = [], // for select fields
  className = '',
  inputClassName = '',
  rows = 3, // for textarea
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: required && `${label} is required` },
  });

  const baseInputClass = `
    input-field
    ${error ? 'border-red-300 focus:border-red-300 focus:ring-red-500' : ''}
    ${inputClassName}
  `;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...field}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            className={baseInputClass}
            {...props}
          />
        );
      
      case 'select':
        return (
          <select
            {...field}
            disabled={disabled}
            className={baseInputClass}
            {...props}
          >
            <option value="">{placeholder || 'Select an option'}</option>
            {options.map((option) => {
              const value = typeof option === 'string' ? option : option.value;
              const label = typeof option === 'string' ? option : option.label;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              {...field}
              type="checkbox"
              checked={field.value || false}
              disabled={disabled}
              className="
                h-4 w-4 text-primary-600 border-gray-300 rounded
                focus:ring-primary-500 focus:ring-2
              "
              {...props}
            />
            <label className="ml-2 text-sm text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );
      
      default:
        return (
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={baseInputClass}
            {...props}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className={className}>
        {renderInput()}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {label && type !== 'checkbox' && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default FormField;
