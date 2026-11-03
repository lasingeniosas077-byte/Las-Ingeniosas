import { getStore } from "@netlify/blobs";

const IDS = ["triple","limon","rafaello","tresleches","frutosrojos","maracuya","mocca","beso","mango"];
const H = { "cache-control": "no-store", "content-type": "application/json" };

export default async (req) => {
  const store = getStore("ingeniosas");
  if (req.method === "GET") {
    const d = await store.get("agotados", { type: "json" });
    return new Response(JSON.stringify(Array.isArray(d) ? d : []), { headers: H });
  }
  if (req.method === "POST") {
    let body = {};
    try { body = await req.json(); } catch (e) {}
    const pass = process.env.ADMIN_PASSWORD;
    if (!pass || body.password !== pass) {
      await new Promise(r => setTimeout(r, 800));
      return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), { status: 401, headers: H });
    }
    const list = (Array.isArray(body.agotados) ? body.agotados : []).filter(id => IDS.includes(id));
    await store.setJSON("agotados", list);
    return new Response(JSON.stringify({ ok: true, agotados: list }), { headers: H });
  }
  return new Response("", { status: 405 });
};

export const config = { path: "/api/disponibilidad" };
