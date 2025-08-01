import { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductsContext } from '../context/ProductsContext';
import { assets } from "../assets/assets";
import { FiltersPanel } from '../components/FilterPanel';
import { Search } from '../components/Search';

export const Products = () => {
    const { allProducts, getAllProducts, loading, totalPages, filters, setFilters, getProductById } = useContext(ProductsContext);
    const navigate = useNavigate();
    const truncateWords = (text, wordLimit) => {
        const words = text.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
    };

    useEffect(() => {
        getAllProducts(filters.page);
    }, [filters.page, filters.category, filters.priceRange, filters.sortOption]);

    const handlePageChange = (newPage) => {
        if (loading) return;
        if (newPage >= 1 && newPage <= totalPages && newPage !== filters.page) {
            setFilters(prev => ({ ...prev, page: newPage }));
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }, 100);
        }
    };

    const renderPageNumbers = () => {
        const current = filters.page;
        const total = totalPages;
        const pages = [];

        if (current > 3) {
            pages.push(1);
            if (current > 4) pages.push("start-ellipsis");
        }

        const start = Math.max(2, current - 2);
        const end = Math.min(total - 1, current + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (current < total - 3) {
            pages.push("end-ellipsis");
            pages.push(total);
        } else if (current !== total && !pages.includes(total)) {
            pages.push(total);
        }

        return pages;
    };

    const location = useLocation();
    useEffect(() => {
        if (location.pathname === "/products") {
            setFilters({
                category: "",
                priceRange: "",
                sortOption: "",
                page: 1,
            });
        }
    }, [location.pathname]);

    return (
        <div className='mx-6 md:mx-16 lg:mx-24 xl:mx-32 my-6'>
            <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">Popular Products</h2>
            <Search />
            <FiltersPanel />

            {loading ? (
                <div className="w-full h-[300px] flex justify-center items-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allProducts.products.map(product => (
                            <div key={product._id} className="bg-[#263238] border border-[#1E88E5] rounded-xl overflow-hidden p-5 transition duration-300 hover:shadow-lg hover:scale-[1.01]">
                                <div className="h-[180px] flex justify-center items-center bg-[#37474F] rounded-lg mb-4 overflow-hidden">
                                    <img
                                        loading="lazy"
                                        src={product.image}
                                        alt={product.title}
                                        className="object-contain h-full hover:scale-110 duration-300"
                                    />
                                </div>
                                <div className="mb-4">
                                    <p className="font-semibold text-white mb-1 truncate">{product.title}</p>
                                    <p className="text-sm text-gray-300">{truncateWords(product.description, 15)}</p>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-[#1E88E5] font-semibold">★ 4.0</p>
                                    <div className="flex items-center gap-1">
                                        {Array(5).fill(0).map((_, i) => (
                                            <img key={i} src={i < 4 ? assets.starIconFilled : assets.starIconOutlined} alt="star" className="w-4 h-4" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col  items-center">
                                        <p className="font-semibold text-white">${product.finalPrice.toFixed(2)}</p>
                                        {product.discountPercent > 0 && (
                                            <del className="text-gray-400">${product.price.toFixed(2)}</del>
                                        )}
                                    </div>
                                    <button onClick={() =>{getProductById(product._id), navigate("/products/" + product._id), window.scrollTo({ top: 0, behavior: "smooth" })} } 
                                        className="cursor-pointer bg-transparent border border-[#1E88E5] hover:bg-[#1E88E5] transition duration-300 text-white text-sm px-4 py-1.5 rounded-lg">
                                        See Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
                        <button
                            onClick={() => handlePageChange(filters.page - 1)}
                            disabled={filters.page === 1 || loading}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-600 text-gray-300 hover:bg-[#1E88E5]/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {renderPageNumbers().map((item, index) =>
                            item === "start-ellipsis" || item === "end-ellipsis" ? (
                                <span key={index} className="px-2 text-gray-400">...</span>
                            ) : (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(item)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition ${
                                        item === filters.page
                                            ? "bg-[#1E88E5] text-white border-[#1E88E5]"
                                            : "text-gray-300 border-gray-600 hover:bg-white/10"
                                    }`}
                                >
                                    {item}
                                </button>
                            )
                        )}

                        <button
                            onClick={() => handlePageChange(filters.page + 1)}
                            disabled={filters.page === totalPages || loading}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-600 text-gray-300 hover:bg-[#1E88E5]/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
