import React from 'react'
import { useParams } from 'react-router-dom'

function Products() {
  const {id} = useParams();
  return (
    <div>Product id is {id}</div>
  )
}

export default Products