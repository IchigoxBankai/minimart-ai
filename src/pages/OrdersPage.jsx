// MiniMart AI - Orders & POS Management Page with Barcode Scanner & Thermal Receipt

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ArrowRight, 
  Trash2, 
  Receipt,
  Eye,
  User,
  Package,
  Scan,
  Printer,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { BarcodeScannerModal } from '../components/orders/BarcodeScannerModal';
import { ThermalReceiptModal } from '../components/orders/ThermalReceiptModal';
import { formatCurrency, formatDate } from '../utils/formatters';

const STATUS_OPTIONS = ['All', 'Completed', 'Processing', 'Pending', 'Cancelled'];

export const OrdersPage = ({ selectedOrderFromDashboard, onClearSelectedOrder }) => {
  const { orders, products, customers, createOrder, updateOrderStatus, currency, profile } = useStore();

  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(selectedOrderFromDashboard || null);
  const [thermalOrder, setThermalOrder] = useState(null);

  // New Order Form
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [selectedCustomerId, setSelectedCustomerId] = useState('cust-walkin');
  const [orderItems, setOrderItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [redeemedPoints, setRedeemedPoints] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Selected customer object for loyalty calculation
  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  // Keyboard shortcut listeners (F2 for new sale, B for barcode scanner)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'F2' || e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsCreateOpen(true);
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setIsScannerOpen(true);
      } else if (e.key === 'p' || e.key === 'P') {
        if (orders.length > 0) {
          e.preventDefault();
          setThermalOrder(orders[0]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orders]);

  // Add Item to Order form
  const [selectedProdId, setSelectedProdId] = useState('');
  const [itemQty, setItemQty] = useState(1);

  const handleAddItem = (prodToAdd, qty = itemQty) => {
    const prod = prodToAdd || products.find((p) => p.id === selectedProdId);
    if (!prod) return;

    const existingIdx = orderItems.findIndex((i) => i.productId === prod.id);
    if (existingIdx > -1) {
      const updated = [...orderItems];
      updated[existingIdx].quantity += Number(qty);
      setOrderItems(updated);
    } else {
      setOrderItems([
        ...orderItems,
        {
          productId: prod.id,
          name: prod.name,
          price: prod.sellingPrice,
          quantity: Number(qty),
          cost: prod.costPrice,
        },
      ]);
    }
    setSelectedProdId('');
    setItemQty(1);
  };

  const handleRemoveItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const subtotal = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [orderItems]);

  const total = Math.max(0, subtotal - Number(discount || 0));

  const handleRedeemPoints = (ptsToRedeem) => {
    const available = selectedCustomer?.loyaltyPoints || 0;
    const pts = Math.min(available, ptsToRedeem, subtotal);
    setRedeemedPoints(pts);
    setDiscount(pts); // 1 pt = 1 currency
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (orderItems.length === 0) return;

    const newOrder = createOrder({
      customerId: selectedCustomerId,
      customerName,
      items: orderItems,
      discount: Number(discount),
      redeemedPoints: Number(redeemedPoints),
      paymentMethod,
      status: 'Completed',
    });

    // Reset Form & open thermal receipt
    setIsCreateOpen(false);
    setOrderItems([]);
    setDiscount(0);
    setRedeemedPoints(0);
    setCustomerName('Walk-in Customer');
    setSelectedCustomerId('cust-walkin');
    setThermalOrder(newOrder);
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = activeStatus === 'All' || o.status === activeStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.paymentMethod.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [orders, activeStatus, searchQuery]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success"><CheckCircle2 className="w-3 h-3" />Completed</Badge>;
      case 'Processing':
        return <Badge variant="info"><Clock className="w-3 h-3" />Processing</Badge>;
      case 'Pending':
        return <Badge variant="warning"><Clock className="w-3 h-3" />Pending</Badge>;
      case 'Cancelled':
        return <Badge variant="danger"><XCircle className="w-3 h-3" />Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E2521] tracking-tight">
            POS Checkout & Orders
          </h2>
          <p className="text-sm text-[#697A71] mt-1">
            Barcode scanning, thermal print receipts, and multi-payment checkout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsCreateOpen(true);
              setIsScannerOpen(true);
            }}
            className="btn-secondary text-xs font-bold px-3.5 py-2 min-h-[42px] flex items-center gap-1.5"
          >
            <Scan className="w-4 h-4" />
            <span>Scan Barcode</span>
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="btn-primary text-xs font-bold px-4 py-2 shadow-md shadow-[#1F6B4F]/20 min-h-[42px]"
          >
            <Plus className="w-4 h-4" />
            <span>New Walk-in Sale</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID (#ORD-9842), customer name, or payment..."
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[38px] ${
                  activeStatus === status
                    ? 'bg-[#1F6B4F] text-white shadow-xs'
                    : 'bg-[#F2EFE7] text-[#526259] hover:bg-[#EAE6DB]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table & Cards */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          description="There are no orders matching your status filter or search query."
          actionLabel="Create Order"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF8F3] text-[#697A71] text-xs font-bold uppercase tracking-wider border-b border-[#EBE7DC]">
                  <tr>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items / Qty</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Receipt / Print</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE7]">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setViewingOrder(order)}
                      className="hover:bg-[#FAF8F3]/70 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#1E2521]">
                        #{order.id}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-bold text-[#1E2521]">{order.customerName}</p>
                      </td>

                      <td className="py-3 px-4 text-xs text-[#526259]">
                        {order.items?.length || 1} items (
                        {order.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 1} units)
                      </td>

                      <td className="py-3 px-4 font-display font-bold text-base text-[#1E2521]">
                        {formatCurrency(order.total, currency)}
                      </td>

                      <td className="py-3 px-4 text-xs">
                        <span className="font-semibold text-[#526259]">{order.paymentMethod}</span>
                      </td>

                      <td className="py-3 px-4">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="py-3 px-4 text-xs text-[#8A9A90]">
                        {formatDate(order.date, 'short')}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setThermalOrder(order);
                            }}
                            className="p-2 text-[#1F6B4F] hover:bg-[#EAF3ED] rounded-xl transition-all"
                            title="Thermal POS Print"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingOrder(order);
                            }}
                            className="p-2 text-[#697A71] hover:text-[#1E2521] hover:bg-[#F2EFE7] rounded-xl transition-all"
                            title="View Receipt"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setViewingOrder(order)}
                className="card p-4 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-sm text-[#1E2521]">
                      #{order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="font-bold text-sm text-[#1E2521] mt-1.5">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-[#697A71] mt-0.5">
                    {order.items?.length || 1} items • {order.paymentMethod}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#8A9A90]">
                      {formatDate(order.date, 'relative')}
                    </p>
                    <p className="font-display font-bold text-lg text-[#1E2521]">
                      {formatCurrency(order.total, currency)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setThermalOrder(order);
                      }}
                      className="p-2 rounded-xl bg-[#EAF3ED] text-[#1F6B4F] min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingOrder(order);
                      }}
                      className="btn-outline text-xs font-bold px-3 py-1.5 min-h-[44px]"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Order Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="POS Walk-in Checkout"
        subtitle="Add items with barcode scanner or catalog selector"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {/* Customer Selection & Loyalty Points Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  setSelectedCustomerId('cust-walkin');
                }}
                className="input-field"
                placeholder="Walk-in Customer"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Or Pick Saved Customer
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  const cust = customers.find((c) => c.id === e.target.value);
                  if (cust) {
                    setSelectedCustomerId(cust.id);
                    setCustomerName(cust.name);
                  } else {
                    setSelectedCustomerId('cust-walkin');
                    setCustomerName('Walk-in Customer');
                  }
                }}
                className="input-field appearance-none bg-white"
              >
                <option value="cust-walkin">Walk-in Customer (Guest)</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone || 'No phone'}) — {c.loyaltyPoints || 0} pts [{c.loyaltyTier || 'Bronze'}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loyalty Points Redemption Banner (if selected customer has points) */}
          {selectedCustomer && (selectedCustomer.loyaltyPoints || 0) > 0 && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#DCEBDD] to-[#F7F5EF] border border-[#C2DEC6] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#1F6B4F] text-white font-extrabold text-[10px] uppercase">
                  {selectedCustomer.loyaltyTier || 'Bronze'} Member
                </span>
                <div>
                  <span className="font-bold text-[#1E2521]">
                    {selectedCustomer.loyaltyPoints} Loyalty Points Available
                  </span>
                  <span className="text-[11px] text-[#526259] block">
                    (1 Pt = {formatCurrency(1, currency)} discount)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleRedeemPoints(50)}
                  disabled={selectedCustomer.loyaltyPoints < 50}
                  className="px-2.5 py-1 rounded-xl bg-white border border-[#B9D8BD] hover:border-[#1F6B4F] text-[#1F6B4F] font-bold text-[11px] disabled:opacity-40 transition-all shadow-2xs"
                >
                  Redeem 50 Pts
                </button>
                <button
                  type="button"
                  onClick={() => handleRedeemPoints(100)}
                  disabled={selectedCustomer.loyaltyPoints < 100}
                  className="px-2.5 py-1 rounded-xl bg-white border border-[#B9D8BD] hover:border-[#1F6B4F] text-[#1F6B4F] font-bold text-[11px] disabled:opacity-40 transition-all shadow-2xs"
                >
                  Redeem 100 Pts
                </button>
                <button
                  type="button"
                  onClick={() => handleRedeemPoints(selectedCustomer.loyaltyPoints)}
                  className="px-2.5 py-1 rounded-xl bg-[#1F6B4F] text-white font-bold text-[11px] hover:bg-[#16523C] transition-all shadow-2xs"
                >
                  Max ({Math.min(selectedCustomer.loyaltyPoints, subtotal || selectedCustomer.loyaltyPoints)})
                </button>
              </div>
            </div>
          )}

          {/* Item Selector & Barcode Scanner Quick Button */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#EBE7DC] space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#1E2521] uppercase tracking-wider">
                Cart Items ({orderItems.length})
              </p>
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="text-xs font-bold text-[#1F6B4F] bg-white border border-[#CDE1D3] hover:bg-[#EAF3ED] px-3 py-1 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Scan className="w-3.5 h-3.5 text-[#F2A93B]" />
                <span>Open Barcode Scanner (Beep)</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <select
                value={selectedProdId}
                onChange={(e) => setSelectedProdId(e.target.value)}
                className="input-field text-xs flex-1 bg-white"
              >
                <option value="">Select a product from inventory...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                    {p.name} — {formatCurrency(p.sellingPrice, currency)} ({p.stock} in stock)
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={itemQty}
                  onChange={(e) => setItemQty(e.target.value)}
                  className="input-field w-20 text-center font-bold"
                />
                <button
                  type="button"
                  onClick={() => handleAddItem()}
                  disabled={!selectedProdId}
                  className="btn-primary text-xs font-bold px-4 whitespace-nowrap min-h-[44px]"
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* Order Items Table */}
            {orderItems.length > 0 && (
              <div className="divide-y divide-[#EFECE2] pt-2">
                {orderItems.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#1E2521]">{item.name}</p>
                      <p className="text-[#697A71]">
                        {formatCurrency(item.price, currency)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-[#1E2521]">
                        {formatCurrency(item.price * item.quantity, currency)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment & Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['UPI', 'Cash', 'Card'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all min-h-[44px] ${
                      paymentMethod === method
                        ? 'bg-[#1F6B4F] text-white border-[#1F6B4F]'
                        : 'bg-white border-[#DCD6C8] text-[#526259]'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Discount Amount
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
                className="input-field font-bold text-emerald-700"
              />
            </div>
          </div>

          {/* Final Receipt Preview */}
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E4D9] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#697A71]">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#1E2521]">{formatCurrency(subtotal, currency)}</span>
            </div>
            {Number(discount) > 0 && (
              <div className="flex justify-between text-[#156B3A]">
                <span>Discount:</span>
                <span>-{formatCurrency(discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between font-display font-bold text-base text-[#1E2521] pt-2 border-t border-[#EFECE2]">
              <span>Total Payable:</span>
              <span className="text-[#1F6B4F]">{formatCurrency(total, currency)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFECE2]">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={orderItems.length === 0}
              className="btn-primary"
            >
              Complete Sale & Print Receipt ({formatCurrency(total, currency)})
            </button>
          </div>
        </form>
      </Modal>

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onProductScanned={(scanned) => {
          handleAddItem(scanned, 1);
        }}
      />

      {/* Thermal Receipt Modal */}
      <ThermalReceiptModal
        isOpen={Boolean(thermalOrder)}
        onClose={() => setThermalOrder(null)}
        order={thermalOrder}
        storeProfile={profile}
        currency={currency}
      />

      {/* View Order Receipt Modal */}
      {viewingOrder && (
        <Modal
          isOpen={Boolean(viewingOrder)}
          onClose={() => setViewingOrder(null)}
          title={`Order #${viewingOrder.id}`}
          subtitle={`Placed by ${viewingOrder.customerName} on ${formatDate(viewingOrder.date, 'full')}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            {/* Status changer */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F3] border border-[#E8E4D9]">
              <span className="text-xs font-bold text-[#697A71]">Current Status:</span>
              <select
                value={viewingOrder.status}
                onChange={(e) => {
                  updateOrderStatus(viewingOrder.id, e.target.value);
                  setViewingOrder({ ...viewingOrder, status: e.target.value });
                }}
                className="input-field text-xs font-bold py-1 w-auto"
              >
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Itemized list */}
            <div>
              <p className="text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-2">
                Purchased Items
              </p>
              <div className="divide-y divide-[#F2EFE7] border border-[#EBE7DC] rounded-2xl p-3 bg-white">
                {viewingOrder.items?.map((item, i) => (
                  <div key={i} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#1E2521]">{item.name}</p>
                      <p className="text-[#697A71]">
                        {formatCurrency(item.price, currency)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-sm text-[#1E2521]">
                      {formatCurrency(item.price * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total summary */}
            <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E4D9] space-y-1 text-xs">
              <div className="flex justify-between text-[#697A71]">
                <span>Payment Method:</span>
                <span className="font-bold text-[#1E2521]">{viewingOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[#697A71]">
                <span>Subtotal:</span>
                <span>{formatCurrency(viewingOrder.subtotal, currency)}</span>
              </div>
              {viewingOrder.discount > 0 && (
                <div className="flex justify-between text-[#156B3A]">
                  <span>Discount:</span>
                  <span>-{formatCurrency(viewingOrder.discount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between font-display font-bold text-base text-[#1E2521] pt-2 border-t border-[#EFECE2]">
                <span>Total:</span>
                <span className="text-[#1F6B4F]">{formatCurrency(viewingOrder.total, currency)}</span>
              </div>
            </div>

            {/* Print & Share Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setThermalOrder(viewingOrder);
                  setViewingOrder(null);
                }}
                className="flex-1 btn-primary text-xs font-bold py-2.5 flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Printer className="w-4 h-4" />
                <span>Print Thermal Receipt</span>
              </button>
            </div>

            <button
              onClick={() => setViewingOrder(null)}
              className="w-full btn-outline mt-1"
            >
              Close Receipt
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
