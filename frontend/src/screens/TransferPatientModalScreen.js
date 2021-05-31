import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getPatients, updatePatientTransfer } from '../api/patients'
import { getDepartments } from '../api/departments'
import { getRooms } from '../api/rooms'
import Message from '../components/Message'

const TransferPatientModalScreen = ({ data }) => {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const {
    isLoading: isLoadingUpdatePatientTransfer,
    isError: isErrorUpdatePatientTransfer,
    error: errorUpdatePatientTransfer,
    isSuccess: isSuccessUpdatePatientTransfer,
    mutateAsync: updatePatientTransferMutateAsync,
  } = useMutation(['updatePatientTransfer'], updatePatientTransfer, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['patientDetails', data && data._id])
      queryClient.invalidateQueries('patients')
    },
  })

  const { data: departmentData } = useQuery(
    'departments',
    () => getDepartments(),
    { retry: 0 }
  )

  const { data: roomData } = useQuery('rooms', () => getRooms(), { retry: 0 })
  const { data: patientsData } = useQuery('patients', () => getPatients(), {
    retry: 0,
  })

  const vacantBeds = () => {
    const bedArr =
      roomData &&
      roomData.filter(
        (room) =>
          room.isActive &&
          room.department.name === watch().department &&
          room.name === watch().room &&
          room.bed
      )

    const bed = bedArr && bedArr.length > 0 && bedArr[0].bed

    const occupiedBeds =
      patientsData &&
      patientsData.map(
        (patient) =>
          patient.room === watch().room &&
          patient.department === watch().department &&
          Number(patient.bed)
      )
    let numArr = [...Array(bed).keys()].map((x) => x + 1)

    let filtered = numArr.filter((x) => !occupiedBeds.includes(x))

    return filtered.map((bed) => (
      <option key={bed} value={bed}>
        {bed}
      </option>
    ))
  }

  const submitHandler = (updatedData) => {
    updatePatientTransferMutateAsync({ updatedData, _id: data && data._id })
  }

  return (
    <>
      {isSuccessUpdatePatientTransfer && (
        <Message variant='success'>
          Patient transfer has been updated successfully.
        </Message>
      )}
      {isErrorUpdatePatientTransfer && (
        <Message variant='danger'>{errorUpdatePatientTransfer}</Message>
      )}
      <div
        className='modal fade'
        id='updatePatientTransfer'
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
                Patient Transfer
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
                      <label htmlFor='department'>Department</label>
                      <select
                        {...register('department', {
                          required: 'Department is required',
                        })}
                        type='text'
                        placeholder='Enter name'
                        className='form-control'
                      >
                        <option value=''>-----------</option>
                        {departmentData &&
                          departmentData.map(
                            (department) =>
                              department.isActive && (
                                <option
                                  key={department._id}
                                  value={department.name}
                                >
                                  {department.name}
                                </option>
                              )
                          )}
                      </select>
                      {errors.department && (
                        <span className='text-danger'>
                          {errors.department.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='col-md-4 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='room'>Room Name</label>
                      <select
                        {...register('room', {
                          required: 'Room name is required',
                        })}
                        type='text'
                        placeholder='Enter room'
                        className='form-control'
                        autoFocus
                      >
                        <option value=''>-----------</option>
                        {roomData &&
                          roomData.map(
                            (room) =>
                              room.isActive &&
                              room.department &&
                              room.department.name === watch().department && (
                                <option key={room._id} value={room.name}>
                                  {room.name}
                                </option>
                              )
                          )}
                      </select>
                      {errors.room && (
                        <span className='text-danger'>
                          {errors.room.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='col-md-4 col-12'>
                    <div className='mb-3'>
                      <label htmlFor='bed'>Bed</label>
                      <select
                        {...register('bed', {
                          required: 'Bed is required',
                        })}
                        type='text'
                        placeholder='Enter bed'
                        className='form-control'
                        autoFocus
                      >
                        <option value=''>-----------</option>
                        {vacantBeds()}
                      </select>
                      {errors.bed && (
                        <span className='text-danger'>
                          {errors.bed.message}
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
                  disabled={isLoadingUpdatePatientTransfer}
                >
                  {isLoadingUpdatePatientTransfer ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    'Transfer'
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

export default TransferPatientModalScreen
