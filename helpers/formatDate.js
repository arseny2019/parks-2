export const formatDate = (date) => {
    return `${new Date(date).toLocaleDateString("ru-RU", {month: "long", day: "numeric", year: "numeric"})}`
}
