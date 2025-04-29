const fileName: string = 'About.tsx'
const area: string = 'body'

const About = () => {
  const funcName: string = 'About'
  log.rend(funcName, fileName, area)

  return <div className="space-y-4 p-4 h-full overflow-y-auto pb-20 bg-white text-black">About</div>
}

export default About
