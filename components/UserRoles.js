import { useState, useEffect } from 'react'
import { parseCookies } from 'nookies'
import baseUrl from '../helpers/baseUrl'

function UserRoles() {
    const [users, setUsers] = useState([])
    const { token } = parseCookies()
    useEffect(() => {
        fetchUsers()
    }, [])

    /* fetch User data */
    const fetchUsers = async () => {
        const res = await fetch(`${baseUrl}/api/users`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        const res2 = await res.json()
        setUsers(res2)
    }

    /* user role updated to admin and updates the DB */
    const handleRole = async (_id, role) => {
        const res = await fetch(`${baseUrl}/api/users`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                _id: _id,
                role: role
            })
        })
        const res2 = await res.json()
        console.log("handleRole ", res2)
        const updatedUsers = users.map(user => {
            if ((user.role != res2.role) && (user.email == res2.email)) {
                return res2
            } else {
                return user
            }
        })
        setUsers(updatedUsers)
    }

    return (
        <>
            <h4 className="userrole-heading">User Roles</h4>
            <table className="userrole-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => {
                        return (
                            <tr>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td className="userrole" onClick={() => handleRole(user._id, user.role)}>{user.role}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

export default UserRoles