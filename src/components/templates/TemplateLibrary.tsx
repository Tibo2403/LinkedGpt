import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { fetchTemplates, Template } from '../../lib/api';

interface TemplateLibraryProps {
  onSelect: (template: Template) => void;
  onClose: () => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onSelect, onClose }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTemplates();
        setTemplates(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Templates</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {templates.map(t => (
              <div
                key={t.id}
                onClick={() => onSelect(t)}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <h4 className="font-medium">{t.title}</h4>
                <p className="text-sm text-gray-600 truncate">{t.content}</p>
              </div>
            ))}
            {templates.length === 0 && (
              <p className="text-sm text-gray-500">No templates found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateLibrary;
