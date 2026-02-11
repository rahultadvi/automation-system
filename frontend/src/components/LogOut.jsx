import React from 'react'

function LogOut({handleLogout}) {
  return (
<div className="flex justify-between items-center mb-8">

  {/* LEFT SIDE */}
  <h1 className="text-3xl font-bold">
    
  </h1>

  {/* RIGHT SIDE */}
  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
  >
    Logout
  </button>

</div>

  )
}

export default LogOut
