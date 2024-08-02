export default defineEventHandler((event) => {
    const date = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    console.log(`${date} /api/click endpoint received request`)
    return {
        hello: 'world'
    }
})

