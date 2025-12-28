const fileName = 'FootOrgHeader.tsx'
const area = 'body'

export const FootOrgHeader = (): React.ReactElement => {
  const funcName = 'FootOrgHeader'
  log.rend(funcName, fileName, area)

  return (
    <header className="text-sm font-bold text-gray-800 mt-3.5 ml-2 pb-4 shrink-0">
      Footage Organiser
    </header>
  )
}

export default FootOrgHeader
