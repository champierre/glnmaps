deno compile --allow-read --allow-net --target aarch64-apple-darwin --output binaries/aarch64-apple-darwin-glnmaps glnmaps.ts
deno compile --allow-read --allow-net --target x86_64-apple-darwin --output binaries/x86_64-apple-darwin-glnmaps glnmaps.ts
deno compile --allow-read --allow-net --target x86_64-pc-windows-msvc --output  x86_64-pc-windows-msvc-glnmaps glnmaps.ts
deno compile --allow-read --allow-net --target x86_64-unknown-linux-gnu --output  x86_64-unknown-linux-gnu-glnmaps glnmaps.ts
