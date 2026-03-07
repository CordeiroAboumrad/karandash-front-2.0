import { useSyncExternalStore } from 'react'

export type RelatorioItem = {
  productId: string
  title: string
  description: string
  company: string
  type: string
  status: string
  technique: string
  year: string
  value: number
  imageUrl: string
  addedAt: string
}

type Atom<T> = {
  get: () => T
  set: (value: T | ((prev: T) => T)) => void
  subscribe: (listener: () => void) => () => void
}

const createAtom = <T,>(initialValue: T): Atom<T> => {
  let value = initialValue
  const listeners = new Set<() => void>()

  return {
    get: () => value,
    set: (nextValue) => {
      const resolvedValue =
        typeof nextValue === 'function'
          ? (nextValue as (prev: T) => T)(value)
          : nextValue

      if (Object.is(resolvedValue, value)) {
        return
      }

      value = resolvedValue
      listeners.forEach((listener) => listener())
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

const relatoriosListAtom = createAtom<RelatorioItem[]>([])

export const addToRelatoriosList = (item: RelatorioItem) => {
  relatoriosListAtom.set((current) => {
    const existingIndex = current.findIndex(
      (entry) => entry.productId === item.productId
    )

    if (existingIndex >= 0) {
      const updated = [...current]
      updated[existingIndex] = item
      return updated
    }

    return [item, ...current]
  })
}

export const removeFromRelatoriosList = (productId: string) => {
  relatoriosListAtom.set((current) =>
    current.filter((item) => item.productId !== productId)
  )
}

export const moveRelatorioItem = (
  productId: string,
  direction: 'up' | 'down'
) => {
  relatoriosListAtom.set((current) => {
    const index = current.findIndex((item) => item.productId === productId)
    if (index < 0) {
      return current
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= current.length) {
      return current
    }

    const updated = [...current]
    const [movedItem] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, movedItem)
    return updated
  })
}

export const clearRelatoriosList = () => {
  relatoriosListAtom.set([])
}

export const getRelatoriosList = () => relatoriosListAtom.get()

export const useRelatoriosList = () =>
  useSyncExternalStore(
    relatoriosListAtom.subscribe,
    getRelatoriosList,
    getRelatoriosList
  )
