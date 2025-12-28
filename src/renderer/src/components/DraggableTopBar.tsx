const fileName = 'DraggableTopBar.tsx'
const area = 'app'

function DraggableTopBar(): React.ReactElement {
  const funcName = 'DraggableTopBar'
  log.rend(funcName, fileName, area)

  return <header className="absolute inset-0 bg-transparent h-12 " />
}

export default DraggableTopBar
