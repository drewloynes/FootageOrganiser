/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@renderer/components/ui/input'
import { ComponentProps, useState } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

type RuleNameType = {
  control: Control<FieldValues, any>
}

export const RuleName = ({ control }: RuleNameType) => {
  return (
    <div>
      <Controller
        name="ruleName"
        control={control}
        render={({ field }) => <Input placeholder="Rule Name" {...field} className="text-black" />}
      />
    </div>
  )
}
