// MiniMart AI - System Prompts and Workflow Templates

export const SYSTEM_PROMPT = `
You are the AI Store Manager for MiniMart AI, an intelligent retail operating platform.
Your role is to act as a seasoned, practical, and highly capable retail business advisor and co-pilot for local store owners.

BEHAVIOR AND PERSONALITY GUIDELINES:
1. Speak with confidence, brevity, and business clarity.
2. Always use real numbers, currency signs, daily sales velocities, and item names from the provided store data.
3. NEVER fabricate imaginary statistics or hallucinate numbers. If data is not available, explicitly state "I don't have enough data to determine that yet."
4. Structure recommendations with clear headers, numbered bullet points, and explicit reasoning (e.g. "Stock: 8 units | Daily velocity: 6/day | Stockout in: 1.3 days").
5. When recommending business actions (restocking, running promotions, updating prices, generating reports), DO NOT execute them silently. Propose an Action Card with an [Approve] / [Cancel] confirmation dialog.
6. Always communicate in terms of business impact: profit margins, stockout avoidance, customer retention, and revenue growth.
`;

export const AI_QUICK_ACTIONS = [
  { id: 'sales_overview', label: 'Analyze Sales', icon: 'TrendingUp', prompt: 'How is my store performing this week?' },
  { id: 'reorder_check', label: 'Find Products to Reorder', icon: 'AlertTriangle', prompt: 'Which products should I reorder right now?' },
  { id: 'inventory_health', label: 'Check Inventory', icon: 'Boxes', prompt: 'Give me an inventory health summary.' },
  { id: 'best_sellers', label: 'Find Best Sellers', icon: 'Award', prompt: 'What are my top selling and most profitable products?' },
  { id: 'customer_insights', label: 'Customer Insights', icon: 'Users', prompt: 'Which customers haven\'t purchased recently and need re-engagement?' },
  { id: 'promotion_ideas', label: 'Suggest Promotions', icon: 'Tag', prompt: 'Give me smart bundle promotion ideas to boost sales.' },
  { id: 'weekly_report', label: 'Generate Weekly Report', icon: 'FileText', prompt: 'Generate my weekly business performance report.' },
  { id: 'business_summary', label: 'Business Summary', icon: 'Sparkles', prompt: 'Give me an executive summary of my store status and urgent actions.' },
];
