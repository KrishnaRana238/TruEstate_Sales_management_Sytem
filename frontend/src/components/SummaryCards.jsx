import '../styles/SummaryCards.css';

const SummaryCards = ({ sales, pagination }) => {
  const calculateSummary = () => {
    if (!sales || sales.length === 0) {
      return {
        totalUnits: 0,
        totalAmount: 0,
        totalDiscount: 0,
        totalAmountSRs: 0,
        totalDiscountSRs: 0,
      };
    }

    const totalUnits = sales.reduce((sum, sale) => sum + (sale.Quantity || 0), 0);
    const totalAmount = sales.reduce((sum, sale) => sum + (sale['Total Amount'] || 0), 0);
    const totalDiscount = sales.reduce((sum, sale) => {
      const discount = (sale['Total Amount'] || 0) - (sale['Final Amount'] || 0);
      return sum + discount;
    }, 0);

    // Count unique sales records (SRs) for amounts and discounts
    const amountSRs = sales.filter(sale => sale['Total Amount'] > 0).length;
    const discountSRs = sales.filter(sale => {
      const discount = (sale['Total Amount'] || 0) - (sale['Final Amount'] || 0);
      return discount > 0;
    }).length;

    return {
      totalUnits,
      totalAmount,
      totalDiscount,
      totalAmountSRs: amountSRs,
      totalDiscountSRs: discountSRs,
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const summary = calculateSummary();

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-card-label">Total units sold</span>
          <span className="info-icon">ℹ️</span>
        </div>
        <div className="summary-card-value">{summary.totalUnits}</div>
      </div>

      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-card-label">Total Amount</span>
          <span className="info-icon">ℹ️</span>
        </div>
        <div className="summary-card-value">
          {formatCurrency(summary.totalAmount)} ({summary.totalAmountSRs} SRs)
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-card-label">Total Discount</span>
          <span className="info-icon">ℹ️</span>
        </div>
        <div className="summary-card-value">
          {formatCurrency(summary.totalDiscount)} ({summary.totalDiscountSRs} SRs)
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;

