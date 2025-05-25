const dateString="2025-05-17"
const jsDate = new Date(dateString)
const dateInput= jsDate.toISOString().split("T")[0]
console.log(typeof(dateInput))
console.log(dateInput)