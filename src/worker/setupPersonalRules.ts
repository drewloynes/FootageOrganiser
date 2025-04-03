import { Rule, RuleType } from '@shared/rules/rule'
import { TypeCopyFileOptions, TypeCopyFileFormatOptions } from '@shared/rules/typeCopyFileOptions'
import { RulePath } from '@shared/rules/rulePath'
import { TypeMirrorOptions } from '@shared/rules/typeMirrorOptions'
import { Rules } from '@shared/rules/rules'

export async function setupPersonalRules(): Promise<void> {
  // mirroring
  const mirrorOptions = new TypeMirrorOptions(true)
  const fromRulePath = new RulePath('Main1', '', [], [], [], ['DaVinci'])
  const toRulePath = new RulePath('Backup1', '')
  const mirroringRule = new Rule(
    'Mirroring To Backup',
    RuleType.MIRROR,
    fromRulePath,
    toRulePath,
    mirrorOptions,
    false,
    false
  )

  /*  -------------------------------------------------  */
  // Copying to lumix 1
  const copyFileOptions1 = new TypeCopyFileOptions(
    [
      TypeCopyFileFormatOptions.YEAR,
      TypeCopyFileFormatOptions.MONTH,
      TypeCopyFileFormatOptions.DAY,
      TypeCopyFileFormatOptions.CUSTOM
    ],
    'Lumix',
    true,
    false,
    []
  )
  const fromRulePathCopy1 = new RulePath('Lumix1', '\\DCIM')
  const toRulePathCopy1 = new RulePath('Main1', '\\footage')
  const copyLumixRule1 = new Rule(
    'Copy Lumix1',
    RuleType.COPYFILE,
    fromRulePathCopy1,
    toRulePathCopy1,
    copyFileOptions1,
    false,
    false
  )
  // Copying to lumix 2
  const copyFileOptions2 = new TypeCopyFileOptions(
    [
      TypeCopyFileFormatOptions.YEAR,
      TypeCopyFileFormatOptions.MONTH,
      TypeCopyFileFormatOptions.DAY,
      TypeCopyFileFormatOptions.CUSTOM
    ],
    'Lumix',
    true,
    false,
    []
  )
  const fromRulePathCopy2 = new RulePath('Lumix2', '\\DCIM')
  const toRulePathCopy2 = new RulePath('Main1', '\\footage')
  const copyLumixRule2 = new Rule(
    'Copy Lumix2',
    RuleType.COPYFILE,
    fromRulePathCopy2,
    toRulePathCopy2,
    copyFileOptions2,
    false,
    false
  )
  // Copying to lumix 3
  const copyFileOptions3 = new TypeCopyFileOptions(
    [
      TypeCopyFileFormatOptions.YEAR,
      TypeCopyFileFormatOptions.MONTH,
      TypeCopyFileFormatOptions.DAY,
      TypeCopyFileFormatOptions.CUSTOM
    ],
    'Lumix',
    true,
    false,
    []
  )
  const fromRulePathCopy3 = new RulePath('Lumix3', '\\DCIM')
  const toRulePathCopy3 = new RulePath('Main1', '\\footage')
  const copyLumixRule3 = new Rule(
    'Copy Lumix3',
    RuleType.COPYFILE,
    fromRulePathCopy3,
    toRulePathCopy3,
    copyFileOptions3,
    false,
    false
  )
  // Copying to lumix 4
  const copyFileOptions4 = new TypeCopyFileOptions(
    [
      TypeCopyFileFormatOptions.YEAR,
      TypeCopyFileFormatOptions.MONTH,
      TypeCopyFileFormatOptions.DAY,
      TypeCopyFileFormatOptions.CUSTOM
    ],
    'Lumix',
    true,
    false,
    []
  )
  const fromRulePathCopy4 = new RulePath('Lumix4', '\\DCIM')
  const toRulePathCopy4 = new RulePath('Main1', '\\footage')
  const copyLumixRule4 = new Rule(
    'Copy Lumix4',
    RuleType.COPYFILE,
    fromRulePathCopy4,
    toRulePathCopy4,
    copyFileOptions4,
    false,
    false
  )
  /*  -------------------------------------------------  */
  // Copying to dji 1
  const copyFileOptions5 = new TypeCopyFileOptions(
    [
      TypeCopyFileFormatOptions.YEAR,
      TypeCopyFileFormatOptions.MONTH,
      TypeCopyFileFormatOptions.DAY,
      TypeCopyFileFormatOptions.CUSTOM
    ],
    'DJI',
    true,
    false,
    []
  )
  const fromRulePathCopy5 = new RulePath('DJI1', '\\DCIM')
  const toRulePathCopy5 = new RulePath('Main1', '\\footage')
  const copyDjiRule5 = new Rule(
    'Copy DJI1',
    RuleType.COPYFILE,
    fromRulePathCopy5,
    toRulePathCopy5,
    copyFileOptions5,
    false,
    false
  )
  // Copying to dji 2
  const copyFileOptions6 = new TypeCopyFileOptions(
    [
      TypeCopyFileFormatOptions.YEAR,
      TypeCopyFileFormatOptions.MONTH,
      TypeCopyFileFormatOptions.DAY,
      TypeCopyFileFormatOptions.CUSTOM
    ],
    'DJI',
    true,
    false,
    []
  )
  const fromRulePathCopy6 = new RulePath('DJI2', '\\DCIM')
  const toRulePathCopy6 = new RulePath('Main1', '\\footage')
  const copyDjiRule6 = new Rule(
    'Copy DJI2',
    RuleType.COPYFILE,
    fromRulePathCopy6,
    toRulePathCopy6,
    copyFileOptions6,
    false,
    false
  )

  const currentRules: Rules | undefined = await Rules.loadRules()
  if (currentRules) {
    await currentRules.addRule(mirroringRule)
    await currentRules.addRule(copyLumixRule1)
    await currentRules.addRule(copyLumixRule2)
    await currentRules.addRule(copyLumixRule3)
    await currentRules.addRule(copyLumixRule4)
    await currentRules.addRule(copyDjiRule5)
    await currentRules.addRule(copyDjiRule6)
  } else {
    const newRules = new Rules()
    await newRules.addRule(mirroringRule)
    await newRules.addRule(copyLumixRule1)
    await newRules.addRule(copyLumixRule2)
    await newRules.addRule(copyLumixRule3)
    await newRules.addRule(copyLumixRule4)
    await newRules.addRule(copyDjiRule5)
    await newRules.addRule(copyDjiRule6)
  }
}
