import React, { useState } from 'react'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'

import { getRooms, updateRoom, deleteRoom, addRoom } from '../api/rooms'
import { getDepartments } from '../api/departments'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'

const RoomScreen = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
    },
  })

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'rooms',
    () => getRooms(),
    {
      retry: 0,
    }
  )
  const { data: departmentData } = useQuery(
    'departments',
    () => getDepartments(),
    { retry: 0 }
  )

  const {
    isLoading: isLoadingUpdateRoom,
    isError: isErrorUpdateRoom,
    error: errorUpdateRoom,
    isSuccess: isSuccessUpdateRoom,
    mutateAsync: updateRoomMutateAsync,
  } = useMutation(['updateRoom'], updateRoom, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['rooms'])
    },
  })

  const {
    isLoading: isLoadingDeleteRoom,
    isError: isErrorDeleteRoom,
    error: errorDeleteRoom,
    isSuccess: isSuccessDeleteRoom,
    mutateAsync: deleteRoomMutateAsync,
  } = useMutation(['deleteRoom'], deleteRoom, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['rooms']),
  })

  const {
    isLoading: isLoadingAddRoom,
    isError: isErrorAddRoom,
    error: errorAddRoom,
    isSuccess: isSuccessAddRoom,
    mutateAsync: addRoomMutateAsync,
  } = useMutation(['addRoom'], addRoom, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['rooms'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteRoomMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateRoomMutateAsync({
          _id: id,
          name: data.name,
          isActive: data.isActive,
          bed: data.bed,
          department: data.department,
        })
      : addRoomMutateAsync(data)
  }

  const editHandler = (room) => {
    setId(room._id)
    setEdit(true)
    setValue('name', room.name)
    setValue('isActive', room.isActive)
    setValue('bed', room.bed)
    setValue('department', room.department._id)
  }

  return (
    <div className='container'>
      <div
        className='modal fade'
        id='editRoomModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editRoomModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editRoomModalLabel'>
                {edit ? 'Edit Room' : 'Add Room'}
              </h3>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanHandler}
              ></button>
            </div>
            <div className='modal-body'>
              {isSuccessUpdateRoom && (
                <Message variant='success'>
                  Room has been updated successfully.
                </Message>
              )}
              {isErrorUpdateRoom && (
                <Message variant='danger'>{errorUpdateRoom}</Message>
              )}
              {isSuccessAddRoom && (
                <Message variant='success'>
                  Room has been Created successfully.
                </Message>
              )}
              {isErrorAddRoom && (
                <Message variant='danger'>{errorAddRoom}</Message>
              )}

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
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className='mb-3'>
                    <label htmlFor='name'>Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type='text'
                      placeholder='Enter name'
                      className='form-control'
                      autoFocus
                    />
                    {errors.name && (
                      <span className='text-danger'>{errors.name.message}</span>
                    )}
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='bed'>Bed</label>
                    <input
                      {...register('bed', { required: 'Bed is required' })}
                      type='text'
                      placeholder='Enter name'
                      className='form-control'
                      autoFocus
                    />
                    {errors.bed && (
                      <span className='text-danger'>{errors.bed.message}</span>
                    )}
                  </div>

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
                        departmentData.map((department) => (
                          <option key={department._id} value={department._id}>
                            {department.name}
                          </option>
                        ))}
                    </select>
                    {errors.department && (
                      <span className='text-danger'>
                        {errors.department.message}
                      </span>
                    )}
                  </div>

                  <div className='row'>
                    <div className='col'>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='isActive'
                          {...register('isActive')}
                          checked={watch().isActive}
                        />
                        <label className='form-check-label' htmlFor='isActive'>
                          is Active?
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary '
                      data-bs-dismiss='modal'
                      onClick={formCleanHandler}
                    >
                      Close
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary '
                      disabled={isLoadingAddRoom || isLoadingUpdateRoom}
                    >
                      {isLoadingAddRoom || isLoadingUpdateRoom ? (
                        <span className='spinner-border spinner-border-sm' />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='d-flex justify-content-between align-items-center'>
        <h3 className=''>Rooms</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editRoomModal'
        >
          <FaPlus className='mb-1' />
        </button>
      </div>

      {isSuccessDeleteRoom && (
        <Message variant='success'>Room has been deleted successfully.</Message>
      )}
      {isErrorDeleteRoom && (
        <Message variant='danger'>{errorDeleteRoom}</Message>
      )}
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
          <div className='table-responsive '>
            <table className='table table-sm hover bordered striped caption-top '>
              <caption>{data && data.length} records were found</caption>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DEPARTMENT</th>
                  <th>ROOM</th>
                  <th>BED</th>
                  <th>ACTIVE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((room) => (
                    <tr key={room._id}>
                      <td>{room._id}</td>
                      <td>
                        {room.department &&
                          room.department.name.charAt(0).toUpperCase() +
                            room.department.name.slice(1)}
                      </td>
                      <td>
                        {room.name.charAt(0).toUpperCase() + room.name.slice(1)}
                      </td>
                      <td>{room.bed}</td>
                      <td>
                        {room.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>
                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(room)}
                          data-bs-toggle='modal'
                          data-bs-target='#editRoomModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(room._id)}
                          disabled={isLoadingDeleteRoom}
                        >
                          {isLoadingDeleteRoom ? (
                            <span className='spinner-border spinner-border-sm' />
                          ) : (
                            <span>
                              {' '}
                              <FaTrash className='mb-1' /> Delete
                            </span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default RoomScreen
