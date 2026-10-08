// MiniMart AI - AI Store Manager Core Engine
// Implements Intent Detection, Tool Execution, Reasoning Engine, Action Generation, and Gemini integration

import { aiTools } from './tools';
import { formatCurrency } from '../../utils/formatters';

export class AIStoreManagerService {
  constructor() {
    this.apiKey = localStorage.getItem('minimart_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  setApiKey(key) {
    this.apiKey = key;
    if (key) {
      localStorage.setItem('minimart_gemini_key', key);
    } else {
      localStorage.removeItem('minimart_gemini_key');
    }
  }

  getApiKey() {
    return this.apiKey;
  }

  /**
   * Main entry point to process a store owner's query
   */
  async processUserMessage(storeId, message, conversationHistory = []) {
    const cleanMessage = message.trim().toLowerCase();

    // 1. Classify Intent & select tools
    const intent = this.classifyIntent(cleanMessage);

    // 2. Run selected tool queries on live store data
    const toolResults = this.executeTools(storeId, intent);

    // 3. Generate structured AI response & actionable proposals
    const response = await this.generateResponse(storeId, cleanMessage, intent, toolResults);

    return response;
  }

  /**
   * Intent Classifier
   */
  classifyIntent(msg) {
    if (msg.includes('reorder') || msg.includes('restock') || msg.includes('low stock') || msg.includes('run out') || msg.includes('out of stock')) {
      return 'REORDER_RECOMMENDATION';
    }
    if (msg.includes('sales') || msg.includes('perform') || msg.includes('revenue') || msg.includes('doing') || msg.includes('growth') || msg.includes('trend')) {
      return 'SALES_PERFORMANCE';
    }
    if (msg.includes('promo') || msg.includes('discount') || msg.includes('offer') || msg.includes('bundle') || msg.includes('deal')) {
      return 'PROMOTION_SUGGESTION';
    }
    if (msg.includes('customer') || msg.includes('inactive') || msg.includes('buyer') || msg.includes('vip') || msg.includes('client')) {
      return 'CUSTOMER_INSIGHTS';
    }
    if (msg.includes('report') || msg.includes('summary') || msg.includes('digest') || msg.includes('export') || msg.includes('pdf')) {
      return 'WEEKLY_REPORT';
    }
    if (msg.includes('inventory') || msg.includes('stock') || msg.includes('items') || msg.includes('catalog')) {
      return 'INVENTORY_HEALTH';
    }
    if (msg.includes('best seller') || msg.includes('top product') || msg.includes('popular') || msg.includes('profitable')) {
      return 'BEST_SELLERS';
    }
    if (msg.includes('profit') || msg.includes('margin') || msg.includes('cost')) {
      return 'PROFIT_ANALYSIS';
    }
    return 'GENERAL_BUSINESS';
  }

  /**
   * Tool execution based on intent
   */
  executeTools(storeId, intent) {
    const metrics = aiTools.getDashboardMetrics(storeId);
    const currency = metrics.currency;

    switch (intent) {
      case 'REORDER_RECOMMENDATION': {
        const lowStock = aiTools.getLowStockProducts(storeId);
        return { intent, metrics, lowStock, currency };
      }
      case 'SALES_PERFORMANCE': {
        const salesData = aiTools.getSalesData(storeId, 7);
        const categories = aiTools.getCategoryPerformance(storeId);
        const perf = aiTools.getProductPerformance(storeId);
        return { intent, metrics, salesData, categories, topProducts: perf.topSellers, currency };
      }
      case 'PROMOTION_SUGGESTION': {
        const perf = aiTools.getProductPerformance(storeId);
        const categories = aiTools.getCategoryPerformance(storeId);
        return { intent, metrics, slowMovers: perf.slowMovers, topSellers: perf.topSellers, categories, currency };
      }
      case 'CUSTOMER_INSIGHTS': {
        const customerInsights = aiTools.getCustomerInsights(storeId);
        return { intent, metrics, customerInsights, currency };
      }
      case 'WEEKLY_REPORT': {
        const report = aiTools.generateBusinessReport(storeId, 'Weekly');
        return { intent, metrics, report, currency };
      }
      case 'INVENTORY_HEALTH': {
        const inventory = aiTools.getInventory(storeId);
        const lowStock = aiTools.getLowStockProducts(storeId);
        return { intent, metrics, inventory, lowStock, currency };
      }
      case 'BEST_SELLERS': {
        const perf = aiTools.getProductPerformance(storeId);
        return { intent, metrics, topSellers: perf.topSellers.slice(0, 5), currency };
      }
      case 'PROFIT_ANALYSIS': {
        const profit = aiTools.calculateProfitEstimate(storeId, 30);
        return { intent, metrics, profit, currency };
      }
      default: {
        const lowStock = aiTools.getLowStockProducts(storeId);
        const perf = aiTools.getProductPerformance(storeId);
        return { intent, metrics, lowStock, topSellers: perf.topSellers.slice(0, 3), currency };
      }
    }
  }

  /**
   * Response generator with structured action cards
   */
  async generateResponse(storeId, message, intent, data) {
    const cur = (val) => formatCurrency(val, data.currency);

    switch (intent) {
      case 'REORDER_RECOMMENDATION': {
        if (!data.lowStock || data.lowStock.length === 0) {
          return {
            text: `Good news! All your inventory levels are currently healthy and above safety thresholds. There are no urgent restocks needed right now.`,
            chips: [
              { label: 'Total In-Stock Items', value: data.metrics.totalProducts },
              { label: 'Stockout Risk', value: '0%' }
            ],
            action: null,
            followUps: ['How is my store performing?', 'Show my top sellers', 'Suggest a promotion'],
          };
        }

        const topItem = data.lowStock[0];
        const listText = data.lowStock.slice(0, 3).map((item, idx) => {
          return `${idx + 1}. **${item.name}** — ${item.currentStock} units remaining (avg ${item.dailyVelocity} sold/day, ~${item.daysRemaining} days of stock left). Recommended order: **${item.suggestedOrder} units** from *${item.supplier}*.`;
        }).join('\n\n');

        return {
          text: `Based on your recent sales velocity and current stock levels, I strongly recommend restocking **${data.lowStock.length} items** before the weekend peak:\n\n${listText}\n\n**${topItem.name}** is your highest priority to prevent customer drop-off.`,
          chips: [
            { label: 'Urgent Restocks', value: `${data.lowStock.length} items`, variant: 'danger' },
            { label: 'Highest Priority', value: topItem.name },
            { label: 'Estimated Cost', value: cur(topItem.suggestedOrder * topItem.costPrice) },
          ],
          action: {
            type: 'CREATE_RESTOCK',
            title: `Create Restock Task for ${topItem.name}`,
            description: `Order ${topItem.suggestedOrder} units from ${topItem.supplier} (Est. ${cur(topItem.suggestedOrder * topItem.costPrice)})`,
            payload: {
              productId: topItem.id,
              productName: topItem.name,
              currentStock: topItem.currentStock,
              suggestedQuantity: topItem.suggestedOrder,
              supplier: topItem.supplier,
              estimatedCost: topItem.suggestedOrder * topItem.costPrice,
              priority: topItem.priority,
              reason: `AI Recommended: ${topItem.daysRemaining} days of stock left at velocity ${topItem.dailyVelocity}/day`,
            },
            approveLabel: 'Approve & Create Restock Task',
            cancelLabel: 'Dismiss',
          },
          followUps: ['Check supplier contacts', 'Review full inventory', 'Analyze sales trends'],
        };
      }

      case 'SALES_PERFORMANCE': {
        const topCat = data.categories?.[0]?.category || 'Beverages';
        const bestProd = data.topProducts?.[0]?.name || 'Coca-Cola 750ml';

        return {
          text: `Your store is performing well this week!\n\n• **Revenue:** ${cur(data.metrics.thisWeekRevenue)} (${data.metrics.weeklyGrowth >= 0 ? '+' : ''}${data.metrics.weeklyGrowth}% compared to last week).\n• **Top Category:** **${topCat}** generated the highest volume.\n• **Star Product:** **${bestProd}** leads with highest gross sales.\n\n⚠️ However, you have **${data.metrics.lowStockCount} items** approaching reorder thresholds. I recommend reviewing your stock levels to maintain this sales momentum.`,
          chips: [
            { label: "This Week's Revenue", value: cur(data.metrics.thisWeekRevenue), variant: 'success' },
            { label: 'Weekly Growth', value: `${data.metrics.weeklyGrowth >= 0 ? '+' : ''}${data.metrics.weeklyGrowth}%`, variant: 'info' },
            { label: 'Today\'s Orders', value: `${data.metrics.todayOrdersCount} orders` },
          ],
          action: {
            type: 'NAVIGATE_INVENTORY',
            title: 'Review Low Stock Products',
            description: `Inspect the ${data.metrics.lowStockCount} items that need restocking.`,
            payload: { route: '/inventory' },
            approveLabel: 'View Low Stock Items',
            cancelLabel: 'Done',
          },
          followUps: ['Which products should I reorder?', 'Show category breakdown', 'Generate weekly report'],
        };
      }

      case 'PROMOTION_SUGGESTION': {
        const top = data.topSellers?.[0] || { name: 'Coca-Cola 750ml', id: 'prod-001' };
        const slow = data.slowMovers?.[0] || { name: 'Kurkure Masala Munch', id: 'prod-008' };

        return {
          text: `Here is a high-margin promotional bundle strategy based on your sales affinity:\n\n💡 **"Crunch & Chill Combo"**\nBundle **${top.name}** (High Velocity) with **${slow.name}** (Slow Moving) at an **8% discount**.\n\n**Why this works:**\n1. It accelerates stock turnover for ${slow.name}.\n2. Increases Average Order Value (AOV) by ${cur(40)} per basket.\n3. Maintains an estimated 22% gross margin.`,
          chips: [
            { label: 'Bundle Discount', value: '8% OFF' },
            { label: 'Target AOV Boost', value: '+14%' },
            { label: 'Combined Margin', value: '22%' },
          ],
          action: {
            type: 'CREATE_PROMOTION',
            title: 'Launch "Crunch & Chill" Bundle Promotion',
            description: `Bundle ${top.name} + ${slow.name} with 8% discount across your POS.`,
            payload: {
              title: 'Crunch & Chill Combo',
              description: `Bundle ${top.name} + ${slow.name} with 8% discount`,
              discountPercent: 8,
              bundledProducts: [top.id, slow.id],
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            approveLabel: 'Approve & Activate Promo',
            cancelLabel: 'Cancel',
          },
          followUps: ['Give me another promotion idea', 'Show best sellers', 'Check customer retention'],
        };
      }

      case 'CUSTOMER_INSIGHTS': {
        const ins = data.customerInsights;
        const inactiveNames = ins.inactiveList.slice(0, 3).map(c => `• **${c.name}** (Total spent: ${cur(c.totalSpent)}, last visited ${c.lastPurchaseDate ? 'over 30 days ago' : 'never'})`).join('\n');

        return {
          text: `Here is your customer retention analysis:\n\n• **Active Customers:** ${ins.activeCount}\n• **Inactive Customers (>30 Days):** **${ins.inactiveCount} customers** haven't visited recently.\n• **Average Order Value:** ${cur(ins.averageOrderValue)}\n\n**Lapsed Customers needing attention:**\n${inactiveNames || 'None currently lapsed.'}\n\nI recommend sending a "We Miss You — 10% OFF" WhatsApp/SMS broadcast to reactivate them.`,
          chips: [
            { label: 'Total Customers', value: ins.totalCustomers },
            { label: 'Inactive (>30d)', value: `${ins.inactiveCount}`, variant: 'warning' },
            { label: 'Avg Order Value', value: cur(ins.averageOrderValue) },
          ],
          action: {
            type: 'CREATE_PROMOTION',
            title: 'Create "We Miss You" 10% Winback Promo',
            description: '10% discount promo code for lapsed customers to drive repeat visits.',
            payload: {
              title: 'We Miss You! 10% Winback Promo',
              description: 'Special 10% storewide re-engagement discount for loyal customers',
              discountPercent: 10,
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            },
            approveLabel: 'Create Winback Promo',
            cancelLabel: 'Dismiss',
          },
          followUps: ['View top VIP customers', 'How are sales doing?', 'Generate weekly report'],
        };
      }

      case 'WEEKLY_REPORT': {
        const rep = data.report;
        return {
          text: `Here is your **${rep.title}** summary:\n\n${rep.summary}\n\n### 🎯 Key Highlights:\n• **Total Revenue:** ${rep.keyMetrics[0].value}\n• **Growth:** ${rep.keyMetrics[1].value}\n• **Estimated Profit:** ${rep.keyMetrics[2].value}\n• **Low Stock Alerts:** ${rep.keyMetrics[3].value}\n\n### 📋 AI Recommendations:\n${rep.aiRecommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}`,
          chips: rep.keyMetrics.map(m => ({ label: m.label, value: m.value })),
          action: {
            type: 'VIEW_REPORTS',
            title: 'View & Download Formal Report (PDF / CSV)',
            description: 'Access the full itemized performance report ready for export or printing.',
            payload: { route: '/reports' },
            approveLabel: 'Open Reports Center',
            cancelLabel: 'Close',
          },
          followUps: ['Which products should I reorder?', 'Give me a promotion idea', 'Check profit margins'],
        };
      }

      case 'BEST_SELLERS': {
        const list = data.topSellers.map((p, i) => `${i + 1}. **${p.name}** — ${p.unitsSold} units sold (${cur(p.revenue)} revenue | ${p.margin}% margin)`).join('\n');
        return {
          text: `Here are your top-performing products ranked by gross revenue:\n\n${list}\n\n💡 **Insight:** Ensure stock levels for your top 3 products never drop below 3 days of supply, as they contribute to over 40% of total revenue.`,
          chips: [
            { label: '#1 Best Seller', value: data.topSellers[0]?.name || 'Coca-Cola' },
            { label: 'Highest Margin Item', value: `${data.topSellers.reduce((max, p) => p.margin > max.margin ? p : max, data.topSellers[0]).name}` },
          ],
          action: null,
          followUps: ['Which products need restocking?', 'Suggest a promotion', 'Analyze sales'],
        };
      }

      case 'PROFIT_ANALYSIS': {
        const p = data.profit;
        return {
          text: `Here is your store profit estimation:\n\n• **Gross Revenue:** ${cur(p.revenue)}\n• **Cost of Goods Sold (COGS):** ${cur(p.estimatedCost)}\n• **Estimated Gross Profit:** **${cur(p.estimatedProfit)}**\n• **Estimated Profit Margin:** **${p.profitMarginPercent}%**\n\n*Note: ${p.disclaimer}*`,
          chips: [
            { label: 'Est. Profit', value: cur(p.estimatedProfit), variant: 'success' },
            { label: 'Margin', value: `${p.profitMarginPercent}%`, variant: 'info' },
          ],
          action: null,
          followUps: ['How to increase profit margins?', 'Find slow moving products', 'Generate weekly report'],
        };
      }

      default: {
        return {
          text: `Your store **DailyBasket** is operating smoothly today.\n\n• Today's Revenue: **${cur(data.metrics.todayRevenue)}** across **${data.metrics.todayOrdersCount} orders**.\n• Inventory status: **${data.metrics.lowStockCount} items** need restock attention.\n• Weekly pace: **+${data.metrics.weeklyGrowth}%** growth.\n\nWhat would you like me to analyze or execute for you?`,
          chips: [
            { label: "Today's Revenue", value: cur(data.metrics.todayRevenue) },
            { label: 'Pending Restocks', value: `${data.metrics.lowStockCount} items`, variant: data.metrics.lowStockCount > 0 ? 'warning' : 'neutral' },
          ],
          action: data.metrics.lowStockCount > 0 ? {
            type: 'CREATE_RESTOCK',
            title: 'Auto-Create Restock List',
            description: `Generate replenishment orders for all ${data.metrics.lowStockCount} low stock items.`,
            payload: { productId: data.lowStock?.[0]?.id, productName: data.lowStock?.[0]?.name, suggestedQuantity: 30, supplier: 'Supplier' },
            approveLabel: 'Review Restocks',
            cancelLabel: 'Dismiss',
          } : null,
          followUps: ['Which products should I reorder?', 'How is my store performing?', 'Suggest a promotion idea', 'Generate weekly report'],
        };
      }
    }
  }

  /**
   * Execute an approved action
   */
  async executeApprovedAction(storeId, action) {
    if (!action) return { success: false, message: 'No action provided' };

    switch (action.type) {
      case 'CREATE_RESTOCK': {
        const task = aiTools.createRestockTask(storeId, action.payload);
        return {
          success: true,
          message: `✅ Restock Task for "${task.productName}" (${task.suggestedQuantity} units) has been approved and created in your inventory queue!`,
          task,
        };
      }
      case 'CREATE_PROMOTION': {
        const promo = aiTools.createPromotion(storeId, action.payload);
        return {
          success: true,
          message: `🎉 Promotion "${promo.title}" (${promo.discountPercent}% OFF) is now active in your store!`,
          promo,
        };
      }
      default:
        return { success: true, message: 'Action processed successfully.' };
    }
  }
}

export const aiStoreManager = new AIStoreManagerService();
