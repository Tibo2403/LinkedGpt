import React from 'react';

/**
 * Simple container component with optional header and footer.
 */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  footer?: React.ReactNode;
}

/**
 * Provides a styled container for grouping related UI elements.
 *
 * @param props.title - Optional heading displayed at the top of the card.
 * @param props.footer - Content rendered inside the card footer.
 */

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  footer,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;