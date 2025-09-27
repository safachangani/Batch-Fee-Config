const express = require('express');
const router = express.Router()
const { batch, feeStructure } = require("../schemas/schema");

router.get('/batches', async (req, res) => {
  try {

    const batches = await batch.find(
      {},
      { batchName: 1 }
    )
    res.status(200).json(batches)
  } catch (err) {
    console.log(err)

  }
})

router.get('/fee-structure/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    const batchDetails = await batch.findById(req.params.id)
    console.log(batchDetails);

    const matchedfeeStructure = await feeStructure.find(
      { course: batchDetails.course, medium: batchDetails.medium }
    )
    console.log("data", matchedfeeStructure);
    const filteredfeeStructures = matchedfeeStructure.filter((feeStruct) => {
      return (
        batchDetails.noOfStudents >= feeStruct.minNoOfStudents &&
        batchDetails.noOfStudents <= feeStruct.maxNoOfStudents
      )

    })
    filteredfeeStructures.map((feeStruct) => {
      return (
        feeStruct._id,
        feeStruct.feeStructureName
      )
    })
    // console.log("what is this ", filteredfeeStructures);
    res.status(200).json({ batchDetails, filteredfeeStructures })

  } catch (err) {
    res.status(400).send(err)

  }
})
router.get('/get-total', async (req, res) => {
  try {
    console.log(req.query, "yguy");

    const { id1, batchId } = req.query;
    const feeStructureDetails = await feeStructure.findById(id1);
    const batchDetails = await batch.findById(batchId)
    console.log(feeStructureDetails, batchDetails);

    const monthlyFee = feeStructureDetails.monthlyFee;
    const TotalClassesPerMonth = feeStructureDetails.TotalClassesPerMonth;
    const noOfStudents = batchDetails.noOfStudents;
    const batchNoOfClassesPerMonth = batchDetails.noOfClassesPerMonth
    const feePerStudent = (monthlyFee / TotalClassesPerMonth) * batchNoOfClassesPerMonth
    const totalFee = feePerStudent * noOfStudents
    console.log(totalFee, noOfStudents, feePerStudent, batchNoOfClassesPerMonth);

    res.status(200).json({ feePerStudent, totalFee })

  } catch (err) {
    res.status(400).send(err)
  }

})
module.exports = router
