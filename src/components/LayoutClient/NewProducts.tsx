import React from 'react';
import { Card, Col, Row, Typography } from 'antd';

const { Title, Text } = Typography;

interface Product {
    name: string;
    price: number;
    image: string;
}

const products: Product[] = [
    {
        name: 'Adidas EQT Cushion ADV “North America”',
        price: 7000000,
        image: 'https://picsum.photos/200', // Cập nhật đường dẫn ảnh thật
    },
    {
        name: 'Adidas Nmd R1 “Villa Exclusive”',
        price: 7000000,
        image: 'https://picsum.photos/200',
    },
    {
        name: 'Adidas PW Solar HU NMD “Inspiration Pack”',
        price: 5000000,
        image: 'https://picsum.photos/200',
    },
    {
        name: 'Adidas Ultraboost W',
        price: 5300000,
        image: 'https://picsum.photos/200',
    },
];

const NewProducts: React.FC = () => {
    return (
        <div style={{ padding: '40px 20px' }}>
            <Title
                level={2}
                style={{
                    textAlign: 'center',
                    fontSize: '20px',
                    // fontWeight: 'bold',
                    marginBottom: 8,
                }}
            >
                <span
                    style={{
                        display: 'inline-block',
                        paddingBottom: 4,
                        position: 'relative',
                    }}
                >
                    Sản phẩm mới
                    <span
                        style={{
                            position: 'absolute',
                            left: '25%',
                            bottom: 0,
                            width: '50%',
                            borderBottom: '2px solid black',
                            transform: 'translateY(100%)',
                        }}
                    />
                </span>
            </Title>
            <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 30 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Xem thêm
                </Text>
            </div>

            <Row gutter={[24, 24]} justify="center">
                {products.map((product, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                        <Card
                            hoverable
                            cover={
                                <img
                                    alt={product.name}
                                    src={product.image}
                                    style={{
                                        height: 200,
                                        objectFit: 'contain',
                                        padding: 10,
                                    }}
                                />
                            }
                            style={{ textAlign: 'center' }}
                        >
                            <Text style={{ display: 'block', marginBottom: 8 }}>{product.name}</Text>
                            <Text strong>{product.price.toLocaleString('vi-VN')}₫</Text>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default NewProducts;
