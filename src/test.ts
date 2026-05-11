fetch('https://dolabriform-fascinatedly-lecia.ngrok-free.dev/api/rate', {
  method: 'POST',
  body: JSON.stringify({ scenarioId: '1', action: 'get', cfToken: "cf_dummy_token_xyz" }),
  headers: { 'Content-Type': 'application/json' }
}).then(r => r.text()).then(console.log);
