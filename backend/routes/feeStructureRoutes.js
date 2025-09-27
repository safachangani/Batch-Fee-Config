const express = require('express');
const router = express.Router();
const { feeStructure } = require('../schemas/schema');

router.post('/fee-structure', async (req, res) => {
  try {
    const newFeeStructure = new feeStructure(req.body)
    await newFeeStructure.save();
    res.status(201).json(newFeeStructure)
  } catch (err) {
    res.status(500).send(err)
  }
})


router.get('/fee-structures', async (req, res) => {
  try {
    const feeStructures = await feeStructure.find()
    res.status(200).json(feeStructures);
  } catch (err) {
    res.status(400).json(err.message);
  }
})

router.delete('/fee-structures', (req, res) => {
  feeStructure.deleteMany({}).then((res) => {
    res.status(200).send(res);
  }
  ).catch(err => {
    res.status(400).send(err)
    console.log(err)
  })
})

router.put('/fee-structures/:id', async (req, res) => {
  try {
    console.log(req.body);

    const updatedFeeStructure = await feeStructure.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    res.status(200).json(updatedFeeStructure);
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete('/fee-structure/:id', async (req, res) => {
  try {
    console.log(req.params.id);

    await feeStructure.findByIdAndDelete(req.params.id);
    res.status(200).send("deleted successfully");
  } catch (err) {
    res.status(400).send(err);
  }
})


module.exports = router;
