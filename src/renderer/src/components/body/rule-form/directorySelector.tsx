import { Button } from '@renderer/components/ui/button'
import { ShortPathInVolume } from '@shared/types/pathInVolumeTypes'

// type DirectorySelectorType = {
//   watch: UseFormWatch<any>
//   setValue: UseFormSetValue<any>
//   directory: string
//   buttonText: string
// }

// export const DirectorySelector = ({
//   watch,
//   setValue,
//   directory,
//   buttonText
// }: DirectorySelectorType) => {
//   const [driveName, setDriveName] = useState<string | undefined>()
//   const [drivePath, setDrivePath] = useState<string | undefined>()

//   const selectFolder = async (field: string) => {
//     if (!window.electron?.chooseDirectory) {
//       return
//     }
//     const result = await window.electron.chooseDirectory()
//     console.log(result)
//     if (result) {
//       setValue(field + '.volumeName', result.volumeName) // Updates the form state
//       setValue(field + '.volumePath', result.volumePath) // Updates the form state
//     }
//   }

//   // Use useEffect to listen for changes in the watched directory values
//   useEffect(() => {
//     setDriveName(watch(`${directory}.volumeName`))
//     setDrivePath(watch(`${directory}.voumePath`))
//   }, [watch(directory)])

//   return (
//     <div>
//       {(driveName || drivePath) && (
//         <div className="mb-2 text-center">
//           <p className="text-lg font-semibold text-black">Drive Name: {driveName}</p>
//           <p className="text-lg font-semibold text-black">Drive Path: {drivePath}</p>
//         </div>
//       )}
//       <Button type="button" className="flex-[45%]" onClick={() => selectFolder(directory)}>
//         {buttonText}
//       </Button>
//     </div>
//   )
// }

// TODO Tru tp clean up to make more type safe

import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'

type DirectorySelectorProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues> // fully dynamic path e.g. "copyFileOptions.otherPaths.2"
  buttonText: string
}

export function DirectorySelector<TFieldValues extends FieldValues>({
  control,
  name,
  buttonText
}: DirectorySelectorProps<TFieldValues>) {
  const {
    field: { value, onChange }
  } = useController({
    control,
    name
  })

  const selectFolder = async () => {
    if (!window.electron?.chooseDirectory) return
    const result: ShortPathInVolume | undefined = await window.electron.chooseDirectory()
    console.log(result)
    if (result) {
      onChange({
        ...value,
        volumeName: result.volumeName,
        pathFromVolumeRoot: result.pathFromVolumeRoot
      })
    }
  }

  return (
    <div>
      {(value?.volumeName || value?.pathFromVolumeRoot) && (
        <div className="mb-2 text-center">
          <p className="text-lg font-semibold text-black">Drive Name: {value?.volumeName}</p>
          <p className="text-lg font-semibold text-black">
            Drive Path: {value?.pathFromVolumeRoot}
          </p>
        </div>
      )}
      <Button type="button" className="flex-[45%]" onClick={selectFolder}>
        {buttonText}
      </Button>
    </div>
  )
}
