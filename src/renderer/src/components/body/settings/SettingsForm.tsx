/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  actionCutoffInGBs: z.number().int('Must be an integer').min(10, 'Must be at least 10 GB'),
  autoDeleteLogsInDays: z.number().int('Must be an integer').min(1, 'Must be greater than 0'),
  checkSumMethod: z.enum(['CRC', 'MD5', 'SHA-256'], 'Invalid checksum method'),
  syncTime: z.number().int('Must be an integer').min(1, 'Must be greater than 0')
})

type SettingsFormType = {
  fetchSettings?: any
}

function SettingsForm({ fetchSettings }: SettingsFormType) {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCheckSumMethod, setSelectedCheckSumMethod] = useState('')
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  })

  const navigate = useNavigate()

  useEffect(() => {
    async function loadSettings() {
      const settings = await window.electron.getSettings()
      console.log(settings)
      if (settings) {
        setValue('actionCutoffInGBs', settings.actionCutoffInGBs)
        setValue('autoDeleteLogsInDays', settings.autodeleteLogsInDays)
        setValue('checkSumMethod', settings.checksumMethod)
        setSelectedCheckSumMethod(settings.checksumMethod)
        setValue('syncTime', settings.syncTime)
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [fetchSettings, setValue])

  if (isLoading) {
    return <p>Loading settings...</p>
  }

  const onSubmit = (data) => {
    async function updateSettings(data) {
      await window.electron.updateSettings(
        data.actionCutoffInGBs,
        data.autoDeleteLogsInDays,
        data.checkSumMethod,
        data.syncTime
      )
    }
    console.log('Submitted')
    console.log(data)
    updateSettings(data)
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
        <Input type="number" {...register('actionCutoffInGBs', { valueAsNumber: true })} />
        {errors.actionCutoffInGBs && (
          <p className="text-red-500 text-sm mt-1">{errors.actionCutoffInGBs.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Auto Delete Logs (Days)</label>
        <Input type="number" {...register('autoDeleteLogsInDays', { valueAsNumber: true })} />
        {errors.autoDeleteLogsInDays && (
          <p className="text-red-500 text-sm mt-1">{errors.autoDeleteLogsInDays.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Checksum Method</label>
        <Select
          value={selectedCheckSumMethod}
          onValueChange={(value) => {
            setValue('checkSumMethod', value)
            setSelectedCheckSumMethod(value)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CRC">CRC</SelectItem>
            <SelectItem value="MD5">MD5</SelectItem>
            <SelectItem value="SHA-256">SHA-256</SelectItem>
          </SelectContent>
        </Select>
        {errors.checkSumMethod && (
          <p className="text-red-500 text-sm mt-1">{errors.checkSumMethod.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sync Time</label>
        <Input type="number" {...register('syncTime', { valueAsNumber: true })} />
        {errors.syncTime && <p className="text-red-500 text-sm mt-1">{errors.syncTime.message}</p>}
      </div>

      <Button type="submit">Save Settings</Button>
    </form>
  )
}

export default SettingsForm
