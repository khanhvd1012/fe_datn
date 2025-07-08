import { Input, Dropdown } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

interface VariantFilterProps {
  filters: {
    product_id: string;
    color: string;
    size: string;
    gender: string;
    price: number;
    import_price: number;
    status: string;
  };
  handleFilterChange: (value: string | number, type: string) => void;
  type: 'product_id' | 'color' | 'size' | 'gender' | 'price' | 'import_price' | 'status';
}

const VariantFilter = ({ filters, handleFilterChange, type }: VariantFilterProps) => {
  const placeholderMap: Record<string, string> = {
    product_id: 'Tìm kiếm theo tên sản phẩm',
    color: 'Tìm kiếm theo màu sắc',
    size: 'Tìm kiếm theo kích thước',
    gender: 'Tìm kiếm theo giới tính',
    price: 'Tìm kiếm theo giá',
    import_price: 'Tìm kiếm theo giá nhập',
    status: 'Tìm kiếm theo trạng thái',
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

export default VariantFilter;