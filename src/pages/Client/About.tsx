import React from 'react'
import Breadcrumb from '../../components/LayoutClient/Breadcrumb'
import SidebarMenu from '../../components/LayoutClient/SideBarMenu'

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
            src="https://picsum.photos/300/400"
            alt="Quảng cáo"
            style={{ width: '100%', border: '1px solid #eee', borderRadius: '8px', marginTop: '24px' }}
          />
        </div>

        {/* Nội dung */}
        <div style={{ flex: '3' }}>
          <h2 style={{ fontWeight: 600, fontSize: '20px', marginBottom: '12px' }}>Giới thiệu</h2>
          <p>
            Trang giới thiệu giúp khách hàng hiểu rõ hơn về cửa hàng của bạn. Hãy cung cấp thông tin cụ thể về việc
            kinh doanh, cửa hàng, thông tin liên hệ. Điều này sẽ giúp khách hàng cảm thấy tin tưởng khi mua hàng trên
            website.
          </p>

          <ul style={{ paddingLeft: '20px', marginTop: '16px' }}>
            <li>Bạn là ai?</li>
            <li>Giá trị kinh doanh của bạn là gì?</li>
            <li>Địa chỉ cửa hàng?</li>
            <li>Bạn đã kinh doanh ngành hàng này bao lâu?</li>
            <li>Đội ngũ của bạn gồm những ai?</li>
            <li>Thông tin liên hệ?</li>
            <li>Liên kết mạng xã hội (Facebook, Instagram...)?</li>
          </ul>

          <p style={{ marginTop: '16px' }}>
            Bạn có thể chỉnh sửa hoặc xoá bài viết này tại mục <strong>Trang nội dung</strong>.
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

export default About
