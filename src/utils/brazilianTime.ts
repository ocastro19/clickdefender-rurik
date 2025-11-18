import { formatInTimeZone, toZonedTime } from 'date-fns-tz'
import { format } from 'date-fns'

// Constante para o fuso horário oficial de Brasília
export const BRASILIA_TIMEZONE = 'America/Sao_Paulo'

/**
 * Obtém a data atual no horário de Brasília no formato YYYY-MM-DD
 */
export const getBrazilianDate = (): string => {
  const now = new Date()
  return formatInTimeZone(now, BRASILIA_TIMEZONE, 'yyyy-MM-dd')
}

/**
 * Obtém a data e hora atual no horário de Brasília formatada para exibição
 */
export const getBrazilianDateTime = (): string => {
  const now = new Date()
  return formatInTimeZone(now, BRASILIA_TIMEZONE, 'dd/MM/yyyy HH:mm:ss')
}

/**
 * Obtém apenas a hora atual no horário de Brasília
 */
export const getBrazilianTime = (): string => {
  const now = new Date()
  return formatInTimeZone(now, BRASILIA_TIMEZONE, 'HH:mm:ss')
}

/**
 * Converte uma data para o horário de Brasília
 */
export const toBrazilianTime = (date: Date): Date => {
  return toZonedTime(date, BRASILIA_TIMEZONE)
}

/**
 * Formata uma data string (YYYY-MM-DD) para exibição no formato brasileiro
 */
export const formatBrazilianDate = (dateString: string): string => {
  const date = new Date(dateString + 'T12:00:00') // Meio-dia para evitar problemas de timezone
  const brasiliaDate = toZonedTime(date, BRASILIA_TIMEZONE)
  return formatInTimeZone(brasiliaDate, BRASILIA_TIMEZONE, 'dd/MM/yyyy')
}

/**
 * Formata uma data para o formato YYYY-MM-DD usando horário de Brasília
 */
export const formatDateForStorage = (date: Date): string => {
  const brasiliaDate = toZonedTime(date, BRASILIA_TIMEZONE)
  return formatInTimeZone(brasiliaDate, BRASILIA_TIMEZONE, 'yyyy-MM-dd')
}

/**
 * Verifica se é meia-noite (ou próximo) no horário de Brasília
 */
export const isMidnightInBrasilia = (): boolean => {
  const now = new Date()
  const brasiliaTime = toZonedTime(now, BRASILIA_TIMEZONE)
  const hours = brasiliaTime.getHours()
  const minutes = brasiliaTime.getMinutes()
  
  // Considera meia-noite de 00:00 a 00:05 para ter margem
  return hours === 0 && minutes <= 5
}

/**
 * Obtém o timestamp da próxima meia-noite no horário de Brasília
 */
export const getNextMidnightInBrasilia = (): Date => {
  const now = new Date()
  const brasiliaTime = toZonedTime(now, BRASILIA_TIMEZONE)
  
  // Próximo dia à meia-noite
  const nextMidnight = new Date(brasiliaTime)
  nextMidnight.setDate(nextMidnight.getDate() + 1)
  nextMidnight.setHours(0, 0, 0, 0)
  
  return nextMidnight
}

/**
 * Calcula milissegundos até a próxima meia-noite em Brasília
 */
export const getMillisecondsUntilMidnight = (): number => {
  const now = new Date()
  const nextMidnight = getNextMidnightInBrasilia()
  return nextMidnight.getTime() - now.getTime()
}

/**
 * Verifica se uma data está próxima da meia-noite (últimos 5 minutos do dia)
 */
export const isNearMidnight = (): boolean => {
  const now = new Date()
  const brasiliaTime = toZonedTime(now, BRASILIA_TIMEZONE)
  const hours = brasiliaTime.getHours()
  const minutes = brasiliaTime.getMinutes()
  
  return hours === 23 && minutes >= 55
}

/**
 * Cria um timestamp com informações do horário de Brasília
 */
export const createBrazilianTimestamp = () => {
  return {
    date: getBrazilianDate(),
    time: getBrazilianTime(),
    dateTime: getBrazilianDateTime(),
    timezone: BRASILIA_TIMEZONE,
    timestamp: Date.now()
  }
}