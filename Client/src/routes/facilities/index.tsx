import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/facilities/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/facilities/facilities"!</div>
}
