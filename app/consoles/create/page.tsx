import { PrismaClient } from "../../generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import FormActionButton from "@/components/FormActionButton";
import ConsoleImageInput from "@/components/ConsoleImageInput";
import SideBar from "@/components/SideBar";
import { resolveCoverName, saveGameCover } from "@/lib/game-cover";
import { stackServerApp } from "@/stack/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function createConsole(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const manufacturer = String(formData.get("manufacturer") ?? "").trim();
  const releasedate = String(formData.get("releasedate") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const uploadedImage = await saveGameCover(formData.get("image"), name);
  const image = resolveCoverName(uploadedImage);

  if (!name || !manufacturer || !releasedate || !description) {
    throw new Error("Todos los campos obligatorios deben estar completos.");
  }

  const consoleItem = await prisma.console.create({
    data: {
      name,
      manufacturer,
      releasedate: new Date(releasedate),
      description,
      image,
    },
  });

  revalidatePath("/consoles");
  redirect(`/consoles/${consoleItem.id}`);
}

export default async function CreateConsolePage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <SideBar currentPath="/consoles">
      <div className="min-h-screen bg-[#0a0f1f] text-white">
        <div className="mx-auto max-w-4xl p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-fuchsia-400/80">
                CRUD Consoles
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">Agregar consola</h1>
              <p className="mt-2 text-sm text-gray-400">Crea una nueva consola para tu catalogo.</p>
            </div>

            <Link href="/consoles" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Volver
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
            <form action={createConsole} encType="multipart/form-data" className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-200">Nombre</label>
                <input id="name" name="name" type="text" required className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400" />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="manufacturer" className="mb-2 block text-sm font-medium text-gray-200">Fabricante</label>
                <input id="manufacturer" name="manufacturer" type="text" required className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400" />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="releasedate" className="mb-2 block text-sm font-medium text-gray-200">Fecha de lanzamiento</label>
                <input id="releasedate" name="releasedate" type="date" required className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400" />
              </div>

              <ConsoleImageInput
                label="Imagen de la consola"
                helperText="Selecciona una imagen desde tu equipo. Si no eliges ninguna, se usara no-image.png."
              />

              <div className="md:col-span-2">
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-200">Descripcion</label>
                <textarea id="description" name="description" required rows={6} className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400" />
              </div>

              <div className="md:col-span-2 flex flex-wrap justify-end gap-3 pt-2">
                <Link href="/consoles" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Cancelar
                </Link>
                <FormActionButton
                  label="Guardar consola"
                  pendingLabel="Guardando..."
                  className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-fuchsia-500/20"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </SideBar>
  );
}
