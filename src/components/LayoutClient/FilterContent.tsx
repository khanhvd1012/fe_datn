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
    const [priceFilters, setPriceFilters] = useState<[number, number]>(
        defaultValues?.price || [0, 30000000]
    );
    const [colorFilters, setColorFilters] = useState<string[]>(defaultValues?.colors || []);
    const [sizeFilters, setSizeFilters] = useState<string[]>(defaultValues?.sizes || []);
    const [brandFilters, setBrandFilters] = useState<string[]>(defaultValues?.brands || []);
    const [categoryFilters, setCategoryFilters] = useState<string[]>(defaultValues?.categories || []);
    const [genderFilters, setGenderFilters] = useState<string[]>(defaultValues?.gender || []);

    const { data: colors = [] } = useColors();
    const { data: sizes = [] } = useSizes();
    const { data: brands = [] } = useBrands();
    const { data: categories = [] } = useCategories();

    // Đồng bộ lại state khi defaultValues thay đổi
    useEffect(() => {
        if (defaultValues) {
            setPriceFilters(defaultValues.price || [0, 30000000]);
            setColorFilters(defaultValues.colors || []);
            setSizeFilters(defaultValues.sizes || []);
            setBrandFilters(defaultValues.brands || []);
            setCategoryFilters(defaultValues.categories || []);
            setGenderFilters(defaultValues.gender || []);
        }
    }, []);

    // Hàm gọi onChange khi filters đổi
    const triggerChange = (changed: Partial<FilterValues>) => {
        onChange({
            price: priceFilters,
            colors: colorFilters,
            sizes: sizeFilters,
            brands: brandFilters,
            categories: categoryFilters,
            gender: genderFilters,
            ...changed,
        });
    };

    return (
        <div style={{ width: 300, padding: 16 }}>
            <Title level={5}>THƯƠNG HIỆU</Title>
            <Select
                mode="multiple"
                allowClear
                placeholder="Chọn thương hiệu"
                value={brandFilters}
                onChange={(val) => {
                    setBrandFilters(val);
                    triggerChange({ brands: val });
                }}
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
                onChange={(val) => {
                    setCategoryFilters(val);
                    triggerChange({ categories: val });
                }}
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
                onChange={(val) => {
                    setGenderFilters(val);
                    triggerChange({ gender: val });
                }}
                className="w-full mb-4"
                options={[
                    { label: "Nam", value: "male" },
                    { label: "Nữ", value: "female" },
                    { label: "Unisex", value: "unisex" },
                ]}
            />

            <Title level={5} style={{ paddingTop: 9 }}>GIÁ SẢN PHẨM</Title>
            <Slider
                range
                min={0}
                max={30000000}
                step={10}
                value={priceFilters}
                onChange={(val) => Array.isArray(val) && setPriceFilters(val as [number, number])}
                onAfterChange={(val) =>
                    Array.isArray(val) && triggerChange({ price: val as [number, number] })
                }
                tipFormatter={(value) => `${value?.toLocaleString("vi-VN")}đ`}
            />
            <div>
                Khoảng giá: {priceFilters[0].toLocaleString("vi-VN")}đ -{" "}
                {priceFilters[1].toLocaleString("vi-VN")}đ
            </div>

            <Title level={5} style={{ paddingTop: 9 }}>MÀU SẮC</Title>
            <div className="flex flex-wrap gap-2 mb-4">
                {colors
                    .filter(color => color.status === "active")
                    .map(color => (
                        <div
                            key={color._id}
                            className={`w-6 h-6 rounded border cursor-pointer transition ${
                                colorFilters.includes(color._id!)
                                    ? "border-blue-500 ring-2 ring-blue-500"
                                    : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color.code }}
                            title={color.name}
                            onClick={() => {
                                const newColors = colorFilters.includes(color._id!)
                                    ? colorFilters.filter(id => id !== color._id!)
                                    : [...colorFilters, color._id!];
                                setColorFilters(newColors);
                                triggerChange({ colors: newColors });
                            }}
                        />
                    ))}
            </div>

            <Title level={5}>KÍCH THƯỚC</Title>
            <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                    <button
                        key={size._id}
                        className={`border px-2 py-1 rounded transition ${
                            sizeFilters.includes(size._id!)
                                ? "border-blue-500 ring-2 ring-blue-500 text-black bg-white"
                                : "border-gray-300"
                        }`}
                        onClick={() => {
                            const newSizes = sizeFilters.includes(size._id!)
                                ? sizeFilters.filter(id => id !== size._id!)
                                : [...sizeFilters, size._id!];
                            setSizeFilters(newSizes);
                            triggerChange({ sizes: newSizes });
                        }}
                    >
                        <Text>{size.size}</Text>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterContent;
