const express = require('express');
const router = express.Router();
const { batch } = require('../schemas/schema')

router.post('/batch-details', async (req, res) => {
  try {
    // const { batchName, NoOfStudents, NoOfClassesPerMonth, Course, Medium } = req.body;
    // console.log(req.body, "hello");

    const newBatch = new batch(req.body);
    await newBatch.save()
    res.status(201).json(newBatch)
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message })
  }
})

router.get('/all-batches', async (req, res) => {
  try {
    const batchs = await batch.find()
    res.status(200).json(batchs);
  } catch (err) {
    res.status(400).json(err.message);
  }
})

router.delete('/all-batches', (req, res) => {
  batch.deleteMany({}).then((res) => {
    res.status(200).send(res);
  }
  ).catch(err => {
    res.status(400).send(err)
    console.log(err)
  })
})

router.put('/update-batch/:id', async (req, res) => {
  try {
    console.log(req);

    const updatedBatch = await batch.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    console.log(updatedBatch);

    res.status(200).json(updatedBatch);
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete('/delete-batch/:id', async (req, res) => {
  try {
    console.log(req.params.id);

    await batch.findByIdAndDelete(req.params.id);
    res.status(200).send("deleted successfully");
  } catch (err) {
    res.status(400).send(err);
  }
})

module.exports = router;
