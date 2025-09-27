import React, { useState, useEffect } from 'react'
import axios from '../../axios'
function FeeStructure() {
  const [feeStructures, setFeeStructures] = useState([])
  const [isUpdate, setIsUpdate] = useState(false)
  const [rowId, setRowId] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  useEffect(() => {
    axios.get('/fee/fee-structures').then((res) => {
      console.log(res);
      const data = res.data;
      setFeeStructures(res.data);
    }).catch((err) => {
      console.log(err);

    })
  }, [])
  function handleSubmit(e) {
    e.preventDefault()
    console.log(e.target.elements.course.value)
    const form = e.target.elements;
    const formData = new FormData(e.target)
    const feeStructureDetails = Object.fromEntries(formData.entries())
    console.log(feeStructureDetails)
    if (isUpdate) {
      console.log("is id true", rowId);

      axios.put(`fee/fee-structures/${rowId}`, feeStructureDetails).then((res) => {
        console.log(res)
        const updatedFeeStructure = res.data;
        const newFeeStructures = feeStructures.map((fee) => {
          return fee._id === updatedFeeStructure._id ? { ...fee, ...updatedFeeStructure } : fee
        })
        setFeeStructures(newFeeStructures)
        setIsUpdate(false)
      }).catch(err => console.log(err))
    } else {
      axios.post('/fee/fee-structure', feeStructureDetails).then((res) => {
        console.log(res.data);
        const result = res.data;
        setFeeStructures([...feeStructures, result]);
        console.log(feeStructures)
      }).catch(err => console.log(err.response.data.error))
    }
    e.target.reset()
  }

  function handleDelete(feeStructurId) {
    axios.delete(`/fee/fee-structure/${feeStructurId}`).then((res) => {
      console.log(res);
      const newfeeStructure = feeStructures.filter(fee => fee._id !== feeStructurId)
      setFeeStructures(newfeeStructure)
      console.log(newfeeStructure);

    }).then(err => console.log(err))
  }

  function handleUpdate(feeStructurId) {
    setIsUpdate(true)
    setRowId(feeStructurId)
    const rowData = feeStructures.find(fee => fee._id === feeStructurId)
    console.log(rowData);
    document.querySelector('input[name="feeStructureName"]').value = rowData.feeStructureName
    document.querySelector('input[name="minNoOfStudents"]').value = rowData.minNoOfStudents;
    document.querySelector('input[name="maxNoOfStudents"]').value = rowData.maxNoOfStudents
    document.querySelector('select[name="region"]').value = rowData.region
    document.querySelector('select[name="course"]').value = rowData.course
    document.querySelector('select[name="medium"]').value = rowData.medium
    document.querySelector('input[name="monthlyFee"]').value = rowData.monthlyFee
    document.querySelector('input[name="TotalClassesPerMonth"]').value = rowData.TotalClassesPerMonth
    document.querySelector('input[name="remarks"]').value = rowData.remarks

  }
  function handleToggle() {
    setIsSubmitted(prev => !prev)
  }
  return (
    <div>
      <div>

        <form action="" onSubmit={handleSubmit}>
          <div className='form-title'>
            <h1>Add Fee Structure</h1>
            <button onClick={handleToggle}>{isSubmitted ? '▲' : '▼'}</button>
          </div>
          <div>
            <label htmlFor="">Fee Structure Name</label>
            <input type="text" name='feeStructureName' required />
          </div>
          <div>
            <label htmlFor="">Number Of Stuents(Min)</label>
            <input type="number" name="minNoOfStudents" id="" required />
          </div>
          <div>
            <label htmlFor="">Number Of Stuents(Max)</label>
            <input type="number" name="maxNoOfStudents" id="" required />
          </div>
          <div>
            <label htmlFor="">Region</label>
            <select name="region" id="" required>
              <option value="kochi">kochi</option>
              <option value="chennai">chennai</option>
            </select>
          </div>
          <div>
            <label htmlFor="">Medium</label>
            <select name="medium" id="" required>
              <option value="english">English</option>
              <option value="malayalam">Malayalam</option>
            </select>
          </div>
          <div>
            <label htmlFor="">Course</label>
            <select name="course" id="" required>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
            </select>
          </div>
          <div>
            <label htmlFor="">Monthly Fee(INR)</label>
            <input type="number" name="monthlyFee" id="" required />
          </div>
          <div>
            <label htmlFor="">Total Classes in a Month</label>
            <input type="number" name="TotalClassesPerMonth" id="" required />
          </div>
          <div>
            <label htmlFor="">Remark(Enter Minimum Negotiable Fee)</label>
            <input type="text" name="remarks" id="" required />
          </div>
          {isUpdate ? (

            <input type="submit" value="UPDATE" />)
            : <input type="submit" value="SUBMIT" />}
          {/* <input type="submit" value="Cancel" /> */}
        </form>
      </div>
      <div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Fee Structure Name</th>
                <th>Min Students</th>
                <th>Max Students</th>
                <th>Region</th>
                <th>Medium</th>
                <th>Course</th>
                <th>Monthly Fee</th>
                <th>Total Classes/Month</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeStructures.map((feeStructure) => (
                <tr key={feeStructure._id}>
                  <td>{feeStructure.feeStructureName}</td>
                  <td>{feeStructure.minNoOfStudents}</td>
                  <td>{feeStructure.maxNoOfStudents}</td>
                  <td>{feeStructure.region}</td>
                  <td>{feeStructure.medium}</td>
                  <td>{feeStructure.course}</td>
                  <td>{feeStructure.monthlyFee}</td>
                  <td>{feeStructure.TotalClassesPerMonth}</td>
                  <td>{feeStructure.remarks}</td>
                  <td>
                    <button className='update-btn' onClick={() => handleUpdate(feeStructure._id)}>Update</button>
                    <button className='delete-btn' onClick={() => handleDelete(feeStructure._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  )
}

export default FeeStructure
