const Resource = require('../models/Resource');

exports.listResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ name: 1 });
    console.log(`📦 Returning ${resources.length} resources`);
    res.json(resources);
  } catch (err) {
    console.error('❌ Error fetching resources:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.createResource = async (req, res) => {
  try {
    const data = req.body;
    const resource = await Resource.create(data);
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Resource.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Resource not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Resource.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
