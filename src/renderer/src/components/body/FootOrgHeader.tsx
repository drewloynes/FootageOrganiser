const fileName: string = 'FootOrgHeader.tsx'
const area: string = 'body'

export const FootOrgHeader = () => {
  const funcName: string = 'FootOrgHeader'
  log.rend(funcName, fileName, area)

  return (
    <header className="text-sm font-bold text-gray-800 mt-3.5 ml-2 pb-4 shrink-0">
      Footage Organiser
    </header>
  )
}

export default FootOrgHeader
