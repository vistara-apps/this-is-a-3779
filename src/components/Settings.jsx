import React, { useState } from 'react'
import { Instagram, Check, CreditCard, User, Bell, Shield, HelpCircle } from 'lucide-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account')

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'social', label: 'Social Accounts', icon: Instagram },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ]

  const socialAccounts = [
    { platform: 'Instagram', connected: true, username: '@yourstore' },
    { platform: 'TikTok', connected: false, username: null },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
          <p className="text-dark-muted">Manage your account and application preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-dark-muted hover:bg-dark-border hover:text-dark-text'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-dark-surface rounded-lg p-6 sm:p-8 border border-dark-border">
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Account Information</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                      <input
                        type="text"
                        placeholder="Your company name"
                        className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <button className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Connected Social Accounts</h2>
                  <div className="space-y-4">
                    {socialAccounts.map((account) => (
                      <div key={account.platform} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Instagram className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium">{account.platform}</h3>
                            {account.connected ? (
                              <p className="text-sm text-dark-muted">{account.username}</p>
                            ) : (
                              <p className="text-sm text-dark-muted">Not connected</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {account.connected && (
                            <div className="flex items-center text-green-400 text-sm">
                              <Check className="w-4 h-4 mr-1" />
                              Connected
                            </div>
                          )}
                          <button className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                            account.connected
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-primary hover:bg-blue-600 text-white'
                          }`}>
                            {account.connected ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Billing & Subscription</h2>
                  <div className="space-y-6">
                    <div className="bg-dark-bg rounded-lg p-6 border border-dark-border">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">Pro Plan</h3>
                          <p className="text-dark-muted">$49/month • Renews on Jan 15, 2024</p>
                        </div>
                        <span className="bg-green-500 bg-opacity-20 text-green-400 px-3 py-1 rounded-full text-sm">
                          Active
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-dark-muted">Ad Generations</p>
                          <p className="font-medium">142/200 used</p>
                        </div>
                        <div>
                          <p className="text-sm text-dark-muted">Connected Accounts</p>
                          <p className="font-medium">2/5 used</p>
                        </div>
                        <div>
                          <p className="text-sm text-dark-muted">Analytics</p>
                          <p className="font-medium">Advanced</p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Upgrade Plan
                        </button>
                        <button className="border border-dark-border hover:bg-dark-border text-dark-text px-4 py-2 rounded-lg text-sm transition-colors">
                          Cancel Subscription
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { title: 'Email Notifications', description: 'Receive email updates about your campaigns' },
                      { title: 'Performance Alerts', description: 'Get notified when ads perform exceptionally well or poorly' },
                      { title: 'Weekly Reports', description: 'Receive weekly performance summaries' },
                      { title: 'Billing Notifications', description: 'Get notified about billing and subscription changes' },
                    ].map((item) => (
                      <div key={item.title} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-dark-muted">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-dark-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Privacy & Security</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Data Usage</h3>
                      <div className="space-y-3">
                        {[
                          { title: 'Allow data collection for improving AI models', checked: true },
                          { title: 'Share anonymized usage statistics', checked: false },
                          { title: 'Enable personalized recommendations', checked: true },
                        ].map((item) => (
                          <div key={item.title} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              defaultChecked={item.checked}
                              className="w-4 h-4 text-primary bg-dark-bg border-dark-border rounded focus:ring-primary"
                            />
                            <span className="text-sm">{item.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-4">Account Security</h3>
                      <div className="space-y-3">
                        <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Change Password
                        </button>
                        <button className="border border-dark-border hover:bg-dark-border text-dark-text px-4 py-2 rounded-lg text-sm transition-colors ml-3">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Help & Support</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: 'Documentation', description: 'Learn how to use AdSpark AI effectively' },
                        { title: 'Video Tutorials', description: 'Watch step-by-step guides' },
                        { title: 'Community Forum', description: 'Connect with other users' },
                        { title: 'Contact Support', description: 'Get help from our team' },
                      ].map((item) => (
                        <div key={item.title} className="bg-dark-bg rounded-lg p-4 border border-dark-border hover:border-primary transition-colors cursor-pointer">
                          <h3 className="font-medium mb-2">{item.title}</h3>
                          <p className="text-sm text-dark-muted">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings