import Header from '@/component/Layout/Header'
import ezgoGif from '@/assets/gif/ezgo.gif'
import logo3 from '@/assets/logo3.png'
import { FaStar } from 'react-icons/fa'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { useEffect, useRef } from 'react'
import './AboutUs.css'

import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const blueSection = useRef(null);
  const overviewSection = useRef(null);
  const firstMissionContainer = useRef(null);
  const secondMissionContainer = useRef(null);
  const greenSection = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = [
      blueSection.current,
      overviewSection.current,
      firstMissionContainer.current,
      secondMissionContainer.current,
      greenSection.current
    ];

    elements.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      elements.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="about-page">
      <Header />
      <div className="about-content">
        <div className="gif-container">
          <img src={ezgoGif} alt="EZ Go" className="ezgo-gif" />
        </div>
        
        <button className="about-back-button" onClick={() => navigate(-1)}>
          <RiArrowGoBackFill />
        </button>

        <div ref={blueSection} className="blue-section fade-up">
          <div className="orange-label">dễ dàng, nhanh gọn, easy+go</div>
          <p className="blue-text">
            chữ "z" trong tên thể hiện start-up bao gồm những người trẻ gen z, hướng
            tới chủ yếu những người trẻ gen z. nhiệm vụ của start-up là biến những
            quá trình mất thời gian, công sức thành các quá trình đơn giản hơn, tiết
            kiệm thời gian, tiện lợi.
          </p>
        </div>

        <div ref={overviewSection} className="overview-section fade-up">
          <div className="orange-tagline">trang web đánh giá ẩn danh.</div>
          <img src={logo3} alt="Toi Review" className="toireview-logo" />
          
          <div ref={firstMissionContainer} className="mission-container fade-up">
            <div className="mission-box blue">
              <div className="mission-label orange">sứ mệnh</div>
              <p className="mission-text white">
                giúp người dùng cải thiện việc
                tìm kiếm đánh giá một cách hiệu
                quả và dễ dàng hơn.
              </p>
            </div>
            
            <div className="mission-box white">
              <div className="mission-label blue">tầm nhìn</div>
              <p className="mission-text blue">
                phát triển một trang web phù hợp
                với nhiều đối tượng người dùng.
              </p>
              <div className="curved-text">say it true, just for you</div>
            </div>
          </div>
          
          <div ref={secondMissionContainer} className="mission-container second-row fade-up" style={{ marginTop: '4rem' }}>
            <div className="mission-box orange">
              <div className="mission-label blue">tầm nhìn</div>
              <div className="mission-text-center">
                <p className="mission-text white">
                  đạt 50.000 lượt truy cập website.
                  xây dựng độ uy tín của trang web.
                </p>
              </div>
              <div className="star-icon">
                <FaStar />
              </div>
            </div>
            
            <div className="mission-box green">
              <div className="mission-label orange">giá trị</div>
              <p className="mission-text blue">
                cung cấp thông tin với <span className="blue-word">sự minh
                bạch</span> và <span className="blue-word">đáng tin cậy</span>.
                <br />
                <span className="blue-word">ưu tiên</span> trải nghiệm của khách
                hàng và <span className="blue-word">nhấn mạnh</span> giá trị mà
                toireview có thể mang lại cho họ.
                <br />
                hỗ trợ <span className="blue-word">các doanh nghiệp nhỏ</span> tiếp
                cận khách hàng tiềm năng
              </p>
            </div>
          </div>
        </div>
        
        <div ref={greenSection} className="green-section fade-up">
          <div className="orange-label">một sự thật thú vị, nếu bạn thấy thú vị</div>
          <div className="green-content">
            <div className="left-text">
              vì sao nhân vật chính của website lại là <span className="blue-word">tỏi</span>? vì bạn
              là người chơi hệ gõ <span className="blue-word">telex</span>.
            </div>
            <div className="input-container">
              <input type="text" className="right-input" placeholder="bạn có thể gõ thử" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
