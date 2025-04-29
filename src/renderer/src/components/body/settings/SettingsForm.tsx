import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@renderer/components/ui/select'
import { CHECKSUM_TYPE } from '@shared/types/checksumTypes'
import { StoreSettings } from '@shared/types/settingsTypes'
import { STORE_SETTINGS_ZOD_SCHEMA } from '@shared/validation/validateSettings'
import { useEffect, useState } from 'react'
import { Controller, Resolver, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function SettingsForm() {
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<StoreSettings>()

  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(STORE_SETTINGS_ZOD_SCHEMA) as Resolver<StoreSettings>,
    defaultValues: settings
  })

  const navigate = useNavigate()

  useEffect(() => {
    async function loadSettings() {
      const currentSettings = await window.electron.getSettings()
      console.log(currentSettings)
      setSettings(currentSettings)
      reset(currentSettings)

      if (loading) {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  if (loading) {
    return <p>Loading settings...</p>
  }

  const onSubmit = (newSettings) => {
    newSettings.footageOrganiserVersion = FOOTAGE_ORGANISER_VERSION
    console.log('Submitted')
    console.log(newSettings)

    window.electron.modifySettings(newSettings)

    navigate(`/`)
  }

  const onError = (errors: any) => {
    getValues()
    console.log('Zod Errors:', errors)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4 bg-white text-black">
      <div>
        <label className="block text-sm font-medium text-gray-700">Action Cutoff (GBs)</label>
        <Controller
          name="actionsCutoffInGBs"
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              placeholder="Action Cutoff (GBs)"
              {...field}
              onChange={(e) => field.onChange(e.target.valueAsNumber)}
              className="text-black"
            />
          )}
        />
        {errors.actionsCutoffInGBs && (
          <p className="text-red-500 text-sm mt-1">{errors.actionsCutoffInGBs.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Auto Delete Logs (Days)</label>
        <Controller
          name="deleteOldLogsInDays"
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              placeholder="Auto Delete Logs (Days)"
              {...field}
              onChange={(e) => field.onChange(e.target.valueAsNumber)}
              className="text-black"
            />
          )}
        />
        {errors.deleteOldLogsInDays && (
          <p className="text-red-500 text-sm mt-1">{errors.deleteOldLogsInDays.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Checksum Method</label>
        <Controller
          name="checksumMethod"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="text-black">{field.value}</SelectTrigger>
              <SelectContent className="text-black">
                <SelectItem className="text-black" value={CHECKSUM_TYPE.CRC}>
                  CRC
                </SelectItem>
                <SelectItem className="text-black" value={CHECKSUM_TYPE.MD5}>
                  MD5
                </SelectItem>
                <SelectItem className="text-black" value={CHECKSUM_TYPE.SHA_256}>
                  SHA 256
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.checksumMethod && (
          <p className="text-red-500 text-sm mt-1">{errors.checksumMethod.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Time to resync (Minutes)</label>
        <Controller
          name="reevaluateSleepTime"
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              placeholder="Time to resync (Minutes)"
              {...field}
              onChange={(e) => field.onChange(e.target.valueAsNumber)}
              className="text-black"
            />
          )}
        />
        {errors.reevaluateSleepTime && (
          <p className="text-red-500 text-sm mt-1">{errors.reevaluateSleepTime.message}</p>
        )}
      </div>

      <Button type="submit">Save Settings</Button>
    </form>
  )
}

export default SettingsForm
