"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfWeek, endOfWeek, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameWeek, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CalendarProps {
  selectedDate?: Date
  onSelectDate?: (date: Date) => void
  className?: string
}

export function Calendar({ selectedDate, onSelectDate, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate || new Date())

  React.useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate)
    }
  }, [selectedDate])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateClick = (date: Date) => {
    if (onSelectDate) {
      onSelectDate(date)
    }
  }

  const getWeekStart = (date: Date) => {
    return startOfWeek(date, { weekStartsOn: 1 })
  }

  const isSelectedWeek = (date: Date) => {
    if (!selectedDate) return false
    return isSameWeek(date, selectedDate, { weekStartsOn: 1 })
  }

  const isSelectedDay = (date: Date) => {
    if (!selectedDate) return false
    return isSameDay(date, selectedDate)
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={previousMonth}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold text-sm">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={nextMonth}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const weekStart = getWeekStart(day)
          const isInSelectedWeek = isSelectedWeek(day)
          const isCurrentDay = isSelectedDay(day)
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth()

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(day)}
              className={cn(
                "h-9 w-9 text-sm rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                !isCurrentMonth && "text-muted-foreground opacity-50",
                isInSelectedWeek && "bg-primary/20 text-primary font-semibold",
                isCurrentDay && "bg-primary text-primary-foreground font-bold"
              )}
            >
              {format(day, "d")}
            </button>
          )
        })}
      </div>
    </div>
  )
}

