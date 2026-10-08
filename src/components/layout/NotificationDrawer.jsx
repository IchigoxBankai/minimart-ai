// MiniMart AI - Notifications Center Dropdown & Mobile Panel

import React from 'react';
import { 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  X,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatDate } from '../../utils/formatters';

export const NotificationDrawer = ({ onClose, onNavigate }) => {
  const { notifications, markNotificationRead } = useStore();

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#F2A93B]" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#1F6B4F]" />;
      default:
        return <Info className="w-4 h-4 text-[#1F6B4F]" />;
    }
  };

  const handleItemClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.link) {
      onNavigate(notif.link);
    }
  };

  return (
    <div 
      className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-dropdown border border-[#E6E2D8] p-4 z-50 animate-slide-up"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#1F6B4F]" />
          <h3 className="font-bold text-sm text-[#1E2521]">Store Alerts</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => markNotificationRead('ALL')}
            className="text-[11px] font-semibold text-[#1F6B4F] hover:underline flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="p-1 text-[#697A71] hover:text-[#1E2521] rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-[#F4F1E8] max-h-80 overflow-y-auto my-2">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#697A71]">
            No notifications at the moment.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={`p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 text-left hover:bg-[#FAF8F3] ${
                !notif.read ? 'bg-[#FAF8F3]/70 font-medium' : 'opacity-80'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-[#EAF3ED] flex-shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-[#1E2521] truncate">{notif.title}</p>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#1F6B4F] flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[#526259] leading-snug line-clamp-2 mt-0.5">
                  {notif.message}
                </p>
                <p className="text-[10px] text-[#8A9A90] mt-1">
                  {formatDate(notif.timestamp, 'relative')}
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#A1AEA7] flex-shrink-0 self-center" />
            </div>
          ))
        )}
      </div>

      <div className="pt-2 border-t border-[#F0ECE1] text-center">
        <button
          onClick={() => onNavigate('/reports')}
          className="text-xs font-semibold text-[#1F6B4F] hover:underline flex items-center justify-center gap-1.5 mx-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
          View AI Insights & Digests
        </button>
      </div>
    </div>
  );
};
