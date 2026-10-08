// MiniMart AI - 58mm/80mm POS Thermal Receipt Modal & WhatsApp Share

import React from 'react';
import { Printer, MessageSquare, Share2, Check, X, Store } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ThermalReceiptModal = ({ isOpen, onClose, order, storeProfile, currency = 'INR' }) => {
  if (!order) return null;

  const storeName = storeProfile?.storeName || 'DailyBasket Supermart';
  const phone = storeProfile?.phone || '+91 98765 43210';
  const address = storeProfile?.address || 'Shop 14, Sunrise Plaza, Bengaluru, KA';

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const cur = currency === 'INR' ? '₹' : '$';
    let text = `🧾 *RECEIPT FROM ${storeName.toUpperCase()}*\n`;
    text += `Order: #${order.id} | Date: ${formatDate(order.date, 'short')}\n`;
    text += `Customer: ${order.customerName}\n`;
    text += `--------------------------------\n`;

    order.items?.forEach((item) => {
      text += `${item.name}\n${item.quantity} x ${cur}${item.price} = ${cur}${item.price * item.quantity}\n`;
    });

    text += `--------------------------------\n`;
    text += `Subtotal: ${cur}${order.subtotal}\n`;
    if (order.discount > 0) {
      text += `Discount: -${cur}${order.discount}\n`;
    }
    text += `*TOTAL PAID: ${cur}${order.total}* (${order.paymentMethod})\n\n`;
    text += `Thank you for shopping with us! Have a great day 😊`;

    const encoded = encodeURIComponent(text);
    const customerPhone = order.customerPhone ? order.customerPhone.replace(/[^0-9]/g, '') : '';
    const url = customerPhone 
      ? `https://wa.me/${customerPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(url, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="POS Thermal Receipt"
      subtitle={`Order #${order.id} • ${order.paymentMethod}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Thermal Paper Container */}
        <div 
          id="thermal-receipt" 
          className="bg-white p-6 rounded-2xl border border-dashed border-[#D2CCBC] font-mono text-xs text-slate-800 shadow-sm max-w-sm mx-auto"
        >
          {/* Receipt Store Header */}
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h3 className="font-bold text-base tracking-tight text-slate-900">{storeName}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">{address}</p>
            <p className="text-[10px] text-slate-500">Ph: {phone} • GSTIN: 29AABCT1332M1Z</p>
            <div className="mt-2 text-[11px] font-bold text-slate-700 bg-slate-100 py-0.5 rounded">
              RETAIL TAX INVOICE
            </div>
          </div>

          {/* Receipt Info */}
          <div className="py-2.5 text-[11px] space-y-0.5 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span>Order #:</span>
              <span className="font-bold">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{formatDate(order.date, 'full')}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-bold">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Cashier / POS:</span>
              <span>Nihar Puthran</span>
            </div>
          </div>

          {/* Itemized Lines */}
          <div className="py-2.5 space-y-2 border-b border-dashed border-slate-300">
            <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase">
              <span>Item Description</span>
              <span>Qty x Price</span>
              <span>Amount</span>
            </div>
            {order.items?.map((item, i) => (
              <div key={i} className="text-[11px]">
                <div className="font-bold text-slate-900 truncate">{item.name}</div>
                <div className="flex justify-between text-slate-600 text-[10px]">
                  <span>{item.quantity} × {formatCurrency(item.price, currency)}</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(item.price * item.quantity, currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="py-2.5 space-y-1 border-b border-dashed border-slate-300 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal, currency)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount Applied:</span>
                <span>-{formatCurrency(order.discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>NET TOTAL:</span>
              <span>{formatCurrency(order.total, currency)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
              <span>Payment Mode:</span>
              <span className="font-bold text-slate-800">{order.paymentMethod} (SUCCESS)</span>
            </div>
          </div>

          {/* Barcode Mock */}
          <div className="pt-3 text-center">
            <div className="font-mono tracking-widest text-xs text-slate-400">
              ||| | |||| | || |||| | ||| | |||
            </div>
            <p className="text-[9px] text-slate-500 mt-0.5">#{order.id}</p>
            <p className="text-[10px] font-bold text-slate-700 mt-2">
              *** THANK YOU FOR SHOPPING WITH US! ***
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleWhatsAppShare}
            className="flex-1 btn-secondary text-xs font-bold py-2.5 flex items-center justify-center gap-2 bg-[#E4F5E9] text-[#156B3A] hover:bg-[#D0EED8] min-h-[44px]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send WhatsApp Receipt</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 btn-primary text-xs font-bold py-2.5 flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal Receipt</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
