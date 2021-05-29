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

import {
  getDepartments,
  updateDepartment,
  deleteDepartment,
  addDepartment,
} from '../api/departments'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'

const DepartmentScreen = () => {
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
    'departments',
    () => getDepartments(),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingUpdateDepartment,
    isError: isErrorUpdateDepartment,
    error: errorUpdateDepartment,
    isSuccess: isSuccessUpdateDepartment,
    mutateAsync: updateDepartmentMutateAsync,
  } = useMutation(['updateDepartment'], updateDepartment, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['departments'])
    },
  })

  const {
    isLoading: isLoadingDeleteDepartment,
    isError: isErrorDeleteDepartment,
    error: errorDeleteDepartment,
    isSuccess: isSuccessDeleteDepartment,
    mutateAsync: deleteDepartmentMutateAsync,
  } = useMutation(['deleteDepartment'], deleteDepartment, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['departments']),
  })

  const {
    isLoading: isLoadingAddDepartment,
    isError: isErrorAddDepartment,
    error: errorAddDepartment,
    isSuccess: isSuccessAddDepartment,
    mutateAsync: addDepartmentMutateAsync,
  } = useMutation(['addDepartment'], addDepartment, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['departments'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteDepartmentMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateDepartmentMutateAsync({
          _id: id,
          name: data.name,
          isActive: data.isActive,
        })
      : addDepartmentMutateAsync(data)
  }

  const editHandler = (department) => {
    setId(department._id)
    setEdit(true)
    setValue('name', department.name)
    setValue('isActive', department.isActive)
  }

  return (
    <div className='container'>
      <div
        className='modal fade'
        id='editDepartmentModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editDepartmentModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editDepartmentModalLabel'>
                {edit ? 'Edit Department' : 'Add Department'}
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
              {isSuccessUpdateDepartment && (
                <Message variant='success'>
                  Department has been updated successfully.
                </Message>
              )}
              {isErrorUpdateDepartment && (
                <Message variant='danger'>{errorUpdateDepartment}</Message>
              )}
              {isSuccessAddDepartment && (
                <Message variant='success'>
                  Department has been Created successfully.
                </Message>
              )}
              {isErrorAddDepartment && (
                <Message variant='danger'>{errorAddDepartment}</Message>
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
                      disabled={
                        isLoadingAddDepartment || isLoadingUpdateDepartment
                      }
                    >
                      {isLoadingAddDepartment || isLoadingUpdateDepartment ? (
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
        <h3 className=''>Departments</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editDepartmentModal'
        >
          <FaPlus className='mb-1' />
        </button>
      </div>

      {isSuccessDeleteDepartment && (
        <Message variant='success'>
          Department has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteDepartment && (
        <Message variant='danger'>{errorDeleteDepartment}</Message>
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
                  <th>DEPARTMENT NAME</th>
                  <th>ACTIVE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((department) => (
                    <tr key={department._id}>
                      <td>{department._id}</td>
                      <td>
                        {department.name.charAt(0).toUpperCase() +
                          department.name.slice(1)}
                      </td>
                      <td>
                        {department.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>
                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(department)}
                          data-bs-toggle='modal'
                          data-bs-target='#editDepartmentModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(department._id)}
                          disabled={isLoadingDeleteDepartment}
                        >
                          {isLoadingDeleteDepartment ? (
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

export default DepartmentScreen
