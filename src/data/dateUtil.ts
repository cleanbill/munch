const z = (n: number) => n < 10 ? '0' + n : n;
const dateFormat = (date: Date): string => z(date.getDate()) + '/' + z(date.getMonth() + 1) + '/' + date.getFullYear()

const formatToDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const tempDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return tempDate;
}

const fullDisplay = (date: Date) => {
    const dateFormat = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    return dateFormat.format(date)
}


export { dateFormat, fullDisplay, formatToDate };