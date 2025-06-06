import React, { useState } from 'react';
import { Key, RefreshCw, Check, X } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const ApiSettings: React.FC = () => {
  const [linkedinApiKey, setLinkedinApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [isLinkedinConnected, setIsLinkedinConnected] = useState(false);
  const [isOpenaiConnected, setIsOpenaiConnected] = useState(false);
  const [isTestingLinkedin, setIsTestingLinkedin] = useState(false);
  const [isTestingOpenai, setIsTestingOpenai] = useState(false);

  const handleTestLinkedin = () => {
    if (!linkedinApiKey) {
      alert('Please enter a LinkedIn API key');
      return;
    }
    
    setIsTestingLinkedin(true);
    
    // Mock API connection test
    setTimeout(() => {
      setIsLinkedinConnected(true);
      setIsTestingLinkedin(false);
    }, 1500);
  };

  const handleTestOpenai = () => {
    if (!openaiApiKey) {
      alert('Please enter an OpenAI API key');
      return;
    }
    
    setIsTestingOpenai(true);
    
    // Mock API connection test
    setTimeout(() => {
      setIsOpenaiConnected(true);
      setIsTestingOpenai(false);
    }, 1500);
  };

  const handleDisconnectLinkedin = () => {
    setIsLinkedinConnected(false);
    setLinkedinApiKey('');
  };

  const handleDisconnectOpenai = () => {
    setIsOpenaiConnected(false);
    setOpenaiApiKey('');
  };

  return (
    <Card title="API Connections">
      <div className="space-y-6">
        <div className="pb-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">LinkedIn API</h3>
              <p className="text-sm text-gray-500 mt-1">
                Connect to LinkedIn API to publish posts and send messages.
              </p>
            </div>
            {isLinkedinConnected && (
              <div className="flex items-center text-sm text-green-600">
                <Check className="h-4 w-4 mr-1" />
                Connected
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <Input
              label="LinkedIn API Key"
              placeholder="Enter your LinkedIn API key"
              type="password"
              value={linkedinApiKey}
              onChange={(e) => setLinkedinApiKey(e.target.value)}
              icon={<Key className="h-4 w-4 text-gray-400" />}
              disabled={isLinkedinConnected}
            />
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4">
            {isLinkedinConnected ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<X className="h-4 w-4" />}
                  onClick={handleDisconnectLinkedin}
                >
                  Disconnect
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<RefreshCw className="h-4 w-4" />}
                >
                  Reconnect
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                isLoading={isTestingLinkedin}
                onClick={handleTestLinkedin}
              >
                Connect LinkedIn API
              </Button>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">OpenAI API</h3>
              <p className="text-sm text-gray-500 mt-1">
                Connect to OpenAI API to generate content with GPT.
              </p>
            </div>
            {isOpenaiConnected && (
              <div className="flex items-center text-sm text-green-600">
                <Check className="h-4 w-4 mr-1" />
                Connected
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <Input
              label="OpenAI API Key"
              placeholder="Enter your OpenAI API key"
              type="password"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              icon={<Key className="h-4 w-4 text-gray-400" />}
              disabled={isOpenaiConnected}
            />
          </div>
          
          <div className="mt-4 flex flex-wrap gap-4">
            {isOpenaiConnected ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<X className="h-4 w-4" />}
                  onClick={handleDisconnectOpenai}
                >
                  Disconnect
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<RefreshCw className="h-4 w-4" />}
                >
                  Reconnect
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                isLoading={isTestingOpenai}
                onClick={handleTestOpenai}
              >
                Connect OpenAI API
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ApiSettings;