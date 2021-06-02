import { Link } from 'react-router-dom'
import {
  FaBuilding,
  FaCog,
  FaFileContract,
  FaProcedures,
  FaUser,
  FaUserCircle,
  FaUsers,
} from 'react-icons/fa'

const HeaderAuthorized = () => {
  const userInfo =
    localStorage.getItem('userInfo') &&
    JSON.parse(localStorage.getItem('userInfo'))

  return (
    <>
      <nav className='sticky-top' id='sidebar'>
        <div className='container-fluid pt-3'>
          <Link to='/' className='navbar-brand fw-bold fs-6'>
            H.B.M.S
          </Link>
          <ul
            className='navbar-nav text-light d-flex justify-content-between'
            style={{ height: 'calc(100vh - 100px)' }}
          >
            <div>
              <li className='nav-item dropdown'>
                <span
                  className='nav-link dropdown-toggle'
                  id='navbarDropdown'
                  role='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  <FaUserCircle className='mb-1' /> {userInfo && userInfo.name}
                </span>
                <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
                  <li>
                    <Link to='/profile' className='dropdown-item'>
                      <FaUser className='mb-1' /> Profile
                    </Link>
                  </li>
                </ul>
              </li>
              <li className='nav-item'>
                <Link to='/occupied' className='nav-link'>
                  <FaProcedures className='mb-1' /> Occupied Beds
                </Link>
              </li>
            </div>

            {userInfo && userInfo.roles.includes('Admin') && (
              <>
                <li className='nav-item dropdown '>
                  <span
                    className='nav-link dropdown-toggle'
                    id='navbarDropdown'
                    role='button'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                  >
                    <FaCog className='mb-1' /> Admin
                  </span>
                  <ul
                    className='dropdown-menu '
                    aria-labelledby='navbarDropdown'
                  >
                    <li>
                      <Link to='/admin/users' className='dropdown-item'>
                        <FaUsers className='mb-1' /> Users
                      </Link>
                    </li>
                    <li>
                      <Link to='/admin/users/logs' className='dropdown-item'>
                        <FaFileContract className='mb-1' /> Users Log
                      </Link>
                    </li>

                    <li>
                      <Link to='/admin/departments' className='dropdown-item'>
                        <FaBuilding className='mb-1' /> Departments
                      </Link>
                    </li>

                    <li>
                      <Link to='/admin/rooms' className='dropdown-item'>
                        <FaProcedures className='mb-1' /> Rooms
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  )
}

export default HeaderAuthorized
