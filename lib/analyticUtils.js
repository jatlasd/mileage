export const calculateTypePercents = (data) => {
    if (!data || data.length === 0) {
        return {
            foodPercent: 0,
            shopPercent: 0
        }
    }

    const food = data.find(d => d.type === 'Food')?.totalOrders || 0
    const shop = data.find(d => d.type === 'Shop')?.totalOrders || 0
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