// MiniMart AI - Business Reports & Real PDF / CSV Export Page

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  Boxes, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet,
  Eye
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { aiTools } from '../services/ai/tools';
import { Modal } from '../components/ui/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ReportsPage = () => {
  const { profile, currency, products, orders, customers } = useStore();
  const { showToast } = useToast();

  const [selectedReportType, setSelectedReportType] = useState('Weekly'); // Daily, Weekly, Monthly, Inventory, Customer
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const storeId = profile?.storeId;

  // Report Generator
  const reportData = useMemo(() => {
    return aiTools.generateBusinessReport(storeId, selectedReportType);
  }, [storeId, selectedReportType]);

  // Export PDF with jsPDF and AutoTable
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const storeName = profile?.storeName || 'DailyBasket Supermart';
      const cur = currency === 'INR' ? 'Rs.' : '$';

      // Header Brand
      doc.setFillColor(31, 107, 79); // Primary green
      doc.rect(0, 0, 210, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(`MiniMart AI — ${selectedReportType} Report`, 14, 15);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(storeName, 150, 15);

      // Metadata
      doc.setTextColor(30, 37, 33);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 32);
      doc.text(`Store Owner: ${profile?.ownerName || 'Store Owner'} | Category: ${profile?.businessType || 'Retail'}`, 14, 38);

      // Executive Summary
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary:', 14, 48);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const splitSummary = doc.splitTextToSize(reportData.summary, 180);
      doc.text(splitSummary, 14, 54);

      // Key Metrics Table
      const metricsRows = reportData.keyMetrics.map(m => [m.label, m.value]);
      autoTable(doc, {
        startY: 68,
        head: [['Key Performance Metric', 'Recorded Value']],
        body: metricsRows,
        theme: 'striped',
        headStyles: { fillColor: [31, 107, 79], textColor: [255, 255, 255] },
        styles: { fontSize: 9 },
      });

      // Top Products Table
      const finalY = doc.lastAutoTable?.finalY || 110;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Top Revenue Generating Products:', 14, finalY + 10);

      const productRows = reportData.topProducts.map(p => [
        p.name,
        p.category,
        `${p.unitsSold} units`,
        `${cur} ${p.revenue.toLocaleString()}`,
        `${p.margin}%`,
      ]);

      autoTable(doc, {
        startY: finalY + 14,
        head: [['Product Name', 'Category', 'Units Sold', 'Gross Revenue', 'Gross Margin']],
        body: productRows,
        theme: 'grid',
        headStyles: { fillColor: [66, 81, 73], textColor: [255, 255, 255] },
        styles: { fontSize: 8 },
      });

      // AI Recommendations
      const nextY = doc.lastAutoTable?.finalY || 180;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('AI Store Manager Strategic Action Items:', 14, nextY + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      reportData.aiRecommendations.forEach((rec, idx) => {
        doc.text(`${idx + 1}. ${rec}`, 14, nextY + 17 + (idx * 6));
      });

      // Save PDF
      doc.save(`MiniMart-${selectedReportType}-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
      showToast('Downloaded official PDF business report! 📄', 'success');
    } catch (e) {
      console.error('PDF error', e);
      showToast('Error generating PDF', 'error');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    try {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += `MiniMart AI - ${selectedReportType} Business Report\n`;
      csvContent += `Store: ${profile?.storeName || 'Store'}\n`;
      csvContent += `Generated: ${new Date().toISOString()}\n\n`;

      csvContent += 'KEY METRICS\n';
      reportData.keyMetrics.forEach(m => {
        csvContent += `"${m.label}","${m.value}"\n`;
      });

      csvContent += '\nTOP PRODUCTS\n';
      csvContent += 'Name,Category,Units Sold,Revenue,Margin\n';
      reportData.topProducts.forEach(p => {
        csvContent += `"${p.name}","${p.category}",${p.unitsSold},${p.revenue},${p.margin}%\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `MiniMart-${selectedReportType}-Report-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Exported CSV spreadsheet! 📊', 'success');
    } catch (e) {
      showToast('Error exporting CSV', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E2521] tracking-tight">
            Executive Business Reports
          </h2>
          <p className="text-sm text-[#697A71] mt-1">
            Generate formal summaries, printable digests, and exportable financial audits.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="btn-outline text-xs font-bold px-3.5 py-2 min-h-[42px] flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#1F6B4F]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="btn-primary text-xs font-bold px-4 py-2 min-h-[42px] shadow-sm shadow-[#1F6B4F]/20 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* Report Types Selector Pills */}
      <div className="card p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'Daily', label: 'Daily Sales Report' },
            { id: 'Weekly', label: 'Weekly Business Digest' },
            { id: 'Monthly', label: 'Monthly Financial Audit' },
            { id: 'Inventory', label: 'Inventory Health Report' },
            { id: 'Customer', label: 'Customer Retention Audit' },
          ].map((rep) => (
            <button
              key={rep.id}
              onClick={() => setSelectedReportType(rep.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[40px] ${
                selectedReportType === rep.id
                  ? 'bg-[#1F6B4F] text-white shadow-xs'
                  : 'bg-[#F2EFE7] text-[#526259] hover:bg-[#EAE6DB]'
              }`}
            >
              {rep.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Viewer Container */}
      <div className="card p-6 sm:p-8 space-y-6 bg-white border-[#E3DFD5] shadow-card">
        {/* Report Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#EFECE2] gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3ED] text-[#1F6B4F] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
              <span>AI Certified Store Report</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl text-[#1E2521]">
              {reportData.title}
            </h3>
            <p className="text-xs text-[#697A71] mt-1">
              Store: <strong>{profile?.storeName || 'DailyBasket Supermart'}</strong> • Owner: {profile?.ownerName || 'Store Owner'}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-[#8A9A90]">Generated:</span>
            <p className="text-xs font-bold text-[#1E2521]">
              {formatDate(reportData.generatedAt, 'full')}
            </p>
          </div>
        </div>

        {/* Executive Summary Paragraph */}
        <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E4D9]">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#697A71] mb-1.5">
            Executive Summary
          </h4>
          <p className="text-sm text-[#1E2521] leading-relaxed">
            {reportData.summary}
          </p>
        </div>

        {/* 4 Key Metrics */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#697A71] mb-3">
            Key Performance Indicators
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {reportData.keyMetrics.map((m, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-[#E8E4D9] shadow-soft">
                <p className="text-xs text-[#697A71]">{m.label}</p>
                <p className="font-display font-bold text-xl sm:text-2xl text-[#1E2521] mt-1">
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Product Table */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#697A71] mb-3">
            Department & Product Contribution
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-[#E8E4D9]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF8F3] text-xs font-bold text-[#697A71] uppercase border-b border-[#EBE7DC]">
                <tr>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Units Sold</th>
                  <th className="py-3 px-4">Revenue</th>
                  <th className="py-3 px-4 text-right">Gross Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EFE7]">
                {reportData.topProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-bold text-[#1E2521]">{p.name}</td>
                    <td className="py-3 px-4 text-xs text-[#697A71]">{p.category}</td>
                    <td className="py-3 px-4 font-semibold text-[#1E2521]">{p.unitsSold} units</td>
                    <td className="py-3 px-4 font-bold text-[#1F6B4F]">
                      {formatCurrency(p.revenue, currency)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#1E2521]">
                      {p.margin}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#EAF3ED] to-[#FAF8F3] border border-[#CFE4D5] space-y-3">
          <div className="flex items-center gap-2 text-[#1F6B4F] font-bold text-sm">
            <Sparkles className="w-4 h-4 text-[#F2A93B]" />
            <span>AI Store Manager Strategic Action Recommendations</span>
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-[#1E2521]">
            {reportData.aiRecommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#1F6B4F] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="leading-snug">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Print / Download Quick Actions */}
        <div className="pt-4 border-t border-[#EFECE2] flex items-center justify-between">
          <span className="text-xs text-[#8A9A90]">
            Format compliant with standard retail accounting ledgers.
          </span>
          <button
            onClick={() => window.print()}
            className="btn-outline text-xs font-bold px-3 py-2 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
