// Footer.tsx
import React from 'react';
import {
  FooterWrapper,
  FooterGrid,
  FooterSection,
  FooterBottom
} from './style';

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterGrid>
        <FooterSection>
          <h4>GIỚI THIỆU</h4>
          <p>
            SneakerTrend trang mua sắm trực tuyến của thương hiệu giày nam, nữ, phụ kiện, giúp bạn tiếp cận xu hướng thời trang mới nhất.
          </p>
          <img src="https://webmedia.com.vn/images/2021/09/logo-da-thong-bao-bo-cong-thuong-mau-xanh.png"  alt="Bộ Công Thương" width="120" />
          <div style={{ marginTop: '8px', display: 'flex', gap: '12px' }}>
            <i className="fa fa-facebook" />
            <i className="fa fa-google" />
            <i className="fa fa-twitter" />
            <i className="fa fa-youtube" />
            <i className="fa fa-skype" />
          </div>
        </FooterSection>

        <FooterSection>
          <h4>PHÁP LÝ & CÂU HỎI</h4>
          <ul>
            <li>- Tìm kiếm</li>
            <li>- Giới thiệu</li>
            <li>- Chính sách đổi trả</li>
            <li>- Chính sách bảo mật</li>
            <li>- Điều khoản dịch vụ</li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h4>THÔNG TIN LIÊN HỆ</h4>
          <ul>
            <li>Địa chỉ: 113-115 Xuân Phương, ,Nam Từ Liêm, TP.HN</li>
            <li>Điện thoại: +84 (038) 386254710</li>
            <li>Fax: +84 (028) 38800659</li>
            <li>Mail: contact@hn381.com</li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h4>FANPAGE</h4>
          <p><i><b>SneakerTrend</b></i></p>
        </FooterSection>
      </FooterGrid>

      <FooterBottom>
        Copyright © 2019 <b>Runner Inn</b>. Powered by <b>SneakerTrend</b>
      </FooterBottom>
    </FooterWrapper>
  );
};

export default Footer;
