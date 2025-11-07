mport React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import PropTypes from "prop-types";

function CustomerDetails({
  customers,
  addTransaction,
  updateCustomer,
  updateTransaction,
  deleteTransaction,
}) {
  const { id } = useParams();
  const componentRef = useRef();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("credit");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [editPlace, setEditPlace] = useState("");

  const [editingTransaction, setEditingTransaction] = useState(null);

  const customer = customers.find((c) => c.id === parseInt(id));

  // Safe transactions array for .filter() and .map()
  const transactionsSafe = Array.isArray(customer?.transactions) ? customer.transactions : [];

  useEffect(() => {
    if (customer) {
      setEditName(customer.name || "");
      setEditMobile(customer.mobile || "");
      setEditPlace(customer.place || "");
      setError(null);
      setSuccessMsg(null);
    }
  }, [customer]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  // [Your existing handlers with unchanged logic, but using transactionsSafe where needed]

  const formattedBalance =
    customer?.outstanding_balance !== undefined
      ? parseFloat(customer.outstanding_balance).toFixed(2)
      : "0.00";

  return (
    <div key={id} ref={componentRef} className="printable-content">
      {/* Error and Success Messages */}
      <Link className="back link-btn no-print" to="/">
        Back
      </Link>

      {!customer ? (
        <p>Customer not found</p>
      ) : isEditing ? (
        <div>{/* Edit Customer Form */}</div>
      ) : (
        <div>{/* Display Customer Info */}</div>
      )}

      <h3>Transactions</h3>
      <table className="table" style={{ marginBottom: 16 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount (Rs)</th>
            <th className="no-print">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactionsSafe.length > 0 ? (
            transactionsSafe.map((t, i) => (
              <tr key={i}>
                {/* Render each transaction row and edit controls */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No transactions yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Transaction Section */}
    </div>
  );
}

CustomerDetails.propTypes = {
  // Prop types same as your original definitions
};

export default CustomerDetails;
