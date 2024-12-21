import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/facilities_/$facilityId/timeSlots/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/facilities_/$facilityId/timeSlots/"!</div>
}
