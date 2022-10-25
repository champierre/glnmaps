deno compile --allow-read --allow-net --allow-run --target aarch64-apple-darwin --output binaries/aarch64-apple-darwin-glnmaps glnmaps.ts
deno compile --allow-read --allow-net --allow-run --target x86_64-apple-darwin --output binaries/x86_64-apple-darwin-glnmaps glnmaps.ts
deno compile --allow-read --allow-net --allow-run --target x86_64-pc-windows-msvc --output binaries/x86_64-pc-windows-msvc-glnmaps glnmaps.ts
deno compile --allow-read --allow-net --allow-run --target x86_64-unknown-linux-gnu --output binaries/x86_64-unknown-linux-gnu-glnmaps glnmaps.ts
