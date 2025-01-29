const MainContent = () => {
  return (
    <main className="flex-1 p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">List of Rules</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li className="text-gray-700">Rule 1: Always name your files properly.</li>
        <li className="text-gray-700">Rule 2: Organize footage into folders.</li>
        <li className="text-gray-700">Rule 3: Back up your footage regularly.</li>
        <li className="text-gray-700">Rule 4: Use metadata for better searchability.</li>
        <li className="text-gray-700">Rule 5: Delete unnecessary files to save space.</li>
      </ul>
    </main>
  )
}

export default MainContent
