import React, { useState, useEffect } from 'react'
import Breadcrumb from '../../components/LayoutClient/Breadcrumb'
import SidebarMenu from '../../components/LayoutClient/SideBarMenu'

const Counter = ({ target, duration }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(target.replace(/\D/g, '')) // Lấy số từ string
    const increment = end / (duration / 16) // Mỗi frame ~ 16ms
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.ceil(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])

  return (
    <span>
      {count.toLocaleString()} {target.includes('+') && '+'}
    </span>
  )
}

const About = () => {
  return (
    <>
      <Breadcrumb current="Giới thiệu" />
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '24px',
          fontFamily: 'Quicksand, sans-serif',
          fontSize: '15px',
          color: '#444',
          lineHeight: '1.6',
        }}
      >
        <div style={{ display: 'flex', gap: '32px', marginTop: '20px' }}>
          {/* Sidebar */}
          <div style={{ flex: '1' }}>
            <SidebarMenu />
            <img
              src="https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f0c05bf3-780c-4547-93ea-b444109877ec/NIKE+GATO+LV8.png"
              alt="Quảng cáo"
              style={{
                width: '100%',
                border: '1px solid #eee',
                borderRadius: '8px',
                marginTop: '24px',
              }}
            />
          </div>

          {/* Nội dung chính */}
          <div style={{ flex: '3' }}>
            {/* Hero Banner */}
            <div
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '32px',
              }}
            >
              <img
                src="https://static.nike.com/a/images/f_auto,cs_srgb/w_1536,c_limit/5e2817c7-b316-49c3-a36c-0d7c62a5b88c/nike-just-do-it.jpg"
                alt="Giới thiệu"
                style={{ width: '100%', height: '280px', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <h1
                  style={{
                    color: '#fff',
                    fontSize: '28px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Giới thiệu về chúng tôi
                </h1>
              </div>
            </div>

            {/* Câu chuyện */}
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                Câu chuyện của chúng tôi
              </h2>
              <p>
                Chào mừng bạn đến với <strong>SNEAKERTREND</strong> – nơi mang đến những sản phẩm chất lượng,
                phong cách hiện đại và dịch vụ tận tâm. Được thành lập từ năm 2020, chúng tôi không ngừng đổi
                mới để mang đến trải nghiệm mua sắm tuyệt vời nhất.
                <p>Hơn 5 năm phát triển, <strong>SNEAKERTREND</strong> luôn mang đến những mẫu giày chất lượng tốt nhất với giá cả hợp lí nhất đến tay người tiêu dùng với hệ thống cửa hàng Số 1 Hà Nội và bán online khắp Việt Nam.</p>
              </p>
            </section>

            {/* Giá trị cốt lõi */}
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                Giá trị cốt lõi
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                {[
                  { title: 'Chất lượng', desc: 'Sản phẩm đạt tiêu chuẩn cao nhất.' },
                  { title: 'Phong cách', desc: 'Luôn bắt kịp xu hướng thời trang.' },
                  { title: 'Tin cậy', desc: 'Luôn minh bạch, đặt khách hàng lên hàng đầu.' },
                  { title: 'Đổi mới', desc: 'Không ngừng sáng tạo, cải tiến.' },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#f9f9f9',
                      padding: '16px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                  >
                    <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>{item.title}</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Thống kê */}
            <section
              style={{
                marginBottom: '32px',
                background: '#fff',
                color: '#000',
                borderRadius: '12px',
                padding: '32px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
                textAlign: 'center',
              }}
            >
              {[
                { number: '10000+', label: 'Sản phẩm đã bán' },
                { number: '5000+', label: 'Khách hàng hài lòng' },
                { number: '5', label: 'Năm kinh nghiệm' },
              ].map((stat, index) => (
                <div key={index}>
                  <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                    <Counter target={stat.number} duration={2000} />
                  </h3>
                  <p style={{ fontSize: '14px', color: '#000' }}>{stat.label}</p>
                </div>
              ))}
            </section>

            {/* Liên hệ */}
            <section>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>Liên hệ</h2>
              <p>
                📍 Địa chỉ: Số XX Lê Quang Đạo, Nam Từ Liêm, Hà Nội <br />
                📞 Hotline: +84 (024) 12345678 <br />
                📧 Email: contact@datn.com <br />
                🌐 Facebook: <a href="[link]" style={{ color: '#007BFF' }}>Facebook Page</a> <br />
                📸 Instagram: <a href="[link]" style={{ color: '#007BFF' }}>Instagram</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
