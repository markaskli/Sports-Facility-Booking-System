import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/facilities/$facilityId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/facilities/$facilityId"!</div>
}
