export async function POST(request) {
  const visitDate = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  console.log(`Found the hidden endpoint - nice detective work!`);
  console.log(`Visit logged: ${visitDate} EST`);
  
  return new Response('🎯', { 
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}
