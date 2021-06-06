import { Link } from 'react-router-dom'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { useQuery } from 'react-query'
import { getRooms } from '../api/rooms'
import { getPatients } from '../api/patients'

const OccupıedScreen = () => {
  const { data, isLoading, isError, error } = useQuery(
    'rooms',
    () => getRooms(),
    {
      retry: 0,
    }
  )

  const { data: patientsData } = useQuery('patients', () => getPatients(), {
    retry: 0,
    refetchInterval: 10000,
  })

  return (
    <div>
      <h2 className='text-center'>OCCUPIED ROOMS</h2> <hr />
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
        data &&
        data.map((room) => (
          <div className='mt-1' key={room._id}>
            <div className='row'>
              <div className='col-2'>
                <span className='btn btn-light btn-lg rounded-0'>
                  {room.department.name.toUpperCase()}
                </span>
              </div>
              <div className='col-2'>
                <span className='btn btn-light btn-lg rounded-0 mx-1'>
                  {room.name.toUpperCase()}
                </span>
              </div>
              <div className='col-8'>
                <span className='btn btn-secondary btn-lg rounded-0 mx-1'>
                  TOTAL {room.bed}
                </span>

                {patientsData &&
                  patientsData.map(
                    (patient) =>
                      patient.department === room.department.name &&
                      patient.status === 'Admitted' &&
                      patient.room === room.name &&
                      [...Array(room.bed).keys()].map(
                        (x) =>
                          patient.bed.includes(x + 1) && (
                            <>
                              <span key={x + 1}>
                                <Link
                                  to={`/patient/details/${patient.patientId}/${patient._id}`}
                                  className='btn bg-success text-light btn-lg rounded-0 mx-1'
                                >
                                  BED {patient.bed.includes(x + 1) && x + 1}
                                </Link>
                              </span>
                            </>
                          )
                      )
                  )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default OccupıedScreen
