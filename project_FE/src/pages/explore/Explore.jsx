import Header from '@/component/Layout/Header'
import Sidebar from '@/component/Layout/Sidebar';
import Advertisement from '@/pages/home/Advertisement';
import './Explore.css';


const Explore = () => {
  return (
    <div className="about-page">
      <Header />
      <Sidebar />

      <div className="explore-content">
        
      </div>

      <Advertisement />
    </div>
  )
}

export default Explore
