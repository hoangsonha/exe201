import { useState, useEffect, useContext } from 'react'
import { Button, Form } from 'react-bootstrap'
import { RiArrowGoBackFill } from "react-icons/ri"
import logo from '@/assets/logo3.png'
import toi from '@/assets/toi.png'
import { UserContext } from '../../App'
import { useNavigate } from 'react-router'
import './Upgrade.css'

const getPackages = () => {
  return [
    {
      id: 1,
      title: "tỏi thường",
      price: "miễn phí",
      originalPrice: null,
      period: "tháng",
      features: [
        "không có chức năng tỏi AI tóm tắt",
        "không có boost tương tác bài viết",
        "không đổi được tên & ava",
        "có quảng cáo"
      ],
      isCurrentPlan: true,
      isBuyable: false
    },
    {
      id: 2,
      title: "tỏi VIP",
      price: "25.000",
      originalPrice: "35.000",
      period: "tháng",
      features: [
        "tỏi AI giúp bạn tóm tắt review nhanh hơn",
        "các bài viết của bạn sẽ được boost tương tác",
        "bạn có thể customize nhiều thứ hơn- đổi tên & ava xịn sò",
        "không bị quảng cáo"
      ],
      isCurrentPlan: false,
      isBuyable: true
    },
    {
      id: 3,
      title: "tỏi business",
      price: "100.000",
      originalPrice: null,
      period: "tháng",
      features: [
        "tài khoản được đánh dấu doanh nghiệp - đổi ava và tên, tạo tag review chính thức",
        "có thể quảng cáo trên toireview",
        "xem analytics từ tỏi AI - xu hướng của mọi người là gì"
      ],
      isCurrentPlan: false,
      isBuyable: false
    }
  ]
}

const Upgrade = () => {
  const [showPayment, setShowPayment] = useState(false)
  const [packages, setPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("banking")
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    const packageData = getPackages()
    setPackages(packageData)
  }, [])

  const handleUpgradePackage = (packageData) => {
    setSelectedPackage(packageData)
    setShowPayment(true)
  }

  const handleBack = () => {
    setShowPayment(false)
  }

  if (showPayment) {
    return (
      <div className="upgrade-page">
        <div className="upgrade-header">
          <img src={logo} alt="Logo" className="logo-img" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
        </div>
        <Button className="back-button" onClick={handleBack}>
          <RiArrowGoBackFill />
        </Button>
        
        <div className="payment-screen">
          <div className="payment-form">
            <div className="form-group">
              <label className="form-label">tên tài khoản</label>
              <div className="form-control-readonly"></div>
            </div>
            
            <div className="form-group">
              <label className="form-label">chọn phương thức thanh toán</label>
              <div className="payment-options">
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="payment-method" 
                    checked={paymentMethod === "momo"} 
                    onChange={() => setPaymentMethod("momo")}
                  />
                  <div className="payment-option-text">
                    <div className="payment-option-label">thanh toán bằng momo</div>
                  </div>
                </label>
                <label className="payment-option">
                  <input 
                    type="radio" 
                    name="payment-method" 
                    checked={paymentMethod === "banking"} 
                    onChange={() => setPaymentMethod("banking")}
                  />
                  <div className="payment-option-text">
                    <div className="payment-option-label">chuyển khoản qua online banking</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="qr-container">
            <div className="qr-code">
              
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="upgrade-page">
      <div className="upgrade-header">
        <img src={logo} alt="Logo" className="logo-img" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
      </div>

      <div className="upgrade-packages">
        {packages.map((p) => (
          <div key={p.id} className={`package-card ${p.title === "tỏi VIP" ? 'vip-package' : ''}`}>
            {p.title === "tỏi VIP" && (
              <div className="promo-badge">
                {["hot", "deal", "launch"].map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            )}
            
            <div 
              className={`package-title ${
                p.title === "tỏi VIP" 
                  ? 'title-vip' 
                  : p.title === "tỏi business" 
                    ? 'title-business' 
                    : ''
              }`}
            >
              {p.title}
            </div>
            
            <div 
              className={`package-price ${p.title === "tỏi thường" ? 'price-normal' : ''}`}
            >
              {p.originalPrice && (
                <span style={{ fontSize: "1.5rem", textDecoration: "line-through", color: "#999", display: "block" }}>
                  từ {p.originalPrice} VND
                </span>
              )}
              {p.price}{p.price !== "miễn phí" && <span style={{ fontSize: "2rem" }}> VND</span>}
            </div>
            
            <div className="package-period">/{p.period}</div>
            
            <div className="package-features">
              {p.features.map((feature, index) => (
                <div key={index} className="package-feature">{feature}</div>
              ))}
            </div>
            
            <Button 
              className={`package-button ${p.isCurrentPlan ? 'current-package' : ''}`} 
              onClick={() => p.isBuyable && handleUpgradePackage(p)}
              disabled={!p.isBuyable || p.isCurrentPlan}
            >
              {p.title === "tỏi thường" ? "gói của bạn" : "chọn gói này"}
            </Button>
          </div>
        ))}
      </div>

      <img src={toi} alt="Logo" className="toi-img" />
    </div>
  )
}

export default Upgrade