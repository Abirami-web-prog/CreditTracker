const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all customers
router.get('/', (req, res) => {
  const sql = 'SELECT id, name, mobile, place, outstanding_balance FROM Customers ORDER BY name';
  pool.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST a new customer
router.post('/', (req, res) => {
  const { name, mobile, place } = req.body;
  if (!name || !mobile) {
    return res.status(400).json({ error: 'Name and mobile are required.' });
  }
  const sql = 'INSERT INTO Customers (name, mobile, place, outstanding_balance) VALUES (?, ?, ?, 0)';
  pool.query(sql, [name, mobile, place||null], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'A customer with this mobile number already exists.' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, name, mobile, place: place||null, outstanding_balance: 0 });
  });
});

// DELETE a customer and all their transactions
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  pool.getConnection((err, connection) => {
    if(err) return res.status(500).json({ error: 'Database connection failed' });
    connection.beginTransaction(err =>{
      if(err){
        connection.release();
        return res.status(500).json({error: 'Transaction start failed'});
      }
      connection.query('DELETE FROM Transactions WHERE customer_id = ?', [id], (err) => {
        if(err){
          connection.rollback(() => connection.release());
          return res.status(500).json({ error: err.message });
        }
        connection.query('DELETE FROM Customers WHERE id = ?', [id], (err, result) =>{
          if(err){
            connection.rollback(() => connection.release());
            return res.status(500).json({ error: err.message });
          }
          if(result.affectedRows === 0){
            connection.rollback(() => connection.release());
            return res.status(404).json({ message: 'Customer not found.' });
          }
          connection.commit( err => {
            if(err){
              connection.rollback(() => connection.release());
              return res.status(500).json({ error: "Commit failed" });
            }
            connection.release();
            res.json({ message: 'Customer deleted successfully.' });
          });
        });
      });
    });
  });
});

// GET customer details and transactions
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT C.id, C.name, C.mobile, C.place, C.outstanding_balance,
           T.id AS transaction_id, T.date, T.type, T.amount, T.description
    FROM Customers C
    LEFT JOIN Transactions T ON C.id = T.customer_id
    WHERE C.id = ? ORDER BY T.date DESC`;

  pool.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Customer not found.' });

    const customer = {
      id: results[0].id,
      name: results[0].name,
      mobile: results[0].mobile,
      place: results[0].place,
      outstanding_balance: results[0].outstanding_balance,
      transactions: results.filter(r => r.transaction_id).map(r => ({
        id: r.transaction_id,
        date: r.date,
        type: r.type,
        amount: r.amount,
        description: r.description || ''
      }))
    };
    res.json(customer);
  });
});

// POST a new transaction for a customer
router.post('/:id/transactions', (req, res) => {
  const customerId = req.params.id;
  let { type, amount, date, description } = req.body;
  date = date ? date.split('T')[0] : new Date().toISOString().slice(0,10);

  if (!type || !amount) return res.status(400).json({ error: 'Type and amount are required.' });

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) return res.status(400).json({ error: 'Amount must be positive.' });

  pool.getConnection((err, connection) => {
    if(err) return res.status(500).json({ error: 'Database connection failed' });

    connection.beginTransaction(err => {
      if(err){
        connection.release();
        return res.status(500).json({error: 'Transaction start failed'});
      }

      connection.query('SELECT id FROM Customers WHERE id = ?', [customerId], (err, results) => {
        if(err){
          connection.rollback(() => connection.release());
          return res.status(500).json({ error: err.message });
        }
        if(results.length === 0){
          connection.rollback(() => connection.release());
          return res.status(404).json({ error: 'Customer not found.' });
        }

        connection.query('INSERT INTO Transactions (customer_id, date, type, amount, description) VALUES (?, ?, ?, ?, ?)', 
          [customerId, date, type, parsedAmount, description || null], (err, result) => {
          if(err){
            connection.rollback(() => connection.release());
            return res.status(500).json({ error: err.message });
          }

          const updateAmount = type.toLowerCase() === 'credit' ? parsedAmount : -parsedAmount;
          connection.query('UPDATE Customers SET outstanding_balance = outstanding_balance + ? WHERE id = ?', [updateAmount, customerId], (err) => {
            if(err){
              connection.rollback(() => connection.release());
              return res.status(500).json({ error: err.message });
            }

            connection.commit(err => {
              if(err){
                connection.rollback(() => connection.release());
                return res.status(500).json({ error: 'Commit failed' });
              }
              connection.release();
              res.status(201).json({ message: 'Transaction added successfully.' });
            });
          });
      });
    });
  });
});

// PUT update customer
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, mobile, place } = req.body;
  if (!name || !mobile) return res.status(400).json({ error: 'Name and mobile are required.' });

  const sql = 'UPDATE Customers SET name = ?, mobile = ?, place = ? WHERE id = ?';
  pool.query(sql, [name, mobile, place || null, id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') 
        return res.status(409).json({ error: 'Mobile number already exists.' });
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Customer not found.' });
    res.json({ message: 'Customer updated successfully.', id, name, mobile, place });
  });
});

module.exports = router;
