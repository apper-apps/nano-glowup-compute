import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Exercises from '@/components/pages/Exercises'
import Products from '@/components/pages/Products'
import Track from '@/components/pages/Track'
import Profile from '@/components/pages/Profile'
import ExerciseDetail from '@/components/pages/ExerciseDetail'
import ProductDetail from '@/components/pages/ProductDetail'
import Favorites from '@/components/pages/Favorites'
function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="exercises/:id" element={<ExerciseDetail />} />
<Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="track" element={<Track />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App