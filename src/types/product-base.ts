export interface BaseDessertAttributes {
  ingredients: string[]
  isVegetarian: boolean
  shelfLife: string
  storageAdvice: string
}

export interface BaseProduct<TAttributes> {
  id: string
  name: string
  description: string
  priceCents: number
  attributes: TAttributes
  imageUrl?: string
}
