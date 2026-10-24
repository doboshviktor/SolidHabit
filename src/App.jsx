import Header from './components/Header/Header'
import Landing from './pages/Landing/Landing'
import Home from './pages/Home/Home'
import Marketplace from './pages/Marketplace/Marketplace'
import Network from './pages/Network/Network'
import Profile from './pages/Profile/Profile'
import './App.css'

function App() {
  const path = window.location.pathname

  let CurrentPage = Landing
  if (path === '/home' || path === '/dashboard') {
    CurrentPage = Home
  } else if (path === '/marketplace') {
    CurrentPage = Marketplace
  } else if (path === '/network') {
    CurrentPage = Network
  } else if (path === '/profile') {
    CurrentPage = Profile
  }

  return (
    <div className="appContainer">
      <Header />
      <main className="mainContent">
        <CurrentPage />
      </main>
    </div>
  )
}

export default App