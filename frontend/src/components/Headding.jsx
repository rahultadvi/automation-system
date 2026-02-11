import React from 'react'

function Headding() {
  return (
    <div>
         <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-900 px-6 py-4 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">

  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
      WhatsApp Messaging Dashboard
    </h1>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Send and manage WhatsApp messages easily
    </p>
  </div>

  <div className="hidden sm:flex items-center gap-3">
    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-1 rounded-full text-sm font-medium">
      Live Panel
    </span>
  </div>

</div>
    </div>
  )
}

export default Headding
