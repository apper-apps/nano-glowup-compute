import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/molecules/Header'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    age: 28,
    skinType: 'Combination',
    skinConcerns: ['Acne', 'Dark Spots'],
    goals: ['Clear Skin', 'Anti-Aging']
  })

const [preferences, setPreferences] = useState({
    notifications: true,
    dailyReminders: true,
    weeklyReports: false,
    productUpdates: true,
    exerciseReminders: true,
    reminderTime: '09:00',
    difficulty: 'intermediate'
  })

  const [subscription, setSubscription] = useState({
    tier: 'basic',
    expiresAt: '2024-12-31',
    features: ['basic-exercises', 'progress-tracking']
  })

  const [notificationPermission, setNotificationPermission] = useState('default')

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }))
  }

const handleSaveProfile = async () => {
    try {
      // Save profile data (would be API call in real app)
      localStorage.setItem('userProfile', JSON.stringify(profileData))
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleSavePreferences = async () => {
    try {
      // Save preferences including notification settings
      localStorage.setItem('userPreferences', JSON.stringify(preferences))
      
      // Handle exercise reminders
      if (preferences.exerciseReminders && preferences.notifications) {
        await scheduleExerciseReminders()
      }
      
      toast.success('Preferences saved successfully!')
    } catch (error) {
      toast.error('Failed to save preferences')
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      
      if (permission === 'granted') {
        toast.success('Notifications enabled successfully!')
        handlePreferenceChange('notifications', true)
      } else if (permission === 'denied') {
        toast.warning('Notifications were denied. You can enable them in your browser settings.')
        handlePreferenceChange('notifications', false)
      }
    } else {
      toast.error('This browser does not support notifications')
    }
  }

  const scheduleExerciseReminders = async () => {
    if ('serviceWorker' in navigator && 'Notification' in window && Notification.permission === 'granted') {
      // Schedule daily exercise reminders
      const [hours, minutes] = preferences.reminderTime.split(':')
      const reminderTime = new Date()
      reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      
      // If time has passed today, schedule for tomorrow
      if (reminderTime < new Date()) {
        reminderTime.setDate(reminderTime.getDate() + 1)
      }
      
      localStorage.setItem('exerciseReminderTime', preferences.reminderTime)
      toast.info('Exercise reminders scheduled!')
    }
  }

  const handleSubscriptionUpgrade = (newTier) => {
    // In a real app, this would integrate with payment processing
    const tierFeatures = {
      basic: ['basic-exercises', 'progress-tracking'],
      premium: ['basic-exercises', 'progress-tracking', 'advanced-exercises', 'personalized-plans'],
      pro: ['basic-exercises', 'progress-tracking', 'advanced-exercises', 'personalized-plans', 'nutrition-plans', 'priority-support']
    }

    setSubscription(prev => ({
      ...prev,
      tier: newTier,
      features: tierFeatures[newTier],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
    }))

    localStorage.setItem('userSubscription', JSON.stringify({
      tier: newTier,
      features: tierFeatures[newTier],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))

    toast.success(`Upgraded to ${newTier.charAt(0).toUpperCase() + newTier.slice(1)} plan!`)
  }

  const getTierDisplayName = (tier) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1)
  }

  const getTierColor = (tier) => {
    switch (tier) {
      case 'basic': return 'from-gray-400 to-gray-600'
      case 'premium': return 'from-primary to-secondary'
      case 'pro': return 'from-accent to-primary'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const skinTypes = ['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal']
  const concernOptions = ['Acne', 'Dark Spots', 'Wrinkles', 'Dryness', 'Oiliness', 'Sensitivity']
  const goalOptions = ['Clear Skin', 'Anti-Aging', 'Hydration', 'Brightness', 'Even Tone']

  const stats = [
    { label: 'Days Active', value: '24', icon: 'Calendar' },
    { label: 'Exercises Done', value: '45', icon: 'Dumbbell' },
    { label: 'Products Tried', value: '8', icon: 'ShoppingBag' },
    { label: 'Wellness Score', value: '85', icon: 'TrendingUp' }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header title="Profile" subtitle="Manage your skincare journey" />
      
      <div className="px-6 py-6 space-y-6">
        {/* Profile Stats */}
        <Card>
          <h3 className="text-xl font-display font-semibold text-gray-800 mb-6">
            Your Journey
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name={stat.icon} className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-display font-bold text-gray-800">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Profile Information */}
        <Card>
          <h3 className="text-xl font-display font-semibold text-gray-800 mb-6">
            Profile Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={profileData.name}
              onChange={(e) => handleProfileUpdate('name', e.target.value)}
              icon="User"
            />
            
            <Input
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => handleProfileUpdate('email', e.target.value)}
              icon="Mail"
            />
            
            <Input
              label="Age"
              type="number"
              value={profileData.age}
              onChange={(e) => handleProfileUpdate('age', e.target.value)}
              icon="Calendar"
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skin Type
              </label>
              <select
                value={profileData.skinType}
                onChange={(e) => handleProfileUpdate('skinType', e.target.value)}
                className="block w-full rounded-2xl border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors duration-200"
              >
                {skinTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <Button onClick={handleSaveProfile} className="w-full md:w-auto">
              Save Profile
            </Button>
          </div>
        </Card>

        {/* Skin Concerns & Goals */}
        <Card>
          <h3 className="text-xl font-display font-semibold text-gray-800 mb-6">
            Skin Concerns & Goals
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Concerns
              </label>
              <div className="flex flex-wrap gap-2">
                {concernOptions.map(concern => (
                  <motion.button
                    key={concern}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const newConcerns = profileData.skinConcerns.includes(concern)
                        ? profileData.skinConcerns.filter(c => c !== concern)
                        : [...profileData.skinConcerns, concern]
                      handleProfileUpdate('skinConcerns', newConcerns)
                    }}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${profileData.skinConcerns.includes(concern)
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {concern}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Skincare Goals
              </label>
              <div className="flex flex-wrap gap-2">
                {goalOptions.map(goal => (
                  <motion.button
                    key={goal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const newGoals = profileData.goals.includes(goal)
                        ? profileData.goals.filter(g => g !== goal)
                        : [...profileData.goals, goal]
                      handleProfileUpdate('goals', newGoals)
                    }}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${profileData.goals.includes(goal)
                        ? 'bg-secondary text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {goal}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <h3 className="text-xl font-display font-semibold text-gray-800 mb-6">
            Preferences
          </h3>
          
          <div className="space-y-4">
            {Object.entries(preferences).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <ApperIcon 
                    name={key === 'notifications' ? 'Bell' : key === 'dailyReminders' ? 'Clock' : key === 'weeklyReports' ? 'BarChart' : 'Package'} 
                    className="w-5 h-5 text-gray-600" 
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {key === 'notifications' && 'Receive push notifications'}
                      {key === 'dailyReminders' && 'Daily exercise and water reminders'}
                      {key === 'weeklyReports' && 'Weekly progress reports'}
                      {key === 'productUpdates' && 'New product recommendations'}
                    </p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePreferenceChange(key, !value)}
                  className={`
                    w-12 h-6 rounded-full transition-all duration-200 relative
                    ${value ? 'bg-primary' : 'bg-gray-300'}
                  `}
                >
                  <div className={`
                    w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-200 absolute top-0.5
                    ${value ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </motion.button>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Button onClick={handleSavePreferences} className="w-full md:w-auto">
              Save Preferences
            </Button>
          </div>
</Card>

        {/* Notification Settings */}
        <Card>
          <h3 className="text-xl font-display font-semibold text-gray-800 mb-6">
            Notification Settings
          </h3>
          
          <div className="space-y-6">
            {/* Push Notification Permission */}
            {notificationPermission !== 'granted' && (
              <div className="p-4 bg-gradient-to-r from-warning/10 to-info/10 rounded-2xl border border-warning/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">Enable Push Notifications</h4>
                    <p className="text-sm text-gray-600">Get reminders for exercises and important updates</p>
                  </div>
                  <Button onClick={requestNotificationPermission} icon="Bell">
                    Enable
                  </Button>
                </div>
              </div>
            )}

            {/* Exercise Reminder Time */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Clock" className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-800">Exercise Reminder Time</h4>
                  <p className="text-sm text-gray-600">Daily reminder for your skincare exercises</p>
                </div>
              </div>
              <input
                type="time"
                value={preferences.reminderTime}
                onChange={(e) => handlePreferenceChange('reminderTime', e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Exercise Difficulty Preference */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center space-x-3">
                <ApperIcon name="TrendingUp" className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-800">Preferred Exercise Difficulty</h4>
                  <p className="text-sm text-gray-600">Set your default exercise difficulty level</p>
                </div>
              </div>
              <select
                value={preferences.difficulty}
                onChange={(e) => handlePreferenceChange('difficulty', e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Subscription Management */}
        <Card>
          <h3 className="text-xl font-display font-semibold text-gray-800 mb-6">
            Subscription Management
          </h3>
          
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Current Plan: {getTierDisplayName(subscription.tier)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Expires: {new Date(subscription.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getTierColor(subscription.tier)} text-white font-medium`}>
                  {getTierDisplayName(subscription.tier)}
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium text-gray-700">Included Features:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {subscription.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <ApperIcon name="Check" className="w-4 h-4 text-success" />
                      <span className="text-sm text-gray-600">
                        {feature.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upgrade Options */}
            {subscription.tier !== 'pro' && (
              <div className="space-y-4">
                <h5 className="font-medium text-gray-700">Upgrade Options:</h5>
                
                {subscription.tier === 'basic' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border border-primary/20 rounded-2xl cursor-pointer hover:border-primary/40 transition-colors"
                      onClick={() => handleSubscriptionUpgrade('premium')}
                    >
                      <div className="text-center">
                        <h6 className="font-semibold text-gray-800 mb-2">Premium</h6>
                        <p className="text-2xl font-bold text-primary mb-2">$9.99/mo</p>
                        <p className="text-sm text-gray-600 mb-4">Advanced exercises + personalized plans</p>
                        <Button className="w-full" size="sm">Upgrade</Button>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border border-accent/20 rounded-2xl cursor-pointer hover:border-accent/40 transition-colors"
                      onClick={() => handleSubscriptionUpgrade('pro')}
                    >
                      <div className="text-center">
                        <h6 className="font-semibold text-gray-800 mb-2">Pro</h6>
                        <p className="text-2xl font-bold text-accent mb-2">$19.99/mo</p>
                        <p className="text-sm text-gray-600 mb-4">Everything + nutrition plans</p>
                        <Button className="w-full" size="sm">Upgrade</Button>
                      </div>
                    </motion.div>
                  </div>
                )}
                
                {subscription.tier === 'premium' && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-accent/20 rounded-2xl cursor-pointer hover:border-accent/40 transition-colors"
                    onClick={() => handleSubscriptionUpgrade('pro')}
                  >
                    <div className="text-center">
                      <h6 className="font-semibold text-gray-800 mb-2">Pro</h6>
                      <p className="text-2xl font-bold text-accent mb-2">$19.99/mo</p>
                      <p className="text-sm text-gray-600 mb-4">Add nutrition plans + priority support</p>
                      <Button className="w-full">Upgrade to Pro</Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* App Settings */}
        <Card>
          <h3 className="text-xl font-display font-semibold text-gray-800 mb-6">
            App Settings
          </h3>
          
          <div className="space-y-4">
            <Button variant="secondary" className="w-full justify-start" icon="Download">
              Export Data
            </Button>
            
            <Button variant="secondary" className="w-full justify-start" icon="RefreshCw">
              Reset Progress
            </Button>
            
            <Button variant="secondary" className="w-full justify-start" icon="HelpCircle">
              Help & Support
            </Button>
            
            <Button variant="secondary" className="w-full justify-start" icon="FileText">
              Privacy Policy
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Profile