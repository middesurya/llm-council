/**
 * Finance Knowledge Base
 * Contains GAAP/IFRS standards, financial regulations, and reference information
 */

export interface AccountingStandard {
  code: string;
  title: string;
  framework: "GAAP" | "IFRS";
  description: string;
  keywords: string[];
}

export interface FinancialReference {
  topic: string;
  content: string;
  keywords: string[];
  standards?: string[];
}

// Accounting Standards (GAAP/IFRS)
export const accountingStandards: AccountingStandard[] = [
  {
    code: "ASC 606",
    title: "Revenue from Contracts with Customers",
    framework: "GAAP",
    description: "Establishes principles for reporting information about the nature, timing, and uncertainty of revenue and cash flows",
    keywords: ["revenue", "recognition", "contracts", "sales", "asc 606", "top line"]
  },
  {
    code: "ASC 842",
    title: "Leases",
    framework: "GAAP",
    description: "Requires lessees to recognize assets and liabilities for most leases on the balance sheet",
    keywords: ["lease", "leases", "rental", "asc 842", "operating lease", "finance lease"]
  },
  {
    code: "IFRS 15",
    title: "Revenue from Contracts with Customers",
    framework: "IFRS",
    description: "Five-step model for revenue recognition from contracts with customers",
    keywords: ["revenue", "recognition", "contracts", "ifrs 15", "sales"]
  },
  {
    code: "IFRS 16",
    title: "Leases",
    framework: "IFRS",
    description: "Single lease accounting model requiring lessees to recognize right-of-use assets and lease liabilities",
    keywords: ["lease", "leases", "ifrs 16", "right of use", "rou asset"]
  },
  {
    code: "ASC 820",
    title: "Fair Value Measurement",
    framework: "GAAP",
    description: "Defines fair value, establishes a framework for measuring fair value, and expands disclosures about fair value measurements",
    keywords: ["fair value", "valuation", "mark to market", "asc 820"]
  },
  {
    code: "IFRS 9",
    title: "Financial Instruments",
    framework: "IFRS",
    description: "Classification and measurement of financial assets, expected credit loss model, hedge accounting",
    keywords: ["financial instruments", "loans", "ifrs 9", "credit loss", "impairment"]
  },
  {
    code: "ASC 330",
    title: "Inventory",
    framework: "GAAP",
    description: "Accounting for inventory, including valuation methods (FIFO, LIFO, weighted average)",
    keywords: ["inventory", "stock", "fifo", "lifo", "asc 330", "cogs"]
  },
  {
    code: "IFRS 13",
    title: "Fair Value Measurement",
    framework: "IFRS",
    description: "Guidance on fair value measurement and disclosure requirements",
    keywords: ["fair value", "valuation", "ifrs 13"]
  }
];

// Financial Reference Knowledge
export const financialReferences: FinancialReference[] = [
  {
    topic: "Revenue Recognition (ASC 606 / IFRS 15)",
    content: `Five-Step Model:
1. Identify the contract with customer
2. Identify separate performance obligations
3. Determine transaction price
4. Allocate transaction price to obligations
5. Recognize revenue when performance obligation satisfied

Key considerations: variable consideration, constraining estimates, significant financing components, time value of money.`,
    keywords: ["revenue", "recognition", "asc 606", "ifrs 15"],
    standards: ["ASC 606", "IFRS 15"]
  },
  {
    topic: "Lease Accounting (ASC 842 / IFRS 16)",
    content: `Key Changes:
- Operating leases now recognized on balance sheet
- Lessees recognize right-of-use (ROU) asset and lease liability
- Lease liability measured at present value of lease payments
- ROU asset = lease liability + lease payments + initial costs
- Both GAAP and IFRS converged with minor differences

Short-term leases (<12 months) can be exempt from balance sheet recognition.`,
    keywords: ["lease", "asc 842", "ifrs 16", "rou asset"],
    standards: ["ASC 842", "IFRS 16"]
  },
  {
    topic: "Fair Value Hierarchy (ASC 820 / IFRS 13)",
    content: `Level 1: Quoted prices in active markets (identical assets/liabilities)
Level 2: Observable inputs other than Level 1 (similar assets, market-corroborated data)
Level 3: Unobservable inputs (management estimates, projections)

Highest and best use, principal market considerations, valuation techniques (market approach, income approach, cost approach)`,
    keywords: ["fair value", "asc 820", "ifrs 13", "valuation", "level 1", "level 2", "level 3"],
    standards: ["ASC 820", "IFRS 13"]
  },
  {
    topic: "Financial Statement Analysis Ratios",
    content: `Liquidity Ratios:
- Current Ratio = Current Assets / Current Liabilities
- Quick Ratio = (Cash + Marketable Securities + AR) / Current Liabilities

Profitability Ratios:
- Gross Margin = Gross Profit / Revenue
- Operating Margin = Operating Income / Revenue
- Net Margin = Net Income / Revenue
- ROE = Net Income / Shareholder Equity
- ROA = Net Income / Total Assets

Solvency Ratios:
- Debt to Equity = Total Debt / Total Equity
- Interest Coverage = EBIT / Interest Expense`,
    keywords: ["ratios", "liquidity", "profitability", "solvency", "analysis", "financial statements"]
  },
  {
    topic: "Revenue Forecasting Methods",
    content: `1. Historical Growth Rates: Compound annual growth rate (CAGR)
2. Trend Analysis: Linear regression, moving averages
3. Market-Based: TAM, SAM, SOM approach
4. Unit Economics: Price × Volume projections
5. Seasonal Adjustments: Identify and account for seasonality
6. Driver-Based: Link revenue to key business drivers

Best Practices:
- Use multiple methods for triangulation
- Document assumptions and sensitivity analysis
- Consider macroeconomic factors and industry trends`,
    keywords: ["forecast", "revenue", "projection", "growth", "cagr"]
  }
];

/**
 * Search accounting standards by keywords
 */
export function searchAccountingStandards(query: string): AccountingStandard[] {
  const lowerQuery = query.toLowerCase();
  return accountingStandards.filter(
    (std) =>
      std.code.toLowerCase().includes(lowerQuery) ||
      std.title.toLowerCase().includes(lowerQuery) ||
      std.description.toLowerCase().includes(lowerQuery) ||
      std.keywords.some((kw) => lowerQuery.includes(kw.toLowerCase()))
  );
}

/**
 * Search financial references by keywords
 */
export function searchFinancialReferences(query: string): FinancialReference[] {
  const lowerQuery = query.toLowerCase();
  return financialReferences.filter(
    (ref) =>
      ref.topic.toLowerCase().includes(lowerQuery) ||
      ref.content.toLowerCase().includes(lowerQuery) ||
      ref.keywords.some((kw) => lowerQuery.includes(kw.toLowerCase()))
  );
}

/**
 * Get relevant financial context for a query
 */
export function getFinancialContext(query: string): string {
  const standards = searchAccountingStandards(query);
  const refs = searchFinancialReferences(query);

  let context = "";

  if (standards.length > 0) {
    context += "\n\nRelevant Accounting Standards:\n";
    standards.forEach((std) => {
      context += `- ${std.code} (${std.framework}): ${std.title}\n`;
      context += `  ${std.description}\n`;
    });
  }

  if (refs.length > 0) {
    context += "\n\nFinancial Reference Information:\n";
    refs.forEach((ref) => {
      context += `\n${ref.topic}:\n${ref.content}\n`;
    });
  }

  return context;
}
