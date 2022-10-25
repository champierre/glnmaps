import { readCSVObjects, writeCSV, writeCSVObjects } from "https://deno.land/x/csv/mod.ts";
import { serve } from "https://deno.land/std@0.159.0/http/server.ts";
import * as Colors from "https://deno.land/std@0.146.0/fmt/colors.ts";

const csvPath = Deno.args[0];
if (!csvPath) {
  console.log(
    Colors.red("glnmaps フォルダ/ファイル名.csv のようにCSVファイルのパスを指定してください。")
  );
  Deno.exit(1);
}

const f = await Deno.open(csvPath);
const spots: any = []
for await (const row of readCSVObjects(f)) {
  spots.push(row);
};

serve(handler, { port: 3000 });
console.log(Colors.green("glnmaps is running. Access it at: http://localhost:3000/"));
Deno.run({ cmd: ["open", "http://localhost:3000"] })

const geojson = await csv2geojson(csvPath);
const downloadLink = '<p><a href="/download" download="index.html">ソースをダウンロード</a></p>';
let index = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>glnmaps</title>
    <style>
      body,
      html {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }

      .geolonia {
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    {{download-link}}
    <script id="geojson" type="application/json">
      {{geojson}}
    </script>
    <div
      class="geolonia"
      data-geojson="#geojson"
    ></div>

    <script
      type="text/javascript"
      src="https://cdn.geolonia.com/v1/embed?geolonia-api-key=YOUR-API-KEY"
    ></script>
  </body>
</html>`;

index = index.replace("{{geojson}}", geojson);

function description(id: Number, _row: any) {
  let desc = `<a href="/spots/${id}/edit">編集</a><br />`;
  for (const key in _row) {
    desc += `<strong>${key}:</strong> ${_row[key]}<br />`;
  }
  return desc;
}

function editPage(spotId, spotData) {
  let edit = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>edit</title>
    <style>
      input[type="text"] {
        width: 300px;
      }
    </style>
  </head>
  <body>
    <form action="/spots/${spotId}" method="post">
      <table>`;
  let index = 0;
  for (const key in spotData) {
    edit += `<tr><td><label for="${key}">${key}</label></td><td><input type="text" name="${key}" value="${spotData[key]}" /></td></tr>`;
    index++;
  }
  edit += `
        </table>
      <input type="submit" value="更新" />
    </form>
  </body>
</html>`;
  return edit;
}

async function csv2geojson(_csvPath: string) {
  const features = [];
  let id = 0;
  for await (const row of spots) {
    const lat = Number(row["緯度"] || row["緯度（10進法）"] || row["lat"] || row["latitude"]);
    const lng = Number(row["経度"] || row["経度（10進法）"] || row["lng"] || row["longitude"] || row["lon"] || row["long"]);
    const data = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      properties: {
        title: row["名称"] || row["name"],
        description: description(id, row),
      },
    };
    features.push(data);
    id++;
  }
  f.close();

  const json = {
    type: "FeatureCollection",
    features: features,
  };
  return JSON.stringify(json);
}

async function handler(req: Request): Response {
  const url = new URL(req.url);
  const method = req.method;
  let html;

  const editPattern = new URLPattern({ pathname: "/spots/:id/edit" });
  const updatePattern = new URLPattern({ pathname: "/spots/:id" });

  if (url.pathname === "/") {
    html = index.replace("{{download-link}}", downloadLink);
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  } else if (updatePattern.test({ pathname: url.pathname }) && method === "POST") {
    const match = updatePattern.exec({ pathname: url.pathname });
    const spotId = match.pathname.groups.id;

    const bodyReader = await req.body?.getReader().read();
    const decoder = new TextDecoder();
    const body = decoder.decode(bodyReader?.value);

    const params = new URLSearchParams(decodeURI(body));
    const spot = Object.fromEntries(params.entries());
    spots[spotId] = spot;

    const header = Object.keys(spots[0]);
    const csvData = spots.map((row) => 
      Object.values(row).map((value) => value.toString())
    );
    const file = await Deno.open("new." + csvPath, { write: true, create: true, truncate: true });
    await writeCSV(file,[header, ...csvData]);

    return new Response(`post ${spotId}`, {
      headers: { "content-type": "text/html" },
    });
  } else if (editPattern.test({ pathname: url.pathname })) {
    const match = editPattern.exec({ pathname: url.pathname });
    const spotId = match.pathname.groups.id;
    const spotData = spots[Number(spotId)];
    return new Response(editPage(spotId, spotData), {
      headers: { "content-type": "text/html" },
    });
  } else if (url.pathname === "/download") {
    html = index.replace("{{download-link}}", "");
    return new Response(html, {
      headers: { "content-type": "text/plain" },
    });
  } else {
    return new Response("Not Found", { status: 404 });
  }
}
