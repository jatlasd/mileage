export const calculateTypePercents = (data) => {
    const food = data[0].totalOrders
    const shop = data[1].totalOrders
    const total = food + shop
    return {
        foodPercent: Math.round((food / total) * 100),
        shopPercent: Math.round((shop / total) * 100)
    }
}