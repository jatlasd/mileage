import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  

const MobileOrderDialog = ({ order, index }) => {
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
    <Dialog>
      <DialogTrigger asChild>
        <button className={`flex items-center justify-center rounded-lg h-10 text-sm font-medium ${order.accepted ? 'bg-green-700' : 'bg-primary'}`}>
          <span className="text-gray-900">{index + 1}.</span>
        </button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[300px] bg-[#1a1b26] border border-white/[0.1] text-white/80">
      <DialogHeader>
        <DialogTitle className="text-white/90 text-lg font-semibold">Order Details</DialogTitle>
      </DialogHeader>
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
      </DialogContent>
    </Dialog>
  )
}

export default MobileOrderDialog