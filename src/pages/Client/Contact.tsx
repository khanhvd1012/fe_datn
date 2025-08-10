import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { message } from 'antd';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import { useCreateContact } from '../../hooks/useContact';
import type { IContact } from '../../interface/contact';

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IContact>({
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      address: '',
      message: ''
    }
  });

  const { mutate, isPending } = useCreateContact();

  // Tự động điền thông tin nếu đã đăng nhập
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const userName = localStorage.getItem('userName');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Lấy địa chỉ và số điện thoại mặc định nếu có
        let address = '';
        let phone = user.phone || '';
        if (Array.isArray(user.shipping_addresses)) {
          const defaultAddr = user.shipping_addresses.find((addr: any) => addr.is_default);
          address = defaultAddr ? defaultAddr.address : (user.shipping_addresses[0]?.address || '');
          phone = defaultAddr ? defaultAddr.phone : (user.shipping_addresses[0]?.phone || user.phone || '');
        } else {
          address = user.address || '';
        }
        reset({
          username: user.username || '',
          email: user.email || '',
          phone: phone,
          address: address,
          message: ''
        });
      } catch (e) {}
    } else if (userName) {
      reset({
        username: userName,
        email: '',
        phone: '',
        address: '',
        message: ''
      });
    }
  }, [reset]);

  const onSubmit = (data: IContact) => {
    mutate(data, {
      onSuccess: () => {
        message.success('Gửi liên hệ thành công!');
        reset();
      },
      onError: () => {
        message.error('Gửi liên hệ thất bại, vui lòng thử lại!');
      }
    });
  };

  return (
    <>
      <Breadcrumb current="Liên hệ" />
      <div style={{ padding: '40px', fontFamily: '"Quicksand", sans-serif', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          {/* Google Map */}
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

          {/* Form */}
          <div style={{ flex: '1 1 35%', minWidth: '300px' }}>
            <div style={{ marginBottom: '24px', fontSize: '15px', lineHeight: 1.8 }}>
              <p><strong>Địa chỉ:</strong><br />Số XX Lê Quang Đạo, Nam Từ Liêm, Hà Nội</p>
              <p><strong>Email:</strong><br />contact@datn.com</p>
              <p><strong>Điện thoại:</strong><br />+84 (024) 12345678</p>
              <p><strong>Thời gian làm việc:</strong><br />T2 - T6: 8h - 18h | T7: 9h30 - 17h</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <input
                  {...register("username", { required: "Vui lòng nhập họ tên" })}
                  type="text"
                  placeholder="Tên của bạn"
                  style={inputStyle}
                />
                {errors.username && <p style={errorStyle}>{errors.username.message}</p>}
              </div>

              <div>
                <input
                  {...register("email", {
                    required: "Vui lòng nhập email",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Email không hợp lệ"
                    }
                  })}
                  type="email"
                  placeholder="Email của bạn"
                  style={inputStyle}
                />
                {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
              </div>

              <div>
                <input
                  {...register("phone", {
                    required: "Vui lòng nhập số điện thoại",
                    pattern: {
                      value: /^(0|\+84)[0-9]{9,10}$/,
                      message: "Số điện thoại không hợp lệ"
                    }
                  })}
                  type="text"
                  placeholder="Số điện thoại của bạn"
                  style={inputStyle}
                />
                {errors.phone && <p style={errorStyle}>{errors.phone.message}</p>}
              </div>

              <div>
                <input
                  {...register("address")}
                  type="text"
                  placeholder="Địa chỉ (nếu có)"
                  style={inputStyle}
                />
              </div>

              <div>
                <textarea
                  {...register("message", { required: "Vui lòng nhập nội dung liên hệ" })}
                  placeholder="Nội dung"
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
                {errors.message && <p style={errorStyle}>{errors.message.message}</p>}
              </div>

              <button type="submit" style={buttonStyle} disabled={isPending}>
                {isPending ? 'Đang gửi...' : 'GỬI CHO CHÚNG TÔI'}
              </button>
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
  marginBottom: '8px',
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
  fontFamily: '"Quicksand", sans-serif',
  marginTop: '12px'
};

const errorStyle: React.CSSProperties = {
  color: 'red',
  fontSize: '13px',
  marginBottom: '10px',
  fontFamily: '"Quicksand", sans-serif'
};
