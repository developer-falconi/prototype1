export async function GET(request: Request) {
  try {
   
    const clientOrigin = request.headers.get('host') || '';

    const fullUrl = 'http://localhost:4002/api/producer/domain';
    const response = await fetch(fullUrl, {
      headers: {
        'x-client-origin': clientOrigin,
      },
    });

    const producer = await response.json() as {
      success: boolean;
      data: any
    };

    if (producer.success) {
      return new Response(JSON.stringify(producer), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(
        JSON.stringify({ error: "Failed to fetch events" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error fetching requisitions:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
