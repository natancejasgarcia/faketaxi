import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Ride, WeekStat } from '@/types'

export function formatEuros(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €'
}

export function formatAmount(amount: number): string {
  return amount.toFixed(2).replace('.', ',') + ' €'
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatDateLabel(dateStr: string): string {
  const d = parseISO(dateStr)
  const today = todayISO()
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')

  if (dateStr === today) return 'Hoy'
  if (dateStr === yesterday) return 'Ayer'
  return format(d, "EEEE d 'de' MMMM", { locale: es })
}

export function formatTime(isoString: string): string {
  return format(parseISO(isoString), 'HH:mm')
}

export function getWeekRange(date: Date): { from: string; to: string } {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return {
    from: format(start, 'yyyy-MM-dd'),
    to: format(end, 'yyyy-MM-dd'),
  }
}

export function getMonthRange(date: Date): { from: string; to: string } {
  return {
    from: format(startOfMonth(date), 'yyyy-MM-dd'),
    to: format(endOfMonth(date), 'yyyy-MM-dd'),
  }
}

export function buildWeekStats(rides: Ride[], weekFrom: string, weekTo: string): WeekStat[] {
  const days = eachDayOfInterval({
    start: parseISO(weekFrom),
    end: parseISO(weekTo),
  })

  return days.map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayRides = rides.filter((r) => r.date === dayStr)
    return {
      date: dayStr,
      label: format(day, 'EEE', { locale: es }),
      total_amount: dayRides.reduce((s, r) => s + Number(r.amount), 0),
      total_rides: dayRides.length,
    }
  })
}

export function LAST_PAYMENT_KEY() {
  return 'ft_last_payment'
}
