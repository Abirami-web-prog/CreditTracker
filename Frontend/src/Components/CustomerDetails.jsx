import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function CustomerDetails({
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

  // Your existing handlers (addTransaction, updateCustomer, updateTransaction, deleteTransaction) here unchanged
  // Ensure usage of transactionsSafe instead of customer.transactions in all places

  const formattedBalance =
    customer && customer.outstanding_balance !== undefined
      ? parseFloat(customer.outstanding_balance).toFixed(2)
      : "0.00";

  return (
    <div key={id} ref={componentRef} className="printable-content">
      {error && (
        <p style={{ color: "red", padding: 10, backgroundColor: "#ffe6e6", borderRadius: 5 }}>
          {error}
        </p>
      )}
      {successMsg && (
        <p style={{ color: "green", padding: 10, backgroundColor: "#e6ffe6", borderRadius: 5 }}>
          {successMsg}
        </p>
      )}

      <Link className="back link-btn no-print" to="/">
        Back
      </Link>

      {!customer ? (
        <p>Customer not found</p>
      ) : isEditing ? (
        // Edit Customer Form here
        <div>
          {/* Form code with editable inputs */}
        </div>
      ) : (
        // Display Customer Info here
        <div>
          {/* Customer info display */}
        </div>
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
          {transactionsSafe.map((t, i) => (
            <tr key={i}>
              {/* Render each transaction and edit controls */}
            </tr>
          ))}
          {transactionsSafe.length === 0 && (
            <tr>
              <td colSpan={6}>No transactions yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Transaction Form here */}
    </div>
  );
}

CustomerDetails.propTypes = {
  customers: PropTypes.array.isRequired,
  addTransaction: PropTypes.func.isRequired,
  updateCustomer: PropTypes.func.isRequired,
  updateTransaction: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
};
