import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { ProfileService } from '@/services/profile.service';
import { Button, Card, Input, TextArea, Spinner } from '@/ui';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Building2, 
  Banknote,
  Bell,
  Shield,
  Camera,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, setUser, profile, setProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'bank' | 'preferences' | 'security'>('personal');
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
    country: profile?.country || 'Nigeria',
    bio: profile?.bio || '',
    occupation: profile?.occupation || '',
  });
  
  const [bankDetails, setBankDetails] = useState({
    bankName: profile?.bankDetails?.bankName || '',
    accountNumber: profile?.bankDetails?.accountNumber || '',
    accountName: profile?.bankDetails?.accountName || '',
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: profile?.preferences?.emailNotifications ?? true,
    smsNotifications: profile?.preferences?.smsNotifications ?? false,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.checked });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    setIsLoading(true);
    try {
      const response = await ProfileService.updateAvatar(avatarFile);
      if(user){
        if (response.success) {
          const { _id, ...userWithoutId } = user;
  
          setUser({ ...userWithoutId, avatar: response.data.url, _id: _id! });
          toast.success('Profile picture updated!');
        }
      }
    } catch (error) {
      toast.error('Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const response = await ProfileService.updateProfile(formData);
      if (response.success) {
        if(user){
          const { _id, ...userWithoutId } = user;
          setUser({ ...userWithoutId, ...formData, _id: _id! });
          toast.success('Profile updated successfully!');
          setIsEditing(false);
        }
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBankDetails = async () => {
    setIsLoading(true);
    try {
      const response = await ProfileService.updateBankDetails(bankDetails);
      if(profile){
        if (response.success) {
          const {_id, userId, ...profileWithoutId} = profile
          setProfile({ ...profileWithoutId, bankDetails, _id: _id, userId });
          toast.success('Bank details updated!');
        }
      }
    } catch (error) {
      toast.error('Failed to update bank details');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await ProfileService.updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      if (response.success) {
        toast.success('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'bank', label: 'Bank Details', icon: Banknote },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">Profile Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account information and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-80">
          <Card className="sticky top-24">
            {/* Avatar Section */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] flex items-center justify-center">
                      <span className="text-4xl text-white">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <Camera size={16} className="text-[var(--color-brand-primary)]" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              {avatarFile && (
                <button
                  onClick={uploadAvatar}
                  disabled={isLoading}
                  className="mt-2 text-sm text-[var(--color-brand-primary)] hover:underline"
                >
                  Save photo
                </button>
              )}
              <h2 className="mt-4 font-semibold text-[var(--color-brand-text)]">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-1 capitalize">{user?.role}</p>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                      ${activeTab === tab.id 
                        ? 'bg-[var(--color-brand-primary)] text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[var(--color-brand-text)]">Personal Information</h2>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="secondary">
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={() => setIsEditing(false)} variant="ghost">
                        <X size={16} className="mr-1" />
                      </Button>
                      <Button onClick={updateProfile} disabled={isLoading}>
                        {isLoading ? <Spinner size="sm" /> : <><Save size={16} className="mr-1" />  </>}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      icon={<User size={18} />}
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      icon={<User size={18} />}
                    />
                  </div>

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={true}
                    icon={<Mail size={18} />}
                  />

                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    icon={<Phone size={18} />}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      icon={<MapPin size={18} />}
                    />
                    <Input
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <Input
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    icon={<Building2 size={18} />}
                  />

                  <Input
                    label="Occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    icon={<Briefcase size={18} />}
                  />

                  <TextArea
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Tell us a little about yourself..."
                    rows={3}
                  />
                </div>
              </Card>
            </motion.div>
          )}

          {/* Bank Details Tab */}
          {activeTab === 'bank' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[var(--color-brand-text)]">Bank Details</h2>
                  <Button onClick={updateBankDetails} disabled={isLoading}>
                    {isLoading ? <Spinner size="sm" /> : 'Save Bank Details'}
                  </Button>
                </div>

                <div className="space-y-5">
                  <Input
                    label="Bank Name"
                    name="bankName"
                    value={bankDetails.bankName}
                    onChange={handleBankChange}
                    placeholder="e.g., First Bank, GTBank, etc."
                  />
                  <Input
                    label="Account Number"
                    name="accountNumber"
                    type="number"
                    value={bankDetails.accountNumber}
                    onChange={handleBankChange}
                    placeholder="10-digit account number"
                  />
                  <Input
                    label="Account Name"
                    name="accountName"
                    value={bankDetails.accountName}
                    onChange={handleBankChange}
                    placeholder="Account holder's full name"
                  />
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    ⚠️ Your bank details are used for withdrawals from your wallet. Please ensure they are accurate.
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-6">Notification Preferences</h2>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-[var(--color-brand-primary)]" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates about orders, savings, and properties</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={preferences.emailNotifications}
                      onChange={handlePreferenceChange}
                      className="w-5 h-5 text-[var(--color-brand-primary)] rounded focus:ring-[var(--color-brand-primary)]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Phone size={20} className="text-[var(--color-brand-primary)]" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Get important alerts via SMS</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      name="smsNotifications"
                      checked={preferences.smsNotifications}
                      onChange={handlePreferenceChange}
                      className="w-5 h-5 text-[var(--color-brand-primary)] rounded focus:ring-[var(--color-brand-primary)]"
                    />
                  </label>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-6">Change Password</h2>

                <div className="space-y-5">
                  <Input
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                  />
                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />
                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                  />
                </div>

                <div className="mt-6">
                  <Button onClick={updatePassword} disabled={isLoading} className="w-full md:w-auto">
                    {isLoading ? <Spinner size="sm" /> : 'Update Password'}
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    🔒 Password requirements: Minimum 8 characters, containing uppercase, lowercase, and numbers.
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}