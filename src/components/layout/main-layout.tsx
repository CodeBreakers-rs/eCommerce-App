import { Outlet } from 'react-router-dom'
import Header from '../common/navigation/header'

const MainLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
)

export default MainLayout
