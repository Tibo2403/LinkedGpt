import React from 'react';

/**
 * Multi-line text area with optional label.
 */

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  rows?: number;
}

/**
 * Renders a styled textarea element.
 *
 * @param props.label - Optional field label.
 * @param props.error - Validation message shown below the textarea.
 * @param props.rows - Default height in rows.
 */

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className = '',
  rows = 4,
  ...props
}) => {
  const id = props.id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] sm:text-sm ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TextArea;