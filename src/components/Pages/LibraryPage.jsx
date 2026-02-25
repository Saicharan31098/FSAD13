import React, { useState } from 'react';
import ConfirmationDialog from '../ConfirmationDialog.jsx';

const LibraryPage = () => {
  const [borrowings, setBorrowings] = useState([
    { id: 'BOR2023001', bookTitle: 'Introduction to Algorithms', borrower: 'John Smith', borrowDate: '2023-10-01', dueDate: '2023-10-15', status: 'Due Soon' },
    { id: 'BOR2023002', bookTitle: 'Physics for Scientists', borrower: 'Emily Johnson', borrowDate: '2023-09-25', dueDate: '2023-10-09', status: 'Overdue' },
    { id: 'BOR2023003', bookTitle: 'Calculus: Early Transcendentals', borrower: 'Michael Brown', borrowDate: '2023-10-10', dueDate: '2023-10-24', status: 'Active' }
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (borrowingId) => {
    setItemToDelete(borrowingId);
    setShowDialog(true);
  };

  const confirmDelete = () => {
    setBorrowings(borrowings.filter(borrowing => borrowing.id !== itemToDelete));
    setShowDialog(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDialog(false);
    setItemToDelete(null);
  };

  return (
    <div id="library-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">📖 Library Management</h1>
        <p className="page-subtitle">Manage library resources, borrowing, and inventory</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--primary)'}}>
            <i className="fas fa-book"></i>
          </div>
          <div className="stat-info">
            <h3>25,847</h3>
            <p>Total Books</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--success)'}}>
            <i className="fas fa-book-open"></i>
          </div>
          <div className="stat-info">
            <h3>3,452</h3>
            <p>Books Borrowed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--warning)'}}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-info">
            <h3>128</h3>
            <p>Overdue Books</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--accent)'}}>
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>1,842</h3>
            <p>Active Members</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Borrowings</h2>
          <button className="btn btn-primary" id="add-borrowing-btn"><i className="fas fa-plus"></i> Add Borrowing Record</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Borrow ID</th>
              <th>Book Title</th>
              <th>Borrower</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="borrowing-table-body">
            {borrowings.map(borrowing => (
              <tr key={borrowing.id}>
                <td>{borrowing.id}</td>
                <td>{borrowing.bookTitle}</td>
                <td>{borrowing.borrower}</td>
                <td>{borrowing.borrowDate}</td>
                <td>{borrowing.dueDate}</td>
                <td>
                  <span className={`badge badge-${borrowing.status === 'Active' ? 'success' : borrowing.status === 'Due Soon' ? 'warning' : 'danger'}`}>
                    {borrowing.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-outline view-borrowing-btn" data-id={borrowing.id}><i className="fas fa-eye"></i></button>
                    <button 
                      className="btn btn-danger delete-borrowing-btn" 
                      onClick={() => handleDelete(borrowing.id)}
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
        message="Are you sure you want to delete this borrowing record? This action cannot be undone."
      />
    </div>
  );
};

export default LibraryPage;