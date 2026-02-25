import React, { useState } from 'react';
import ConfirmationDialog from '../ConfirmationDialog.jsx';

const FinancePage = () => {
  const [transactions, setTransactions] = useState([
    { id: 'TXN2023001', student: 'John Smith', type: 'Tuition Fee', amount: 1200, date: '2023-10-15', status: 'Paid' },
    { id: 'TXN2023002', student: 'Emily Johnson', type: 'Library Fine', amount: 25, date: '2023-10-14', status: 'Pending' },
    { id: 'TXN2023003', student: 'Michael Brown', type: 'Tuition Fee', amount: 1200, date: '2023-10-10', status: 'Overdue' }
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (transactionId) => {
    setItemToDelete(transactionId);
    setShowDialog(true);
  };

  const confirmDelete = () => {
    setTransactions(transactions.filter(transaction => transaction.id !== itemToDelete));
    setShowDialog(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDialog(false);
    setItemToDelete(null);
  };

  return (
    <div id="finance-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">💰 Financial Management</h1>
        <p className="page-subtitle">Manage tuition fees, payments, and financial records</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--primary)'}}>
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-info">
            <h3>$1,245,680</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--success)'}}>
            <i className="fas fa-money-check"></i>
          </div>
          <div className="stat-info">
            <h3>$892,450</h3>
            <p>Tuition Collected</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--warning)'}}>
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="stat-info">
            <h3>$353,230</h3>
            <p>Pending Payments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--danger)'}}>
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stat-info">
            <h3>$128,560</h3>
            <p>Overdue Payments</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Transactions</h2>
          <button className="btn btn-primary" id="add-transaction-btn"><i className="fas fa-plus"></i> Add Transaction</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Student</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="transaction-table-body">
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.student}</td>
                <td>{transaction.type}</td>
                <td>${transaction.amount}</td>
                <td>{transaction.date}</td>
                <td>
                  <span className={`badge badge-${transaction.status === 'Paid' ? 'success' : transaction.status === 'Pending' ? 'warning' : 'danger'}`}>
                    {transaction.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-outline view-transaction-btn" data-id={transaction.id}><i className="fas fa-eye"></i></button>
                    <button 
                      className="btn btn-danger delete-transaction-btn" 
                      onClick={() => handleDelete(transaction.id)}
                    ><i className="fas fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog 
        show={showDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
};


export default FinancePage;