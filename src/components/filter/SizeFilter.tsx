import { Input, Select, Dropdown } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

interface SizeFilterProps {
  filters: {
    name: string;
    value: string;
    status: string;
  };
  handleFilterChange: (value: string | number, type: string) => void;
  type: 'name' | 'value' | 'status';
}

const SizeFilter = ({ filters, handleFilterChange, type }: SizeFilterProps) => {
  if (type === 'name') {
    return (
      <Dropdown
        trigger={['click']}
        dropdownRender={() => (
          <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <Input
              placeholder="Tìm kiếm theo tên"
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
  }

  if (type === 'value') {
    return (
      <Dropdown
        trigger={['click']}
        dropdownRender={() => (
          <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <Input
              placeholder="Tìm kiếm theo giá trị"
              value={filters.value}
              onChange={(e) => handleFilterChange(e.target.value, 'value')}
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

  if (type === 'status') {
    return (
      <Dropdown
        trigger={['click']}
        dropdownRender={() => (
          <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <Select
              style={{ width: '200px' }}
              placeholder="Chọn trạng thái"
              allowClear
              value={filters.status}
              onChange={(value) => handleFilterChange(value || '', 'status')}
            >
              <Select.Option value="active">Đang hoạt động</Select.Option>
              <Select.Option value="inactive">Ngừng hoạt động</Select.Option>
            </Select>
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