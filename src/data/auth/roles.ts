const SUPERUSER_ROLES = ['SUPERUSER', 'ROLE_SUPERUSER', 'ADMIN', 'ROLE_ADMIN']

const normalizeRole = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toUpperCase()
  return normalized.length > 0 ? normalized : null
}

const normalizeRoles = (roles: unknown[]): string[] => {
  return roles
    .map((role) => normalizeRole(role))
    .filter((role): role is string => Boolean(role))
}

const decodeTokenPayload = (token: string): Record<string, unknown> | null => {
  try {
    const [, payload] = token.split('.')
    if (!payload) {
      return null
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const decoded = atob(padded)
    return JSON.parse(decoded) as Record<string, unknown>
  } catch {
    return null
  }
}

const extractRolesFromData = (data: Record<string, unknown>): string[] => {
  const candidates = [
    data.role,
    data.roles,
    data.authorities,
    (data.user as Record<string, unknown> | undefined)?.role,
    (data.user as Record<string, unknown> | undefined)?.roles,
    (data.user as Record<string, unknown> | undefined)?.authorities,
  ]

  const result: string[] = []
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      result.push(...normalizeRoles(candidate))
      continue
    }

    if (typeof candidate === 'string' && candidate.includes(' ')) {
      result.push(...normalizeRoles(candidate.split(' ')))
      continue
    }

    const normalized = normalizeRole(candidate)
    if (normalized) {
      result.push(normalized)
    }
  }

  return [...new Set(result)]
}

export const storeRolesFromLogin = (response: unknown) => {
  if (!response || typeof response !== 'object') {
    localStorage.removeItem('userRoles')
    return
  }

  const roles = extractRolesFromData(response as Record<string, unknown>)
  if (roles.length === 0) {
    localStorage.removeItem('userRoles')
    return
  }

  localStorage.setItem('userRoles', JSON.stringify(roles))
}

const getRolesFromStorage = (): string[] => {
  try {
    const raw = localStorage.getItem('userRoles')
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return normalizeRoles(parsed)
  } catch {
    return []
  }
}

const getRolesFromToken = (): string[] => {
  const token = localStorage.getItem('bearerToken')
  if (!token) {
    return []
  }

  const payload = decodeTokenPayload(token)
  if (!payload) {
    return []
  }

  return extractRolesFromData(payload)
}

export const getCurrentUserRoles = (): string[] => {
  const roles = [...getRolesFromStorage(), ...getRolesFromToken()]
  return [...new Set(roles)]
}

export const isSuperUser = (): boolean => {
  const roles = getCurrentUserRoles()
  return roles.some((role) => SUPERUSER_ROLES.includes(role))
}
