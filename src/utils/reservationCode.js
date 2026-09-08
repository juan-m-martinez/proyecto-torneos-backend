export const generateReservationCode = () => {
    const randomPart = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `TKT-${randomPart}`;
};

