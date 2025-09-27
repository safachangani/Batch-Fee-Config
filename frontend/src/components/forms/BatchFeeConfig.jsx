import React, { useEffect, useState } from 'react'
import axios from '../../axios'
import './batch-config.css'
function BatchFeeConfig() {
  const [batchesName, setBatchesName] = useState([])
  const [feeStructures, setFeeStructures] = useState([])
  const [batchDetails, setBatchDetails] = useState(null)
  const [showfeeDetails, setShowFeeDetails] = useState(false)
  const [totalfeeDetails, setTotalFeeDetails] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [studentDiscount, setStudentDiscount] = useState({})
  const [count, setCount] = useState([1]);
  const [feeId, setFeeId] = useState('')
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    axios.get('/batchfee/batches').then((res) => {
      console.log(res);
      setBatchesName(res.data)
    }).catch(err => console.log(err))
  }, [])

  function handleSelectedBatch(e) {
    const batchId = e.target.value;
    console.log(batchId, "batch");

    axios.get(`/batchfee/fee-structure/${batchId}`).then((res) => {
      console.log(res);
      setBatchDetails(res.data.batchDetails)
      setFeeStructures(res.data.filteredfeeStructures)

    }).catch(err => console.log(err)
    )

  }

  function handleFeeStructure(e) {
    setShowFeeDetails(true)
    const id = e.target.value
    setFeeId(e.target.value)
    console.log(e.target.value, "feeid")
    axios.get(`/batchfee/get-total`, { params: { id1: id, batchId: batchDetails._id } }).then((res) => {
      console.log(res.data);
      setTotalFeeDetails(res.data)

    }).catch(err => console.log(err)
    )
  }

  function handleDiscount(e) {
    console.log(Number(e.target.value))

    const discount = e.target.value;
    setDiscount(discount);
    // const sum = totalfeeDetails.totalFee - discount;
    // totalfeeDetails.feePerStudent = sum / batchDetails.noOfStudents;
    // setTotalFeeDetails({
    //   ...totalfeeDetails,
    //   totalFee: sum,
    //   feePerStudent: sum / batchDetails.noOfStudents
    // })
  }

  const totalstudentsDiscount = Object.values(studentDiscount).reduce(
    (acc, red) => acc + Number(red),
    0
  );
  console.log(studentDiscount);


  function addComponemt() {
    setCount([...count, count.length + 1])
  }
  function handleChecked() {
    setIsChecked(prev => !prev)
  }
  return (
    <div className='section'>
      <h1>Batch Fee Configuration</h1>
      <div className='section-wrapper'>
        <div className='row'>
          <p>Select Batch</p>
          <div className='row-wrapper'>
            <label htmlFor="">Batches</label>
            <select name="batches" id="" onChange={handleSelectedBatch}>
              {batchesName.map((batch) => (

                <option value={batch._id} key={batch._id}>{batch.batchName}</option>
              ))}
            </select>
            {batchDetails && (
              <div className='details'>
                <ul>
                  <li>Batch Name : <span>{batchDetails.batchName}</span></li>
                  <li>Course : <span>{batchDetails.course}</span></li>
                  <li>Medium : <span>{batchDetails.medium}</span></li>
                </ul>
                <ul>
                  <li>No. of Students : <span>{batchDetails.noOfStudents}</span></li>
                  <li>Classes per Month : <span>{batchDetails.noOfClassesPerMonth}</span></li>
                </ul>
              </div>
            )}

          </div>
        </div>
        <div className='row'>
          <p>Select Fee Structure</p>
          <div className="row-wrapper">
            <label htmlFor="">Fee Structure</label>
            <select name="batches" id="" onChange={handleFeeStructure}>
              <option value="">Select a fee structure</option>
              {feeStructures.length > 0 ?
                feeStructures.map(fee => (

                  <option value={fee._id} key={fee._id}>{fee.feeStructureName}</option>
                )
                ) : <option disabled>no fee structure found </option>
              }
            </select>
            {showfeeDetails &&
              feeStructures.filter(feeStruct => feeStruct._id == feeId)
                .map(feeStruct => (
                  <div className='details'>
                    <ul key={feeStruct._id}>
                      <li>Fee Structure Name : <span>{feeStruct.feeStructureName}</span></li>
                      <li>No. of Students : <span>{feeStruct.minNoOfStudents} - {feeStruct.maxNoOfStudents}</span></li>
                      <li>Classes per Month : <span>{feeStruct.TotalClassesPerMonth}</span></li>
                    </ul>
                    <ul>
                      <li>Monthly Fee : <span>{feeStruct.monthlyFee}</span></li>
                      <li>Course : <span>{feeStruct.course}</span></li>
                      <li>Medium : <span>{feeStruct.medium}</span></li>
                    </ul>
                  </div>

                ))
            }

          </div>
        </div>
        {totalfeeDetails &&

          <div className='row'>
            <p>{`monthly Fee for ${batchDetails.batchName}`}</p>
            <input
              type="text"
              value={`INR ${totalfeeDetails.totalFee - discount}`}
              disabled
              className='mo__fee'
            />
          </div>
        }
        {totalfeeDetails &&
          <div className='section-col2'>
            <label htmlFor="" className='std__config'>
              <input type="checkbox" name="" id="" onChange={handleChecked} />
              do you want to configure students discount?
            </label>
            <div className='col2-wrapper'>
              <div className={`col2-inner-wrapper ${isChecked ? 'checked' : ''}`}>
                <div className='col2-content'>
                  {count.map((id) => (
                    <StudentComponent
                      key={id}
                      id={id}
                      studentFee={totalfeeDetails.feePerStudent}
                      studentDiscount={studentDiscount[id] || 0}
                      changeDiscount={(val) => {
                        setStudentDiscount(prev => ({ ...prev, [id]: val }))
                      }}
                    />
                  )
                  )}
                </div>
                <button className='btn-add' onClick={addComponemt}>+add</button>
              </div>
            </div>
            <div className='row'>
              <p>Discount</p>
              <input type="number" name="" id="" min={0} onChange={handleDiscount} value={discount} />
            </div>
            < div className='row'>
              <p>Total Batch Fee</p>
              <input
                type="text"
                value={`INR ${totalfeeDetails.totalFee - discount - totalstudentsDiscount}`}
                disabled
                className='batch__mo__fee'
              />

            </div>
          </div>
        }
      </div>
    </div>
  )
}

function StudentComponent({ id, studentFee, studentDiscount, changeDiscount }) {
  const [name, setName] = useState(null)
  const [selectedDiscount, SetSelectedDiscount] = useState(null)
  function handleStudentDiscount(e) {
    changeDiscount(e.target.value)
  }
  function handleName(e) {
    setName(e.target.value)
  }
  function handleSelectedDescount(e) {
    setName(e.target.value)
  }
  return (
    <div className='student-cart'>
      <label >{`Student${id} Name`}</label>
      <input type="text" placeholder="Student Name" onChange={handleName}></input>
      <label >Discount Category</label>
      <select onChange={handleSelectedDescount} >
        <option value="merit">Merit</option>
      </select>
      <label >Discount</label>
      <input type="number" id="discount" min={0} value={studentDiscount}
        onChange={handleStudentDiscount} disabled={!name && !selectedDiscount}></input>
      <p>{`Total Monthly Fee : ${studentFee - studentDiscount}`}</p>
    </div>
  )
}
export default BatchFeeConfig
