import React, { useEffect, useState } from 'react'
import './batch-form.css'
import axios from '../../axios'

function BatchForm() {
  const [batches, setBatches] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false)
  const [rowId, setRowId] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    axios.get('/batch/all-batches').then((res) => {
      console.log(res);
      const data = res.data;
      setBatches(res.data);
      console.log(batches);
    }).catch((err) => {
      console.log(err);

    })
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    console.log(e.target.elements.course.value)
    const form = e.target.elements;
    const formData = new FormData(e.target)
    const batchDetails = Object.fromEntries(formData.entries())
    console.log(batchDetails)
    if (isUpdate) {
      console.log("is id true");

      axios.put(`batch/update-batch/${rowId}`, batchDetails).then((res) => {
        console.log(res)
        const updatedBatch = res.data;
        const newBatch = batches.map((batch) => {
          return batch._id === updatedBatch._id ? { ...batch, ...updatedBatch } : batch
        })
        setBatches(newBatch)
        setIsUpdate(false)
      }).catch(err => console.log(err))
    } else {
      axios.post('/batch/batch-details', batchDetails).then((res) => {
        console.log(res.data);
        const result = res.data;
        setBatches([...batches, result]);
        console.log(batches)
      }).catch(err => console.log(err.response.data.error))
    }
    e.target.reset()
    setIsSubmitted(true)
  }

  function handleDelete(batchId) {
    axios.delete(`/batch/delete-batch/${batchId}`).then((res) => {
      console.log(res);
      const newBatches = batches.filter(batch => batch._id !== batchId)
      setBatches(newBatches)
      console.log(newBatches);

    }).then(err => console.log(err))
  }
  function handleUpdate(batchId) {
    setIsSubmitted(false)
    setIsUpdate(true)
    setRowId(batchId)
    const rowData = batches.find(batch => batch._id === batchId)
    console.log(rowData);
    document.querySelector('input[name="batchName"]').value = rowData.batchName
    document.querySelector('input[name="noOfStudents"]').value = rowData.noOfStudents;
    document.querySelector('input[name="noOfClassesPerMonth"]').value = rowData.noOfClassesPerMonth
    document.querySelector('select[name="course"]').value = rowData.course
    document.querySelector('select[name="medium"]').value = rowData.medium

  }
  function handleToggle() {
    setIsSubmitted(prev => !prev)
  }
  return (
    <div className='section'>
      <div>
        <form action="" onSubmit={handleSubmit} className={`${isSubmitted && 'collapse'}`} >
          <div className='form-title'>
            <h1>Batch Details</h1>
            <button onClick={handleToggle}>{isSubmitted ? '▲' : '▼'}</button>
          </div>
          <div>
            <label htmlFor="">Batch Name</label>
            <input type="text" name='batchName' required />
          </div>
          <div>
            <label htmlFor="">Number Of Stuents</label>
            <input type="number" min={1} name="noOfStudents" id="" required />
          </div>
          <div>
            <label htmlFor="">Number Of Classes Per Month</label>
            <input type="number" min={1} name="noOfClassesPerMonth" id="" required />
          </div>
          <div>
            <label htmlFor="">Course</label>
            <select name="course" id="" required>
              <option value="mathematics">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology</option>
            </select>

          </div>
          <div>
            <label htmlFor="">Medium</label>
            <select name="medium" id="" required>
              <option value="english">English</option>
              <option value="malayalam">Malayalam</option>
            </select>
          </div>
          {isUpdate ? (

            <input type="submit" value="UPDATE" />)
            : <input type="submit" value="SUBMIT" />}
        </form>
      </div>
      <div>
        <div>
          {batches.length > 0 && (<table>
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>No. of Students</th>
                <th>Classes/Month</th>
                <th>Course</th>
                <th>Medium</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch._id}>
                  <td>{batch.batchName}</td>
                  <td>{batch.noOfStudents}</td>
                  <td>{batch.noOfClassesPerMonth}</td>
                  <td>{batch.course}</td>
                  <td>{batch.medium}</td>
                  <td>
                    <button className='btn-update' onClick={() => handleUpdate(batch._id)}>Update</button>
                    <button className='btn-delete' onClick={() => handleDelete(batch._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>)}


        </div>
      </div>
    </div>
  )
}

export default BatchForm
