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
    productUpdates: true
  })

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

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!')
  }

  const handleSavePreferences = () => {
    toast.success('Preferences saved successfully!')
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