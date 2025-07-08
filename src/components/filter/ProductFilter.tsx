import { Input, Dropdown } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

interface ProductFilterProps {
  filters: {
    name: string;
    brand: string;
    category: string;
    size: string;
  };
  handleFilterChange: (value: string | number, type: string) => void;
  type: 'name' | 'brand' | 'category' | 'size';
}

const ProductFilter = ({ filters, handleFilterChange, type }: ProductFilterProps) => {
  const placeholderMap: Record<string, string> = {
    name: 'Tìm kiếm theo tên sản phẩm',
    brand: 'Tìm kiếm theo thương hiệu',
    category: 'Tìm kiếm theo danh mục',
    size: 'Tìm kiếm theo kích cỡ',
  };

  return (
    <Dropdown
      trigger={['click']}
      dropdownRender={() => (
        <div
          style={{
            backgroundColor: 'white',
            padding: '8px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <Input
            placeholder={placeholderMap[type]}
            value={filters[type]}
            onChange={(e) => handleFilterChange(e.target.value, type)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      )}
    >
      <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
    </Dropdown>
  );
};

export default ProductFilter;