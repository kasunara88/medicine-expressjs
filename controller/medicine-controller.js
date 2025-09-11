const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kasun",
  database: "afsd09_medicine",
});

const saveMedicine = (req, res) => {
  connection.query(
    "INSERT INTO medicine (name, type, price) VALUES (?, ?, ?)",
    [req.body.name, req.body.type, req.body.price],
    (err, rows) => {
      if (err) {
        console.error("Error saving medicine:", err);
      }
      res.send(rows);
    }
  );
};

const updateMedicine = (req, res) => {
  connection.query(
    "UPDATE medicine SET name = ?, type = ?, price = ? WHERE id = ?",
    [req.body.name, req.body.type, req.body.price, req.params.id],
    (err, rows) => {
      if (err) {
        console.error("Error updating medicine:", err);
      }
      res.send(rows);
    }
  );
};

const deleteMedicine = (req, res) => {
  connection.query(
    "DELETE FROM medicine WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        console.error("Error deleting medicine:", err);
      }
      res.send(rows);
    }
  );
};

const getAllMedicine = (req, res) => {
  connection.query("SELECT * FROM medicine", (err, rows) => {
    if (err) {
      console.error("Error fetching all medicines:", err);
    }
    res.send(rows);
  });
};

const getMedicineById = (req, res) => {
  connection.query(
    "SELECT * FROM medicine WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        console.error("Error fetching medicine by ID:", err);
      }
      res.send(rows);
    }
  );
};

module.exports = {
  saveMedicine,
  updateMedicine,
  deleteMedicine,
  getAllMedicine,
  getMedicineById,
};
