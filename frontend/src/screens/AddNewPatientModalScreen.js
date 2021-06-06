import React from 'react'
import { getDepartments } from '../api/departments'
import { useQuery } from 'react-query'
import { getRooms } from '../api/rooms'
import { getPatients } from '../api/patients'

const AddNewPatientModalScreen = ({
  submitHandler,
  isLoadingAddPatient,
  register,
  handleSubmit,
  watch,
  errors,
  reset,
}) => {
  const { data: departmentData } = useQuery(
    'departments',
    () => getDepartments(),
    { retry: 0 }
  )

  const { data: roomData } = useQuery('rooms', () => getRooms(), { retry: 0 })
  const { data: patientsData } = useQuery('patients', () => getPatients(), {
    retry: 0,
    refetchInterval: 10000,
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
          patient.status === 'Admitted' &&
          Number(patient.bed)
      )
    let numArr = [...Array(!bed ? 0 : bed).keys()].map((x) => x + 1)

    let filtered = numArr.filter((x) => !occupiedBeds.includes(x))

    return filtered.map((bed) => (
      <option key={bed} value={bed}>
        {bed}
      </option>
    ))
  }

  return (
    <div
      className='modal fade'
      id='addNewPatient'
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
                      <option value='Dr. Mohamed Haji'>Dr. Mohamed Haji</option>
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

              <hr />

              <div className='row'>
                <div className='col-md-3 col-12'>
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
                <div className='col-md-3 col-12'>
                  <div className='mb-3'>
                    <label htmlFor='dateIn'>Admission Date</label>
                    <input
                      {...register('dateIn', {
                        required: 'Admission date is required',
                      })}
                      type='datetime-local'
                      placeholder='Enter dateIn'
                      className='form-control'
                      autoFocus
                    />
                    {errors.dateIn && (
                      <span className='text-danger'>
                        {errors.dateIn.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className='col-md-3 col-12'>
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
                      <span className='text-danger'>{errors.room.message}</span>
                    )}
                  </div>
                </div>

                <div className='col-md-3 col-12'>
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
                      <span className='text-danger'>{errors.bed.message}</span>
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
                disabled={isLoadingAddPatient}
              >
                {isLoadingAddPatient ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddNewPatientModalScreen
