import React from 'react';

interface LinkPreviewProps {
  url: string;
  title: string;
  description: string;
}

/**
 * Displays a preview for a link including its title and description.
 */
const LinkPreview: React.FC<LinkPreviewProps> = ({ url, title, description }) => {
  return (
    <div className="mt-2 p-4 border rounded-md bg-gray-50">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#0A66C2] font-medium hover:underline"
      >
        {title}
      </a>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
  );
};

export default LinkPreview;
