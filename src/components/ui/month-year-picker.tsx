"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfMonth, addMonths, subMonths, startOfYear, endOfYear, eachMonthOfInterval } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface MonthYearPickerProps {
  selectedDate?: Date
  onSelectDate?: (date: Date) => void
  className?: string
}

export function MonthYearPicker({ selectedDate, onSelectDate, className }: MonthYearPickerProps) {
  const [currentYear, setCurrentYear] = React.useState(selectedDate ? selectedDate.getFullYear() : new Date().getFullYear())

  const yearStart = startOfYear(new Date(currentYear, 0, 1))
  const yearEnd = endOfYear(new Date(currentYear, 11, 31))
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd })

  const previousYear = () => {
    setCurrentYear(currentYear - 1)
  }

  const nextYear = () => {
    setCurrentYear(currentYear + 1)
  }

  const handleMonthClick = (month: Date) => {
    const firstDayOfMonth = startOfMonth(month)
    if (onSelectDate) {
      onSelectDate(firstDayOfMonth)
    }
  }

  const isSelectedMonth = (month: Date) => {
    if (!selectedDate) return false
    return (
      month.getMonth() === selectedDate.getMonth() &&
      month.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={previousYear}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold text-sm">
          {currentYear}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={nextYear}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {months.map((month, idx) => {
          const isSelected = isSelectedMonth(month)

          return (
            <button
              key={idx}
              onClick={() => handleMonthClick(month)}
              className={cn(
                "h-12 text-sm rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isSelected && "bg-primary text-primary-foreground font-semibold"
              )}
            >
              {format(month, "MMM")}
            </button>
          )
        })}
      </div>
    </div>
  )
}

