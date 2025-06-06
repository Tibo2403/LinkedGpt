import React, { useState } from 'react';
import {
  Linkedin, Menu, X, User, Settings, LogOut, MessageSquare, 
  Inbox, FileText, Calendar as CalendarIcon, LayoutDashboard, FileEdit, History 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const { t } = useTranslation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Linkedin className="h-8 w-8 text-[#0A66C2]" />
              <span className="ml-2 text-xl font-bold text-gray-900">LinkedGPT</span>
            </div>
            
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/" className="border-[#0A66C2] text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {t('dashboard.title')}
                </Link>
                <Link to="/posts" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <FileEdit className="h-4 w-4 mr-2" />
                  {t('posts.title')}
                </Link>
                <Link to="/messages" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Messages
                </Link>
                <Link to="/received-messages" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <Inbox className="h-4 w-4 mr-2" />
                  Inbox
                </Link>
                <Link to="/history" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <History className="h-4 w-4 mr-2" />
                  {t('history.title')}
                </Link>
                <Link to="/cv-generator" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <FileText className="h-4 w-4 mr-2" />
                  CV Generator
                </Link>
                <Link to="/calendar" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Calendar
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {user ? (
              <div className="hidden sm:flex sm:items-center sm:ml-6">
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={toggleProfileMenu}
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2]"
                      id="user-menu-button"
                      aria-expanded={isProfileMenuOpen}
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      {user.user_metadata?.avatar_url ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.user_metadata.avatar_url}
                          alt={user.user_metadata?.full_name || 'User avatar'}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-[#0A66C2] flex items-center justify-center text-white">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </button>
                  </div>
                  
                  {isProfileMenuOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex={-1}
                    >
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                        {user.user_metadata?.full_name || user.email}
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <User className="mr-2 h-4 w-4" /> {t('profile.title')}
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <Settings className="mr-2 h-4 w-4" /> {t('settings.title')}
                      </Link>
                      <button
                        onClick={signOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> {t('auth.signOut')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex sm:items-center sm:space-x-4">
                <Button variant="outline" size="sm">{t('auth.login')}</Button>
                <Button size="sm">{t('auth.signup')}</Button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0A66C2]"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          {user ? (
            <>
              <div className="pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="bg-[#0A66C2] bg-opacity-10 border-l-4 border-[#0A66C2] text-[#0A66C2] block pl-3 pr-4 py-2 text-base font-medium flex items-center"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {t('dashboard.title')}
                </Link>
                <Link
                  to="/posts"
                  className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center"
                >
                  <FileEdit className="h-4 w-4 mr-2" />
                  {t('posts.title')}
                </Link>
                <Link
                  to="/messages"
                  className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Messages
                </Link>
                <Link
                  to="/received-messages"
                  className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center"
                >
                  <Inbox className="h-4 w-4 mr-2" />
                  Inbox
                </Link>
                <Link
                  to="/history"
                  className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center"
                >
                  <History className="h-4 w-4 mr-2" />
                  {t('history.title')}
                </Link>
                <Link
                  to="/cv-generator"
                  className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  CV Generator
                </Link>
                <Link
                  to="/calendar"
                  className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Calendar
                </Link>
              </div>
              
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata?.full_name || 'User avatar'}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white">
                        <User className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.user_metadata?.full_name || 'User'}
                    </div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    {t('profile.title')}
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    {t('settings.title')}
                  </Link>
                  <button
                    onClick={signOut}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    {t('auth.signOut')}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4 px-4">
                <Button variant="outline" className="w-full">{t('auth.login')}</Button>
                <Button className="w-full">{t('auth.signup')}</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

