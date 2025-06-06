import React, { useState } from 'react';
import { User, Mail, Briefcase, MapPin, X, GraduationCap, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import TextArea from '../components/common/TextArea';
import { useAuthStore } from '../stores/authStore';

interface LinkedInProfile {
  fullName: string;
  headline: string;
  location: string;
  photoUrl: string;
  publicProfileUrl: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
  }>;
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [linkedInProfile] = useState<LinkedInProfile>({
    fullName: 'John Doe',
    headline: 'Senior Marketing Manager | Digital Strategy | AI & Automation',
    location: 'San Francisco Bay Area',
    photoUrl: '',
    publicProfileUrl: 'https://www.linkedin.com/in/johndoe',
    experience: [
      {
        title: 'Senior Marketing Manager',
        company: 'TechCorp Inc.',
        duration: '2020 - Present'
      },
      {
        title: 'Marketing Manager',
        company: 'Digital Solutions Ltd',
        duration: '2018 - 2020'
      }
    ],
    education: [
      {
        school: 'Stanford University',
        degree: 'Master of Business Administration',
        field: 'Marketing and Digital Transformation'
      },
      {
        school: 'University of California, Berkeley',
        degree: 'Bachelor of Arts',
        field: 'Business Administration'
      }
    ]
  });

  const [profileForm, setProfileForm] = useState({
    fullName: linkedInProfile.fullName,
    title: linkedInProfile.headline,
    location: linkedInProfile.location,
    about: 'Marketing professional specializing in digital marketing, content strategy, and social media management. Passionate about leveraging AI and automation to optimize marketing campaigns and drive engagement.'
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
  };

  const handleShare = (platform: 'linkedin' | 'twitter' | 'email') => {
    const profileUrl = linkedInProfile.publicProfileUrl;
    
    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}`);
        break;
      case 'email':
        window.location.href = `mailto:?subject=Check out my LinkedIn profile&body=${encodeURIComponent(profileUrl)}`;
        break;
    }
    
    setIsShareModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {t('profile.title')}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start space-x-4">
              {linkedInProfile.photoUrl || user?.user_metadata?.avatar_url ? (
                <img
                  src={linkedInProfile.photoUrl || user?.user_metadata?.avatar_url}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-[#0A66C2] flex items-center justify-center text-white">
                  <User className="h-12 w-12" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {linkedInProfile.fullName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {linkedInProfile.headline}
                </p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {linkedInProfile.location}
                </div>
                <div className="mt-4 flex space-x-3">
                  <Button 
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsShareModalOpen(true)}
                  >
                    Share Profile
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">About</h4>
              <p className="mt-2 text-sm text-gray-500">
                {profileForm.about}
              </p>
            </div>
          </Card>

          <Card>
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Experience
            </h4>
            <div className="mt-4 space-y-4">
              {linkedInProfile.experience.map((exp, index) => (
                <div key={index} className="flex">
                  <div className="mr-4">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">{exp.title}</h5>
                    <p className="text-sm text-gray-500">{exp.company}</p>
                    <p className="text-xs text-gray-400">{exp.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <GraduationCap className="h-4 w-4 mr-2" />
              Education
            </h4>
            <div className="mt-4 space-y-4">
              {linkedInProfile.education.map((edu, index) => (
                <div key={index} className="flex">
                  <div className="mr-4">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">{edu.school}</h5>
                    <p className="text-sm text-gray-500">{edu.degree}</p>
                    <p className="text-xs text-gray-400">{edu.field}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{linkedInProfile.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Profile Stats</h4>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-2xl font-semibold text-gray-900">152</div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-2xl font-semibold text-gray-900">1.2k</div>
                    <div className="text-sm text-gray-500">Connections</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">LinkedIn Profile</h4>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(linkedInProfile.publicProfileUrl, '_blank')}
                  >
                    View on LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                />
                <Input
                  label="Title"
                  value={profileForm.title}
                  onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                />
                <Input
                  label="Location"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                />
                <TextArea
                  label="About"
                  value={profileForm.about}
                  onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                  rows={4}
                />
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Profile Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Share Profile</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => handleShare('linkedin')}
              >
                Share on LinkedIn
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => handleShare('twitter')}
              >
                Share on Twitter
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => handleShare('email')}
              >
                Share via Email
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;