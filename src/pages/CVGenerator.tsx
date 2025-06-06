import React, { useState } from 'react';
import { FileText, Download, Upload, Sparkles, FileDown, FileText as FileTextIcon, Settings, X } from 'lucide-react';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import TextArea from '../components/common/TextArea';

interface CVSection {
  id: string;
  type: 'experience' | 'education' | 'skills';
  content: {
    title?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    skills?: string[];
  };
}

interface ExportSettings {
  format: 'pdf' | 'word';
  template: 'modern' | 'classic' | 'minimal';
  fontSize: number;
  spacing: number;
  includePhoto: boolean;
  accentColor: string;
  paperSize: 'a4' | 'letter';
  margins: number;
}

const CVGenerator: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [sections, setSections] = useState<CVSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [showExportSettings, setShowExportSettings] = useState(false);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'pdf',
    template: 'modern',
    fontSize: 11,
    spacing: 1.15,
    includePhoto: true,
    accentColor: '#0A66C2',
    paperSize: 'a4',
    margins: 2.54
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleGenerateCV = async () => {
    setIsGenerating(true);
    // Mock API call to analyze job description and generate CV
    setTimeout(() => {
      const extractedKeywords = ['AI', 'Machine Learning', 'Marketing Automation', 'Content Strategy'];
      setKeywords(extractedKeywords);
      
      const generatedSections: CVSection[] = [
        {
          id: '1',
          type: 'experience',
          content: {
            title: 'Senior Marketing Manager',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            startDate: '2020-01',
            endDate: 'Present',
            description: 'Led digital marketing initiatives focusing on AI-driven automation and content optimization.'
          }
        },
        {
          id: '2',
          type: 'education',
          content: {
            title: 'Master of Business Administration',
            company: 'Stanford University',
            location: 'Stanford, CA',
            startDate: '2018',
            endDate: '2020',
            description: 'Specialized in Digital Marketing and AI Applications'
          }
        },
        {
          id: '3',
          type: 'skills',
          content: {
            skills: ['Digital Marketing', 'AI Strategy', 'Content Optimization', 'Marketing Automation']
          }
        }
      ];
      
      setSections(generatedSections);
      setIsGenerating(false);
    }, 2000);
  };

  const generateWordDocument = (sections: CVSection[]) => {
    // Create a simple HTML representation of the CV
    const content = sections.map(section => {
      const sectionContent = section.content;
      return `
        <h2>${section.type.toUpperCase()}</h2>
        ${section.type === 'skills' ? 
          `<p>${sectionContent.skills?.join(', ')}</p>` :
          `<h3>${sectionContent.title}</h3>
           <p>${sectionContent.company} - ${sectionContent.location}</p>
           <p>${sectionContent.startDate} - ${sectionContent.endDate}</p>
           <p>${sectionContent.description}</p>`
        }
      `;
    }).join('\n');

    // Create a Blob with the content
    const blob = new Blob([`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            h2 { color: ${exportSettings.accentColor}; }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `], { type: 'application/msword' });

    // Save the file
    saveAs(blob, 'cv.doc');
  };

  const generatePDF = (sections: CVSection[]) => {
    const pdf = new jsPDF({
      unit: 'mm',
      format: exportSettings.paperSize
    });

    // Set font size and spacing
    pdf.setFontSize(exportSettings.fontSize);
    pdf.setLineHeightFactor(exportSettings.spacing);

    // Add content
    let yPos = 20;
    sections.forEach(section => {
      // Add section title
      pdf.setTextColor(exportSettings.accentColor.replace('#', ''));
      pdf.setFont('helvetica', 'bold');
      pdf.text(section.type.toUpperCase(), 20, yPos);
      yPos += 10;

      // Add section content
      pdf.setTextColor(0);
      pdf.setFont('helvetica', 'normal');
      
      if (section.type === 'skills') {
        const skills = section.content.skills?.join(', ') || '';
        const lines = pdf.splitTextToSize(skills, pdf.internal.pageSize.width - 40);
        lines.forEach(line => {
          pdf.text(line, 20, yPos);
          yPos += 7;
        });
      } else {
        pdf.setFont('helvetica', 'bold');
        pdf.text(section.content.title || '', 20, yPos);
        yPos += 7;
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${section.content.company} - ${section.content.location}`, 20, yPos);
        yPos += 7;
        
        pdf.text(`${section.content.startDate} - ${section.content.endDate}`, 20, yPos);
        yPos += 7;
        
        const description = section.content.description || '';
        const lines = pdf.splitTextToSize(description, pdf.internal.pageSize.width - 40);
        lines.forEach(line => {
          pdf.text(line, 20, yPos);
          yPos += 7;
        });
      }
      
      yPos += 10;
    });

    // Save the PDF
    pdf.save('cv.pdf');
  };

  const handleExport = async (format: 'pdf' | 'word') => {
    setIsExporting(true);
    
    try {
      if (format === 'word') {
        generateWordDocument(sections);
      } else {
        generatePDF(sections);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('An error occurred while exporting. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWithSettings = async () => {
    await handleExport(exportSettings.format);
    setShowExportSettings(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          ATS-Optimized CV Generator
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Generate an ATS-friendly CV optimized for your target job description.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-6">
              <TextArea
                label="Job Description"
                placeholder="Paste the job description here to analyze keywords and generate an optimized CV..."
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="mt-4">
                <Button
                  onClick={handleGenerateCV}
                  isLoading={isGenerating}
                  icon={<Sparkles className="h-4 w-4" />}
                >
                  Analyze & Generate CV
                </Button>
              </div>
            </div>

            {sections.length > 0 && (
              <div className="space-y-6">
                {sections.map((section) => (
                  <div key={section.id} className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                    </h3>
                    
                    {section.type === 'skills' ? (
                      <div className="flex flex-wrap gap-2">
                        {section.content.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Input
                          label="Title"
                          value={section.content.title}
                          onChange={() => {}}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Company/Institution"
                            value={section.content.company}
                            onChange={() => {}}
                          />
                          <Input
                            label="Location"
                            value={section.content.location}
                            onChange={() => {}}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            type="month"
                            label="Start Date"
                            value={section.content.startDate}
                            onChange={() => {}}
                          />
                          <Input
                            type="month"
                            label="End Date"
                            value={section.content.endDate}
                            onChange={() => {}}
                          />
                        </div>
                        <TextArea
                          label="Description"
                          value={section.content.description}
                          onChange={() => {}}
                          rows={4}
                        />
                      </div>
                    )}
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      icon={<Settings className="h-4 w-4" />}
                      onClick={() => setShowExportSettings(true)}
                    >
                      Export Settings
                    </Button>
                    <Button
                      variant="outline"
                      icon={<FileDown className="h-4 w-4" />}
                      onClick={() => handleExport('word')}
                      isLoading={isExporting}
                    >
                      Export as Word
                    </Button>
                    <Button
                      icon={<FileTextIcon className="h-4 w-4" />}
                      onClick={() => handleExport('pdf')}
                      isLoading={isExporting}
                    >
                      Export as PDF
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Keywords Analysis</h3>
            {keywords.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Key Skills & Requirements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    ATS Tips
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Use standard section headings</li>
                    <li>• Include relevant keywords naturally</li>
                    <li>• Avoid complex formatting</li>
                    <li>• Use common file formats (PDF, DOCX)</li>
                    <li>• Keep layout simple and clean</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">
                  Paste a job description to analyze key requirements and optimize your CV.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Export Settings Modal */}
      {showExportSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Export Settings</h3>
              <button
                onClick={() => setShowExportSettings(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`p-3 border rounded-lg flex items-center justify-center ${
                      exportSettings.format === 'pdf'
                        ? 'border-[#0A66C2] bg-blue-50 text-[#0A66C2]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setExportSettings({ ...exportSettings, format: 'pdf' })}
                  >
                    <FileTextIcon className="h-5 w-5 mr-2" />
                    PDF
                  </button>
                  <button
                    className={`p-3 border rounded-lg flex items-center justify-center ${
                      exportSettings.format === 'word'
                        ? 'border-[#0A66C2] bg-blue-50 text-[#0A66C2]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setExportSettings({ ...exportSettings, format: 'word' })}
                  >
                    <FileDown className="h-5 w-5 mr-2" />
                    Word
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Style
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] sm:text-sm"
                  value={exportSettings.template}
                  onChange={(e) => setExportSettings({
                    ...exportSettings,
                    template: e.target.value as 'modern' | 'classic' | 'minimal'
                  })}
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Size
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] sm:text-sm"
                    value={exportSettings.fontSize}
                    onChange={(e) => setExportSettings({
                      ...exportSettings,
                      fontSize: parseInt(e.target.value)
                    })}
                  >
                    <option value="10">10pt</option>
                    <option value="11">11pt</option>
                    <option value="12">12pt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Line Spacing
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] sm:text-sm"
                    value={exportSettings.spacing}
                    onChange={(e) => setExportSettings({
                      ...exportSettings,
                      spacing: parseFloat(e.target.value)
                    })}
                  >
                    <option value="1">Single</option>
                    <option value="1.15">1.15</option>
                    <option value="1.5">1.5</option>
                    <option value="2">Double</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paper Size
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] sm:text-sm"
                    value={exportSettings.paperSize}
                    onChange={(e) => setExportSettings({
                      ...exportSettings,
                      paperSize: e.target.value as 'a4' | 'letter'
                    })}
                  >
                    <option value="a4">A4</option>
                    <option value="letter">US Letter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Margins (cm)
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] sm:text-sm"
                    value={exportSettings.margins}
                    onChange={(e) => setExportSettings({
                      ...exportSettings,
                      margins: parseFloat(e.target.value)
                    })}
                  >
                    <option value="1.27">Narrow (1.27cm)</option>
                    <option value="2.54">Normal (2.54cm)</option>
                    <option value="3.81">Wide (3.81cm)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={exportSettings.accentColor}
                    onChange={(e) => setExportSettings({
                      ...exportSettings,
                      accentColor: e.target.value
                    })}
                    className="h-8 w-8 rounded border border-gray-300"
                  />
                  <span className="text-sm text-gray-500">
                    Choose accent color for headings and details
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includePhoto"
                  checked={exportSettings.includePhoto}
                  onChange={(e) => setExportSettings({
                    ...exportSettings,
                    includePhoto: e.target.checked
                  })}
                  className="h-4 w-4 text-[#0A66C2] focus:ring-[#0A66C2] border-gray-300 rounded"
                />
                <label htmlFor="includePhoto" className="ml-2 block text-sm text-gray-700">
                  Include profile photo
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowExportSettings(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExportWithSettings}
                  isLoading={isExporting}
                  icon={exportSettings.format === 'pdf' ? <FileTextIcon className="h-4 w-4" /> : <FileDown className="h-4 w-4" />}
                >
                  Export as {exportSettings.format.toUpperCase()}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVGenerator;