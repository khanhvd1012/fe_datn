import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import type { IProduct } from "../../interface/product";

interface SearchBoxProps {
  onClose: () => void;
  products?: IProduct[];
}

const SearchBox: React.FC<SearchBoxProps> = ({ onClose, products = [] }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const navigate = useNavigate();

  const closeSearchBox = useCallback(() => onClose(), [onClose]);

  // Load lại lịch sử khi mở
  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Lắng nghe clear history
  useEffect(() => {
    const clearHandler = () => setHistory([]);
    window.addEventListener("clearSearchHistory", clearHandler);
    return () => window.removeEventListener("clearSearchHistory", clearHandler);
  }, []);

  // Focus input khi mở
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeSearchBox();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSearchBox]);

  // Đóng khi scroll
  useEffect(() => {
    window.addEventListener("scroll", closeSearchBox);
    return () => window.removeEventListener("scroll", closeSearchBox);
  }, [closeSearchBox]);

  const mapGenderKeyword = (gender: string) => {
    if (!gender) return "";
    switch (gender.toLowerCase()) {
      case "male":
        return "nam";
      case "female":
        return "nữ";
      case "unisex":
        return "unisex";
      default:
        return gender.toLowerCase();
    }
  };

  // Hàm filter
  const matchProduct = (p: IProduct, tokens: string[]) => {
    const productText = [
      p.name,
      typeof p.brand !== "string" ? p.brand?.name : "",
      typeof p.category !== "string" ? p.category?.name : "",
      ...p.variants.map((v) => mapGenderKeyword(v.gender)),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return tokens.every((t) => productText.includes(t));
  };

  // Kết quả tìm kiếm
  const results = useMemo(() => {
    if (!search.trim() || !Array.isArray(products)) return [];
    const tokens = search.toLowerCase().split(/\s+/).filter(Boolean);
    return products.filter((p) => matchProduct(p, tokens));
  }, [search, products]);

  // Lưu lịch sử
  const saveHistory = useCallback(
    (keyword: string) => {
      let updated = [keyword, ...history.filter((h) => h !== keyword)];
      updated = updated.slice(0, 5); // chỉ giữ 5 mục gần nhất
      setHistory(updated);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
    },
    [history]
  );

  // helper để map keyword => gender chuẩn
  const detectGenderFromKeyword = (keyword: string): string | null => {
    if (keyword.includes("nam") || keyword.includes("male")) return "male";
    if (keyword.includes("nữ") || keyword.includes("nu") || keyword.includes("female")) return "female";
    if (keyword.includes("unisex")) return "unisex";
    return null;
  };

  const handleSearch = useCallback(() => {
    if (!search.trim()) return;

    const keyword = search.toLowerCase();

    // gom tất cả categories duy nhất
    const categories = Array.from(
      new Map(
        products
          .map((p) => (typeof p.category !== "string" ? p.category : null))
          .filter(Boolean)
          .map((c) => [c!._id, c!])
      ).values()
    );

    // gom tất cả brands duy nhất
    const brands = Array.from(
      new Map(
        products
          .map((p) => (typeof p.brand !== "string" ? p.brand : null))
          .filter(Boolean)
          .map((b) => [b!._id, b!])
      ).values()
    );

    // tìm category phù hợp nhất
    const matchedCategory =
      categories
        .filter((c) => keyword.includes(c.name.toLowerCase()))
        .sort((a, b) => b.name.length - a.name.length)[0] || null;

    // tìm brand phù hợp nhất
    const matchedBrand =
      brands
        .filter((b) => keyword.includes(b.name.toLowerCase()))
        .sort((a, b) => b.name.length - a.name.length)[0] || null;

    const detectedGender = detectGenderFromKeyword(keyword);

    saveHistory(search.trim());

    // Điều hướng sang trang product
    navigate("/products", {
      state: {
        categories: matchedCategory ? [matchedCategory._id] : [],
        brands: matchedBrand ? [matchedBrand._id] : [],
        search: search.trim(),
        gender: detectedGender ? [detectedGender] : [],
      },
    });

    closeSearchBox();
  }, [search, products, saveHistory, navigate, closeSearchBox]);


  return (
    <div
      ref={containerRef}
      className="w-[350px] bg-white shadow-lg rounded-lg p-4"
    >
      {/* Ô input + nút tìm */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 flex-grow">
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm..."
            className="bg-transparent outline-none w-full text-gray-700 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="ml-2 w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            disabled={!search.trim()}
            onClick={handleSearch}
          >
            <SearchOutlined className="text-sm" />
          </button>
        </div>
        <div
          onClick={closeSearchBox}
          className="flex-shrink-0 cursor-pointer text-lg text-gray-500 hover:text-black"
        >
          <CloseOutlined />
        </div>
      </div>

      {/* Kết quả tìm kiếm hoặc lịch sử */}
      {search ? (
        <div className="max-h-60 overflow-y-auto">
          {results.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-4">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            results.map((product) => {
              const genders = Array.from(
                new Set(product.variants.map((v) => mapGenderKeyword(v.gender)).filter(Boolean))
              );

              return (
                <Link
                  key={product._id}
                  to="/products"
                  state={{
                    productId: product._id,
                    brands:
                      typeof product.brand !== "string" && product.brand
                        ? [product.brand._id]
                        : [],
                    categories:
                      typeof product.category !== "string" && product.category
                        ? [product.category._id]
                        : [],
                    gender: genders,
                  }}
                  onClick={closeSearchBox}
                  className="flex items-center gap-3 py-2 px-2 rounded hover:bg-gray-100 transition"
                >
                  <div>
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-gray-500">
                      {typeof product.brand !== "string" && product.brand?.name} •{" "}
                      {typeof product.category !== "string" && product.category?.name} •{" "}
                      {genders.length > 0 ? genders.join(", ") : "Không rõ giới tính"}
                    </div>
                  </div>
                </Link>
              );
            })

          )}
        </div>
      ) : (
        history.length > 0 && (
          <div className="max-h-40 overflow-y-auto border-t pt-2">
            {history.slice(0, 5).map((h, idx) => (
              <div
                key={idx}
                className="py-2 px-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSearch(h);
                  handleSearch();
                }}
              >
                {h}
              </div>
            ))}
          </div>
        )
      )}

    </div>
  );
};

export default SearchBox;
