import React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { updatePatient } from '../api/patients'
import Message from '../components/Message'

const UpdatePatientInfoModalScreen = ({ data }) => {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  setValue('patientId', data && data.patientId)
  setValue('patient', data && data.patient)
  setValue('doctor', data && data.doctor)
  setValue('guardian', data && data.guardian)
  setValue('relationship', data && data.relationship)
  setValue('contact', data && data.contact)

  const {
    isLoading: isLoadingUpdatePatientInfo,
    isError: isErrorUpdatePatientInfo,
    error: errorUpdatePatientInfo,
    isSuccess: isSuccessUpdatePatientInfo,
    mutateAsync: updatePatientInfoMutateAsync,
  } = useMutation(['updatePatientInfo'], updatePatient, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['patientDetails', data && data._id])
      queryClient.invalidateQueries('patients')
    },
  })

  const submitHandler = (updatedData) => {
    updatePatientInfoMutateAsync({ updatedData, _id: data && data._id })
  }

  return (
    <>
      {isSuccessUpdatePatientInfo && (
        <Message variant='success'>
          Patient info has been updated successfully.
        </Message>
      )}
      {isErrorUpdatePatientInfo && (
        <Message variant='danger'>{errorUpdatePatientInfo}</Message>
      )}
      <div
        className='modal fade'
        id='updatePatientInfo'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='staticBackdropLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h5 className='modal-title' id='staticBackdropLabel'>
                Add New Patient
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={() => reset()}
              ></button>
            </div>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className='modal-body'>
                <div className='row'>
                  <div className='col-md-4 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='patientId'>Patient ID</label>
                      <input
                        {...register('patientId', {
                          required: 'Patient ID is required',
                        })}
                        type='text'
                        placeholder='Enter patient ID'
                        className='form-control'
                        autoFocus
                      />
                      {errors.patientId && (
                        <span className='text-danger'>
                          {errors.patientId.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='col-md-4 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='patient'>Patient Name</label>
                      <input
                        {...register('patient', {
                          required: 'Patient Name is required',
                        })}
                        type='text'
                        placeholder='Enter patient Name'
                        className='form-control'
                        autoFocus
                      />
                      {errors.patient && (
                        <span className='text-danger'>
                          {errors.patient.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='col-md-4 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='doctor'>Doctor</label>
                      <select
                        {...register('doctor', {
                          required: 'Doctor is required',
                        })}
                        type='text'
                        placeholder='Enter doctor'
                        className='form-control'
                        autoFocus
                      >
                        <option value=''>--------</option>
                        <option value='Dr. Abdirashid Sheyk Yusuf'>
                          Dr. Abdirashid Sheyk Yusuf
                        </option>
                        <option value='Dr. Tony Kashe'>Dr. Tony Kashe</option>
                        <option value='Dr. Mohamed Haji'>
                          Dr. Mohamed Haji
                        </option>
                        <option value='Dr. Ramez'>Dr. Ramez</option>
                        <option value='Dr. Ali Tamim'>Dr. Ali Tamim</option>
                        <option value='Dr. Ramla'>Dr. Ramla</option>
                        <option value='Dr. Ramez'>Dr. Ramez</option>
                        <option value='Dr. Anas'>Dr. Anas</option>
                        <option value='Dr. Abdirahman Dhere'>
                          Dr. Abdirahman Dhere
                        </option>
                        <option value='Dr. Abdalla Hagazi'>
                          Dr. Abdalla Hagazi
                        </option>
                      </select>
                      {errors.doctor && (
                        <span className='text-danger'>
                          {errors.doctor.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <hr />
                <div className='row'>
                  <div className='col-md-4 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='guardian'>Guardian</label>
                      <input
                        {...register('guardian', {
                          required: 'Guardian is required',
                        })}
                        type='text'
                        placeholder='Enter guardian name'
                        className='form-control'
                        autoFocus
                      />
                      {errors.guardian && (
                        <span className='text-danger'>
                          {errors.guardian.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='col-md-4 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='relationship'>Relationship</label>
                      <input
                        {...register('relationship', {
                          required: 'Relationship is required',
                        })}
                        type='text'
                        placeholder='Enter relationship'
                        className='form-control'
                        autoFocus
                      />
                      {errors.relationship && (
                        <span className='text-danger'>
                          {errors.relationship.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='col-md-4 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='contact'>Contact</label>
                      <input
                        {...register('contact', {
                          required: 'Contact is required',
                        })}
                        type='number'
                        placeholder='Enter contact'
                        className='form-control'
                        autoFocus
                      />
                      {errors.contact && (
                        <span className='text-danger'>
                          {errors.contact.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-bs-dismiss='modal'
                  onClick={() => reset()}
                >
                  Close
                </button>
                <button
                  type='submit'
                  className='btn btn-primary '
                  disabled={isLoadingUpdatePatientInfo}
                >
                  {isLoadingUpdatePatientInfo ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    'Update'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdatePatientInfoModalScreen
