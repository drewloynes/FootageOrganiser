import { Button } from '@renderer/src/components/ui/button'
import { Input } from '@renderer/src/components/ui/input'
import { Controller } from 'react-hook-form'

export default function DynamicList({ label, name, control, options = [] }) {
  return (
    <div className="space-y-2">
      <label>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <>
            {value.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const newList = [...value]
                    newList[index] = e.target.value
                    onChange(newList)
                  }}
                />
                <Button onClick={() => onChange(value.filter((_, i) => i !== index))}>
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={() => onChange([...value, ''])}>Add</Button>
          </>
        )}
      />
    </div>
  )
}
