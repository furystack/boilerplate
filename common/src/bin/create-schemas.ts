import { promises } from 'fs'
import { join } from 'path'
import { createGenerator } from 'ts-json-schema-generator'

export interface SchemaGenerationSetting {
  inputFile: string
  outputFile: string
  type: string
}

/**
 * Entity schemas, e.g. User, Session, etc...
 */
export const entityValues: SchemaGenerationSetting[] = [
  {
    inputFile: './src/models/*.ts',
    outputFile: './schemas/entities.json',
    type: '*',
  },
]

export const apiValues: SchemaGenerationSetting[] = [
  {
    inputFile: './src/boilerplate-api.ts',
    outputFile: './schemas/boilerplate-api.json',
    type: '*',
  },
]

export const exec = async (): Promise<void> => {
  for (const schemaValue of [...entityValues, ...apiValues]) {
    try {
      console.log(`Create schema from ${schemaValue.inputFile} to ${schemaValue.outputFile}`)
      const schema = createGenerator({
        path: join(process.cwd(), schemaValue.inputFile),
        tsconfig: join(process.cwd(), './tsconfig.json'),
        skipTypeCheck: true,
        // expose: 'all',
      }).createSchema(schemaValue.type)
      await promises.writeFile(join(process.cwd(), schemaValue.outputFile), JSON.stringify(schema, null, 2))
    } catch (error) {
      console.error(`There was an error generating schema from ${schemaValue.inputFile}`, error)
    }
  }
}

exec()
  .then(() => {
    console.log('Schemas created')
    process.exit(0)
  })
  .catch((e) => {
    console.error('Error creating schemas', e)
    process.exit(1)
  })
