// MiniMart AI - Inventory Management & Stock Movements Page

import React, { useState, useMemo } from 'react';
import { 
  Boxes, 
  Search, 
  Filter, 
  PackagePlus, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Truck,
  Check,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Building
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { RestockModal } from '../components/inventory/RestockModal';
import { ExpiryTracker } from '../components/inventory/ExpiryTracker';
import { SuppliersHub } from '../components/inventory/SuppliersHub';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../utils/formatters';

export const InventoryPage = () => {
  const { 
    products, 
    inventoryMovements, 
    restockTasks, 
    restockProduct, 
    updateRestockTaskStatus,
    currency 
  } = useStore();

  const [activeTab, setActiveTab] = useState('inventory'); // inventory, expiry, tasks, suppliers, movements
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, IN_STOCK, LOW_STOCK, OUT_OF_STOCK
  
  // Restock modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isRestockOpen, setIsRestockOpen] = useState(false);

  // Status metrics
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.stock > p.reorderLevel);
  const lowStockProducts = products.filter((p) => p.stock <= p.reorderLevel && p.stock > 0);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.supplier?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      if (!matchesQuery) return false;

      if (statusFilter === 'IN_STOCK') return p.stock > p.reorderLevel;
      if (statusFilter === 'LOW_STOCK') return p.stock <= p.reorderLevel && p.stock > 0;
      if (statusFilter === 'OUT_OF_STOCK') return p.stock === 0;

      return true;
    });
  }, [products, searchQuery, statusFilter]);

  const handleOpenRestock = (p) => {
    setSelectedProduct(p);
    setIsRestockOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E2521] tracking-tight">
            Inventory & Supply Chain
          </h2>
          <p className="text-sm text-[#697A71] mt-1">
            Real-time stock tracking, expiry batch monitoring, restock tasks, and supplier purchase orders.
          </p>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center bg-[#F2EFE7] p-1 rounded-2xl border border-[#E3DFD5] overflow-x-auto max-w-full no-scrollbar">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-white text-[#1F6B4F] shadow-xs'
                : 'text-[#697A71] hover:text-[#1E2521]'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Stock Status</span>
          </button>

          <button
            onClick={() => setActiveTab('expiry')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'expiry'
                ? 'bg-white text-[#1F6B4F] shadow-xs'
                : 'text-[#697A71] hover:text-[#1E2521]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Expiry Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tasks'
                ? 'bg-white text-[#1F6B4F] shadow-xs'
                : 'text-[#697A71] hover:text-[#1E2521]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Restock Tasks ({restockTasks.filter((t) => t.status !== 'received').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'suppliers'
                ? 'bg-white text-[#1F6B4F] shadow-xs'
                : 'text-[#697A71] hover:text-[#1E2521]'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Suppliers & POs</span>
          </button>

          <button
            onClick={() => setActiveTab('movements')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'movements'
                ? 'bg-white text-[#1F6B4F] shadow-xs'
                : 'text-[#697A71] hover:text-[#1E2521]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Movement Audit</span>
          </button>
        </div>
      </div>

      {/* 4 Inventory Status Metric Pills */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`card p-4 text-left transition-all ${
              statusFilter === 'ALL' ? 'border-[#1F6B4F] ring-2 ring-[#1F6B4F]/20' : 'card-hover'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-[#697A71] font-semibold">
              <span>Total Catalog</span>
              <Boxes className="w-4 h-4 text-[#1F6B4F]" />
            </div>
            <div className="font-display font-bold text-2xl text-[#1E2521] mt-2">
              {totalProducts} Items
            </div>
            <p className="text-[11px] text-[#8A9A90] mt-1">All active store SKUs</p>
          </button>

          <button
            onClick={() => setStatusFilter('IN_STOCK')}
            className={`card p-4 text-left transition-all ${
              statusFilter === 'IN_STOCK' ? 'border-[#1F6B4F] ring-2 ring-[#1F6B4F]/20' : 'card-hover'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-[#156B3A] font-semibold">
              <span>🟢 In Stock</span>
              <CheckCircle2 className="w-4 h-4 text-[#156B3A]" />
            </div>
            <div className="font-display font-bold text-2xl text-[#156B3A] mt-2">
              {inStockProducts.length} Items
            </div>
            <p className="text-[11px] text-[#8A9A90] mt-1">Above safety thresholds</p>
          </button>

          <button
            onClick={() => setStatusFilter('LOW_STOCK')}
            className={`card p-4 text-left transition-all ${
              statusFilter === 'LOW_STOCK' ? 'border-[#F2A93B] ring-2 ring-[#F2A93B]/20' : 'card-hover'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-[#B06B08] font-semibold">
              <span>🟡 Low Stock</span>
              <AlertTriangle className="w-4 h-4 text-[#F2A93B]" />
            </div>
            <div className="font-display font-bold text-2xl text-[#B06B08] mt-2">
              {lowStockProducts.length} Items
            </div>
            <p className="text-[11px] text-[#B06B08] mt-1">Approaching reorder level</p>
          </button>

          <button
            onClick={() => setStatusFilter('OUT_OF_STOCK')}
            className={`card p-4 text-left transition-all ${
              statusFilter === 'OUT_OF_STOCK' ? 'border-red-400 ring-2 ring-red-400/20' : 'card-hover'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-[#C92A2A] font-semibold">
              <span>🔴 Out of Stock</span>
              <XCircle className="w-4 h-4 text-[#C92A2A]" />
            </div>
            <div className="font-display font-bold text-2xl text-[#C92A2A] mt-2">
              {outOfStockProducts.length} Items
            </div>
            <p className="text-[11px] text-[#C92A2A] mt-1">Urgent restocking needed</p>
          </button>
        </div>
      )}

      {/* Main Tab Content: Stock Status */}
      {activeTab === 'inventory' && (
        <>
          {/* Search & Filter Bar */}
          <div className="card p-4">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter stock by product name, SKU, or supplier..."
                className="input-field pl-10"
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={Boxes}
              title="No inventory records found"
              description="No items match your active search or status filter."
              actionLabel="Show All Items"
              onAction={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
            />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#FAF8F3] text-[#697A71] text-xs font-bold uppercase tracking-wider border-b border-[#EBE7DC]">
                      <tr>
                        <th className="py-3.5 px-4">Product</th>
                        <th className="py-3.5 px-4">SKU</th>
                        <th className="py-3.5 px-4">Current Stock</th>
                        <th className="py-3.5 px-4">Reorder Threshold</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Daily Velocity</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EFE7]">
                      {filteredProducts.map((p) => {
                        const isOut = p.stock === 0;
                        const isLow = p.stock <= p.reorderLevel;

                        return (
                          <tr key={p.id} className="hover:bg-[#FAF8F3]/70 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-[#1E2521]">{p.name}</p>
                                  <p className="text-xs text-[#697A71]">{p.category} • {p.supplier}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4 font-mono text-xs text-[#697A71]">
                              {p.sku}
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-display font-bold text-base text-[#1E2521]">
                                {p.stock} units
                              </span>
                            </td>

                            <td className="py-3 px-4 text-xs font-semibold text-[#697A71]">
                              {p.reorderLevel} units
                            </td>

                            <td className="py-3 px-4">
                              {isOut ? (
                                <Badge variant="danger">🔴 Out of Stock</Badge>
                              ) : isLow ? (
                                <Badge variant="warning">🟡 Low Stock</Badge>
                              ) : (
                                <Badge variant="success">🟢 In Stock</Badge>
                              )}
                            </td>

                            <td className="py-3 px-4 text-xs font-medium text-[#1F6B4F]">
                              ~{p.salesVelocity || 3.5}/day
                            </td>

                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleOpenRestock(p)}
                                className="btn-primary text-xs font-bold px-3 py-1.5 rounded-xl min-h-[36px]"
                              >
                                <PackagePlus className="w-3.5 h-3.5" />
                                <span>Restock</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {filteredProducts.map((p) => {
                  const isOut = p.stock === 0;
                  const isLow = p.stock <= p.reorderLevel;

                  return (
                    <div key={p.id} className="card p-4 flex flex-col justify-between">
                      <div className="flex items-start gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-14 h-14 rounded-2xl object-cover bg-slate-100 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm text-[#1E2521] truncate">
                            {p.name}
                          </h4>
                          <p className="text-xs text-[#8A9A90] font-mono">SKU: {p.sku}</p>
                          <div className="mt-1.5">
                            {isOut ? (
                              <Badge variant="danger" size="sm">Out of Stock</Badge>
                            ) : isLow ? (
                              <Badge variant="warning" size="sm">Low Stock ({p.stock} left)</Badge>
                            ) : (
                              <Badge variant="success" size="sm">In Stock ({p.stock} left)</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[#697A71]">Reorder threshold: {p.reorderLevel}</p>
                          <p className="text-[11px] font-bold text-[#1F6B4F]">Avg {p.salesVelocity || 3.5}/day sold</p>
                        </div>
                        <button
                          onClick={() => handleOpenRestock(p)}
                          className="btn-primary text-xs font-bold px-3.5 py-2 min-h-[44px]"
                        >
                          <PackagePlus className="w-4 h-4" />
                          <span>Restock</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* Expiry Tracker Tab */}
      {activeTab === 'expiry' && <ExpiryTracker />}

      {/* Suppliers & PO Hub Tab */}
      {activeTab === 'suppliers' && <SuppliersHub />}

      {/* Restock Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-display font-bold text-base text-[#1E2521] mb-1">
              Active Restock Queue & PO Tasks
            </h3>
            <p className="text-xs text-[#697A71] mb-4">
              AI-generated and manual purchase orders scheduled for supplier fulfillment.
            </p>

            {restockTasks.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#697A71]">
                No pending restock tasks in the queue.
              </p>
            ) : (
              <div className="space-y-3">
                {restockTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E4D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1E2521]">
                          {t.productName}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-[#FEF6E8] text-[#B06B08]'
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                      <p className="text-xs text-[#526259] mt-1">
                        Order <strong>{t.suggestedQuantity} units</strong> from <em>{t.supplier}</em> (Est. {formatCurrency(t.estimatedCost, currency)})
                      </p>
                      {t.reason && (
                        <p className="text-[11px] text-[#8A9A90] mt-0.5">
                          Reason: {t.reason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {t.status === 'received' ? (
                        <span className="badge-success">
                          <Check className="w-3 h-3" />
                          Stock Received
                        </span>
                      ) : (
                        <button
                          onClick={() => updateRestockTaskStatus(t.id, 'received')}
                          className="btn-primary text-xs font-bold px-3 py-2 min-h-[44px]"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark Stock Received</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Movements Audit Logs Tab */}
      {activeTab === 'movements' && (
        <div className="card p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
            <div>
              <h3 className="font-display font-bold text-base text-[#1E2521]">
                Inventory Movement Audit Trail
              </h3>
              <p className="text-xs text-[#697A71]">
                Automated chronological log of every sale, restock intake, and manual adjustment.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#F2EFE7] my-3">
            {inventoryMovements.map((mov) => {
              const isPositive = mov.quantityChange > 0;

              return (
                <div key={mov.id} className="py-3.5 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
                        isPositive ? 'bg-[#E4F5E9] text-[#156B3A]' : 'bg-[#F2EFE7] text-[#526259]'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1E2521]">
                        {mov.productName}
                      </p>
                      <p className="text-xs text-[#697A71]">{mov.reason}</p>
                      <p className="text-[10px] text-[#8A9A90] mt-0.5">
                        {formatDate(mov.timestamp, 'full')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-display font-bold text-sm ${
                        isPositive ? 'text-[#156B3A]' : 'text-[#1E2521]'
                      }`}
                    >
                      {isPositive ? `+${mov.quantityChange}` : mov.quantityChange} units
                    </p>
                    <p className="text-xs text-[#8A9A90]">
                      Balance: {mov.remainingStock} units
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Restock Modal */}
      <RestockModal
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        product={selectedProduct}
        currency={currency}
        onRestockSubmit={(payload) => restockProduct(payload)}
      />
    </div>
  );
};
