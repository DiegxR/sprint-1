export const date = () =>{
    const date = new Date();
    const hour = date.getHours()
    const minutes = date.getMinutes()
    const time = `${hour > 12 ? hour-12 : hour}:${minutes} ${hour >= 12 ? 'pm' : 'am'}`
    return {
        time,
        minutes,
        hour
    }
}