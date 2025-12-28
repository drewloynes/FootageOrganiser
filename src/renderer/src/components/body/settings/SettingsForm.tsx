import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@renderer/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@renderer/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { CHECKSUM_TYPE } from '@shared-all/types/checksumTypes'
import { StoreSettings } from '@shared-all/types/settingsTypes'
import { STORE_SETTINGS_ZOD_SCHEMA } from '@shared-all/validation/validateSettings'
import { useEffect, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import SettingsFormLoading from './SettingsFormLoading'
import { SettingsFormNumberInput } from './utils/SettingsFormNumberInput'

const fileName = 'SettingsFomr.tsx'
const area = 'settings'

function SettingsForm(): React.ReactElement {
  const funcName = 'SettingsForm'
  log.rend(funcName, fileName, area)

  const [loading, setLoading] = useState(true)

  const form = useForm({
    resolver: zodResolver(STORE_SETTINGS_ZOD_SCHEMA) as Resolver<StoreSettings>
  })
  const { control, reset, handleSubmit } = form

  const navigate = useNavigate()

  useEffect(() => {
    log.cond('useEffect: Set form current values', funcName, fileName, area)

    async function loadSettings(): Promise<void> {
      log.ipcSent(`Request current settings`, funcName, fileName, area)
      const currentSettings = await window.electron.getSettings()
      log.ipcRec('Current settings received', funcName, fileName, area, currentSettings)

      reset(currentSettings)
      setLoading(false)
    }

    void loadSettings()
  }, [])

  if (loading) {
    log.cond('Loading settings', funcName, fileName, area)
    return <SettingsFormLoading />
  }

  const onSubmit = (newSettings): void => {
    log.cond('Settings-Form Submitted', funcName, fileName, area)

    newSettings.footageOrganiserVersion = FOOTAGE_ORGANISER_VERSION

    log.ipcSent('modify-settings', funcName, fileName, area, newSettings)
    window.electron.modifySettings(newSettings)

    void navigate(`/`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any): void => {
    console.log('Zod Errors:', errors)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4 px-6">
        <SettingsFormNumberInput
          control={control}
          fieldName="actionsCutoffInGBs"
          label="Drive Cutoff (GBs)"
          tooltip="Stop performing actions on a drive when its available space is less than this
                    number of GBs"
          placeHolderText="Action Cutoff (GBs)"
        />

        <SettingsFormNumberInput
          control={control}
          fieldName="deleteOldLogsInDays"
          label="Logs Retention (Days)"
          tooltip="Number of days logs of actions are stored for before automatic deletion"
          placeHolderText="Logs Retention (Days)"
        />

        <FormField
          control={control}
          name="checksumMethod"
          render={({ field }) => (
            <FormItem className="mr-10">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex flex-row items-center w-fit">
                    <FormLabel className="text-xs ml-4">Checksum Method</FormLabel>
                  </TooltipTrigger>
                  <TooltipContent>Method to use when running checksums</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="cursor-pointer w-40">{field.value}</SelectTrigger>
                  <SelectContent>
                    <SelectItem className="cursor-pointer" value={CHECKSUM_TYPE.CRC}>
                      CRC
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value={CHECKSUM_TYPE.MD5}>
                      MD5
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value={CHECKSUM_TYPE.SHA_256}>
                      SHA 256
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SettingsFormNumberInput
          control={control}
          fieldName="reevaluateSleepTime"
          label="Time Until Re-Evaluation (Minutes)"
          tooltip="Number of minutes to pause between re-evaluating rules"
          placeHolderText="Number of minutes to pause between re-evaluating rules"
        />

        <Button type="submit" className="text-xl px-4 mt-3 py-6 font-bold cursor-pointer">
          Save Settings
        </Button>
      </form>
    </Form>
  )
}

export default SettingsForm
