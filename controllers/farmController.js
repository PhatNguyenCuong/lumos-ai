// controllers/farmController.js
const Farm = require("../models/farmModel");

exports.getAllFarms = async (req, res) => {
  const result = await Farm.getAll();
  res.json(result.rows);
};

exports.getFarmById = async (req, res) => {
  const result = await Farm.getById(req.params.id);
  res.json(result.rows[0]);
};

exports.createFarm = async (req, res) => {
  const result = await Farm.create(req.body);
  res.status(201).json(result.rows[0]);
};

exports.updateFarm = async (req, res) => {
  const result = await Farm.update(req.params.id, req.body);
  res.json(result.rows[0]);
};

exports.deleteFarm = async (req, res) => {
  await Farm.delete(req.params.id);
  res.json({ message: "Xóa farm thành công ✅" });
};
