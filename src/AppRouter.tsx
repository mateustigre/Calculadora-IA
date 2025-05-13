import { Routes, Route } from 'react-router-dom'
import App from './App'
import Result from './Result'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  )
}
