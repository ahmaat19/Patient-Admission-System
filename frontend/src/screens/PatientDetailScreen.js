import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPatientDetails } from '../api/patients'
import { useQuery } from 'react-query'
import Loader from 'react-loader-spinner'
import Message from '../components/Message'
import {
  FaArrowAltCircleLeft,
  FaCheckCircle,
  FaEdit,
  FaTimesCircle,
  FaUserInjured,
} from 'react-icons/fa'
import moment from 'moment'
import UpdatePatientInfoModalScreen from './UpdatePatientInfoModalScreen'

const PatientDetailScreen = () => {
  const { id } = useParams()

  const { data, error, isLoading, isError } = useQuery(
    ['patientDetails', id],
    async () => await getPatientDetails(id),
    { retry: 0 }
  )

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
                <span className='fw-bold'>Patient Admission History</span>{' '}
                <span className='btn-group'>
                  <button className='btn btn-primary btn-sm mx-1'>
                    Transfer
                  </button>
                  <button className='btn btn-danger btn-sm mx-1'>
                    Discharge
                  </button>
                </span>
              </p>
              <hr />
              <div className='table-responsive'>
                <table className='table table-sm hover bordered striped caption-top '>
                  <caption>
                    {data.room && data.room.length} updated history
                  </caption>
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
                    {data &&
                      data.room &&
                      data.room.length > 0 &&
                      data.room.map((r) => (
                        <tr key={r._id}>
                          <td>{moment(r.date).format('lll')}</td>
                          <td>{r.department.toUpperCase()}</td>
                          <td>{r.room.toUpperCase()}</td>
                          <td>{r.bed}</td>
                          <td>
                            {r.status === 'Admitted' ? (
                              <FaCheckCircle className='mb-1 text-success' />
                            ) : r.status === 'Transferred' ? (
                              <FaTimesCircle className='mb-1 text-secondary' />
                            ) : (
                              r.status === 'Discharged' && (
                                <FaCheckCircle className='mb-1 text-secondary' />
                              )
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='col-md-4 col-12 border-start border-info'>
              <p className=''>
                <span className='fw-bold'>Patient Info </span>
                <span className='float-end text-primary'>
                  <button
                    className='btn btn-primary btn-sm mx-1'
                    data-bs-toggle='modal'
                    data-bs-target='#updatePatientInfo'
                  >
                    <FaEdit className='mb-1' /> Edit Patient Info
                  </button>
                </span>
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
                {moment(data.createdAt).format('lll')} <br />
                <span className='fw-bold'>Status: </span>{' '}
                <span className='bg-info px-2 rounded-1 text-light'>
                  {data.room && data.room.slice(-1)[0].status} <br />
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
        </>
      )}
    </div>
  )
}

export default PatientDetailScreen
