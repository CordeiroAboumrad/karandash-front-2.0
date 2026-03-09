import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export type LoginForm = z.input<typeof LoginFormSchema>

export const UserCredentialRedefinitionSchema = z.object({
  currentEmail: z.email('Email invalido'),
  currentPassword: z
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres'),
  newEmail: z.email('Email invalido').optional(),
  newPassword: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export type UserCredentialRedefinition = z.input<
  typeof UserCredentialRedefinitionSchema
>

export const ArtistSchema = z.object({
  id: z.number(),
  name: z.string(),
  gender: z.enum(['masculino', 'feminino']).nullable().optional(),
  dateofbirth: z.string(),
  placeofbirth: z.string(),
  history: z.string(),
  createdat: z.string(),
  updatedat: z.string(),
})

export type ArtistSchema = z.infer<typeof ArtistSchema>

export const ArtistsResultSchema = z.array(ArtistSchema)

export type ArtistsSchema = z.infer<typeof ArtistsResultSchema>

export const CustomerResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  email: z.string(),
  createdat: z.string(),
})

export type CustomerSchema = z.infer<typeof CustomerResultSchema>

export const CustomersResultSchema = z.array(CustomerResultSchema)

export type CustomersSchema = z.infer<typeof CustomersResultSchema>

export const ProductResultSchema = z.object({
  id: z.string(),
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

export const ProductsResultSchema = z.object({
  content: z.array(ProductResultSchema),
  totalPages: z.number(),
  totalElements: z.number(),
  size: z.number(),
  page: z.number(),
})

export type ProductSchema = z.infer<typeof ProductResultSchema>

export type ProductsSchema = z.infer<typeof ProductsResultSchema>

export const UserCreateParamsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  primaryEmail: z.email('Email invalido'),
  username: z
    .string()
    .min(3, 'O nome de usuário deve ter no mínimo 3 caracteres'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  admin: z.boolean().optional(),
})

export type UserCreateParams = z.infer<typeof UserCreateParamsSchema>

export const UserUpdateParamsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  primaryEmail: z.email('Email inválido'),
  username: z
    .string()
    .min(3, 'O nome de usuário deve ter no mínimo 3 caracteres'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres').optional(),
})

export type UserUpdateParams = z.infer<typeof UserUpdateParamsSchema>

