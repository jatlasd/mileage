"use client";

import { useState, useEffect } from "react";
import OrderHoverCard from "./OrderHoverCard";
import MobileOrderDialog from "./MobileOrderDialog";

const ArContainer = () => {
  const [orders, setOrders] = useState([]);
  const [acceptanceRatePercent, setAcceptanceRatePercent] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [ordersSinceLastDecline, setOrdersSinceLastDecline] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/entry");
        const trips = await response.json();
        const allOrders = trips.flatMap((trip) => trip.orders || []).slice(0, 100);
        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const calculateAcceptanceRatePercent = () => {
        if (orders.length === 0) {
            setAcceptanceRatePercent(0);
            return;
        }
        const acceptedOrderCount = orders.filter((order) => order.accepted).length;
        const ratePercent = (acceptedOrderCount / orders.length) * 100;
        setAcceptanceRatePercent(Number(ratePercent.toFixed(1)));
    }
    calculateAcceptanceRatePercent();
  }, [orders])

  if(isLoading) return <p>Loading...</p>

  const sortedOrders = [...orders].sort((a, b) => 
    sortNewestFirst 
      ? new Date(b.time) - new Date(a.time)
      : new Date(a.time) - new Date(b.time)
  );

  const calculateOrdersToDecline = () => {
    if (sortNewestFirst) {
      const lastDeclineIndex = sortedOrders.findIndex(order => !order.accepted);
      return lastDeclineIndex === -1 ? sortedOrders.length : lastDeclineIndex;
    } else {
      const nextDeclineIndex = sortedOrders.findIndex(order => !order.accepted);
      return nextDeclineIndex === -1 ? sortedOrders.length : nextDeclineIndex;
    }
  };

  const ordersToDecline = calculateOrdersToDecline();

  return (
    <div className="flex flex-col space-y-5 container mx-auto px-5 md:px-0">
            {acceptanceRatePercent !== null && (
                <h1 className="text-center text-xl md:text-2xl lg:text-3xl">Acceptance Rate:&nbsp;&nbsp;<span className={`text-3xl md:text-4xl lg:text-5xl text-primar ${acceptanceRatePercent >= 70 ? 'text-green-500' : 'text-primary'}`}y>{acceptanceRatePercent}%</span></h1>
            )}
            <h2 className="text-center text-lg md:text-xl lg:text-2xl">
                {sortNewestFirst 
                    ? `Orders Since Last Decline: ${ordersToDecline}`
                    : `Orders Until Next Decline: ${ordersToDecline}`
                }
            </h2>
        <div className="flex justify-between items-center">
            <h1 className="text-primary text-xl md:text-3xl lg:text-5xl">{sortNewestFirst ? 'Most Recent Orders' : 'Next Orders to Pop Off'}</h1>
            <button
                onClick={() => setSortNewestFirst(!sortNewestFirst)}
                className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-base bg-accent-1 text-text/80 rounded"
            >
                {sortNewestFirst ? "Show Oldest First" : "Show Newest First"}
            </button>
        </div>
        <div className="md:hidden container mx-auto max-w-7xl grid grid-cols-5 gap-4 px-6 md:px-10 pb-10">
            {sortedOrders.map((order, i) => (
                <MobileOrderDialog key={i} order={order} index={i} />
            ))}
        </div>
        <div className="hidden container mx-auto max-w-7xl md:grid md:grid-cols-5 lg:grid-cols-10 gap-4 px-6 md:px-10 pb-10">
            {sortedOrders.map((order, i) => (
                <OrderHoverCard key={i} order={order} index={i} />
            ))}
        </div>
    </div>
  );
};

export default ArContainer;
