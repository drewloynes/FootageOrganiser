/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@renderer/components/ui/button'
import { useEffect, useState } from 'react'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'

type DirectorySelectorType = {
  watch: UseFormWatch<any>
  setValue: UseFormSetValue<any>
  directory: string
  buttonText: string
}

export const DirectorySelector = ({
  watch,
  setValue,
  directory,
  buttonText
}: DirectorySelectorType) => {
  const [driveName, setDriveName] = useState<string | undefined>()
  const [drivePath, setDrivePath] = useState<string | undefined>()

  const selectFolder = async (field: string) => {
    if (window.electron?.chooseDirectory) {
      const result = await window.electron.chooseDirectory()
      console.log(result)
      if (result) {
        setValue(field, result) // Updates the form state
      }
    }
  }

  // Use useEffect to listen for changes in the watched directory values
  useEffect(() => {
    setDriveName(watch(`${directory}.0`))
    setDrivePath(watch(`${directory}.1`))
  }, [watch(directory)])

  return (
    <div>
      {(driveName || drivePath) && (
        <div className="mb-2 text-center">
          <p className="text-lg font-semibold text-black">Drive Name: {driveName}</p>
          <p className="text-lg font-semibold text-black">Drive Path: {drivePath}</p>
        </div>
      )}
      <Button type="button" className="flex-[45%]" onClick={() => selectFolder(directory)}>
        {buttonText}
      </Button>
    </div>
  )
}
