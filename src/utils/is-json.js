export default function isJSON(str) {
    try {
        const data = JSON.parse(str);
        return [true, data];
    } catch (error) {
        return [false, null];
    }
}