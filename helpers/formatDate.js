export const formatDate = (dateString) => {
    const currentDate = new Date();
    const date = new Date(dateString);
    const fullDate = `${date.toLocaleDateString("ru-RU", {month: "long", day: "numeric", year: "numeric"})}`;
    const today = date.getDate() === currentDate.getDate() && currentDate.getTime() - date.getTime() < 3600 * 1000 * 24;
    const yesterday = date.getDate() === (new Date(currentDate.getTime() - (currentDate.getHours() + 1.01) * 3600 * 1000)).getDate();
    if (today) {
        return 'Сегодня'
    } else if (yesterday) {
        return 'Вчера'
    } else {
        return fullDate;
    }
}
