import { useState, useEffect, useContext } from 'react'
import { Button } from 'react-bootstrap'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { IoHome } from 'react-icons/io5'
import logo from '@/assets/logo3.png'
import toi from '@/assets/toi.png'
import { UserContext } from '../../App'
import { useNavigate } from 'react-router'
import { getUserById } from '@/serviceAPI/userService'
import { getAllSubscriptionType, checkPay } from '../../serviceAPI/subscriptionService'

import './Upgrade.css'

const BANK_ID = "970405"
const ACCOUNT_NO = "5404205492644"

const Upgrade = () => {
  const [showPayment, setShowPayment] = useState(false)
  const [checking, setChecking] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [packages, setPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [userData, setUserData] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("banking")
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const rawInfo = `UID:${userData?.userId} PKGID:${selectedPackage?.id} UN:${userData?.userName}`;
  const addInfo = encodeURIComponent(rawInfo);

  const URL_PAY = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.jpg?amount=${selectedPackage?.price}&addInfo=${addInfo}&accountName=TOIREVIEW`

  useEffect(() => {
    fetchUserInfo()
  }, [])

  console.log(packages)

  const fetchUserInfo = async () => {
    try {
      const result = await getUserById(user.id)

      const subscriptionsType = await getAllSubscriptionType()

      setPackages(subscriptionsType.data.data)
      setUserData(result.data)
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error)
    }
  }

  const handleUpgradePackage = (packageData) => {
    setSelectedPackage(packageData)
    setShowPayment(true)
    setChecking(true)
  }

  useEffect(() => {
    let intervalId

    if (checking && selectedPackage && userData) {
      intervalId = setInterval(async () => {
        try {
          const response = await checkPay({
            userId: userData.userId,
            subscriptionTypeId: selectedPackage.id,
          })

          if (response.status == "Success") {
            setPaymentSuccess(true)
            setChecking(false)
            clearInterval(intervalId)

            setTimeout(() => {
              setPaymentSuccess(false)
              window.location.reload()
            }, 5000)
          }
        } catch (err) {
          console.error("Lỗi khi kiểm tra thanh toán: ", err)
        }
      }, 3000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [checking, selectedPackage, userData])


  const handleBack = () => {
    setShowPayment(false)
  }

  if (showPayment) {
    return (
      <div className="upgrade-page">

        {paymentSuccess && (
          <div className="payment-success-toast">
            ✅ Thanh toán thành công! Đang tải lại...
          </div>
        )}

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
              <div className="form-control-readonly">@{userData?.userName}</div>
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
            <div >
              <img className="qr-code" src={URL_PAY} />
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
      <Button className="back-button" onClick={() => navigate('/')}>
        <IoHome />
      </Button>
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
              {p.price == 0 ? "free" : p.price}{p.price !== 0 && <span style={{ fontSize: "2rem" }}> VND</span>}
            </div>
            
            <div className="package-period">/{p.duration == 0 ? "30 ngày" : `${p.duration} ngày`}</div>
            
            <div className="package-features">
              {p.features.split(', ').map((feature, index) => (
                <div key={index} className="package-feature">{feature}</div>
              ))}
            </div>
            
            <Button 
              className={`package-button ${userData.subscriptionId == p.id ? 'current-package' : ''}`} 
              onClick={() => handleUpgradePackage(p)}
              disabled={userData.subscriptionId == p.id}
            >
              {userData.subscriptionId == p.id ? "gói của bạn" : "chọn gói này"}
            </Button>
          </div>
        ))}
      </div>

      <img src={toi} alt="Logo" className="toi-img" />
    </div>
  )
}

export default Upgrade