import { theme } from 'antd';
import { Header } from 'antd/es/layout/layout'
import React from 'react'

const Headers = () => {
    const {token: { colorBgContainer }} = theme.useToken();
    return (
        <div>
            <Header style={{ padding: 0, background: colorBgContainer }} />
        </div>
    )
}

export default Headers