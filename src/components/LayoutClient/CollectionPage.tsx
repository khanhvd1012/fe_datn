import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Card, Spin, message } from 'antd';
import axios from 'axios';
import { useBrands } from '../../hooks/useBrands';
import { useCategories } from '../../hooks/useCategories';
import Breadcrumb from './Breadcrumb';

const { Title, Text } = Typography;

const slugify = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const CollectionPage: React.FC = () => {
  const { slug } = useParams();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  const matchedBrand = brands.find((b: any) => slugify(b.name) === slug);
  const matchedCategory = categories.find((c: any) => slugify(c.name) === slug);
  const filterField = matchedBrand ? 'brand' : matchedCategory ? 'category' : null;
  const filterValue = matchedBrand?._id || matchedCategory?._id;

  useEffect(() => {
    if (!filterField || !filterValue) {
      setProducts([]);
      setVariants([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      axios.get(`http://localhost:3000/api/products?${filterField}=${filterValue}`),
      axios.get('http://localhost:3000/api/variants')
    ])
      .then(([productsRes, variantsRes]) => {
        const fetchedProducts = productsRes.data.data.products || [];
        const allVariants = variantsRes.data.data || [];

        const productIds = fetchedProducts.map((p: any) => p._id);
        const filteredVariants = allVariants.filter((v: any) =>
          productIds.includes(
            typeof v.product_id === 'string' ? v.product_id : v.product_id?._id
          )
        );

        setProducts(fetchedProducts);
        setVariants(filteredVariants);
        setLoading(false);
      })
      .catch(() => {
        message.error('Không thể tải dữ liệu sản phẩm hoặc biến thể');
        setLoading(false);
      });
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
  }, [variants]);

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
              : 'Không xác định'}
            <span
              style={{
                position: 'absolute',
                left: '25%',
                bottom: 0,
                width: '50%',
                borderBottom: '2px solid black',
                transform: 'translateY(100%)'
              }}
            />
          </span>
        </Title>

        <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 30 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Tự động trượt qua sản phẩm
          </Text>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin />
          </div>
        ) : !variants.length ? (
          <div style={{ textAlign: 'center', fontSize: 16, marginTop: 40 }}>
            <Text type="secondary">Không có sản phẩm nào trong bộ sưu tập này.</Text>
          </div>
        ) : (
          <div
            ref={sliderRef}
            style={{
              display: 'flex',
              overflowX: 'hidden',
              scrollBehavior: 'smooth',
            }}
          >
            {variants.map((variant) => {
              const product = products.find(
                (p) => Array.isArray(p.variants) && p.variants.includes(variant._id)
              );
              if (!product) return null;

              const image =
                Array.isArray(variant.image_url) && variant.image_url.length > 0
                  ? variant.image_url[0]
                  : product.images?.[0] || 'https://picsum.photos/200';

              return (
                <div
                  key={variant._id}
                  style={{
                    flex: '0 0 10%',
                    padding: '0 10px',
                    minWidth: 250,
                    marginBottom: 20,
                  }}
                >
                  <Link to={`/products/${product.slug}`} state={{ variantId: variant._id }}>
                    <Card
                      hoverable
                      cover={
                        <div
                          style={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                          }}
                        >
                          <img
                            alt={product.name}
                            src={image}
                            style={{
                              maxHeight: '100%',
                              maxWidth: '100%',
                              objectFit: 'contain',
                              display: 'block',
                            }}
                          />
                        </div>
                      }
                      style={{
                        textAlign: 'center',
                        height: 340,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          height: 48,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          marginBottom: 8,
                        }}
                      >
                        <Text style={{ fontWeight: 500 }}>
                          {product.name} - {variant.color?.name}
                        </Text>
                      </div>
                      <Text strong>{variant.price?.toLocaleString('en-US')}$</Text>
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
