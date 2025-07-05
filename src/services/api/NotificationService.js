export const NotificationService = {
  // Request notification permission from user
  requestPermission: async () => {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications')
    }

    const permission = await Notification.requestPermission()
    localStorage.setItem('notificationPermission', permission)
    return permission
  },

  // Check current notification permission status
  getPermissionStatus: () => {
    if (!('Notification' in window)) {
      return 'unsupported'
    }
    return Notification.permission
  },

  // Send immediate notification
  sendNotification: (title, options = {}) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      })

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    }
    return null
  },

  // Schedule exercise reminder
  scheduleExerciseReminder: async (time, exerciseName) => {
    const [hours, minutes] = time.split(':')
    const scheduleTime = new Date()
    scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    // If time has passed today, schedule for tomorrow
    if (scheduleTime < new Date()) {
      scheduleTime.setDate(scheduleTime.getDate() + 1)
    }

    const timeUntilReminder = scheduleTime.getTime() - new Date().getTime()

    if (timeUntilReminder > 0) {
      setTimeout(() => {
        NotificationService.sendNotification(
          '🧘‍♀️ Time for your skincare exercise!',
          {
            body: exerciseName ? `Ready for ${exerciseName}?` : 'Take a few minutes for your facial routine',
            icon: '/favicon.ico',
            tag: 'exercise-reminder',
            requireInteraction: true,
            actions: [
              {
                action: 'open',
                title: 'Start Exercise'
              },
              {
                action: 'dismiss',
                title: 'Later'
              }
            ]
          }
        )
      }, timeUntilReminder)

      // Store reminder info
      const reminders = JSON.parse(localStorage.getItem('scheduledReminders') || '[]')
      reminders.push({
        id: Date.now(),
        time: time,
        exerciseName: exerciseName,
        scheduledFor: scheduleTime.toISOString(),
        type: 'exercise'
      })
      localStorage.setItem('scheduledReminders', JSON.stringify(reminders))

      return true
    }

    return false
  },

  // Schedule daily exercise reminders
  scheduleDailyReminders: (time) => {
    // Clear existing reminders
    NotificationService.clearReminders('exercise')

    // Schedule recurring daily reminder
    const scheduleDaily = () => {
      NotificationService.scheduleExerciseReminder(time, 'Daily Facial Exercise')
      
      // Schedule next day's reminder
      setTimeout(scheduleDaily, 24 * 60 * 60 * 1000) // 24 hours
    }

    scheduleDaily()
  },

  // Clear specific type of reminders
  clearReminders: (type) => {
    const reminders = JSON.parse(localStorage.getItem('scheduledReminders') || '[]')
    const filtered = reminders.filter(reminder => reminder.type !== type)
    localStorage.setItem('scheduledReminders', JSON.stringify(filtered))
  },

  // Get all scheduled reminders
  getScheduledReminders: () => {
    return JSON.parse(localStorage.getItem('scheduledReminders') || '[]')
  },

  // Send wellness motivation notification
  sendMotivationNotification: () => {
    const messages = [
      '🌟 You\'re glowing! Keep up the great work!',
      '💆‍♀️ Time to pamper yourself with a facial exercise',
      '✨ Your skin will thank you for staying consistent!',
      '🧘‍♀️ A few minutes of self-care can make a big difference',
      '💖 You deserve this moment of wellness'
    ]

    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    
    return NotificationService.sendNotification(
      'Wellness Check-in',
      {
        body: randomMessage,
        icon: '/favicon.ico',
        tag: 'motivation'
      }
    )
  },

  // Initialize notification service
  init: async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', registration)
      } catch (error) {
        console.log('Service Worker registration failed:', error)
      }
    }

    // Check for existing permission
    const permission = NotificationService.getPermissionStatus()
    if (permission === 'granted') {
      // Set up any existing scheduled reminders
      const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}')
      if (preferences.exerciseReminders && preferences.reminderTime) {
        NotificationService.scheduleDailyReminders(preferences.reminderTime)
      }
    }

    return permission
  }
}