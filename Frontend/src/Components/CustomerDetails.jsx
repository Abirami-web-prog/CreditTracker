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

  // Defensive transactions array
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

  // ... other hooks and handlers remain unchanged ...

  return (
    <div key={id} ref={componentRef} className="printable-content">
      {/* ... error and success messages ... */}

      <Link className="back link-btn no-print" to="/">
        Back
      </Link>

      {!customer ? (
        <p>Customer not found</p>
      ) : isEditing ? (
        // Edit customer form
        // ...
        null
      ) : (
        // Customer details display
        // ...
        null
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
                {/* transaction rows and editing logic */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No transactions yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add transaction form controls */}

    </div>
  );
}

CustomerDetails.propTypes = {
  // ... your original proptypes ...
};

export default CustomerDetails;
