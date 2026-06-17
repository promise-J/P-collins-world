import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Button, Card, Input, Spinner } from "@/ui";
import { SettingsService } from "@/services/settings.service";
import { 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Globe, 
  Shield,
  Moon,
  Sun,
  Smartphone,
  Mail,
  MessageCircle,
  DollarSign,
  LogOut,
  Save,
  ChevronRight,
  Eye,
  EyeOff,
  Key,
  Fingerprint
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security" | "appearance">("profile");
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    currency: "NGN",
    language: "en",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    savingsAlerts: true,
    propertyAlerts: true,
    orderUpdates: true,
    groupChatNotifications: true,
  });

  const [appearance, setAppearance] = useState({
    theme: "light",
    reducedAnimations: false,
    compactView: false,
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Fetch settings
  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => SettingsService.getSettings(),
  });

  // Initialize forms with fetched data
  useEffect(() => {
    if (settingsData?.data) {
      const { user: userData, settings } = settingsData.data;
      
      setProfileForm({
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        phone: userData?.phone || "",
        currency: settings?.profile?.currency || "NGN",
        language: settings?.profile?.language || "en",
      });
      
      if (settings?.notifications) {
        setNotificationSettings(settings.notifications);
      }
      
      if (settings?.appearance) {
        setAppearance(settings.appearance);
      }
    }
  }, [settingsData]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => SettingsService.updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: (data: any) => SettingsService.updateNotifications(data),
    onSuccess: () => {
      toast.success("Notification settings updated");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: () => toast.error("Failed to update notification settings"),
  });

  const updateAppearanceMutation = useMutation({
    mutationFn: (data: any) => SettingsService.updateAppearance(data),
    onSuccess: () => {
      toast.success("Appearance settings updated");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: () => toast.error("Failed to update appearance settings"),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      SettingsService.changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => {
      toast.success("Password changed successfully");
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    updateNotificationsMutation.mutate({ [key]: value });
  };

  const handleThemeChange = (theme: string) => {
    setAppearance({ ...appearance, theme });
    updateAppearanceMutation.mutate({ theme });
    
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (securityForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: securityForm.currentPassword,
      newPassword: securityForm.newPassword,
    });
  };

  const handleReducedAnimationsChange = (checked: boolean) => {
    setAppearance({ ...appearance, reducedAnimations: checked });
    updateAppearanceMutation.mutate({ reducedAnimations: checked });
  };

  const handleCompactViewChange = (checked: boolean) => {
    setAppearance({ ...appearance, compactView: checked });
    updateAppearanceMutation.mutate({ compactView: checked });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  if (settingsLoading) {
    return (
      <Container>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account preferences and settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72">
            <Card className="sticky top-24">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] flex items-center justify-center text-white font-bold text-lg">
                    {profileForm.firstName?.[0]}{profileForm.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-brand-text)]">
                      {profileForm.firstName} {profileForm.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
              <nav className="p-2 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-[var(--color-brand-primary)] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="flex-1 text-left">{tab.label}</span>
                      <ChevronRight size={16} className={isActive ? "opacity-100" : "opacity-0"} />
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-gray-100 mt-4">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </Card>
          </div>

          {/* Main Content - Same as before but with API integration */}
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <Card>
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-[var(--color-brand-text)]">Profile Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
              </div>
              <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="First Name"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    required
                  />
                </div>
                
                <Input
                  label="Email Address"
                  type="email"
                  value={user?.email || ""}
                  disabled
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      value={profileForm.currency}
                      onChange={(e) => setProfileForm({ ...profileForm, currency: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                    >
                      <option value="NGN">Nigerian Naira (₦)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="GBP">British Pound (£)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      value={profileForm.language}
                      onChange={(e) => setProfileForm({ ...profileForm, language: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                      <option value="pt">Portuguese</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? <Spinner size="sm" /> : <><Save size={18} className="mr-2" /> Save Changes</>}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <Card>
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-[var(--color-brand-text)]">Notification Preferences</h2>
                <p className="text-sm text-gray-500 mt-1">Choose what notifications you want to receive</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700 mb-3">Channels</h3>
                  
                  <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-[var(--color-brand-primary)]" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => handleNotificationChange("emailNotifications", e.target.checked)}
                      className="w-5 h-5 text-[var(--color-brand-primary)] rounded"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Smartphone size={20} className="text-[var(--color-brand-primary)]" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => handleNotificationChange("pushNotifications", e.target.checked)}
                      className="w-5 h-5 text-[var(--color-brand-primary)] rounded"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <MessageCircle size={20} className="text-[var(--color-brand-primary)]" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-500">Get important alerts via SMS</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) => handleNotificationChange("smsNotifications", e.target.checked)}
                      className="w-5 h-5 text-[var(--color-brand-primary)] rounded"
                    />
                  </label>
                </div>
                
                <div className="space-y-3 pt-4">
                  <h3 className="font-medium text-gray-700 mb-3">Alert Types</h3>
                  
                  {Object.entries({
                    savingsAlerts: "Savings Alerts",
                    propertyAlerts: "Property Alerts", 
                    orderUpdates: "Order Updates",
                    groupChatNotifications: "Group Chat Notifications",
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-gray-500">
                          {key === "savingsAlerts" && "Updates about your savings goals and group activities"}
                          {key === "propertyAlerts" && "New property listings and price updates"}
                          {key === "orderUpdates" && "Order confirmation, shipping, and delivery updates"}
                          {key === "groupChatNotifications" && "Messages and mentions in group chats"}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings[key as keyof typeof notificationSettings] as boolean}
                        onChange={(e) => handleNotificationChange(key, e.target.checked)}
                        className="w-5 h-5 text-[var(--color-brand-primary)] rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <Card>
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-[var(--color-brand-text)]">Security Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your password and security preferences</p>
              </div>
              <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
                <div>
                  <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <Key size={18} />
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        label="Current Password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={securityForm.currentPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    
                    <div className="relative">
                      <Input
                        label="New Password"
                        type={showNewPassword ? "text" : "password"}
                        value={securityForm.newPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-[42px] text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={changePasswordMutation.isPending}>
                    {changePasswordMutation.isPending ? <Spinner size="sm" /> : "Update Password"}
                  </Button>
                </div>
              </form>
              
              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Fingerprint size={24} className="text-[var(--color-brand-primary)]" />
                    <div>
                      <h3 className="font-medium text-[var(--color-brand-text)]">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Button variant="secondary">Enable 2FA</Button>
                </div>
              </div>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <Card>
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-[var(--color-brand-text)]">Appearance</h2>
                <p className="text-sm text-gray-500 mt-1">Customize how the app looks and feels</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Theme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: "light", label: "Light", icon: Sun, color: "text-yellow-500" },
                      { id: "dark", label: "Dark", icon: Moon, color: "text-slate-700" },
                      { id: "system", label: "System", icon: Globe, color: "text-blue-500" },
                    ].map(({ id, label, icon: Icon, color }) => (
                      <button
                        key={id}
                        onClick={() => handleThemeChange(id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          appearance.theme === id
                            ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <Icon size={32} className={color} />
                        </div>
                        <p className="font-medium text-center">{label}</p>
                        <p className="text-xs text-gray-500 text-center">
                          {id === "light" && "Light mode theme"}
                          {id === "dark" && "Dark mode theme"}
                          {id === "system" && "Follow device settings"}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <p className="font-medium">Reduced Animations</p>
                      <p className="text-sm text-gray-500">Minimize motion effects throughout the app</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={appearance.reducedAnimations}
                      onChange={(e) => handleReducedAnimationsChange(e.target.checked)}
                      className="w-5 h-5 text-[var(--color-brand-primary)] rounded"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <p className="font-medium">Compact View</p>
                      <p className="text-sm text-gray-500">Show more content by reducing spacing</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={appearance.compactView}
                      onChange={(e) => handleCompactViewChange(e.target.checked)}
                      className="w-5 h-5 text-[var(--color-brand-primary)] rounded"
                    />
                  </label>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}