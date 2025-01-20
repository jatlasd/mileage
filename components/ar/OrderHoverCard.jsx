import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
  

const OrderHoverCard = ({ order, index}) => {
  const date = new Date(order.time)
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return (
    <HoverCard>
        <HoverCardTrigger>
          <div className={`flex items-center justify-center rounded-lg h-10 text-sm font-medium transition-colors ${order.accepted ? 'bg-green-700/65 hover:bg-green-700/80' : 'bg-primary/75 hover:bg-primary/85'}`}>
            <span className="text-gray-900">{index + 1}.</span>
          </div>
        </HoverCardTrigger>
      <HoverCardContent className="w-64 bg-surface border border-text/10 text-text/85">
        <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{formattedDate}</span>
              <span className="text-sm text-muted-foreground">{formattedTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Type:</span>
              <span className="text-sm capitalize">{order.type || 'Standard'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Status:</span>
              <span className={`text-sm ${order.accepted ? 'text-green-500' : 'text-red-500'}`}>
                {order.accepted ? 'Accepted' : 'Declined'}
              </span>
            </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default OrderHoverCard