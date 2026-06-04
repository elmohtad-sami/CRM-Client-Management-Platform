const Devis = require('../models/Devis');
const asyncHandler = require('../utils/asyncHandler');

const getUserId = (req) => req.user?.sub;

exports.getDevis = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }
  const devisList = await Devis.find({ userId }).sort({ createdAt: -1 });
  res.json(devisList);
});

exports.createDevis = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }
  const devis = await Devis.create({ ...req.body, userId });
  res.status(201).json(devis);
});

exports.deleteDevis = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }
  const devis = await Devis.findOneAndDelete({ id: req.params.id, userId });
  if (!devis) {
    return res.status(404).json({ message: 'Devis not found' });
  }
  res.json({ message: 'Devis deleted' });
});
