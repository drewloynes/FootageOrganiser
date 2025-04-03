/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ViewAllRules = () => {
  const [items, setItems] = useState([])

  const fetchList = async () => {
    console.log('Running fetchList')
    try {
      const data = await window.electron.getRules() // Call the IPC function
      console.log(data)
      setItems(data) // Update state with the received data
    } catch (error) {
      console.error('Failed to fetch list:', error)
    }
  }

  useEffect(() => {
    fetchList()

    const intervalId = setInterval(() => {
      // console.log('Running setInterval')
      fetchList()
    }, 2000)

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, []) // Empty array ensures this runs only once

  const navigate = useNavigate()

  return (
    <main className="flex-1 p-6 text-center">
      <h2 className="text-2xl font-bold mb-4 text-black">List of Rules</h2>
      {items.length > 0 ? (
        <ul className="list-disc">
          {items.map((item, index) => (
            <li key={index} className="text-lg">
              <div className="flex items-center border rounded-lg shadow-md p-4 w-full max-w-lg bg-white">
                {/* Left Side: Name & Button */}
                <div className="flex flex-col items-start w-1/3">
                  <h2 className="text-lg font-semibold text-black">{item.ruleName}</h2>
                  <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => navigate(`/edit-rule/${item.ruleName}`)}
                  >
                    Edit Rule
                  </button>
                </div>

                {/* Divider Line */}
                <div className="h-16 w-[2px] bg-gray-300 mx-4"></div>

                {/* Right Side: Description */}
                <div className="flex-1">
                  <p className="text-gray-700">{item.status}</p>
                </div>
                <div>
                  {item.stopAfterProcessing && item.status === 'Actions Awaiting Approval' && (
                    <div>
                      <button
                        className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
                        onClick={() => {
                          console.log('Pressed view pending work')
                          navigate(`/approval-list/${item.ruleName}`)
                        }}
                      >
                        View Pending Work
                      </button>
                      <div className="h-16 w-[2px] bg-gray-300 mx-4"></div>
                      <button
                        className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
                        onClick={() => {
                          window.electron.startRule(item.ruleName)
                          setItems((prevItems: any) =>
                            prevItems.map((rule) =>
                              rule.ruleName === item.ruleName
                                ? { ...rule, startActions: true }
                                : rule
                            )
                          )
                        }}
                      >
                        Run Rule
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  {item.stopAfterProcessing &&
                    (item.status === 'Actioning' || item.status === 'Queued Actions') && (
                      <div>
                        <div className="h-16 w-[2px] bg-gray-300 mx-4"></div>
                        <button
                          className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
                          onClick={() => {
                            window.electron.stopRule(item.ruleName)
                            setItems((prevItems: any) =>
                              prevItems.map((rule) =>
                                rule.ruleName === item.ruleName
                                  ? { ...rule, startActions: false }
                                  : rule
                              )
                            )
                          }}
                        >
                          Stop Rule
                        </button>
                      </div>
                    )}
                </div>
              </div>
              {/* <p className="text-lg font-semibold text-black">{item.name}</p> */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-black">Loading...</p>
      )}
    </main>
  )
}

export default ViewAllRules
