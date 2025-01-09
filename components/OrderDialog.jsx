"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const OrderDialog = ({ tripId, onOrderCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [open, setOpen] = useState(false);

  const createOrder = async (type, accepted) => {
    try {
      setIsLoading(true);
      setSelectedButton(`${type}-${accepted}`);
      const response = await fetch(`/api/entry/${tripId}/order`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, accepted }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      const updatedTrip = await response.json();
      onOrderCreated(updatedTrip);
      setOpen(false);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
      setSelectedButton(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#1a1b26] border border-white/[0.2] text-white/80 hover:bg-[#1f2133] transition-all duration-200 px-4 py-2 rounded-lg hover:scale-105 active:scale-95">
          Add Order
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1b26] border border-white/[0.1] text-white/80 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white/90 text-center pb-4">Add New Order</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-2 gap-y-10">
          <button
            onClick={() => createOrder('Food', true)}
            disabled={isLoading}
            className={`relative overflow-hidden bg-gradient-to-br from-accent-1 to-accent-1/70 text-white px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${
              selectedButton === 'Food-true' ? 'scale-95' : ''
            }`}
          >
            <span className="relative z-10">Food - Accept</span>
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full hover:translate-x-0 transition-transform duration-300" />
          </button>
          <button
            onClick={() => createOrder('Food', false)}
            disabled={isLoading}
            className={`relative overflow-hidden bg-gradient-to-br from-accent-1/70 to-accent-1/50 opacity-70 text-white px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${
              selectedButton === 'Food-false' ? 'scale-95' : ''
            }`}
          >
            <span className="relative z-10">Food - Decline</span>
            <div className="absolute inset-0 bg-white/10 transform -translate-x-full hover:translate-x-0 transition-transform duration-300" />
          </button>
          <button
            onClick={() => createOrder('Shop', true)}
            disabled={isLoading}
            className={`relative overflow-hidden bg-gradient-to-br from-accent-2 to-accent-2/70 text-white px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${
              selectedButton === 'Shop-true' ? 'scale-95' : ''
            }`}
          >
            <span className="relative z-10">Shop - Accept</span>
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full hover:translate-x-0 transition-transform duration-300" />
          </button>
          <button
            onClick={() => createOrder('Shop', false)}
            disabled={isLoading}
            className={`relative overflow-hidden bg-gradient-to-br from-accent-2/70 to-accent-2/70 opacity-70 text-white px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${
              selectedButton === 'Shop-false' ? 'scale-95' : ''
            }`}
          >
            <span className="relative z-10">Shop - Decline</span>
            <div className="absolute inset-0 bg-white/10 transform -translate-x-full hover:translate-x-0 transition-transform duration-300" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
