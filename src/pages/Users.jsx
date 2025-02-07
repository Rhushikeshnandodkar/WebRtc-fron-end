import React from 'react'
import { useState, useEffect } from 'react'

function Users() {
    const[users, setUsers] = useState([])
    const[loading, setLoading] = useState(true)

    useEffect(() =>{
        fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) =>response.json())
        .then((data) => {
            console.log("data is ....." + data)
            setUsers(data)
            setLoading(false)
        })
        .catch((error) =>{
            console.log(error)
            setLoading(false)
        })
    }, [])
  return (
    <>
    <div>Users</div>
    {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </>
  )
}

export default Users