import { useState, useEffect } from 'react'
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  InstagramOutlined,
  StarOutlined,
  BulbOutlined,
  LikeOutlined,
  RocketOutlined,
} from '@ant-design/icons'
import Breadcrumb from '../../components/LayoutClient/Breadcrumb'
import SidebarMenu from '../../components/LayoutClient/SideBarMenu'

interface CounterProps {
  target: string
  duration: number
}

const Counter: React.FC<CounterProps> = ({ target, duration }) => {
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
                src="https://file.hstatic.net/200000174405/collection/19238246_1997064527179566_5473797071884482645_o_ff15685be80c4d21973dcb914398e04f.jpg"
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
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <h1
                  style={{
                    color: '#fff',
                    fontSize: '32px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Giới thiệu về chúng tôi
                </h1>
              </div>
            </div>

            {/* Giới thiệu về SneakerTrend */}
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                Giới thiệu về SneakerTrend
              </h2>
              <p>
                - <strong>SneakerTrend</strong> được thành lập với sứ mệnh mang đến cho cộng đồng yêu giày
                sneaker tại Việt Nam một điểm đến đáng tin cậy, nơi mỗi khách hàng đều có thể tìm thấy
                những sản phẩm chất lượng, chính hãng và hợp xu hướng nhất. Chúng tôi hiểu rằng sneaker
                không chỉ là một đôi giày, mà còn là cách để mỗi người thể hiện cá tính, phong cách
                và niềm đam mê của mình.
              </p>
              <br />
              <p>
                - Từ năm 2020, <strong>SneakerTrend</strong> bắt đầu hành trình của mình với khát vọng tạo ra
                một không gian mua sắm trực tuyến hiện đại, minh bạch và thân thiện. Trong suốt hơn 5 năm,
                chúng tôi đã không ngừng mở rộng, xây dựng hệ thống dịch vụ chuyên nghiệp và phục vụ
                hàng ngàn khách hàng trên khắp cả nước.
              </p>
              <br />
              <p>
                - Website <strong>SneakerTrend</strong> không chỉ là nơi cung cấp giày sneaker từ các thương
                hiệu nổi tiếng như Nike, Adidas, Puma hay Converse, mà còn là một cộng đồng nơi những tín đồ
                thời trang có thể kết nối, chia sẻ xu hướng và lan tỏa cảm hứng sống năng động, tích cực.
              </p>
              <br />

              <p>
                - Với đội ngũ trẻ trung, nhiệt huyết cùng cam kết đặt khách hàng làm trung tâm, chúng tôi
                tin rằng <strong>SneakerTrend</strong> sẽ không chỉ đồng hành cùng bạn trên từng bước chân,
                mà còn là người bạn truyền cảm hứng, giúp bạn tự tin khẳng định bản thân mỗi ngày.
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
                  {
                    title: 'Chất lượng',
                    desc: 'Sản phẩm đạt tiêu chuẩn cao nhất.',
                    icon: <StarOutlined style={{ fontSize: '22px', color: '#ff9800' }} />,
                  },
                  {
                    title: 'Phong cách',
                    desc: 'Luôn bắt kịp xu hướng thời trang.',
                    icon: <LikeOutlined style={{ fontSize: '22px', color: '#2196f3' }} />,
                  },
                  {
                    title: 'Tin cậy',
                    desc: 'Luôn minh bạch, đặt khách hàng lên hàng đầu.',
                    icon: <BulbOutlined style={{ fontSize: '22px', color: '#4caf50' }} />,
                  },
                  {
                    title: 'Đổi mới',
                    desc: 'Không ngừng sáng tạo, cải tiến.',
                    icon: <RocketOutlined style={{ fontSize: '22px', color: '#e91e63' }} />,
                  },
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
                    <div style={{ marginBottom: '8px' }}>{item.icon}</div>
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
                  <h3
                    style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}
                  >
                    <Counter target={stat.number} duration={2000} />
                  </h3>
                  <p style={{ fontSize: '14px', color: '#000' }}>{stat.label}</p>
                </div>
              ))}
            </section>

            {/* Liên hệ */}
            <section>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                Liên hệ
              </h2>
              <p>
                <EnvironmentOutlined /> Địa chỉ: Số XX Lê Quang Đạo, Nam Từ Liêm, Hà Nội <br />
                <PhoneOutlined /> Hotline: +84 (024) 12345678 <br />
                <MailOutlined /> Email: contact@datn.com <br />
                <FacebookOutlined />{' '}
                <a href="[link]" style={{ color: '#007BFF' }}>
                  Facebook Page
                </a>{' '}
                <br />
                <InstagramOutlined />{' '}
                <a href="[link]" style={{ color: '#007BFF' }}>
                  Instagram
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
