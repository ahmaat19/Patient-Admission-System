import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { updatePatientDischarge } from '../api/patients'
import Message from '../components/Message'

const DischargePatientModalScreen = ({ data }) => {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const {
    isLoading: isLoadingUpdatePatientDischarge,
    isError: isErrorUpdatePatientDischarge,
    error: errorUpdatePatientDischarge,
    isSuccess: isSuccessUpdatePatientDischarge,
    mutateAsync: updatePatientDischargeMutateAsync,
  } = useMutation(['updatePatientDischarge'], updatePatientDischarge, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['patientDetails', data && data._id])
      queryClient.invalidateQueries('patients')
    },
  })

  const submitHandler = (updatedData) => {
    updatePatientDischargeMutateAsync({ updatedData, _id: data && data._id })
  }

  return (
    <>
      {isSuccessUpdatePatientDischarge && (
        <Message variant='success'>Patient discharged successfully.</Message>
      )}
      {isErrorUpdatePatientDischarge && (
        <Message variant='danger'>{errorUpdatePatientDischarge}</Message>
      )}
      <div
        className='modal fade'
        id='updatePatientDischarge'
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
                Patient Discharge
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
                  <div className='col-md-5 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='dateOut'>Discharge Date</label>
                      <input
                        {...register('dateOut', {
                          required: 'Discharge date is required',
                        })}
                        type='datetime-local'
                        placeholder='Enter discharge date '
                        className='form-control'
                        autoFocus
                      />
                      {errors.dateOut && (
                        <span className='text-danger'>
                          {errors.dateOut.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='col-md-7 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='description'>Discharge Description</label>
                      <textarea
                        {...register('description', {
                          required: 'Discharge description is required',
                        })}
                        cols='30'
                        rows='5'
                        placeholder='Enter discharge description '
                        className='form-control'
                      />
                      {errors.description && (
                        <span className='text-danger'>
                          {errors.description.message}
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
                  disabled={isLoadingUpdatePatientDischarge}
                >
                  {isLoadingUpdatePatientDischarge ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    'Discharge'
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

export default DischargePatientModalScreen
