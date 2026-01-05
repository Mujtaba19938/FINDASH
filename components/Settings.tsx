import React, { useState } from 'react';
import { User as UserIcon, Shield, Bell, Globe, Camera, Save, Lock, Smartphone, Mail, AlertCircle, Check } from 'lucide-react';
import { User } from 'firebase/auth';

const TABS = [
  { id: 'general', label: 'General', icon: UserIcon, description: 'Profile & personal information' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Password & 2FA' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email & push alerts' },
  { id: 'preferences', label: 'Preferences', icon: Globe, description: 'Language & currency' },
];

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-11 h-6 rounded-full p-1 transition-colors relative focus:outline-none ${checked ? 'bg-brand-green' : 'bg-secondary'}`}
  >
    <div 
        className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} 
    />
  </button>
);

interface SettingsProps {
  user: User | null;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  // Mock States
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  // Extract user information
  const userEmail = user?.email || '';
  const displayName = user?.displayName || '';
  const emailParts = userEmail.split('@');
  const firstName = displayName ? displayName.split(' ')[0] : (emailParts[0] ? emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1) : '');
  const lastName = displayName ? displayName.split(' ').slice(1).join(' ') : '';

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-12 gap-8 min-h-[600px]">
      
      {/* Settings Sidebar */}
      <div className="col-span-12 md:col-span-3">
        <div className="bg-dark-card rounded-2xl p-4 sticky top-6 shadow-sm transition-colors">
           <div className="space-y-2">
             {TABS.map((tab) => {
               const Icon = tab.icon;
               const isActive = activeTab === tab.id;
               return (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`
                     w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left group
                     ${isActive ? 'bg-brand-green text-black shadow-lg shadow-brand-green/20' : 'text-secondary hover:bg-dark-accent/50 hover:text-primary'}
                   `}
                 >
                   <div className={`p-2 rounded-lg ${isActive ? 'bg-black/10 text-black' : 'bg-dark-accent text-secondary group-hover:text-primary'}`}>
                      <Icon size={20} />
                   </div>
                   <div>
                      <div className={`font-semibold text-sm ${isActive ? 'text-black' : 'text-primary'}`}>{tab.label}</div>
                      <div className={`text-[10px] ${isActive ? 'text-black/70' : 'text-secondary'}`}>{tab.description}</div>
                   </div>
                 </button>
               );
             })}
           </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="col-span-12 md:col-span-9">
         <div className="bg-dark-card rounded-2xl p-8 h-full relative overflow-hidden shadow-sm transition-colors">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-8 border-b border-dark-border pb-6 transition-colors">
                <div>
                   <h2 className="text-2xl font-bold text-primary mb-1 transition-colors">
                      {TABS.find(t => t.id === activeTab)?.label} Settings
                   </h2>
                   <p className="text-secondary text-sm">
                      Manage your {TABS.find(t => t.id === activeTab)?.description.toLowerCase()}
                   </p>
                </div>
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-primary text-dark-bg px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                       <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                       <span>Saving...</span>
                    </>
                  ) : (
                    <>
                       <Save size={18} />
                       <span>Save Changes</span>
                    </>
                  )}
                </button>
            </div>

            {/* General Tab */}
            {activeTab === 'general' && (
               <div className="max-w-3xl animate-in fade-in duration-300">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 mb-10">
                     <div className="relative group cursor-pointer">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-dark-accent group-hover:border-brand-green transition-colors">
                           <img src="https://picsum.photos/200/200" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Camera size={24} className="text-white" />
                        </div>
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-primary transition-colors">Profile Photo</h3>
                        <p className="text-secondary text-xs mb-3">Recommended 400x400px. JPG, PNG or GIF.</p>
                        <div className="flex gap-3">
                           <button className="text-xs font-semibold bg-dark-accent text-primary px-4 py-2 rounded-lg hover:opacity-80 transition-colors">Upload New</button>
                           <button className="text-xs font-semibold text-red-400 px-4 py-2 rounded-lg hover:bg-red-400/10 transition-colors">Remove</button>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="col-span-2 md:col-span-1">
                        <label className="block text-secondary text-xs font-medium mb-2 uppercase tracking-wide">First Name</label>
                        <input 
                           type="text" 
                           defaultValue={firstName}
                           placeholder="First Name"
                           className="w-full bg-dark-accent text-primary rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-brand-green border border-transparent transition-all placeholder-secondary/50"
                        />
                     </div>
                     <div className="col-span-2 md:col-span-1">
                        <label className="block text-secondary text-xs font-medium mb-2 uppercase tracking-wide">Last Name</label>
                        <input 
                           type="text" 
                           defaultValue={lastName}
                           placeholder="Last Name"
                           className="w-full bg-dark-accent text-primary rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-brand-green border border-transparent transition-all placeholder-secondary/50"
                        />
                     </div>
                     <div className="col-span-2">
                        <label className="block text-secondary text-xs font-medium mb-2 uppercase tracking-wide">Email Address</label>
                        <div className="relative">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                           <input 
                              type="email" 
                              defaultValue={userEmail}
                              readOnly
                              className="w-full bg-dark-accent/50 text-primary rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-1 focus:ring-brand-green border border-transparent transition-all placeholder-secondary/50 cursor-not-allowed"
                              title="Email cannot be changed"
                           />
                        </div>
                        <p className="text-secondary text-xs mt-1">This is your login email address</p>
                     </div>
                     <div className="col-span-2">
                        <label className="block text-secondary text-xs font-medium mb-2 uppercase tracking-wide">Bio</label>
                        <textarea 
                           className="w-full bg-dark-accent text-primary rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-brand-green border border-transparent transition-all placeholder-secondary/50 h-32 resize-none"
                           defaultValue="Senior Product Designer based in San Francisco. Loves coffee and coding."
                        ></textarea>
                     </div>
                  </div>
               </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
               <div className="max-w-3xl animate-in fade-in duration-300">
                  <div className="bg-dark-accent/50 border border-dark-border rounded-xl p-6 mb-8 flex items-start gap-4 transition-colors">
                     <div className="p-3 bg-brand-green/10 rounded-full text-brand-green">
                        <Shield size={24} />
                     </div>
                     <div>
                        <h4 className="text-primary font-bold mb-1 transition-colors">Secure Your Account</h4>
                        <p className="text-secondary text-sm mb-4">Two-factor authentication adds an extra layer of security to your account.</p>
                        <div className="flex items-center gap-3">
                           <Toggle checked={twoFactor} onChange={setTwoFactor} />
                           <span className="text-sm font-medium text-primary">{twoFactor ? 'Enabled' : 'Disabled'}</span>
                        </div>
                     </div>
                  </div>

                  <h3 className="text-lg font-bold text-primary mb-6 transition-colors">Change Password</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="block text-secondary text-xs font-medium mb-2 uppercase tracking-wide">Current Password</label>
                        <div className="relative">
                           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                           <input 
                              type="password" 
                              className="w-full bg-dark-accent text-primary rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-1 focus:ring-brand-green border border-transparent transition-all"
                              placeholder="••••••••••••"
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-secondary text-xs font-medium mb-2 uppercase tracking-wide">New Password</label>
                           <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                              <input 
                                 type="password" 
                                 className="w-full bg-dark-accent text-primary rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-1 focus:ring-brand-green border border-transparent transition-all"
                              />
                           </div>
                        </div>
                        <div>
                           <label className="block text-secondary text-xs font-medium mb-2 uppercase tracking-wide">Confirm New Password</label>
                           <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                              <input 
                                 type="password" 
                                 className="w-full bg-dark-accent text-primary rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-1 focus:ring-brand-green border border-transparent transition-all"
                              />
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-dark-border">
                     <h3 className="text-lg font-bold text-primary mb-4 transition-colors">Active Sessions</h3>
                     <div className="flex items-center justify-between p-4 bg-dark-accent rounded-xl mb-3 transition-colors">
                        <div className="flex items-center gap-4">
                            <Smartphone className="text-secondary" size={24} />
                            <div>
                                <div className="text-primary font-medium text-sm transition-colors">iPhone 14 Pro Max</div>
                                <div className="text-secondary text-xs">San Francisco, US • Active now</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-brand-green text-xs font-medium">
                            <div className="w-2 h-2 rounded-full bg-brand-green"></div> Current
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-dark-accent rounded-xl opacity-60 transition-colors">
                        <div className="flex items-center gap-4">
                            <Globe className="text-secondary" size={24} />
                            <div>
                                <div className="text-primary font-medium text-sm transition-colors">Chrome on MacOS</div>
                                <div className="text-secondary text-xs">San Francisco, US • 2 days ago</div>
                            </div>
                        </div>
                        <button className="text-red-400 text-xs hover:underline">Revoke</button>
                     </div>
                  </div>
               </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
               <div className="max-w-3xl animate-in fade-in duration-300">
                  <div className="space-y-6">
                     <div className="flex items-center justify-between p-4 bg-dark-accent/50 rounded-xl border border-transparent hover:border-dark-border transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                              <Mail size={20} />
                           </div>
                           <div>
                              <div className="text-primary font-bold text-sm transition-colors">Email Notifications</div>
                              <div className="text-secondary text-xs">Receive daily summaries and invoices</div>
                           </div>
                        </div>
                        <Toggle checked={emailNotifs} onChange={setEmailNotifs} />
                     </div>

                     <div className="flex items-center justify-between p-4 bg-dark-accent/50 rounded-xl border border-transparent hover:border-dark-border transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                              <Smartphone size={20} />
                           </div>
                           <div>
                              <div className="text-primary font-bold text-sm transition-colors">Push Notifications</div>
                              <div className="text-secondary text-xs">Real-time alerts for transactions</div>
                           </div>
                        </div>
                        <Toggle checked={pushNotifs} onChange={setPushNotifs} />
                     </div>

                     <div className="flex items-center justify-between p-4 bg-dark-accent/50 rounded-xl border border-transparent hover:border-dark-border transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400">
                              <AlertCircle size={20} />
                           </div>
                           <div>
                              <div className="text-primary font-bold text-sm transition-colors">Marketing & Updates</div>
                              <div className="text-secondary text-xs">News about product features</div>
                           </div>
                        </div>
                        <Toggle checked={marketing} onChange={setMarketing} />
                     </div>
                  </div>
               </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
               <div className="max-w-3xl animate-in fade-in duration-300">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2">
                         <label className="block text-secondary text-xs font-medium mb-2 uppercase tracking-wide">Language</label>
                         <select className="w-full bg-dark-accent text-primary rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-brand-green border border-transparent transition-all cursor-pointer">
                            <option>English (United States)</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                         </select>
                      </div>
                      
                      <div className="col-span-2 md:col-span-1">
                         <label className="block text-secondary text-xs font-medium mb-2 uppercase tracking-wide">Currency</label>
                         <select className="w-full bg-dark-accent text-primary rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-brand-green border border-transparent transition-all cursor-pointer">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                         </select>
                      </div>

                      <div className="col-span-2 md:col-span-1">
                         <label className="block text-secondary text-xs font-medium mb-2 uppercase tracking-wide">Timezone</label>
                         <select className="w-full bg-dark-accent text-primary rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-brand-green border border-transparent transition-all cursor-pointer">
                            <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                            <option>(GMT+00:00) London</option>
                            <option>(GMT+01:00) Paris</option>
                         </select>
                      </div>
                   </div>

                   <div className="mt-8 p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center justify-between">
                       <div>
                          <h4 className="text-red-400 font-bold text-sm">Delete Account</h4>
                          <p className="text-secondary text-xs">Permanently remove your account and all data.</p>
                       </div>
                       <button className="text-red-400 bg-red-500/10 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors">
                          Delete
                       </button>
                   </div>
               </div>
            )}

         </div>
      </div>
    </div>
  );
};

export default Settings;