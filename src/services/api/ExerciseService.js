import exerciseData from "@/services/mockData/exercises.json";

export const ExerciseService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...exerciseData]
  },
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const exercise = exerciseData.find(item => item.Id === id)
    if (!exercise) {
      throw new Error('Exercise not found')
    }
    return { ...exercise }
  },

  create: async (exercise) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newId = Math.max(...exerciseData.map(item => item.Id)) + 1
    const newExercise = { ...exercise, Id: newId }
    exerciseData.push(newExercise)
    return { ...newExercise }
  },

  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = exerciseData.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Exercise not found')
    }
    exerciseData[index] = { ...exerciseData[index], ...data }
    return { ...exerciseData[index] }
  },

delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    const index = exerciseData.findIndex(item => item.Id === id)
    if (index === -1) {
      throw new Error('Exercise not found')
    }
    const deleted = exerciseData.splice(index, 1)[0]
    return { ...deleted }
  },

  getDifficultySettings: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const settings = JSON.parse(localStorage.getItem('userPreferences') || '{}')
    return {
      preferredDifficulty: settings.difficulty || 'intermediate',
      availableDifficulties: ['beginner', 'intermediate', 'advanced']
    }
  },

  updateDifficultySettings: async (difficulty) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const settings = JSON.parse(localStorage.getItem('userPreferences') || '{}')
    settings.difficulty = difficulty
    localStorage.setItem('userPreferences', JSON.stringify(settings))
    return { difficulty }
  },

  getByDifficulty: async (difficulty) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    const difficultyMap = {
      'beginner': 'easy',
      'intermediate': 'medium', 
      'advanced': 'hard'
    }
    const mappedDifficulty = difficultyMap[difficulty.toLowerCase()] || difficulty.toLowerCase()
    const filtered = exerciseData.filter(exercise => 
      exercise.difficulty?.toLowerCase() === mappedDifficulty
    )
    return [...filtered]
  }
}