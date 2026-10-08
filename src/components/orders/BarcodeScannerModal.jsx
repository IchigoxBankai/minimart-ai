// MiniMart AI - Camera & Simulated Barcode / QR Code Scanner Component

import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, Zap, Scan, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { playScannerBeep } from '../../utils/sound';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';

export const BarcodeScannerModal = ({ isOpen, onClose, onProductScanned }) => {
  const { products, currency } = useStore();
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setScannedProduct(null);
      setManualCode('');
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError('');
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } else {
        setCameraError('Camera access not supported in this browser. Use simulated scanner below.');
      }
    } catch (err) {
      setCameraError('Camera permission denied or camera unavailable. You can click any sample barcode below to simulate scanning!');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleScanSuccess = (prod) => {
    playScannerBeep();
    setScannedProduct(prod);
    if (onProductScanned) {
      onProductScanned(prod);
    }
    setTimeout(() => {
      setScannedProduct(null);
    }, 1500);
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    const clean = manualCode.trim().toLowerCase();
    const found = products.find(
      (p) => p.sku.toLowerCase() === clean || p.name.toLowerCase().includes(clean)
    );
    if (found) {
      handleScanSuccess(found);
      setManualCode('');
    } else {
      alert('No product found with this barcode or SKU.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Barcode & SKU Scanner"
      subtitle="Point camera at product barcode or tap quick test barcodes"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Scanner Viewport */}
        <div className="relative w-full h-56 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-[#1F6B4F]">
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4 text-slate-400">
              <Camera className="w-10 h-10 mx-auto mb-2 text-[#1F6B4F] opacity-80 animate-pulse" />
              <p className="text-xs text-slate-300">Scanner Viewport Active</p>
              {cameraError && (
                <p className="text-[11px] text-amber-400 mt-1 max-w-xs">{cameraError}</p>
              )}
            </div>
          )}

          {/* Animated Red Laser Scanning Line */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse" />

          {/* Target Reticle */}
          <div className="absolute inset-8 border-2 border-white/40 rounded-xl pointer-events-none flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest font-mono text-white/70 bg-black/50 px-2 py-0.5 rounded">
              Align Barcode
            </span>
          </div>

          {/* Success Flash Overlay */}
          {scannedProduct && (
            <div className="absolute inset-0 bg-[#1F6B4F]/90 backdrop-blur-xs flex flex-col items-center justify-center text-white animate-fade-in p-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#F2A93B] mb-2 animate-bounce" />
              <p className="font-display font-bold text-lg">{scannedProduct.name}</p>
              <p className="text-xs text-[#DCEBDD]">
                Added to cart • {formatCurrency(scannedProduct.sellingPrice, currency)}
              </p>
            </div>
          )}
        </div>

        {/* Manual Barcode / SKU Input */}
        <form onSubmit={handleManualSearch} className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Type SKU or barcode (e.g. BEV-CC-750)..."
            className="input-field text-xs font-mono flex-1"
          />
          <button type="submit" className="btn-primary text-xs font-bold px-4">
            Scan Code
          </button>
        </form>

        {/* Quick Test Barcode Buttons */}
        <div>
          <p className="text-xs font-bold text-[#697A71] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
            <span>1-Click Test Scanners</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {products.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleScanSuccess(p)}
                className="p-2.5 rounded-xl bg-[#FAF8F3] hover:bg-[#EAF3ED] border border-[#E3DFD5] hover:border-[#1F6B4F] text-left transition-all flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E3DFD5] flex items-center justify-center text-[#1F6B4F]">
                  <Scan className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1E2521] group-hover:text-[#1F6B4F] truncate">
                    {p.name}
                  </p>
                  <p className="text-[10px] font-mono text-[#8A9A90] truncate">
                    {p.sku}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-[#EFECE2] text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full btn-outline text-xs font-bold"
          >
            Done Scanning
          </button>
        </div>
      </div>
    </Modal>
  );
};
