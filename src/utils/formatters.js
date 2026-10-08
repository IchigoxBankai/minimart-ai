// Utility formatters for MiniMart AI

export const formatCurrency = (amount, currency = 'INR') => {
  const num = Number(amount) || 0;
  
  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'AED ',
    CAD: 'C$',
    AUD: 'A$',
  };

  const symbol = currencySymbols[currency] || '₹';

  if (currency === 'INR') {
    return `${symbol}${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }

  return `${symbol}${num.toLocaleString('en-US', {
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatDate = (dateInput, format = 'medium') => {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';

  if (format === 'relative') {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (format === 'short') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (format === 'time') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  if (format === 'full') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatNumber = (value) => {
  const num = Number(value) || 0;
  return num.toLocaleString('en-US');
};

export const formatPercentage = (value, includePlus = true) => {
  const num = Number(value) || 0;
  const sign = num > 0 && includePlus ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
};

export const calculateGrowth = (current, previous) => {
  if (!previous || previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
