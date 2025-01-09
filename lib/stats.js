export function filterTripsByField(trips, field, value) {
    return trips.filter(trip => trip[field] === value);
  }

  export function convertTripDate(isoDateTime) {
    const date = new Date(isoDateTime);
    return date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'long',
    });
  }
  export function convertTripTime(isoDateTime) {
    const date = new Date(isoDateTime);
    return date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      timeStyle: 'short',
    });
  }

