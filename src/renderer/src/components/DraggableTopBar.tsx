const fileName: string = 'DraggableTopBar.tsx'
const area: string = 'app'

function DraggableTopBar() {
  const funcName: string = 'DraggableTopBar'
  log.rend(funcName, fileName, area)

  return <header className="absolute inset-0 bg-transparent h-12 " />
}

export default DraggableTopBar
