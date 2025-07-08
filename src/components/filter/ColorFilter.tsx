import { Input, Dropdown } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

interface ColorFilterProps {
  filters: {
    name: string;
    code: string;
    status: string;
  };
  handleFilterChange: (value: string | number, type: string) => void;
  type: 'name' | 'code' | 'status' ;
}

const ColorFilter = ({ filters, handleFilterChange, type }: ColorFilterProps) => {
  const placeholderMap: Record<string, string> = {
    name: 'Tìm kiếm theo tên màu sắc',
    code: 'Tìm kiếm theo mã màu',
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

export default ColorFilter;