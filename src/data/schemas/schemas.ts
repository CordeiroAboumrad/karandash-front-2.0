import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export type LoginForm = z.input<typeof LoginFormSchema>

export const ArtistFormSchema = z.object({
  id: z.number(),
  name: z.string(),
  dateofbirth: z.string(),
  placeofbirth: z.string(),
  history: z.string(),
  createdat: z.string(),
  updatedat: z.string(),
})

export const ArtistSchema = z.object({
  id: z.number(),
  name: z.string(),
  dateofbirth: z.string(),
  placeofbirth: z.string(),
  history: z.string(),
  createdat: z.string(),
  updatedat: z.string(),
})

export const ArtistsResultSchema = z.array(ArtistSchema.optional())

export type ArtistsSchema = z.infer<typeof ArtistsResultSchema>

export const CustomersResultSchema = z.array(
  z.object({
    name: z.string(),
    address: z.string(),
    email: z.string(),
    createdat: z.string(),
  })
)

export type CustomersSchema = z.infer<typeof CustomersResultSchema>

export const ProductsResultSchema = z.array(
  z.object({
    description: z.number(),
    title: z.string(),
    company: z.string(),
    status: z.string(),
    type: z.string(),
    keywords: z.string(),
    artistid: z.number().nullable(),
    artists: ArtistSchema.optional(),
    arttechnique: z.string(),
    acquisitioncost: z.number(),
    value: z.number(),
    productyear: z.string(),
    measurements: z.string(),
    sold: z.boolean(),
    customersoldtoid: z.number().nullable(),
    createdat: z.string(),
    updatedat: z.string(),
  })
)

export type ProductsSchema = z.infer<typeof ProductsResultSchema>
