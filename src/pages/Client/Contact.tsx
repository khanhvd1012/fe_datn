import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';

const Contact = () => {
  return (
    <>
     <Breadcrumb current="Liên hệ" />
    <div style={{ padding: '40px', fontFamily: '"Quicksand", sans-serif', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Left: Google Map */}
        <div style={{ flex: '2 1 60%', minWidth: '300px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.502205926635!2d105.76250757597112!3d21.011312480636735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454c9dfcbdd7d%3A0x7f6c5d88ed4dd272!2zTMOqIFF1YW5nIMSQ4bqgbywgTmFtIFR1IHbDoG4sIEjhu5MgTuG7mWkgQ2l0eQ!5e0!3m2!1svi!2s!4v1718700000000"
            width="100%"
            height="500"
            style={{ border: 0, borderRadius: '10px' }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* Right: Contact Info + Form */}
        <div style={{ flex: '1 1 35%', minWidth: '300px' }}>
          <div style={{ marginBottom: '24px', fontSize: '15px', lineHeight: 1.8 }}>
            <p><strong>Địa chỉ:</strong><br />Số XX Lê Quang Đạo, Nam Từ Liêm, Hà Nội</p>
            <p><strong>Email:</strong><br />contact@azworld.com</p>
            <p><strong>Điện thoại:</strong><br />+84 (024) 12345678</p>
            <p><strong>Thời gian làm việc:</strong><br />T2 - T6: 8h - 18h | T7: 9h30 - 17h</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Tên của bạn" style={inputStyle} />
            <input type="email" placeholder="Email của bạn" style={inputStyle} />
            <input type="text" placeholder="Số điện thoại của bạn" style={inputStyle} />
            <textarea placeholder="Nội dung" rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
            <button type="submit" style={buttonStyle}>GỬI CHO CHÚNG TÔI</button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  marginBottom: '14px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '15px',
  fontFamily: '"Quicksand", sans-serif'
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 20px',
  backgroundColor: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 600,
  fontSize: '15px',
  cursor: 'pointer',
  fontFamily: '"Quicksand", sans-serif'
};

export default Contact;
