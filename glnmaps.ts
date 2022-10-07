import { readCSVRows, readCSVObjects } from "https://deno.land/x/csv/mod.ts";

const server = Deno.listen({ port: 3000 });
const csvPath = Deno.args[0];

for await (const conn of server) {
  serveHttp(conn);
}

async function csv2geojson(csvPath: string) {
  const f = await Deno.open(csvPath);
  let geojson;
  geojson = '{"type": "FeatureCollection","features": [{';

  let features = [];
  for await (const row of readCSVObjects(f)) {
    const lat = Number(row['緯度'] || row['緯度（10進法）']);
    const lng = Number(row['経度'] || row['経度（10進法）']);
    const data = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      properties: {
        title: row['名称'],
        description: row['名称'],
      }
    };
    features.push(data);
  }
  f.close();

  const json = {
    type: "FeatureCollection",
    features: features
  }
  return JSON.stringify(json);
}

async function serveHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);

  for await (const requestEvent of httpConn) {
    let body;
    const url = new URL(requestEvent.request.url);
    const path = url.pathname;

    if (path === "/") {
      body = await Deno.readFileSync("./index.html");
    }
    
    if (path === "/geojson") {
      body = await csv2geojson(csvPath);
    }

    requestEvent.respondWith(
      new Response(body, {
        status: 200,
      }),
    );
  }
}
