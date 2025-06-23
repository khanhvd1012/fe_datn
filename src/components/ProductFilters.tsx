import { Input, Dropdown, Space, Select, Tag } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ICategory } from '../interface/category';
import type { IBrand } from '../interface/brand';

interface FiltersType {
  name: string;
  minPrice: string;
  maxPrice: string;
  category: string;
  brand: string;
  status: string;
  gender: string;
}

interface ProductFiltersProps {
  filters: FiltersType;
  onFilterChange: (value: string | number, type: string) => void;
  categories?: ICategory[];
  brands?: IBrand[];
}

export const ProductFilters = {
  nameColumn: ({ filters, onFilterChange }: ProductFiltersProps) => ({
    title: (
      <Space size="middle">
        Tên sản phẩm
        <Dropdown
          trigger={['click']}
          dropdownRender={() => (
            <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <Input
                placeholder="Tìm kiếm theo tên"
                value={filters.name}
                onChange={(e) => onFilterChange(e.target.value, 'name')}
                prefix={<SearchOutlined />}
                allowClear
              />
            </div>
          )}
        >
          <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
        </Dropdown>
      </Space>
    ),
    dataIndex: "name",
    key: "name",
  }),

  priceColumn: ({ filters, onFilterChange }: ProductFiltersProps) => ({
    title: (
      <Space size="middle">
        Giá
        <Dropdown
          trigger={['click']}
          dropdownRender={() => (
            <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Input
                placeholder="Giá tối thiểu"
                value={filters.minPrice}
                onChange={(e) => onFilterChange(e.target.value, 'minPrice')}
                type="number"
                allowClear
              />
              <Input
                placeholder="Giá tối đa"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange(e.target.value, 'maxPrice')}
                type="number"
                allowClear
              />
            </div>
          )}
        >
          <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
        </Dropdown>
      </Space>
    ),
    dataIndex: "price",
    key: "price",
    render: (price: number) => `${price?.toFixed(2)} đ`
  }),

  brandColumn: ({ filters, onFilterChange, brands }: ProductFiltersProps) => ({
    title: (
      <Space size="middle">
        Thương hiệu
        <Dropdown
          trigger={['click']}
          dropdownRender={() => (
            <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <Select
                style={{ width: '200px' }}
                placeholder="Chọn thương hiệu"
                allowClear
                value={filters.brand}
                onChange={(value) => onFilterChange(value || '', 'brand')}
              >
                {brands?.map((brand: IBrand) => (
                  <Select.Option key={brand._id} value={brand._id}>
                    {brand.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}
        >
          <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
        </Dropdown>
      </Space>
    ),
    dataIndex: "brand",
    key: "brand",
    render: (brand: any) => {
      if (typeof brand === 'object' && brand !== null && 'name' in brand) {
        return brand.name;
      }
      return 'Chưa có thương hiệu';
    }
  }),

  categoryColumn: ({ filters, onFilterChange, categories }: ProductFiltersProps) => ({
    title: (
      <Space size="middle">
        Danh mục
        <Dropdown
          trigger={['click']}
          dropdownRender={() => (
            <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <Select
                style={{ width: '200px' }}
                placeholder="Chọn danh mục"
                allowClear
                value={filters.category}
                onChange={(value) => onFilterChange(value || '', 'category')}
              >
                {categories?.map((category: ICategory) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}
        >
          <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
        </Dropdown>
      </Space>
    ),
    dataIndex: "category",
    key: "category",
    render: (category: any) => {
      if (typeof category === 'object' && category !== null && 'name' in category) {
        return category.name;
      }
      return 'Chưa phân loại';
    }
  }),

  genderColumn: ({ filters, onFilterChange }: ProductFiltersProps) => ({
    title: (
      <Space size="middle">
        Giới tính
        <Dropdown
          trigger={['click']}
          dropdownRender={() => (
            <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <Select
                style={{ width: '200px' }}
                placeholder="Chọn giới tính"
                allowClear
                value={filters.gender}
                onChange={(value) => onFilterChange(value || '', 'gender')}
              >
                <Select.Option value="male">Nam</Select.Option>
                <Select.Option value="female">Nữ</Select.Option>
                <Select.Option value="unisex">Unisex</Select.Option>
              </Select>
            </div>
          )}
        >
          <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
        </Dropdown>
      </Space>
    ),
    dataIndex: "gender",
    key: "gender",
    render: (gender: string) => {
      const colors: any = {
        unisex: "green",
        female: "pink",
        male: "blue",
      }
      const genderText = {
        unisex: "UNISEX",
        female: "NỮ",
        male: "NAM"
      }[gender] || gender.toUpperCase();
      return <Tag color={colors[gender] || "default"}>{genderText}</Tag>
    }
  }),

  statusColumn: ({ filters, onFilterChange }: ProductFiltersProps) => ({
    title: (
      <Space size="middle">
        Trạng thái
        <Dropdown
          trigger={['click']}
          dropdownRender={() => (
            <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <Select
                style={{ width: '200px' }}
                placeholder="Chọn trạng thái"
                allowClear
                value={filters.status}
                onChange={(value) => onFilterChange(value || '', 'status')}
              >
                <Select.Option value="inStock">Còn hàng</Select.Option>
                <Select.Option value="outOfStock">Hết hàng</Select.Option>
              </Select>
            </div>
          )}
        >
          <FilterOutlined style={{ cursor: 'pointer', marginLeft: 8 }} />
        </Dropdown>
      </Space>
    ),
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      const color = status === 'inStock' ? 'success' : 'error';
      return <Tag color={color}>{status === 'inStock' ? 'Còn hàng' : 'Hết hàng'}</Tag>
    }
  })
};
