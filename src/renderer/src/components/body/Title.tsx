const fileName: string = 'Title.tsx'
const area: string = 'body'

const Title = () => {
  const funcName: string = 'Title'
  log.rend(funcName, fileName, area)

  return (
    <h1 className="text-3xl font-bold font-serif flex h-16 bg-midnight text-black py-4">
      Footage Organiser
    </h1>
  )
}

export default Title
