export const todayDateRange = () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    // console.log(startOfDay)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    // console.log(endOfDay);
    return {startOfDay, endOfDay}
}

// todayDate()