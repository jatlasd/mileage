export async function checkOil (miles) {
    try {
        const response = await fetch('/api/oil')
        const data = await response.json()
        const storedMiles = data.mileage
        console.log(`Current miles: ${miles}`)
        console.log(`Stored miles: ${storedMiles}`)
        const difference = miles - storedMiles
        console.log(`Difference: ${difference}`)
        if (difference >= 3000) {
            await fetch('/api/oil', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentlyNeeds: true })
            })
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error('Error fetching oil data:', error)
    }
}