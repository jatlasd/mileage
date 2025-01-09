import React from 'react'
import { Separator } from '../ui/separator'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { convertTripTime } from '@/lib/stats'

const OrderCard = ({ order }) => {
    const isFood = order.type === 'Food'
    const orderTime = convertTripTime(order.time)
    return (
        <div className={`flex justify-between items-center w-full p-4 rounded-lg mb-2 transition-colors ${
            isFood 
            ? 'bg-gradient-to-br from-accent-1 to-accent-1/70 text-white/90' 
            : 'bg-gradient-to-br from-accent-2 to-accent-2/70 text-white/90'
        }`}>
            <div className='flex flex-col gap-1'>
                <span className='text-sm text-white/70'>Time</span>
                <span className='font-medium'>{orderTime}</span>
            </div>
            <div className='flex flex-col gap-1'>
                <span className='text-sm text-white/70'>Type</span>
                <span className='font-medium'>{order.type}</span>
            </div>
            <div className='flex flex-col gap-1'>
                <span className='text-sm text-white/70'>Status</span>
                <span className={`font-medium ${order.accepted ? 'text-green-400' : 'text-red-400'}`}>
                    {order.accepted ? 'Accepted' : 'Declined'}
                </span>
            </div>
        </div>
    )
}

const SingleTrip = ({ trip }) => {
    const acceptedOrders = trip.orders.filter(order => order.accepted)
    const declinedOrders = trip.orders.filter(order => !order.accepted)
    
    return (
        <div className='bg-card flex flex-col w-full max-w-3xl p-6 rounded-xl shadow-sm border'>
            <div className='flex items-center justify-between mb-6'>
                <h1 className='text-2xl font-semibold'>Trip Details</h1>
                <div className='flex gap-2'>
                    <div className='px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm'>
                        {acceptedOrders.length} Accepted
                    </div>
                    <div className='px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-sm'>
                        {declinedOrders.length} Declined
                    </div>
                </div>
            </div>
            <Separator className='mb-6'/>
            <div className='grid grid-cols-2 gap-4 mb-6'>
                <div className='flex flex-col gap-1'>
                    <span className='text-sm text-muted-foreground'>Month</span>
                    <span className='text-lg font-medium'>{trip.month}</span>
                </div>
                <div className='flex flex-col gap-1'>
                    <span className='text-sm text-muted-foreground'>Day of Week</span>
                    <span className='text-lg font-medium'>{trip.dayOfWeek}</span>
                </div>
            </div>
            <div className='space-y-4'>
                <h2 className='text-xl font-semibold'>Orders</h2>
                <Accordion type="single" collapsible className='w-full'>
                    <AccordionItem value="orders" className='border rounded-lg'>
                        <AccordionTrigger className='px-4 hover:no-underline hover:bg-muted/50'>
                            <span className='font-medium'>View All Orders</span>
                        </AccordionTrigger>
                        <AccordionContent className='px-4 pt-4'>
                            <div className='space-y-2'>
                                {trip.orders.map((order) => (
                                    <OrderCard order={order} key={order._id}/>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}

export default SingleTrip