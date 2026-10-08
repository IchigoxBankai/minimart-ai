// MiniMart AI - AI Insights Carousel Dashboard Component

import React from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Lightbulb, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';

export const AIInsightsCarousel = ({ onOpenAIMessage }) => {
  const { products, orders, customers, metrics, currency } = useStore();

  const lowStock = products.filter((p) => p.stock <= p.reorderLevel);
  const inactiveCust = customers.filter((c) => c.status === 'Inactive');

  const insights = [
    {
      id: 'low-stock-alert',
      type: 'warning',
      icon: AlertTriangle,
      tag: 'Low Stock Alert',
      title: `${lowStock[0]?.name || 'Fast seller'} is depleting quickly`,
      description: `${lowStock.length} products are below safe thresholds. High risk of stockout before weekend peak.`,
      prompt: 'Which products should I reorder right now?',
      iconBg: 'bg-[#FEF6E8]',
      iconColor: 'text-[#B06B08]',
    },
    {
      id: 'sales-opportunity',
      type: 'opportunity',
      icon: TrendingUp,
      tag: 'Sales Opportunity',
      title: 'Beverages are driving 38% of total revenue',
      description: 'Consider running a combo bundle with Snacks to increase average basket size by 15%.',
      prompt: 'Suggest a high-margin promotion idea for Beverages and Snacks.',
      iconBg: 'bg-[#EAF3ED]',
      iconColor: 'text-[#1F6B4F]',
    },
    {
      id: 'customer-insight',
      type: 'retention',
      icon: Users,
      tag: 'Customer Insight',
      title: `${inactiveCust.length || 3} customers haven't purchased in 30+ days`,
      description: 'Re-engage lapsed shoppers with a special 10% winback promo code on WhatsApp/SMS.',
      prompt: 'Which customers haven\'t purchased recently and need re-engagement?',
      iconBg: 'bg-[#EBF3FC]',
      iconColor: 'text-[#1965B8]',
    },
    {
      id: 'ai-recommendation',
      type: 'recommendation',
      icon: Lightbulb,
      tag: 'AI Recommendation',
      title: 'Store pacing +12.4% vs previous week',
      description: 'Overall gross profit margin is estimated at 28.5%. View full weekly business digest.',
      prompt: 'Generate my weekly business performance report.',
      iconBg: 'bg-[#FEF6E8]',
      iconColor: 'text-[#F2A93B]',
    },
  ];

  return (
    <div className="card p-5 sm:p-6 bg-gradient-to-br from-white via-white to-[#F6FBF8] border-[#CFE4D5]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-[#E8EFEA]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1F6B4F] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-[#F2A93B]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-[#1E2521]">
              AI Store Manager Insights
            </h3>
            <p className="text-xs text-[#697A71]">Real-time intelligence from your store data</p>
          </div>
        </div>
        <button
          onClick={() => onOpenAIMessage('How is my store performing today?')}
          className="btn-primary text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 min-h-[36px]"
        >
          <span>Ask AI Store Manager</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {insights.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onOpenAIMessage(card.prompt)}
              className="p-4 rounded-2xl bg-white border border-[#E4EBE6] hover:border-[#1F6B4F]/40 hover:shadow-card hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className={`p-1.5 rounded-lg ${card.iconBg} ${card.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#697A71]">
                    {card.tag}
                  </span>
                </div>
                <h4 className="font-display font-bold text-sm text-[#1E2521] group-hover:text-[#1F6B4F] transition-colors leading-snug">
                  {card.title}
                </h4>
                <p className="text-xs text-[#526259] leading-relaxed mt-1.5">
                  {card.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-bold text-[#1F6B4F]">
                <span>Ask AI Co-pilot</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
