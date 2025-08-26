import { Select, Slider, Typography } from "antd";
import { useState, useEffect } from "react";
import { useBrands } from "../../hooks/useBrands";
import { useCategories } from "../../hooks/useCategories";
import { useColors } from "../../hooks/useColors";
import { useSizes } from "../../hooks/useSizes";
import type { ICategory } from "../../interface/category";
import Text from "antd/es/typography/Text";

const { Title } = Typography;

interface FilterValues {
    price: [number, number];
    brands: string[];
    categories: string[];
    colors: string[];
    sizes: string[];
    gender: string[];
}

interface Props {
    onChange: (filters: FilterValues) => void;
    defaultValues?: FilterValues;
}

const FilterContent = ({ onChange, defaultValues }: Props) => {
    const [priceFilters, setPriceFilters] = useState<[number, number]>(defaultValues?.price || [0, 10000000]);
    const [colorFilters, setColorFilters] = useState<string[]>(defaultValues?.colors || []);
    const [sizeFilters, setSizeFilters] = useState<string[]>(defaultValues?.sizes || []);
    const [brandFilters, setBrandFilters] = useState<string[]>(defaultValues?.brands || []);
    const [categoryFilters, setCategoryFilters] = useState<string[]>(defaultValues?.categories || []);
    const [genderFilters, setGenderFilters] = useState<string[]>(defaultValues?.gender || []);

    const { data: colors = [] } = useColors();
    const { data: sizes = [] } = useSizes();
    const { data: brands = [] } = useBrands();
    const { data: categories = [] } = useCategories();

    useEffect(() => {
        if (defaultValues) {
            setPriceFilters(defaultValues.price || [0, 1000]);
            setColorFilters(defaultValues.colors || []);
            setSizeFilters(defaultValues.sizes || []);
            setBrandFilters(defaultValues.brands || []);
            setCategoryFilters(defaultValues.categories || []);
            setGenderFilters(defaultValues.gender || []);
        }
    }, []);

    // Gọi lại onChange mỗi khi filters thay đổi
    useEffect(() => {
        const newFilters: FilterValues = {
            price: priceFilters,
            colors: colorFilters,
            sizes: sizeFilters,
            brands: brandFilters,
            categories: categoryFilters,
            gender: genderFilters,
        };

        onChange(newFilters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [priceFilters, colorFilters, sizeFilters, brandFilters, categoryFilters, genderFilters]);

    return (
        <div style={{ width: 300, padding: 16 }}>
            <Title level={5}>THƯƠNG HIỆU</Title>
            <Select
                mode="multiple"
                allowClear
                placeholder="Chọn thương hiệu"
                value={brandFilters}
                onChange={setBrandFilters}
                className="w-full mb-4"
                options={brands.map(brand => ({
                    label: brand.name,
                    value: brand._id!,
                }))}
            />

            <Title level={5} style={{ paddingTop: 9 }}>DANH MỤC</Title>
            <Select
                mode="multiple"
                allowClear
                placeholder="Chọn danh mục"
                value={categoryFilters}
                onChange={setCategoryFilters}
                className="w-full mb-4"
                options={categories.map((category: ICategory) => ({
                    label: category.name,
                    value: category._id!,
                }))}
            />
            <Title level={5} style={{ paddingTop: 9 }}>GIỚI TÍNH</Title>
            <Select
                mode="multiple"
                allowClear
                placeholder="Chọn giới tính"
                value={genderFilters}
                onChange={setGenderFilters}
                className="w-full mb-4"
                options={[
                    { label: 'Nam', value: 'male' },
                    { label: 'Nữ', value: 'female' },
                    { label: 'Unisex', value: 'unisex' },
                ]}
            />
            <Title level={5} style={{ paddingTop: 9 }}>GIÁ SẢN PHẨM</Title>
            <Slider
                range
                min={0}
                max={10000000}
                step={10}
                value={[0, priceFilters[1]]}   
                onChange={(value) => {
                    if (Array.isArray(value)) {
                        setPriceFilters([0, value[1]]); 
                    }
                }}
                tipFormatter={(value) => `${value?.toLocaleString('vi-VN')}đ`}
            />
            <div>  Khoảng giá: {priceFilters[0].toLocaleString('vi-VN')}đ - {priceFilters[1].toLocaleString('vi-VN')}đ</div>

            <Title level={5} style={{ paddingTop: 9 }}>MÀU SẮC</Title>
            <div className="flex flex-wrap gap-2 mb-4">
                {colors
                    .filter(color => color.status === 'active')
                    .map(color => (
                        <div
                            key={color._id}
                            className={`w-6 h-6 rounded border cursor-pointer transition ${colorFilters.includes(color._id!) ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'}`}
                            style={{ backgroundColor: color.code }}
                            title={color.name}
                            onClick={() =>
                                setColorFilters(prev =>
                                    prev.includes(color._id!)
                                        ? prev.filter(id => id !== color._id!)
                                        : [...prev, color._id!]
                                )
                            }
                        />
                    ))}
            </div>

            <Title level={5}>KÍCH THƯỚC</Title>
            <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                    <button
                        key={size._id}
                        className={`border px-2 py-1 rounded transition ${sizeFilters.includes(size._id!) ? 'border-blue-500 ring-2 ring-blue-500 text-black bg-white' : 'border-gray-300'}`}
                        onClick={() =>
                            setSizeFilters(prev =>
                                prev.includes(size._id!)
                                    ? prev.filter(id => id !== size._id!)
                                    : [...prev, size._id!]
                            )
                        }
                    >
                        <Text>{size.size}</Text>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterContent;
