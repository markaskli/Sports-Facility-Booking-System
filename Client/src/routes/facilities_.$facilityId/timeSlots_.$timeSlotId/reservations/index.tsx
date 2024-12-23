import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/facilities_/$facilityId/timeSlots_/$timeSlotId/reservations/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/facilities_/$facilityId/timeSlots_/$timeSlotId/reservations/"!
    </div>
  )
}
