"use client";

import { filterTripsByField } from "@/lib/stats";
import { useState, useEffect } from "react";

const SingleTrip = ({ trip, index }) => {
  return (
    <div className="flex flex-col rounded border px-4 py-6">
      <h1>Index:&nbsp;{index + 1}</h1>
    </div>
  )
}

const Testing = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState(null);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/entry");
        const data = await response.json();
        setTrips(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    fetchData();
  }, []);

  const handleSetFilter = (e) => {
    setFilter(e.target.value)
    setFilteredTrips(filterTripsByField(trips, "dayOfWeek", e.target.value))
  }

  if (isLoading) return <p>loading</p>;

  return (
    <div className="flex flex-col w-full items-center">

      <button
        onClick={async () => {
          const response = await fetch("/api/analytics");
          const data = await response.json();
          console.log(data);
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Fetch Analytics
      </button>
      <select 
        value={filter || ""} 
        onChange={(e) => handleSetFilter(e)}
        className="mt-4 p-2 border rounded"
      >
        <option value="">Select a day</option>
        {daysOfWeek.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
      
      <div className="flex justify-evenly pt-10 w-full">
        <div className="flex flex-col border-2 rounded-xl items-center px-6 py-10">
          <h1>All Orders</h1>
          <p>{trips.length}</p>
        </div>
        <div className="flex flex-col border-2 rounded-xl items-center px-6 py-10">
          <h1>
            Filtered By:&nbsp;<span>{filter ? filter : "Select"}</span>
          </h1>
          <p>{filteredTrips.length}</p>
        </div>
        <div className="flex flex-col border-2 rounded-xl items-center px-6 py-10">
          <h1>Filtered Orders</h1>
          {filteredTrips.map((trip, index) => (
              <SingleTrip trip={trip} index={index} key={index}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testing;
