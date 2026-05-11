const run = async () => {
    try {
        const res = await fetch('https://dolabriform-fascinatedly-lecia.ngrok-free.dev/api/rate', {
            method: 'POST',
            body: JSON.stringify({ scenarioId: '1', action: 'get_all' }),
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(await res.text());
    } catch (e) {
        console.error(e);
    }
}
run();
