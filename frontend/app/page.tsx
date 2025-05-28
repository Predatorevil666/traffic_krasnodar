import { Header } from "@/components/header"
import MapWrapper from "@/components/map-wrapper"

export default function Home() {
  return (
    <main className="h-screen w-full flex flex-col">
      <Header />
      <MapWrapper />
    </main>
  )
}
