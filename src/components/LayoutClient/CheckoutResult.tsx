import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Result, Button, Spin } from "antd";

const CheckoutResult = () => {
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "fail">("loading");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const zpStatus = queryParams.get("status"); // ZaloPay trả về ?status=1 (thành công)

    if (zpStatus === "1") {
      setStatus("success");
    } else {
      setStatus("fail");
    }
  }, [location.search]);

  if (status === "loading") {
    return <Spin tip="Đang xử lý kết quả thanh toán..." style={{ marginTop: 50 }} />;
  }

  return (
    <div style={{ marginTop: 50 }}>
      {status === "success" ? (
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle="Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý."
          extra={[
            <Link to="/" key="home">
              <Button type="primary">Về trang chủ</Button>
            </Link>,
            <Link to="/order-history" key="orders">
              <Button>Xem đơn hàng</Button>
            </Link>,
          ]}
        />
      ) : (
        <Result
          status="error"
          title="Thanh toán thất bại hoặc đã hủy"
          subTitle="Giao dịch không thành công. Vui lòng thử lại."
          extra={[
            <Link to="/checkout" key="retry">
              <Button type="primary">Thử lại</Button>
            </Link>,
            <Link to="/" key="home">
              <Button>Về trang chủ</Button>
            </Link>,
          ]}
        />
      )}
    </div>
  );
};

export default CheckoutResult;
