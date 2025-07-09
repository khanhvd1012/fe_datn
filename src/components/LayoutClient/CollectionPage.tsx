import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Card, Spin, message } from 'antd';
import axios from 'axios';
import { useBrands } from '../../hooks/useBrands';
import { useCategories } from '../../hooks/useCategories';
import { useVariants } from '../../hooks/useVariants';
import Breadcrumb from './Breadcrumb';

const { Title, Text } = Typography;

const slugify = (str: string) =>
    str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

const getProductsByFilter = async (filter: string, value: string) => {
    const { data } = await axios.get(`http://localhost:3000/api/products?${filter}=${value}`);
    return data?.data?.products || [];
};

const CollectionPage: React.FC = () => {
    const { slug } = useParams();
    const { data: brands = [] } = useBrands();
    const { data: categories = [] } = useCategories();
    const { data: variants = [] } = useVariants();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const sliderRef = useRef<HTMLDivElement>(null);

    const matchedBrand = brands.find((b: any) => slugify(b.name) === slug);
    const matchedCategory = categories.find((c: any) => slugify(c.name) === slug);
    const filterField = matchedBrand ? 'brand' : matchedCategory ? 'category' : null;
    const filterValue = matchedBrand?._id || matchedCategory?._id;

    useEffect(() => {
        if (filterField && filterValue) {
            setLoading(true);
            getProductsByFilter(filterField, filterValue)
                .then((res) => setProducts(res))
                .catch(() => message.error('Lỗi tải sản phẩm'))
                .finally(() => setLoading(false));
        }
    }, [filterField, filterValue]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (sliderRef.current) {
                const container = sliderRef.current;
                const scrollAmount = container.offsetWidth;
                if (container.scrollLeft + scrollAmount >= container.scrollWidth) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [products]);

    const getMinPrice = (product: any) => {
        const productVariants = variants.filter((v: any) => product.variants.includes(v._id));
        const prices = productVariants.map((v: any) => v.price).filter((p: any) => typeof p === 'number');
        return prices.length > 0 ? Math.min(...prices) : null;
    };

    const getDisplayImage = (product: any) => {
        const productVariants = variants.filter((v: any) => product.variants.includes(v._id));
        const vWithImage = productVariants.find((v: any) => Array.isArray(v.image_url) && v.image_url.length > 0);
        return vWithImage?.image_url?.[0] || product.images?.[0] || '/no-image.jpg';
    };

    return (
        <>
            <Breadcrumb current="Bộ sưu tập" />
            <div style={{ padding: '40px 20px' }}>
                <Title level={2} style={{ textAlign: 'center', fontSize: '20px', marginBottom: 8 }}>
                    <span style={{ display: 'inline-block', paddingBottom: 4, position: 'relative' }}>
                        {matchedBrand
                            ? `Thương hiệu: ${matchedBrand.name}`
                            : matchedCategory
                                ? `Danh mục: ${matchedCategory.name}`
                                : 'Không xác định'
                        }
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
                </Title> <br />
                {loading ? (
                    <div style={{ textAlign: 'center' }}><Spin /></div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center' }}>Không có sản phẩm nào</div>
                ) : (
                    <div
                        ref={sliderRef}
                        style={{
                            display: 'flex',
                            overflowX: 'hidden',
                            scrollBehavior: 'smooth',
                        }}
                    >
                        {products.map((product) => {
                            const minPrice = getMinPrice(product);
                            const displayPrice =
                                typeof minPrice === 'number'
                                    ? `${minPrice.toLocaleString('vi-VN')}₫`
                                    : 'Đang cập nhật';

                            return (
                                <div
                                    key={product._id}
                                    style={{
                                        flex: '0 0 25%',
                                        padding: '0 8px',
                                        minWidth: 250,
                                    }}
                                >
                                    <Link to={`/products/${product.slug}`}>
                                        <Card
                                            hoverable
                                            cover={
                                                <img
                                                    alt={product.name}
                                                    src={getDisplayImage(product)}
                                                    style={{ height: 200, objectFit: 'contain', padding: 10 }}
                                                />
                                            }
                                            style={{ textAlign: 'center' }}
                                        >
                                            <Text style={{ display: 'block', marginBottom: 8 }}>{product.name}</Text>
                                            <Text strong>{displayPrice}</Text>
                                        </Card>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default CollectionPage;
