import { forwardRef } from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "../../lib/utils"
import { ChevronLeftIcon, ChevronRightIcon } from "@animateicons/react/lucide"

const Calendar = forwardRef(({ className, classNames, showOutsideDays = true, ...props }, ref) => (
  <DayPicker
    showOutsideDays={showOutsideDays}
    className={cn("p-3", className)}
    classNames={{
      root: "rdp-root",
      chevron: "rdp-chevron",
      day: "rdp-day h-9 w-9 p-0 font-normal inline-flex items-center justify-center rounded-lg text-sm transition-colors",
      day_button: cn(
        "rdp-day_button h-9 w-9 p-0 font-normal rounded-lg transition-colors",
        "text-[var(--c-text-2)] hover:text-[var(--c-text)] hover:bg-[var(--c-element)]",
        "aria-selected:bg-[var(--c-element)] aria-selected:text-[var(--c-text)] aria-selected:hover:bg-[var(--c-element-hover-2)]"
      ),
      caption_label: "rdp-caption_label text-sm font-medium text-[var(--c-text)]",
      month_grid: "rdp-month_grid w-full border-collapse",
      month_caption: "rdp-month_caption flex justify-center pt-1 relative items-center",
      months: "rdp-months relative",
      month: "rdp-month space-y-4",
      nav: "rdp-nav space-x-1 flex items-center",
      button_next: cn(
        "rdp-button_next h-7 w-7 bg-transparent p-0 inline-flex items-center justify-center rounded-lg transition-colors",
        "text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:bg-[var(--c-element)] absolute right-1"
      ),
      button_previous: cn(
        "rdp-button_previous h-7 w-7 bg-transparent p-0 inline-flex items-center justify-center rounded-lg transition-colors",
        "text-[var(--c-text-3)] hover:text-[var(--c-text)] hover:bg-[var(--c-element)] absolute left-1"
      ),
      weeks: "rdp-weeks",
      week: "rdp-week flex w-full mt-2",
      weekday: cn(
        "rdp-weekday text-[var(--c-text-3)] rounded-lg w-9 font-medium text-[0.8rem] uppercase"
      ),
      weekdays: "rdp-weekdays flex",
      today: "rdp-today bg-[var(--c-elevated)] text-[var(--c-text)] font-bold",
      outside: "rdp-outside text-[var(--c-placeholder)] opacity-50",
      selected: "rdp-selected bg-[var(--c-element)] text-[var(--c-text)]",
      disabled: "rdp-disabled text-[var(--c-placeholder)] opacity-50",
      hidden: "rdp-hidden invisible",
      ...classNames,
    }}
    components={{
      Chevron: ({ orientation }) => {
        const Icon = orientation === "left" ? ChevronLeftIcon : ChevronRightIcon
        return <Icon size={16} className="text-[var(--c-text-3)]" />
      },
    }}
    {...props}
  />
))
Calendar.displayName = "Calendar"

export { Calendar }
