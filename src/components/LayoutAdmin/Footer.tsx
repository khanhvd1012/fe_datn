import { Footer } from 'antd/es/layout/layout'

const Footers = () => {
  return (
    <div>
        <Footer style={{ textAlign: 'center' }}>
            SneakTrend ©{new Date().getFullYear()} Created by SneakTrend UED
        </Footer>
    </div>
  )
}

export default Footers