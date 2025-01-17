export const calculateTypePercents = (data) => {
    if (!data || data.length === 0) {
        return {
            foodPercent: 0,
            shopPercent: 0
        }
    }

    const food = data.find(d => d.type === 'Food')?.averageOrders || 0
    const shop = data.find(d => d.type === 'Shop')?.averageOrders || 0
    const total = food + shop
    
    if (total === 0) {
        return {
            foodPercent: 0,
            shopPercent: 0
        }
    }

    return {
        foodPercent: Math.round((food / total) * 100),
        shopPercent: Math.round((shop / total) * 100)
    }
}