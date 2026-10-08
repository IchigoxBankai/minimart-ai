// MiniMart AI - Suppliers Directory & Purchase Order (PO) Hub

import React, { useState } from 'react';
import { Truck, Phone, Mail, FileText, Download, Plus, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../ui/Modal';
import { formatCurrency } from '../../utils/formatters';

export const SuppliersHub = () => {
  const { profile, currency, products } = useStore();
  const { showToast } = useToast();

  const [suppliers, setSuppliers] = useState([
    {
      id: 'sup-001',
      name: 'Hindustan Coca-Cola Beverages',
      contactPerson: 'Suresh Menon',
      phone: '+91 98450 88211',
      email: 'orders.south@hccb.com',
      category: 'Beverages',
      paymentTerms: 'Net 15 Days',
      leadTimeDays: 2,
      rating: '4.9 ★',
    },
    {
      id: 'sup-002',
      name: 'Gujarat Cooperative (Amul GCMMF)',
      contactPerson: 'Kailash Patel',
      phone: '+91 98200 11984',
      email: 'depot.bangalore@amul.coop',
      category: 'Dairy',
      paymentTerms: 'COD / Next Day',
      leadTimeDays: 1,
      rating: '5.0 ★',
    },
    {
      id: 'sup-003',
      name: 'Britannia Industries Distribution',
      contactPerson: 'Rajesh Nair',
      phone: '+91 98110 33499',
      email: 'retail.support@britannia.co.in',
      category: 'Bakery & Snacks',
      paymentTerms: 'Net 7 Days',
      leadTimeDays: 1,
      rating: '4.8 ★',
    },
    {
      id: 'sup-004',
      name: 'PepsiCo Snacks Division',
      contactPerson: 'Vikram Joshi',
      phone: '+91 98920 44102',
      email: 'fmcg.orders@pepsico.com',
      category: 'Snacks & Beverages',
      paymentTerms: 'Net 15 Days',
      leadTimeDays: 3,
      rating: '4.7 ★',
    },
    {
      id: 'sup-005',
      name: 'Nestlé India Depot',
      contactPerson: 'Anand Kulkarni',
      phone: '+91 98710 66521',
      email: 'orders@nestle.in',
      category: 'Grocery & Packaged',
      paymentTerms: 'Net 30 Days',
      leadTimeDays: 2,
      rating: '4.9 ★',
    },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    category: 'Grocery',
    paymentTerms: 'Net 15 Days',
    leadTimeDays: 2,
  });

  const handleDownloadPO = (sup) => {
    try {
      const doc = new jsPDF();
      const storeName = profile?.storeName || 'DailyBasket Supermart';
      const cur = currency === 'INR' ? 'Rs.' : '$';

      // Header
      doc.setFillColor(31, 107, 79);
      doc.rect(0, 0, 210, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('PURCHASE ORDER (PO)', 14, 16);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`PO Ref: #PO-${Math.floor(1000 + Math.random() * 9000)}`, 150, 16);

      // Metadata
      doc.setTextColor(30, 37, 33);
      doc.setFontSize(10);
      doc.text(`Issued by: ${storeName} (Owner: Nihar Puthran)`, 14, 34);
      doc.text(`Supplier: ${sup.name} (Attn: ${sup.contactPerson})`, 14, 40);
      doc.text(`Payment Terms: ${sup.paymentTerms} | Lead Time: ${sup.leadTimeDays} Days`, 14, 46);

      // Find items related to this supplier
      const supplierProducts = products.filter(
        (p) => p.supplier?.toLowerCase().includes(sup.name.toLowerCase().split(' ')[0]) || p.category === sup.category
      );

      const itemsRows = (supplierProducts.length > 0 ? supplierProducts : products.slice(0, 3)).map((p) => {
        const orderQty = Math.max((p.reorderLevel * 2) - p.stock, 25);
        return [
          p.name,
          p.sku,
          `${orderQty} units`,
          `${cur} ${p.costPrice}`,
          `${cur} ${(orderQty * p.costPrice).toLocaleString()}`,
        ];
      });

      autoTable(doc, {
        startY: 56,
        head: [['Product Description', 'SKU Code', 'Order Quantity', 'Unit Cost Price', 'Estimated Total']],
        body: itemsRows,
        theme: 'striped',
        headStyles: { fillColor: [31, 107, 79], textColor: [255, 255, 255] },
        styles: { fontSize: 9 },
      });

      doc.save(`PO-${sup.name.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.pdf`);
      showToast(`Generated official Purchase Order PDF for ${sup.name}! 📄`, 'success');
    } catch (e) {
      showToast('Error generating PO PDF', 'error');
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    setSuppliers([
      ...suppliers,
      {
        id: `sup-${Date.now()}`,
        rating: '5.0 ★',
        ...formData,
      },
    ]);
    setIsAddOpen(false);
    showToast(`Added supplier "${formData.name}" to directory`, 'success');
    setFormData({ name: '', contactPerson: '', phone: '', email: '', category: 'Grocery', paymentTerms: 'Net 15 Days', leadTimeDays: 2 });
  };

  return (
    <div className="card p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0ECE1] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#DCEBDD] text-[#1F6B4F]">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-base text-[#1E2521]">
              Supplier Directory & Purchase Order (PO) Hub
            </h3>
          </div>
          <p className="text-xs text-[#697A71] mt-0.5">
            Manage distributor contracts, payment terms, and generate official PO PDFs.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-primary text-xs font-bold px-3.5 py-1.5 rounded-xl min-h-[38px] flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map((sup) => (
          <div
            key={sup.id}
            className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E4D9] flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-[#1E2521]">{sup.name}</h4>
                  <p className="text-xs text-[#697A71] mt-0.5">Contact: {sup.contactPerson}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-[#E3DFD5] rounded-full text-[#1F6B4F]">
                  {sup.rating}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-[#526259]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#8A9A90]" />
                  <span className="font-mono">{sup.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#8A9A90]" />
                  <span>{sup.email}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#8A9A90]" />
                  <span>Terms: <strong>{sup.paymentTerms}</strong> ({sup.leadTimeDays}d delivery)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE4D7] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#1F6B4F] bg-[#EAF3ED] px-2 py-0.5 rounded">
                {sup.category}
              </span>
              <button
                onClick={() => handleDownloadPO(sup)}
                className="btn-outline text-xs font-bold py-1.5 px-3 flex items-center gap-1.5 min-h-[36px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PO (PDF)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Authorized Supplier"
        subtitle="Register distributor contacts and delivery terms"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
              Company / Distributor Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Hindustan Unilever Ltd"
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Manager name"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98000 00000"
                className="input-field font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Payment Terms
              </label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="input-field text-xs bg-white"
              >
                <option value="Net 7 Days">Net 7 Days</option>
                <option value="Net 15 Days">Net 15 Days</option>
                <option value="Net 30 Days">Net 30 Days</option>
                <option value="COD / Immediate">COD / Immediate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Delivery Lead Time
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.leadTimeDays}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: Number(e.target.value) })}
                className="input-field text-center font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFECE2]">
            <button type="button" onClick={() => setIsAddOpen(false)} className="btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Supplier
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
