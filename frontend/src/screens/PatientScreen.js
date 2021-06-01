import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Message from '../components/Message'
import Moment from 'react-moment'
import moment from 'moment'
import { getPatients, addPatient, deletePatient } from '../api/patients'
import { useQuery, useQueryClient, useMutation } from 'react-query'

import Loader from 'react-loader-spinner'
import { FaFileMedicalAlt, FaTrash, FaUserPlus } from 'react-icons/fa'
import AddNewPatientModalScreen from './AddNewPatientModalScreen'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'

const PatientScreen = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')

  const { data, error, isLoading, isError } = useQuery(
    'patients',
    async () => await getPatients(),
    { retry: 0, refetchInterval: 10000 }
  )

  const {
    isLoading: isLoadingAddPatient,
    isError: isErrorAddPatient,
    error: errorAddPatient,
    isSuccess: isSuccessAddPatient,
    mutateAsync: addPatientMutateAsync,
  } = useMutation(addPatient, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['patients'])
    },
  })

  const {
    isLoading: isLoadingDeletePatient,
    isError: isErrorDeletePatient,
    error: errorDeletePatient,
    isSuccess: isSuccessDeletePatient,
    mutateAsync: DeletePatientMutateAsync,
  } = useMutation(deletePatient, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['patients']),
  })

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => DeletePatientMutateAsync(id)))
  }

  const submitHandler = (data) => {
    addPatientMutateAsync(data)
  }

  return (
    <>
      {isErrorDeletePatient && (
        <Message variant='danger'>{errorDeletePatient}</Message>
      )}
      {isSuccessDeletePatient && (
        <Message variant='success'>
          Patient has been deleted successfully
        </Message>
      )}

      {isSuccessAddPatient && (
        <Message variant='success'>
          Patient has been admitted successfully
        </Message>
      )}
      {isErrorAddPatient && (
        <Message variant='danger'>{errorAddPatient}</Message>
      )}

      <div className='d-flex justify-content-between'>
        <h3 className=''>Inpatient List</h3>
        <button
          className='float-end mb-1 pt-2 btn-light btn-sm'
          data-bs-toggle='modal'
          data-bs-target='#addNewPatient'
        >
          <FaUserPlus className='mb-1 text-success  ' />
          Add New Patient
        </button>
      </div>
      <input
        type='text'
        className='form-control text-info '
        placeholder='Search by Patient ID'
        name='search'
        value={search}
        onChange={(e) => setSearch(e.target.value.toUpperCase())}
        autoFocus
        required
      />

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
          <div className='table-responsive'>
            <table className='table table-sm hover bordered striped caption-top '>
              <caption>{!isLoading && data.length} records were found</caption>
              <thead>
                <tr>
                  <th>PATIENT ID</th>
                  <th>NAME</th>
                  <th>DOCTOR</th>
                  <th>DEPARTMENT</th>
                  <th>ROOM</th>
                  <th>BED</th>
                  <th>DATE-IN</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  data.length > 0 &&
                  data.map(
                    (patient) =>
                      patient.patientId.includes(search) && (
                        <tr key={patient._id}>
                          <td>{patient.patientId}</td>
                          <td>{patient.patient}</td>
                          <td>{patient.doctor}</td>
                          <td>{patient.department.toUpperCase()}</td>
                          <td>{patient.room.toUpperCase()}</td>
                          <td> {patient.bed}</td>
                          <td>
                            <Moment format='YYYY-MM-DD HH:mm:ss'>
                              {moment(patient.dateIn)}
                            </Moment>
                          </td>
                          <td>
                            {patient.status === 'Admitted'
                              ? 'Inpatient'
                              : 'Discharged'}
                          </td>
                          <th className='btn-group'>
                            <Link
                              to={`/patient/details/${patient.patientId}/${patient._id}`}
                              className='btn btn-primary btn-sm border-0'
                            >
                              <FaFileMedicalAlt className='mb-1' /> Detail
                            </Link>
                            {patient.status !== 'Discharged' && (
                              <button
                                className='btn btn-danger btn-sm ms-1'
                                onClick={() => deleteHandler(patient._id)}
                                disabled={isLoadingDeletePatient}
                              >
                                {isLoadingDeletePatient ? (
                                  <span className='spinner-border spinner-border-sm' />
                                ) : (
                                  <span>
                                    {' '}
                                    <FaTrash className='mb-1' /> Delete
                                  </span>
                                )}
                              </button>
                            )}
                          </th>
                        </tr>
                      )
                  )}
              </tbody>
            </table>
          </div>

          <AddNewPatientModalScreen
            submitHandler={submitHandler}
            isLoadingAddPatient={isLoadingAddPatient}
            register={register}
            handleSubmit={handleSubmit}
            watch={watch}
            errors={errors}
            reset={reset}
          />
        </>
      )}
    </>
  )
}

export default PatientScreen
