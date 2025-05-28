"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface TrafficExportProps {
  onClose: () => void
}

export function TrafficExport({ onClose }: TrafficExportProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), new Date()])
  const [startDate, endDate] = dateRange
  const [singleDate, setSingleDate] = useState<Date | null>(new Date())
  const [activeTab, setActiveTab] = useState<string>("range")

  const handleExport = () => {
    // В реальном приложении здесь был бы код для экспорта данных
    if (activeTab === "range") {
      console.log("Exporting traffic data for range:", { startDate, endDate })

      // Имитация скачивания файла
      const link = document.createElement("a")
      link.href = "#"
      link.setAttribute(
        "download",
        `traffic-data-${startDate?.toISOString().split("T")[0]}-to-${endDate?.toISOString().split("T")[0]}.xlsx`,
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
    } else {
      console.log("Exporting traffic data for single day:", singleDate)

      // Имитация скачивания файла
      const link = document.createElement("a")
      link.href = "#"
      link.setAttribute("download", `traffic-data-${singleDate?.toISOString().split("T")[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    }

    onClose()
  }

  return (
    <Card className="border-0 shadow-none w-[350px]">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Выгрузка данных о загруженности</CardTitle>
        <CardDescription>Выберите период или конкретный день для выгрузки данных о загруженности дорог</CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <Tabs defaultValue="range" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="range">Период</TabsTrigger>
            <TabsTrigger value="single">Один день</TabsTrigger>
          </TabsList>

          <TabsContent value="range">
            <div className="space-y-2">
              <Label>Выберите период</Label>
              <div className="border rounded-md p-2">
                <DatePicker
                  selected={startDate}
                  onChange={(dates) => setDateRange(dates as [Date | null, Date | null])}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  monthsShown={1}
                  dateFormat="dd.MM.yyyy"
                  calendarClassName="w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="single">
            <div className="space-y-2">
              <Label>Выберите день</Label>
              <div className="border rounded-md p-2">
                <DatePicker
                  selected={singleDate}
                  onChange={(date) => setSingleDate(date)}
                  inline
                  monthsShown={1}
                  dateFormat="dd.MM.yyyy"
                  calendarClassName="w-full"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="px-0 pt-2 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button onClick={handleExport}>Скачать</Button>
      </CardFooter>
    </Card>
  )
}
