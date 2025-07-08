import { Input, Dropdown } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

interface BrandFilterProps {
  filters: {
    name: string;
  };
  handleFilterChange: (value: string, type: 'name') => void;
}

const BrandFilter = ({ filters, handleFilterChange }: BrandFilterProps) => {
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
            placeholder="Tìm kiếm theo tên thương hiệu"
            value={filters.name}
            onChange={(e) => handleFilterChange(e.target.value, 'name')}
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

export default BrandFilter;
