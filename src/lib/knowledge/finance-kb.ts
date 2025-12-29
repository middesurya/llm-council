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
  sourceUrl?: string;  // Provenance: Link to FASB/IASB documentation
  lastUpdated?: string; // ISO timestamp of last update
  version?: string;    // Version identifier
}

export interface FinancialReference {
  topic: string;
  content: string;
  keywords: string[];
  standards?: string[];
  sourceUrl?: string;  // Provenance: Link to financial guidelines
  lastUpdated?: string; // ISO timestamp of last update
  version?: string;    // Version identifier
}

// Accounting Standards (GAAP/IFRS) - Expanded Database (20+ standards)
// Sources: FASB Accounting Standards Codification, IFRS Foundation
export const accountingStandards: AccountingStandard[] = [
  // Revenue & Contracts
  {
    code: "ASC 606",
    title: "Revenue from Contracts with Customers",
    framework: "GAAP",
    description: "Establishes principles for reporting information about the nature, timing, and uncertainty of revenue and cash flows",
    keywords: ["revenue", "recognition", "contracts", "sales", "asc 606", "top line"],
    sourceUrl: "https://asc.fasb.org/SectionDisplay.tpl?Section=606-10",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ASC-606-2014"
  },
  {
    code: "IFRS 15",
    title: "Revenue from Contracts with Customers",
    framework: "IFRS",
    description: "Five-step model for revenue recognition from contracts with customers",
    keywords: ["revenue", "recognition", "contracts", "ifrs 15", "sales"],
    sourceUrl: "https://www.ifrs.org/content/dam/features/ifrs15/assets/contract-assets/logo-ifrs15.svg",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "IFRS-15-2014"
  },

  // Leases
  {
    code: "ASC 842",
    title: "Leases",
    framework: "GAAP",
    description: "Requires lessees to recognize assets and liabilities for most leases on the balance sheet",
    keywords: ["lease", "leases", "rental", "asc 842", "operating lease", "finance lease"],
    sourceUrl: "https://asc.fasb.org/SectionDisplay.tpl?Section=842-10",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ASC-842-2016"
  },
  {
    code: "IFRS 16",
    title: "Leases",
    framework: "IFRS",
    description: "Single model for lease accounting requiring lessees to recognize lease assets and lease liabilities",
    keywords: ["lease", "leases", "rental", "ifrs 16", "rou asset", "lease liability"],
    sourceUrl: "https://www.ifrs.org/content/dam/features/ifrs16/assets/logo-ifrs16.svg",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "IFRS-16-2016"
  },

  // Fair Value & Valuation
  {
    code: "ASC 820",
    title: "Fair Value Measurement",
    framework: "GAAP",
    description: "Defines fair value, establishes a framework for measuring fair value, and expands disclosures about fair value measurements",
    keywords: ["fair value", "valuation", "mark to market", "asc 820"]
  },
  {
    code: "IFRS 13",
    title: "Fair Value Measurement",
    framework: "IFRS",
    description: "Guidance on fair value measurement and disclosure requirements",
    keywords: ["fair value", "valuation", "ifrs 13"]
  },

  // Financial Instruments
  {
    code: "IFRS 9",
    title: "Financial Instruments",
    framework: "IFRS",
    description: "Classification and measurement of financial assets, expected credit loss model, hedge accounting",
    keywords: ["financial instruments", "loans", "ifrs 9", "credit loss", "impairment"]
  },
  {
    code: "ASC 326",
    title: "Credit Losses (CECL)",
    framework: "GAAP",
    description: "Current expected credit losses model for estimating credit losses on financial instruments",
    keywords: ["cecl", "credit loss", "impairment", "allowance", "asc 326"]
  },
  {
    code: "ASC 815",
    title: "Derivatives and Hedging",
    framework: "GAAP",
    description: "Accounting for derivative instruments and hedging activities",
    keywords: ["derivatives", "hedging", "hedge accounting", "asc 815", "forwards", "options", "swaps"]
  },
  {
    code: "IFRS 7",
    title: "Financial Instruments Disclosures",
    framework: "IFRS",
    description: "Disclosures required for financial instruments, including liquidity risk and credit risk",
    keywords: ["financial instruments", "disclosures", "ifrs 7", "risk", "liquidity"]
  },

  // Assets & Inventory
  {
    code: "ASC 330",
    title: "Inventory",
    framework: "GAAP",
    description: "Accounting for inventory, including valuation methods (FIFO, LIFO, weighted average)",
    keywords: ["inventory", "stock", "fifo", "lifo", "asc 330", "cogs"]
  },
  {
    code: "ASC 360",
    title: "Property, Plant, and Equipment",
    framework: "GAAP",
    description: "Accounting for PP&E including depreciation, impairment, and disposal",
    keywords: ["ppe", "fixed assets", "depreciation", "impairment", "asc 360", "capitalization"]
  },
  {
    code: "IAS 16",
    title: "Property, Plant, and Equipment",
    framework: "IFRS",
    description: "Recognition, measurement, depreciation, and impairment of property, plant and equipment",
    keywords: ["ppe", "fixed assets", "depreciation", "ias 16", "revaluation model"]
  },
  {
    code: "IAS 2",
    title: "Inventories",
    framework: "IFRS",
    description: "Accounting for inventories including measurement and cost formulas (FIFO, weighted average)",
    keywords: ["inventory", "stock", "fifo", "ias 2", "net realizable value"]
  },
  {
    code: "IAS 36",
    title: "Impairment of Assets",
    framework: "IFRS",
    description: "Procedures for ensuring assets are carried at no more than their recoverable amount",
    keywords: ["impairment", "asset impairment", "recoverable amount", "ias 36", "value in use"]
  },

  // Intangibles & Goodwill
  {
    code: "ASC 350",
    title: "Intangibles - Goodwill and Other",
    framework: "GAAP",
    description: "Accounting for goodwill and other intangible assets",
    keywords: ["goodwill", "intangibles", "amortization", "impairment", "asc 350"]
  },
  {
    code: "IAS 38",
    title: "Intangible Assets",
    framework: "IFRS",
    description: "Recognition, measurement, and amortization of intangible assets",
    keywords: ["intangibles", "amortization", "ias 38", "patents", "trademarks"]
  },
  {
    code: "IFRS 3",
    title: "Business Combinations",
    framework: "IFRS",
    description: "Accounting for business combinations and recognition of goodwill",
    keywords: ["business combination", "merger", "acquisition", "ifrs 3", "purchase price allocation"]
  },

  // Liabilities & Equity
  {
    code: "ASC 480",
    title: "Distinguishing Liabilities from Equity",
    framework: "GAAP",
    description: "Guidance on classifying financial instruments as liabilities or equity",
    keywords: ["equity", "liabilities", "classification", "asc 480", "redeemable shares"]
  },
  {
    code: "IAS 32",
    title: "Financial Instruments - Presentation",
    framework: "IFRS",
    description: "Classification of financial instruments as liabilities or equity",
    keywords: ["equity", "liabilities", "ias 32", "classification", "compound instruments"]
  },
  {
    code: "ASC 718",
    title: "Compensation - Stock Compensation",
    framework: "GAAP",
    description: "Accounting for share-based payment transactions",
    keywords: ["stock options", "equity compensation", "asc 718", "rsu", "stock-based compensation"]
  },
  {
    code: "IFRS 2",
    title: "Share-Based Payment",
    framework: "IFRS",
    description: "Accounting for share-based payment transactions",
    keywords: ["share-based payment", "stock options", "ifrs 2", "equity compensation"]
  },

  // Income Statement & Performance
  {
    code: "ASC 225",
    title: "Income Statement",
    framework: "GAAP",
    description: "Presentation of income statement, including extraordinary items and discontinued operations",
    keywords: ["income statement", "p&l", "asc 225", "earnings per share"]
  },
  {
    code: "IAS 1",
    title: "Presentation of Financial Statements",
    framework: "IFRS",
    description: "Overall requirements for financial statement presentation",
    keywords: ["financial statements", "presentation", "ias 1", "balance sheet", "income statement"]
  },

  // Income Taxes
  {
    code: "ASC 740",
    title: "Income Taxes",
    framework: "GAAP",
    description: "Accounting for income taxes, including deferred tax assets and liabilities",
    keywords: ["income tax", "deferred tax", "asc 740", "tax provision", "temporary differences"]
  },
  {
    code: "IAS 12",
    title: "Income Taxes",
    framework: "IFRS",
    description: "Accounting for current and deferred tax",
    keywords: ["income tax", "deferred tax", "ias 12", "tax base", "temporary differences"]
  },

  // Earnings Per Share
  {
    code: "ASC 260",
    title: "Earnings Per Share",
    framework: "GAAP",
    description: "Computation, presentation, and disclosure of EPS",
    keywords: ["eps", "earnings per share", "asc 260", "diluted eps", "basic eps"]
  },
  {
    code: "IAS 33",
    title: "Earnings Per Share",
    framework: "IFRS",
    description: "Calculation and presentation of basic and diluted EPS",
    keywords: ["eps", "earnings per share", "ias 33", "dilution", "potential ordinary shares"]
  },

  // Cash Flows
  {
    code: "ASC 230",
    title: "Statement of Cash Flows",
    framework: "GAAP",
    description: "Presentation of cash flow statements with operating, investing, financing activities",
    keywords: ["cash flow", "statement of cash flows", "asc 230", "operating activities"]
  },
  {
    code: "IAS 7",
    title: "Statement of Cash Flows",
    framework: "IFRS",
    description: "Information about changes in cash and cash equivalents",
    keywords: ["cash flow", "statement of cash flows", "ias 7", "liquidity"]
  }
];

