import React, { useState } from 'react';
import { Sparkles, Send, Save, Users, Target, Building, GraduationCap } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import TextArea from '../common/TextArea';
import Input from '../common/Input';
import { generateContent, sendLinkedInMessage } from '../../lib/api';

interface RecipientTarget {
  industry?: string;
  jobTitle?: string;
  companySize?: string;
  experience?: string;
  education?: string;
  location?: string;
}

const MessageGenerator: React.FC = () => {
  const [recipientName, setRecipientName] = useState('');
  const [recipientUrn, setRecipientUrn] = useState('');
  const [prompt, setPrompt] = useState('');
  const [messageType, setMessageType] = useState('connection');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTargeting, setShowTargeting] = useState(false);
  const [targeting, setTargeting] = useState<RecipientTarget>({
    industry: '',
    jobTitle: '',
    companySize: '',
    experience: '',
    education: '',
    location: ''
  });

  const messageTypes = [
    { id: 'connection', name: 'Connection Request', icon: <Users className="h-4 w-4" /> },
    { id: 'prospecting', name: 'Prospecting Outreach', icon: <Send className="h-4 w-4" /> },
    { id: 'followup', name: 'Follow-up Message', icon: <Save className="h-4 w-4" /> },
  ];

  const templates = {
    connection: [
      {
        id: 'c1',
        title: 'Mutual Interest',
        description: 'Connect based on shared professional interests',
        template: 'I noticed we both share an interest in [topic]. Would love to connect and possibly exchange ideas about [industry/topic].'
      },
      {
        id: 'c2',
        title: 'Event Follow-up',
        description: 'Connect after meeting at an event',
        template: 'It was great meeting you at [event name]. I enjoyed our conversation about [topic discussed]. Let us stay connected!'
      }
    ],
    prospecting: [
      {
        id: 'p1',
        title: 'Value Proposition',
        description: 'Highlight how you can help them',
        template: 'I have been following your work at [company] and noticed you might be facing challenges with [pain point]. My expertise in [your expertise] has helped similar companies improve [specific metric]. Would you be open to a brief conversation?'
      },
      {
        id: 'p2',
        title: 'Referred Introduction',
        description: 'Mention a mutual connection',
        template: '[Mutual connection] suggested I reach out as they thought my experience in [your expertise] might be relevant to your current initiatives at [prospect company]. I would love to share some insights that helped [similar company] achieve [specific result].'
      }
    ],
    followup: [
      {
        id: 'f1',
        title: 'After Meeting',
        description: 'Follow up after an initial conversation',
        template: 'Thank you for taking the time to chat yesterday. I have been thinking about your challenge with [specific issue], and I wanted to share a resource that might help: [resource/suggestion]. Let me know if you would like to discuss further.'
      },
      {
        id: 'f2',
        title: 'No Response',
        description: 'Gentle follow-up after no response',
        template: 'I wanted to circle back on my previous message about [topic/offer]. I understand you are busy, but I thought you might find value in [specific benefit]. Would you have 15 minutes for a quick call this week?'
      }
    ]
  };

  // Example lookup table mapping recipient names to their LinkedIn URNs
  const recipientUrnMap: Record<string, string> = {
    'John Doe': 'urn:li:person:john123',
    'Jane Smith': 'urn:li:person:jane456',
  };

  const currentTemplates = templates[messageType as keyof typeof templates];

  const handleGenerate = async () => {
    if (!recipientName) {
      alert('Please enter a recipient name');
      return;
    }

    setIsGenerating(true);
    try {
      const targetingContext = targeting.industry
        ? `As a professional in the ${targeting.industry} industry with ${targeting.experience} of experience, `
        : '';
      const promptText = `${targetingContext}${prompt}`;
      const text = await generateContent(promptText);
      setGeneratedMessage(text);
    } catch (err) {
      console.error(err);
      alert('Failed to generate message');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyTemplate = (template: string) => {
    setPrompt(template.replace('[recipient]', recipientName));
  };

  const handleSend = async () => {
    const token = import.meta.env.VITE_LINKEDIN_API_KEY;
    if (!token) {
      alert('LinkedIn API key not configured');
      return;
    }
    const urn = recipientUrn || recipientUrnMap[recipientName.trim()];
    if (!urn) {
      alert('Recipient URN not found. Please provide a valid URN.');
      return;
    }
    try {
      await sendLinkedInMessage(generatedMessage, urn, token);
      alert(`Message to ${recipientName} sent successfully!`);
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    }
  };

  const handleSaveTemplate = () => {
    // Mock save template functionality
    alert('Template saved successfully!');
  };

  return (
    <Card title="Generate LinkedIn Messages">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="mb-4">
          <Input
            label="Recipient Name"
            placeholder="Enter recipient's name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
          <div className="mt-2">
            <Input
              label="Recipient URN"
              placeholder="urn:li:person:123"
              value={recipientUrn}
              onChange={(e) => setRecipientUrn(e.target.value)}
            />
          </div>
        </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message Type
            </label>
            <div className="flex flex-wrap gap-2">
              {messageTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={messageType === type.id ? 'primary' : 'outline'}
                  size="sm"
                  icon={type.icon}
                  onClick={() => setMessageType(type.id)}
                >
                  {type.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              icon={<Target className="h-4 w-4" />}
              onClick={() => setShowTargeting(!showTargeting)}
              className="mb-4"
            >
              {showTargeting ? 'Hide Targeting Options' : 'Show Targeting Options'}
            </Button>

            {showTargeting && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                <Input
                  label="Industry"
                  placeholder="e.g., Technology, Finance"
                  value={targeting.industry}
                  onChange={(e) => setTargeting({ ...targeting, industry: e.target.value })}
                  icon={<Building className="h-4 w-4 text-gray-400" />}
                />
                <Input
                  label="Job Title"
                  placeholder="e.g., Marketing Manager"
                  value={targeting.jobTitle}
                  onChange={(e) => setTargeting({ ...targeting, jobTitle: e.target.value })}
                  icon={<Users className="h-4 w-4 text-gray-400" />}
                />
                <Input
                  label="Company Size"
                  placeholder="e.g., 50-200 employees"
                  value={targeting.companySize}
                  onChange={(e) => setTargeting({ ...targeting, companySize: e.target.value })}
                  icon={<Building className="h-4 w-4 text-gray-400" />}
                />
                <Input
                  label="Experience Level"
                  placeholder="e.g., 5+ years"
                  value={targeting.experience}
                  onChange={(e) => setTargeting({ ...targeting, experience: e.target.value })}
                  icon={<Users className="h-4 w-4 text-gray-400" />}
                />
                <Input
                  label="Education"
                  placeholder="e.g., MBA, Bachelor's"
                  value={targeting.education}
                  onChange={(e) => setTargeting({ ...targeting, education: e.target.value })}
                  icon={<GraduationCap className="h-4 w-4 text-gray-400" />}
                />
                <Input
                  label="Location"
                  placeholder="e.g., San Francisco, CA"
                  value={targeting.location}
                  onChange={(e) => setTargeting({ ...targeting, location: e.target.value })}
                  icon={<Target className="h-4 w-4 text-gray-400" />}
                />
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <TextArea
              label="Instructions for Message Generation"
              placeholder="Describe what you want to say to this person or choose a template from the right..."
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <Button
              onClick={handleGenerate}
              isLoading={isGenerating}
              icon={<Sparkles className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Generate Message
            </Button>
          </div>
          
          {generatedMessage && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Generated Message
              </label>
              <div className="relative">
                <TextArea
                  rows={6}
                  value={generatedMessage}
                  onChange={(e) => setGeneratedMessage(e.target.value)}
                  className="pr-12"
                />
                <div className="absolute right-3 top-3 space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    title="Regenerate content"
                    onClick={handleGenerate}
                  >
                    <Sparkles className="h-4 w-4 text-[#0A66C2]" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {generatedMessage && (
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                icon={<Send className="h-4 w-4" />}
                onClick={handleSend}
              >
                Send Message
              </Button>
              <Button
                variant="outline"
                icon={<Save className="h-4 w-4" />}
                onClick={handleSaveTemplate}
              >
                Save as Template
              </Button>
            </div>
          )}
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Message Templates</h4>
          <div className="space-y-3">
            {currentTemplates.map((template) => (
              <div
                key={template.id}
                className="p-3 bg-white border border-gray-200 rounded-md hover:border-[#0A66C2] cursor-pointer transition-colors"
                onClick={() => applyTemplate(template.template)}
              >
                <h5 className="text-sm font-medium text-gray-900">{template.title}</h5>
                <p className="text-xs text-gray-500 mt-1">{template.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Message Tips</h4>
            <ul className="text-xs text-gray-600 space-y-2">
              <li>• Personalize each message based on the recipient's profile</li>
              <li>• Keep connection requests under 300 characters</li>
              <li>• Mention specific details from their profile or content</li>
              <li>• Clearly state your purpose for reaching out</li>
              <li>• Include a specific call-to-action</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MessageGenerator;