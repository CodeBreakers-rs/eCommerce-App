import { Outlet } from 'react-router-dom'
import Navigation from '../common/navigation'

const MainLayout = () => (
  <>
    <Navigation />
    <main>
      <Outlet />
    </main>
  </>
)

export default MainLayout
