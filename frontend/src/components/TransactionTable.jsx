import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import '../styles/TransactionTable.css';

const TransactionTable = ({ sales }) => {
  const [copiedPhone, setCopiedPhone] = useState(null);

  const rows = Array.isArray(sales) && sales.length > 0 ? sales : [];

  const handleCopyPhone = (phone, index) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(index);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div className="transaction-table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Customer ID</th>
            <th>Customer name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Product Category</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((sale, index) => (
            <tr key={index}>
              <td>{sale['Transaction ID']}</td>
              <td>{sale.Date}</td>
              <td>{sale['Customer ID']}</td>
              <td>{sale['Customer Name']}</td>
              <td>
                <div className="phone-number">
                  {sale['Phone Number']}
                  <button
                    className="copy-btn"
                    onClick={() => handleCopyPhone(sale['Phone Number'], index)}
                    title={copiedPhone === index ? 'Copied!' : 'Copy phone number'}
                  >
                    {copiedPhone === index ? '✓' : <FontAwesomeIcon icon={faCopy} />}
                  </button>
                </div>
              </td>
              <td>{sale.Gender}</td>
              <td>{sale.Age}</td>
              <td>{sale['Product Category']}</td>
              <td>{String(sale.Quantity || 0).padStart(2, '0')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
