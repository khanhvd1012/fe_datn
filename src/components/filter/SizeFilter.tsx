import { Input, Dropdown } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

interface SizeFilterProps {
  filters: {
    size: string;
  };
  handleFilterChange: (value: string | number, type: string) => void;
  type: 'size';
}

const SizeFilter = ({ filters, handleFilterChange, type }: SizeFilterProps) => {
  if (type === 'size') {
    return (
      <Dropdown
        trigger={['click']}
        dropdownRender={() => (
          <div style={{
            backgroundColor: 'white',
            padding: '8px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <Input
              placeholder="Tìm kiếm theo kích thước"
              value={filters.size}
              onChange={(e) => handleFilterChange(e.target.value, 'size')}
              prefix={<SearchOutlined />}
              allowClear
            />
          </div>
        )}
      >
        <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
      </Dropdown>
    );
  }

  return null;
};

export default SizeFilter;