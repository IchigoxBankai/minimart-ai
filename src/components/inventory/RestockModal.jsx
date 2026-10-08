// MiniMart AI - Restock Action Modal

import React, { useState, useEffect } from 'react';
import { Package, Truck, DollarSign, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { formatCurrency } from '../../utils/formatters';

export const RestockModal = ({
  isOpen,
  onClose,
  product,
  currency = 'INR',
  onRestockSubmit,
}) => {
  const [quantity, setQuantity] = useState(25);
  const [supplier, setSupplier] = useState('');
  const [cost, setCost] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      const defaultQty = Math.max((product.reorderLevel || 15) * 2 - product.stock, 20);
      setQuantity(defaultQty);
      setSupplier(product.supplier || 'Standard Distributor');
      setCost(defaultQty * (product.costPrice || 25));
      // Expected delivery in 2 days by default
      const d = new Date();
      d.setDate(d.getDate() + 2);
      setExpectedDate(d.toISOString().split('T')[0]);
      setNotes(`Regular restock intake for ${product.name}`);
    }
  }, [product]);

  if (!product) return null;

  const handleQtyChange = (val) => {
    const q = Number(val) || 0;
    setQuantity(q);
    setCost(q * (product.costPrice || 25));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity <= 0) return;
    setLoading(true);

    onRestockSubmit({
      productId: product.id,
      quantity: Number(quantity),
      supplier,
      cost: Number(cost),
      expectedDate,
      notes,
    });

    setLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Restock ${product.name}`}
      subtitle={`Current Stock: ${product.stock} units | Reorder Level: ${product.reorderLevel} units`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Stock Status Warning Banner */}
        <div className="p-3.5 rounded-2xl bg-[#FEF6E8] border border-[#FCDDB0] flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#F2A93B] flex-shrink-0" />
          <div className="text-xs text-[#526259]">
            <p className="font-bold text-[#B06B08]">
              {product.stock === 0 ? 'Out of Stock Alert' : 'Stock level low!'}
            </p>
            <p>
              Average sales velocity is <strong>{product.salesVelocity || 4.5} units/day</strong>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
              Restock Quantity *
            </label>
            <input
              type="number"
              min="1"
              max="5000"
              value={quantity}
              onChange={(e) => handleQtyChange(e.target.value)}
              className="input-field font-bold text-base text-[#1F6B4F]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
              Total Purchase Cost
            </label>
            <div className="relative">
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="input-field font-bold"
              />
            </div>
            <p className="text-[11px] text-[#8A9A90] mt-1">
              Unit cost: {formatCurrency(product.costPrice, currency)}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
            Supplier / Distributor Name
          </label>
          <div className="relative">
            <Truck className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Supplier name"
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
            Expected Delivery Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
            Internal Movement Notes
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Invoice / PO reference or delivery instructions"
            className="input-field resize-none py-2"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFECE2]">
          <button type="button" onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Updating Stock...' : `Confirm Restock (+${quantity} Units)`}
          </button>
        </div>
      </form>
    </Modal>
  );
};
