import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPatientDetails, getPatientTransfer } from '../api/patients'
import { useQuery } from 'react-query'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import {
  FaArrowAltCircleLeft,
  FaCheckCircle,
  FaEdit,
  FaUserInjured,
} from 'react-icons/fa'
import moment from 'moment'
import UpdatePatientInfoModalScreen from './UpdatePatientInfoModalScreen'
import TransferPatientModalScreen from './TransferPatientModalScreen'
import DischargePatientModalScreen from './DischargePatientModalScreen'

const PatientDetailScreen = () => {
  const { id, patientId } = useParams()

  const { data, error, isLoading, isError } = useQuery(
    ['patientDetails', id],
    async () => await getPatientDetails(id),
    { retry: 0 }
  )

  const { data: transferData, isLoading: isLoadingTransfer } = useQuery(
    ['transfer', patientId],
    async () => await getPatientTransfer(patientId),
    { retry: 0 }
  )

  console.log(transferData)

  return (
    <div>
      {isLoading ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div className='row'>
            <div className='col-md-7 col-12'>
              <p className='d-flex justify-content-between'>
                <Link to='/' className=''>
                  <FaArrowAltCircleLeft className='mb-1' /> Go Back
                </Link>
                <span className='fw-bold'>Patient Admission Info</span>{' '}
                {data.status !== 'Discharged' && (
                  <span className='btn-group'>
                    <button
                      className='btn btn-primary btn-sm mx-1'
                      data-bs-toggle='modal'
                      data-bs-target='#updatePatientTransfer'
                    >
                      Transfer
                    </button>
                    <button
                      className='btn btn-danger btn-sm mx-1'
                      data-bs-toggle='modal'
                      data-bs-target='#updatePatientDischarge'
                    >
                      Discharge
                    </button>
                  </span>
                )}
              </p>
              <hr />
              <div className='table-responsive'>
                <table className='table table-sm hover bordered striped caption-top '>
                  <thead>
                    <tr>
                      <th>DATE-IN</th>
                      <th>DEPARTMENT</th>
                      <th>ROOM</th>
                      <th>BED</th>
                      <th>STATUS</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{moment(data.dateIn).format('lll')}</td>
                      <td>{data.department.toUpperCase()}</td>
                      <td>{data.room.toUpperCase()}</td>
                      <td>{data.bed}</td>
                      <td>
                        {data.status === 'Admitted' ? (
                          <FaCheckCircle className='mb-1 text-success' />
                        ) : (
                          data.status === 'Discharged' && (
                            <FaCheckCircle className='mb-1 text-secondary' />
                          )
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {isLoadingTransfer ? (
                <div className='text-center'>
                  <Loader
                    type='ThreeDots'
                    color='#00BFFF'
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                  />
                </div>
              ) : (
                <>
                  {transferData && transferData.length > 0 && (
                    <>
                      <h6 className='fw-bold text-center mt-5 pt-5'>
                        Patient Transfer History
                      </h6>
                      <hr />
                      <div className='table-responsive'>
                        <table className='table table-sm hover bordered striped caption-top '>
                          <thead>
                            <tr>
                              <th>DATE & TIME</th>
                              <th>DOCTOR</th>
                              <th>DEPARTMENT</th>
                              <th>ROOM</th>
                              <th>BED</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {transferData &&
                              transferData.map((transfer) => (
                                <tr key={transfer._id}>
                                  <td>
                                    {moment(transfer.dateIn).format('lll')}
                                  </td>
                                  <td>{transfer.doctor}</td>
                                  <td>{transfer.department.toUpperCase()}</td>
                                  <td>{transfer.room.toUpperCase()}</td>
                                  <td>{transfer.bed}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className='col-md-4 col-12 border-start border-info'>
              <p className=''>
                <span className='fw-bold'>Patient Info </span>
                {data.status !== 'Discharged' && (
                  <span className='float-end text-primary'>
                    <button
                      className='btn btn-primary btn-sm mx-1'
                      data-bs-toggle='modal'
                      data-bs-target='#updatePatientInfo'
                    >
                      <FaEdit className='mb-1' /> Edit Patient Info
                    </button>
                  </span>
                )}
              </p>{' '}
              <hr />
              <p className=''>
                <FaUserInjured className='display-1' />
              </p>
              <p className='fs-3 mb-1 fw-light'>{data.patient}</p>
              <div>
                <span className='fw-bold'>Patient ID: </span> {data.patientId}
                <br />
                <span className='fw-bold'>Doctor: </span> {data.doctor}
                <br />
                <span className='fw-bold'>Admission Date-In: </span>
                {moment(data.dateIn).format('lll')} <br />
                <span className='fw-bold'>Status: </span>{' '}
                <span className='bg-info px-2 rounded-1 text-light'>
                  {data.status} <br />
                </span>
                <span className='fw-bold'>Guardian: </span>
                {data.guardian} <br />
                <span className='fw-bold'>Relationship: </span>
                {data.relationship} <br />
                <span className='fw-bold'>Contact: </span>
                {data.contact} <br />
              </div>
            </div>
          </div>
          <UpdatePatientInfoModalScreen data={!isLoading && data} />
          <TransferPatientModalScreen data={!isLoading && data} />
          <DischargePatientModalScreen data={!isLoading && data} />
        </>
      )}
    </div>
  )
}

export default PatientDetailScreen
