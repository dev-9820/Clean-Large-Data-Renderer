import React, { useState, useEffect, useMemo } from "react";
import response1 from "./response1.json";
import response2 from "./response2.json";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [dataset, setDataset] = useState("IND");
  const [categories, setCategories] = useState({});
  const [frequent, setFrequent] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(false);

  // Company color scheme
  const companyColor = {
    primary: "#1c1463",
    primaryLight: "#2d24a3",
    primaryLighter: "#3d32e0",
    secondary: "#f8f9ff",
    accent: "#ff6b35",
    textDark: "#1a1a2e",
    textLight: "#4a5568"
  };

  // dataset loading
  useEffect(() => {
    setLoading(true);
    const data = dataset === "IND" ? response1 : response2;
    setCategories(data.categories || {});
    setFrequent(data.frequent || []);
    setPage(1);
    setSelectedCategory(null);
    setExpandedCategories({});
    
    // delayed loading
    setTimeout(() => setLoading(false), 300);
  }, [dataset]);

  
  const filteredItems = useMemo(() => {
    if (!frequent || !Array.isArray(frequent)) return [];
    
    let filtered = frequent;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.cat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.subCat?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(item => 
        item?.cat === selectedCategory || 
        item?.subCat === selectedCategory
      );
    }
    
    return filtered;
  }, [frequent, searchTerm, selectedCategory]);

  const itemsPerPage = 10;
  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [page, filteredItems]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const renderCategories = (catObj, level = 0, path = []) => {
    if (!catObj || typeof catObj !== 'object') return null;
    
    return Object.keys(catObj).map((key) => {
      const currentPath = [...path, key];
      const fullPath = currentPath.join(" → ");
      const hasSubcategories = catObj[key] && typeof catObj[key] === 'object' && Object.keys(catObj[key]).length > 0;
      const isExpanded = expandedCategories[fullPath];

      return (
        <div key={fullPath} className={`${level > 0 ? 'ml-4' : ''}`}>
          <div
            className={`p-2 my-1 rounded cursor-pointer transition-all duration-200 flex justify-between items-center ${
              selectedCategory === fullPath
                ? `bg-[${companyColor.secondary}] border-l-4 border-[${companyColor.primary}]`
                : 'bg-white hover:bg-gray-50'
            }`}
            onClick={() => {
              if (hasSubcategories) {
                toggleCategory(fullPath);
              }
            }}
          >
            <span className="font-medium text-sm text-gray-700">{key}</span>
            {hasSubcategories && (
              <span className="text-gray-500 text-xs">
                {isExpanded ? 'v' : '->'}
              </span>
            )}
          </div>
          {hasSubcategories && isExpanded && (
            <div className="border-l-2 border-gray-200 ml-2">
              {renderCategories(catObj[key], level + 1, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  // Login Simulation
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoggedIn(true);
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#e8edff]">
        {/* Navbar for Login Page */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <div className="w-8 h-8 bg-[#1c1463] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">D</span>
                  </div>
                  <span className="ml-3 text-xl font-bold text-gray-900">DataExplorer</span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center space-x-4">
                  <span className="text-gray-600">Analytics Platform</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Login Form */}
        <div className="flex justify-center items-center pt-20">
          <form
            onSubmit={handleLogin}
            className="bg-white shadow-2xl p-10 rounded-2xl w-96 transform transition-all duration-300 border border-gray-100"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#1c1463] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to access the product catalogue</p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#1c1463] focus:ring-2 focus:ring-[#1c1463]/20 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#1c1463] focus:ring-2 focus:ring-[#1c1463]/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1c1463] text-white py-4 rounded-xl font-semibold mt-6 hover:bg-[#2d24a3] transform transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8f9ff]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-[#1c1463] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">DataExplorer</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <span className="text-gray-600">Welcome to Analytics Platform</span>
                <button
                  onClick={handleLogout}
                  className="bg-[#1c1463] text-white px-4 py-2 rounded-lg hover:bg-[#2d24a3] transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* SIDEBAR */}
      <div className="w-80 bg-white shadow-xl p-6 overflow-y-auto border-r border-gray-200 mt-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Explorer</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="bg-[#1c1463] text-white px-2 py-1 rounded-full">
              {dataset}
            </span>
            <span>{filteredItems.length} items</span>
          </div>
        </div>

        {/* Dataset Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dataset
          </label>
          <select
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-[#1c1463] focus:ring-2 focus:ring-[#1c1463]/20 transition-all duration-200"
            value={dataset}
            onChange={(e) => setDataset(e.target.value)}
          >
            <option value="IND">India Economic Data</option>
            <option value="IMF">International Data (IMF)</option>
          </select>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search items..."
            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-[#1c1463] focus:ring-2 focus:ring-[#1c1463]/20 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Categories */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
            {(selectedCategory || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchTerm("");
                  setPage(1);
                }}
                className="text-sm text-[#1c1463] hover:text-[#2d24a3] font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1c1463] mx-auto"></div>
              </div>
            ) : (
              renderCategories(categories)
            )}
          </div>
        </div>

        {/* Active Filter */}
        {selectedCategory && (
          <div className="bg-[#f8f9ff] border border-[#1c1463]/20 rounded-xl p-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#1c1463]">
                Filter: {selectedCategory}
              </span>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-[#1c1463] hover:text-[#2d24a3] text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Product Catalogue
            </h1>
            <p className="text-gray-600">
              Browse through {filteredItems.length} data items
              {selectedCategory && ` in "${selectedCategory}"`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c1463] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading data...</p>
            </div>
          )}

          {/* Results */}
          {!loading && filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No items found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : !loading && (
            <>
              {/* Table Structure */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#1c1463] to-[#2d24a3] border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Title & ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Frequency
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Unit
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                          Source
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginated.map((item, index) => (
                        <tr 
                          key={item?.id || index}
                          className="transition-colors duration-150 hover:bg-[#f8f9ff]"
                        >
                          {/* Title & ID Column */}
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1">
                                {item?.title || 'No Title'}
                              </h3>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono block truncate">
                                {item?.id || 'No ID'}
                              </code>
                            </div>
                          </td>
                          
                          {/* Category Column */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#1c1463]/10 text-[#1c1463]">
                                  {item?.cat || 'N/A'}
                                </span>
                                <span className="text-gray-400">→</span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#2d24a3]/10 text-[#2d24a3]">
                                  {item?.subCat || 'N/A'}
                                </span>
                              </div>
                              {item?.subset && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-400 text-xs">→</span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3d32e0]/10 text-[#3d32e0]">
                                    {item.subset}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          
                          {/* Frequency Column */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item?.freq === 'Monthly' ? 'bg-yellow-100 text-yellow-800' :
                              item?.freq === 'Quarterly' ? 'bg-orange-100 text-orange-800' :
                              item?.freq === 'Daily' ? 'bg-red-100 text-red-800' :
                              item?.freq === 'BiMonthly' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item?.freq || 'N/A'}
                            </span>
                          </td>

                          {/* Unit Column */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item?.unit === 'Number' ? 'bg-green-100 text-green-800' :
                              item?.unit === 'Rupees' ? 'bg-blue-100 text-blue-800' :
                              item?.unit === 'Percent' ? 'bg-red-100 text-red-800' :
                              item?.unit === 'Index' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item?.unit || 'No unit'}
                            </span>
                          </td>
                          
                          {/* Source Column */}
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1c1463]/10 text-[#1c1463]">
                                {item?.src || 'N/A'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item?.datatype === 'N' ? 'Numerical' : 'Other'} Data
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#1c1463] transition-all duration-200 flex items-center gap-2"
                  >
                    ← Previous
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">
                      Page {page} of {totalPages}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-600">
                      {filteredItems.length} total items
                    </span>
                  </div>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#1c1463] transition-all duration-200 flex items-center gap-2"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}