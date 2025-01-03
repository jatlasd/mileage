import { memo, useMemo } from "react";

const OrderHourBlock = memo(function OrderHourBlock({ hour, orders }) {
  const hourNum = parseInt(hour);
  const startTime = new Date();
  startTime.setHours(hourNum, 0, 0, 0);
  const endTime = new Date();
  endTime.setHours(hourNum + 1, 0, 0, 0);

  return (
    <div className="text-xs bg-[#1a1b26] hover:bg-[#1f2133] px-2.5 py-1 rounded flex items-center border border-white/[0.05] transition-colors">
      <span className="text-text/60 w-[85px]">
        {startTime.toLocaleTimeString([], {
          hour: "numeric",
          hour12: true,
        })}
        {" - "}
        {endTime.toLocaleTimeString([], {
          hour: "numeric",
          hour12: true,
        })}
      </span>
      <div className="bg-indigo-500/10 text-indigo-300/90 w-5 h-5 rounded flex items-center justify-center font-mono font-medium">
        {orders.length}
      </div>
    </div>
  );
});

const TripOrders = memo(function TripOrders({ orders }) {
  if (!orders || orders.length === 0) return null;

  const ordersByHour = useMemo(() => {
    const grouped = {};
    orders.forEach((order) => {
      const orderTime = new Date(order.time);
      const hour = orderTime.getHours();
      if (!grouped[hour]) {
        grouped[hour] = [];
      }
      grouped[hour].push(order);
    });
    return grouped;
  }, [orders]);

  const sortedHours = useMemo(
    () =>
      Object.entries(ordersByHour).sort(
        ([hourA], [hourB]) => parseInt(hourA) - parseInt(hourB)
      ),
    [ordersByHour]
  );

  return (
    <div className="mt-3 pt-3 border-t border-white/[0.05]">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-xs text-text/40">Orders</div>
        <div className="text-xs text-text/30">·</div>
        <div className="text-xs text-text/40">{orders.length} total</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedHours.map(([hour, hourOrders]) => (
          <OrderHourBlock key={hour} hour={hour} orders={hourOrders} />
        ))}
      </div>
    </div>
  );
});

export default TripOrders; 