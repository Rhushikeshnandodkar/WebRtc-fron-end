import React from 'react'
import Navbar from '../molecules/Navbar'
import { useState } from 'react'
function Home() {
    const [entries, setEntries] = useState([])
    const [newEntry, setNewEntry] = useState('')
    const handleInputChange = (e) =>{
        setNewEntry(e.target.value)
    }
    const addEntry = () =>{
        if(newEntry.trim() === ''){
            alert("please enter valid entry")
            return;
        }
        setEntries([...entries, newEntry])
        setNewEntry('')
    }
    const deleteEntry = (index) =>{
        setEntries(entries.filter((_, i)=> i != index))
    }
  return (
    <>
    <div style={{ padding: '20px' }}>
      <h1>Simple CRUD App - Step 1</h1>
      <input type="text"
      placeholder='enter new entry'
      value={newEntry}
      onChange={handleInputChange}
       />
       <button onClick={addEntry}></button>
      {/* Display Entries */}
      <h2>Entries:</h2>
      {entries.length > 0 ? (
        <ul>
          {entries.map((entry, index) => (
            <li key={index}>{entry}
            <button onClick={() => deleteEntry(index)}>Delete</button></li>
          ))}
        </ul>
      ) : (
        <p>No entries available.</p>
      )}
    </div>
    </>
  )
}

export default Home