// Financial Reference Knowledge (expanded database - 15+ topics)
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
    standards: ["ASC 606", "IFRS 15"],
    sourceUrl: "https://www.fasb.org/jsp/FASB/Page/SectionPage&cid=1176157313663",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ASC-606-2014"
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
    standards: ["ASC 842", "IFRS 16"],
    sourceUrl: "https://www.fasb.org/jsp/FASB/Page/SectionPage&cid=1176157313663",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ASC-842-2016"
  },
  {
    topic: "Fair Value Hierarchy (ASC 820 / IFRS 13)",
    content: `Level 1: Quoted prices in active markets (identical assets/liabilities)
Level 2: Observable inputs other than Level 1 (similar assets, market-corroborated data)
Level 3: Unobservable inputs (management estimates, projections)

Highest and best use, principal market considerations, valuation techniques (market approach, income approach, cost approach)`,
    keywords: ["fair value", "asc 820", "ifrs 13", "valuation", "level 1", "level 2", "level 3"],
    standards: ["ASC 820", "IFRS 13"],
    sourceUrl: "https://www.fasb.org/jsp/FASB/Page/SectionPage&cid=1176157313663",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ASC-820-2011"
  },
  {
    topic: "Financial Statement Analysis Ratios",
    content: `Liquidity Ratios:
- Current Ratio = Current Assets / Current Liabilities
- Quick Ratio = (Cash + Marketable Securities + AR) / Current Liabilities
- Cash Ratio = Cash / Current Liabilities

Profitability Ratios:
- Gross Margin = Gross Profit / Revenue
- Operating Margin = Operating Income / Revenue
- Net Margin = Net Income / Revenue
- ROE = Net Income / Shareholder Equity
- ROA = Net Income / Total Assets
- ROIC = NOPAT / Invested Capital

Solvency Ratios:
- Debt to Equity = Total Debt / Total Equity
- Interest Coverage = EBIT / Interest Expense
- Debt to EBITDA = Total Debt / EBITDA

Efficiency Ratios:
- Asset Turnover = Revenue / Total Assets
- Inventory Turnover = COGS / Average Inventory
- Days Sales Outstanding = (AR / Revenue) × 365`,
    keywords: ["ratios", "liquidity", "profitability", "solvency", "analysis", "financial statements", "efficiency"],
    sourceUrl: "https://www.investopedia.com/terms/f/financial-ratios.asp",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "General-Knowledge"
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
- Consider macroeconomic factors and industry trends
- Validate forecasts against actuals regularly`,
    keywords: ["forecast", "revenue", "projection", "growth", "cagr", "budgeting"],
    sourceUrl: "https://www.investopedia.com/terms/r/revenue-forecast.asp",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "General-Knowledge"
  },
  {
    topic: "Credit Loss Modeling (CECL / IFRS 9)",
    content: `CECL (ASC 326) - Current Expected Credit Losses:
- Estimate lifetime expected credit losses at origination
- Reassess each reporting period
- Consider reasonable and supportable forecasts

IFRS 9 Expected Credit Loss Model:
- 12-month ECL for performing instruments
- Lifetime ECL for credit-impaired instruments
- Three-stage model: Stage 1 (performing), Stage 2 (underperforming), Stage 3 (impaired)

Key considerations: historical data, current conditions, reasonable forecasts`,
    keywords: ["cecl", "credit loss", "ifrs 9", "impairment", "allowance", "expected credit loss"],
    standards: ["ASC 326", "IFRS 9"]
  },
  {
    topic: "Business Combinations (IFRS 3 / ASC 805)",
    content: `Acquisition Method Steps:
1. Identify the acquirer
2. Determine the acquisition date
3. Recognize and measure identifiable assets acquired, liabilities assumed
4. Recognize and measure goodwill or bargain purchase gain
5. Measure consideration transferred

Goodwill Calculation:
Goodwill = Consideration Transferred + Noncontrolling Interest + Acquisition-Date Fair Value of Previous Equity Interests - Net Recognizable Assets

Purchase Price Allocation (PPA):
- Allocate purchase price to identifiable assets based on fair value
- Tangible assets, intangible assets, liabilities
- Remainder is goodwill`,
    keywords: ["business combination", "merger", "acquisition", "goodwill", "ppa", "purchase price allocation"],
    standards: ["IFRS 3", "ASC 805"]
  },
  {
    topic: "Asset Impairment Testing",
    content: `GAAP (ASC 360) Impairment Testing:
1. Compare carrying amount to undiscounted cash flows
2. If impaired, measure impairment loss = Carrying Amount - Fair Value
3. Goodwill tested at reporting unit level

IFRS (IAS 36) Impairment Testing:
1. Compare carrying amount to recoverable amount (higher of value in use or fair value less costs to sell)
2. Recognize impairment when carrying amount > recoverable amount
3. Cash-generating unit (CGU) level testing

Value in Use: Discounted future cash flows from asset
Key inputs: growth rates, margins, discount rates, terminal value`,
    keywords: ["impairment", "asset impairment", "goodwill impairment", "ias 36", "asc 360", "recoverable amount"],
    standards: ["IAS 36", "ASC 360", "ASC 350"]
  },
  {
    topic: "Derivative Instruments and Hedging",
    content: `Derivative Definition:
- Financial instrument with (1) underlying, (2) notional amount, (3) requires no initial investment, (4) settled at future date

Types: Forwards, Futures, Options, Swaps

Hedge Accounting (ASC 815 / IFRS 9):
1. Fair Value Hedge: Hedge exposure to changes in fair value
2. Cash Flow Hedge: Hedge exposure to variable cash flows
3. Net Investment Hedge: Hedge foreign currency investment

Hedge Effectiveness Testing:
- Assess correlation between hedge and hedged item
- Document hedge relationship and effectiveness methodology
- Ineffectiveness recognized in earnings`,
    keywords: ["derivatives", "hedging", "hedge accounting", "forwards", "options", "swaps", "asc 815"],
    standards: ["ASC 815", "IFRS 9"]
  },
  {
    topic: "Income Tax Provision (ASC 740 / IAS 12)",
    content: `Components:
1. Current tax expense: Taxes payable for current period
2. Deferred tax expense: Changes in deferred tax assets/liabilities

Deferred Tax (DTA/DTL):
- Temporary differences between book and tax bases
- DTA: Future deductible amounts (tax losses, accrued expenses)
- DTL: Future taxable amounts (depreciation, unrealized gains)

Measurement:
- Enactment date: Use enacted tax rates
- Loss carryforwards: Consider valuation allowance if realization doubtful
- State and local taxes: Include in provision

ASC 740-10 (Uncertain Tax Positions):
- Recognition threshold: More likely than not (>50%)
- Measurement: Largest amount with >50% likelihood`,
    keywords: ["income tax", "deferred tax", "tax provision", "asc 740", "ias 12", "temporary differences", "dtl", "dta"],
    standards: ["ASC 740", "IAS 12"]
  },
  {
    topic: "Inventory Valuation Methods",
    content: `Cost Flow Assumptions:
- FIFO: First-in, First-out - oldest costs sold first
- LIFO: Last-in, First-out (GAAP only) - newest costs sold first
- Weighted Average: Average cost of all units available

Valuation Lower of Cost or Market (LCM) - GAAP:
- Market = replacement cost, constrained by NRV and NRV-normal profit
- Write down inventory if market < cost

Valuation Lower of Cost and Net Realizable Value (LCNRV) - IFRS:
- NRV = estimated selling price - estimated costs to complete and sell
- Write down to NRV if NRV < cost

Impact:
- FIFO: Higher net income during inflation (lower COGS)
- LIFO: Lower taxable income during inflation (higher COGS)`,
    keywords: ["inventory", "fifo", "lifo", "valuation", "cogs", "asc 330", "ias 2"],
    standards: ["ASC 330", "IAS 2"]
  },
  {
    topic: "Stock-Based Compensation",
    content: `Equity-Classified Awards (ASC 718 / IFRS 2):
- Measured at fair value on grant date
- Expense recognized over requisite service period
- For options, use option pricing model (Black-Scholes, binomial lattice)

Valuation Inputs:
- Stock price on grant date
- Exercise price
- Expected volatility
- Expected term
- Risk-free rate
- Dividend yield

Liability-Classified Awards:
- Remeasured each reporting period
- Changes in fair value recognized in earnings

Performance Conditions:
- Market conditions: Reflected in fair value (e.g., target stock price)
- Non-market conditions: Adjust for expected achievement (e.g., revenue targets)
- Vesting conditions: Expense over vesting period`,
    keywords: ["stock options", "equity compensation", "asc 718", "ifrs 2", "rsu", "stock-based compensation"],
    standards: ["ASC 718", "IFRS 2"]
  },
  {
    topic: "Earnings Per Share (EPS)",
    content: `Basic EPS:
- Numerator: Net income available to common shareholders
- Denominator: Weighted average common shares outstanding (WACSO)

Diluted EPS:
- Includes dilutive securities: options, RSUs, convertible securities
- Treasury stock method for options/RSUs
  - Shares assumed issued from exercise
  - Proceeds used to repurchase shares at average market price
- If-converted method for convertible securities
  - Adjust numerator for interest (net of tax) and dividends
  - Adjust denominator for convertible shares

Anti-dilution:
- Exclude securities that increase EPS or decrease loss per share`,
    keywords: ["eps", "earnings per share", "asc 260", "ias 33", "diluted eps", "basic eps"],
    standards: ["ASC 260", "IAS 33"]
  },
  {
    topic: "Cash Flow Statement Presentation",
    content: `Operating Activities (Indirect Method - most common):
- Start with net income
- Add back non-cash expenses (depreciation, amortization)
- Adjust for changes in working capital
  - Increase in current assets: Subtract (use of cash)
  - Decrease in current assets: Add (source of cash)
  - Increase in current liabilities: Add (source of cash)
  - Decrease in current liabilities: Subtract (use of cash)

Investing Activities:
- Capital expenditures (CapEx)
- Acquisitions/dispositions of businesses
- Purchase/sale of investments

Financing Activities:
- Debt proceeds and repayments
- Equity issuances and repurchases
- Dividend payments

Reconciliation:
- Net change in cash = Net cash from operations + investing + financing
- Ending cash = Beginning cash + Net change in cash`,
    keywords: ["cash flow", "statement of cash flows", "asc 230", "ias 7", "operating activities", "investing", "financing"],
    standards: ["ASC 230", "IAS 7"]
  },
  {
    topic: "Revenue Recognition - Special Topics",
    content: `Variable Consideration:
- Estimate using either expected value or most likely amount
- Constrain to amount for which it's highly probable significant reversal won't occur
- Reassess each reporting period

Principal vs. Agent (IFRS 15 / ASC 606):
- Principal: Controls goods/services before transfer, recognizes gross revenue
- Agent: Arranges for others to provide goods/services, recognizes net revenue (fee only)
- Indicators: Inventory risk, discretion in pricing, credit risk

Right of Return:
- Recognize refund liability for expected returns
- Recognize asset for right to recover goods
- Adjust revenue for expected returns

Point in Time vs. Over Time:
- Over time: Customer simultaneously receives and consumes benefits, or entity creates/enhances asset with no alternative use
- Point in time: At a specific point when control transfers`,
    keywords: ["revenue recognition", "variable consideration", "principal agent", "asc 606", "ifrs 15"],
    standards: ["ASC 606", "IFRS 15"]
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
      context += `- ${std.code} (${std.framework}): ${std.title}`;
      if (std.sourceUrl) {
        context += ` | Source: ${std.sourceUrl}`;
      }
      context += `\n`;
      context += `  ${std.description}\n`;
    });
  }

  if (refs.length > 0) {
    context += "\n\nFinancial Reference Information:\n";
    refs.forEach((ref) => {
      context += `\n${ref.topic}:`;
      if (ref.sourceUrl) {
        context += ` | Source: ${ref.sourceUrl}`;
      }
      context += `\n${ref.content}\n`;
    });
  }

  return context;
}
