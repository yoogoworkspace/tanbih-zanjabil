import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';
import { 
  Menu, 
  X, 
  Moon, 
  Calendar, 
  Search, 
  Heart, 
  Camera, 
  Settings, 
  Home,
  LogOut,
  User,
  LogIn
} from 'lucide-react';
import Icon from '../AppIcon';


const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, userProfile, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/prayer-times-scheduler', icon: Calendar, label: 'Prayer Times' },
    { path: '/halal-checker', icon: Search, label: 'Halal Checker' },
    { path: '/wellness-survey', icon: Heart, label: 'Wellness' },
    { path: '/ar-salah-guide', icon: Camera, label: 'AR Guide' },
    { path: '/profile-settings', icon: Settings, label: 'Settings' },
  ];

  const isAuthPage = ['/login', '/signup']?.includes(location?.pathname);

  if (isAuthPage) {
    return null; // Don't show header on auth pages
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <Link to="/dashboard" className="text-xl font-bold text-gray-900">
                Islamic Wellness
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems?.map((item) => {
                const Icon = item?.icon;
                const isActive = location?.pathname === item?.path;
                
                return (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-700' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item?.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* User Info - Desktop */}
              {!loading && (
                <div className="hidden md:flex items-center space-x-4">
                  {user ? (
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {userProfile?.full_name || user?.email?.split('@')?.[0] || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {userProfile?.role || 'user'}
                        </p>
                      </div>
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Link to="/login">
                        <Button variant="outline" size="sm" className="flex items-center space-x-2">
                          <LogIn className="w-4 h-4" />
                          <span>Sign In</span>
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen?.(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-1">
              {/* Mobile Navigation Items */}
              {navigationItems?.map((item) => {
                const Icon = item?.icon;
                const isActive = location?.pathname === item?.path;
                
                return (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={() => setIsMenuOpen?.(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-700' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item?.label}</span>
                  </Link>
                );
              })}

              {/* Mobile User Section */}
              {!loading && (
                <div className="pt-4 mt-4 border-t border-gray-100">
                  {user ? (
                    <div className="space-y-3">
                      <div className="px-3 py-2">
                        <p className="text-base font-medium text-gray-900">
                          {userProfile?.full_name || user?.email?.split('@')?.[0] || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {userProfile?.role || 'user'}
                        </p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="text-base font-medium">Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen?.(false)}
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        <LogIn className="w-5 h-5" />
                        <span className="text-base font-medium">Sign In</span>
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsMenuOpen?.(false)}
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        <span className="text-base font-medium">Sign Up</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      {/* Preview Mode Banner (when not authenticated) */}
      {!loading && !user && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <p className="text-sm text-blue-700 text-center">
              <span className="font-semibold">Preview Mode:</span> You're viewing the app as a guest.{' '}
              <Link to="/login" className="underline hover:no-underline font-medium">
                Sign in
              </Link>{' '}
              to access personalized features and save your data.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;