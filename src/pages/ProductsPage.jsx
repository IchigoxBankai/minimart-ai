// MiniMart AI - Products Management Page

import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  AlertTriangle,
  ArrowUpDown,
  Tag,
  DollarSign,
  Truck,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Modal } from '../components/ui/Modal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/formatters';

const CATEGORIES = [
  'All',
  'Beverages',
  'Snacks',
  'Grocery',
  'Dairy',
  'Bakery',
  'Personal Care',
  'Household',
  'Other',
];

export const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, currency } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name'); // name, price_asc, price_desc, stock_low, stock_high

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    sku: '',
    category: 'Grocery',
    description: '',
    sellingPrice: '',
    costPrice: '',
    stock: '',
    reorderLevel: 15,
    supplier: '',
    imageUrl: '',
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialForm,
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      description: product.description || '',
      sellingPrice: product.sellingPrice,
      costPrice: product.costPrice,
      stock: product.stock,
      reorderLevel: product.reorderLevel,
      supplier: product.supplier || '',
      imageUrl: product.imageUrl || '',
      isActive: product.isActive !== false,
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sellingPrice) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    setIsFormModalOpen(false);
  };

  const confirmDelete = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'All' || p.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.supplier?.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.sellingPrice - b.sellingPrice;
        if (sortBy === 'price_desc') return b.sellingPrice - a.sellingPrice;
        if (sortBy === 'stock_low') return a.stock - b.stock;
        if (sortBy === 'stock_high') return b.stock - a.stock;
        return a.name.localeCompare(b.name);
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E2521] tracking-tight">
            Product Catalog
          </h2>
          <p className="text-sm text-[#697A71] mt-1">
            Manage your store items, pricing, margins, stock thresholds, and suppliers.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary text-sm font-bold shadow-md shadow-[#1F6B4F]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU code, or supplier..."
              className="input-field pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-[#8A9A90] hover:text-[#1E2521] absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#697A71] whitespace-nowrap hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field text-xs font-semibold py-2 w-full sm:w-auto"
            >
              <option value="name">Alphabetical (A - Z)</option>
              <option value="stock_low">Lowest Stock First</option>
              <option value="stock_high">Highest Stock First</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="price_asc">Price (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all min-h-[36px] ${
                selectedCategory === cat
                  ? 'bg-[#1F6B4F] text-white shadow-xs'
                  : 'bg-[#F2EFE7] text-[#526259] hover:bg-[#EAE6DB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Content: Desktop Table & Mobile Cards */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products match your criteria"
          description="Try changing your search term or category filter, or add a new product."
          actionLabel="Add Product"
          onAction={openAddModal}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF8F3] text-[#697A71] text-xs font-bold uppercase tracking-wider border-b border-[#EBE7DC]">
                  <tr>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Selling Price</th>
                    <th className="py-3.5 px-4">Cost / Margin</th>
                    <th className="py-3.5 px-4">Stock Level</th>
                    <th className="py-3.5 px-4">Supplier</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE7]">
                  {filteredProducts.map((p) => {
                    const margin = p.sellingPrice > 0
                      ? (((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100).toFixed(0)
                      : 0;
                    const isLow = p.stock <= p.reorderLevel;
                    const isOut = p.stock === 0;

                    return (
                      <tr key={p.id} className="hover:bg-[#FAF8F3]/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80'}
                              alt={p.name}
                              className="w-11 h-11 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                            />
                            <div>
                              <p className="font-bold text-[#1E2521]">{p.name}</p>
                              <p className="text-xs text-[#8A9A90] font-mono">SKU: {p.sku}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <Badge variant="neutral">{p.category}</Badge>
                        </td>

                        <td className="py-3 px-4 font-bold text-[#1E2521]">
                          {formatCurrency(p.sellingPrice, currency)}
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-xs">
                            <span className="text-[#697A71]">{formatCurrency(p.costPrice, currency)}</span>
                            <span className="ml-1.5 font-bold text-[#1F6B4F]">({margin}% margin)</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold text-sm ${
                                isOut
                                  ? 'text-[#C92A2A]'
                                  : isLow
                                  ? 'text-[#B06B08]'
                                  : 'text-[#1F6B4F]'
                              }`}
                            >
                              {p.stock} units
                            </span>
                            {isLow && (
                              <span className="badge-warning text-[10px]">
                                Reorder ({p.reorderLevel})
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-xs text-[#697A71] truncate max-w-[150px]">
                          {p.supplier || '—'}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-2 text-[#697A71] hover:text-[#1F6B4F] hover:bg-[#EAF3ED] rounded-xl transition-all"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingProductId(p.id)}
                              className="p-2 text-[#697A71] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {filteredProducts.map((p) => {
              const isLow = p.stock <= p.reorderLevel;
              const isOut = p.stock === 0;
              const margin = p.sellingPrice > 0
                ? (((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100).toFixed(0)
                : 0;

              return (
                <div key={p.id} className="card p-4 flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-14 h-14 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#697A71]">
                          {p.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isOut
                              ? 'bg-red-100 text-red-700'
                              : isLow
                              ? 'bg-[#FEF6E8] text-[#B06B08]'
                              : 'bg-[#E4F5E9] text-[#156B3A]'
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1E2521] truncate mt-0.5">
                        {p.name}
                      </h4>
                      <p className="text-xs text-[#8A9A90] font-mono">SKU: {p.sku}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                    <div>
                      <p className="font-display font-bold text-base text-[#1E2521]">
                        {formatCurrency(p.sellingPrice, currency)}
                      </p>
                      <p className="text-[10px] text-[#697A71]">
                        Cost: {formatCurrency(p.costPrice, currency)} ({margin}% margin)
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 rounded-xl bg-[#F4F1E8] text-[#526259] hover:text-[#1F6B4F] min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingProductId(p.id)}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Product Add / Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingProduct ? `Edit ${editingProduct.name}` : 'Add New Store Product'}
        subtitle="Specify product catalog information, pricing, and reorder levels"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Britannia Bread 400g"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                SKU / Barcode Code
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. BAK-BRIT-400"
                className="input-field font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field appearance-none bg-white"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Supplier / Brand Distributor
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="e.g. Britannia Industries"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Selling Price *
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="0"
                className="input-field font-bold text-[#1F6B4F]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Cost Price
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                placeholder="0"
                className="input-field font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Initial Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                className="input-field font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Reorder Level
              </label>
              <input
                type="number"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                placeholder="15"
                className="input-field font-bold text-[#B06B08]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
              Product Image URL
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Package weight, brand details, storage notes..."
              className="input-field resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFECE2]">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingProduct ? 'Save Changes' : 'Add to Catalog'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deletingProductId)}
        onClose={() => setDeletingProductId(null)}
        onConfirm={confirmDelete}
        title="Remove Product from Catalog?"
        description="This will remove the product and its pricing from active inventory. Order records will retain item names."
        confirmText="Yes, Delete Product"
        type="danger"
      />
    </div>
  );
};
