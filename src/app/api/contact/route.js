// app/api/contact/route.js

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Do something with form data, if needed

    return new Response(JSON.stringify({ message: 'Message received.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ message: 'Error handling request', error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
