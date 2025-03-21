import { Widget } from "@workspace/ui/components/widget"
import { CircleOff, CirclePause, CirclePlay, CircleSlash, Container, MonitorDot } from "lucide-react"

export function Widgets({}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-4 gap-2 ">
          <Widget
            icon={<Container />}
            title="Total Containers"
            description="12"
            gradient
          />

          <Widget
            icon={<CirclePlay />}
            title="Containers Running"
            description="8 / 12"
            gradient
          />

          <Widget
            icon={<CirclePause />}
            title="Containers Paused"
            description="3 / 12"
            gradient
          />

          <Widget
            icon={<CircleSlash />}
            title="Containers Stopped"
            description="1 / 12"
            gradient
          />
        </div>
    )
}