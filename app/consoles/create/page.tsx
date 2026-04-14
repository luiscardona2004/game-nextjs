import { PrismaClient } from "../../generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import ConsoleCrudForm from "@/components/ConsoleCrudForm";
import SideBar from "@/components/SideBar";
import {
  createConsoleSchema,
  getValidationErrorMessage,
  getValidationFieldErrors,
  type CrudFormState,
} from "@/lib/crud-schemas";
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

async function createConsole(_: CrudFormState, formData: FormData): Promise<CrudFormState> {
  "use server";

  const rawValues = {
    name: String(formData.get("name") ?? ""),
    manufacturer: String(formData.get("manufacturer") ?? ""),
    releasedate: String(formData.get("releasedate") ?? ""),
    description: String(formData.get("description") ?? ""),
  };

  const parsed = createConsoleSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      formError: getValidationErrorMessage(parsed.error),
      fieldErrors: getValidationFieldErrors(parsed.error),
      values: rawValues,
    };
  }

  const uploadedImage = await saveGameCover(formData.get("image"), parsed.data.name);
  const image = resolveCoverName(uploadedImage);

  const consoleItem = await prisma.console.create({
    data: {
      name: parsed.data.name,
      manufacturer: parsed.data.manufacturer,
      releasedate: new Date(parsed.data.releasedate),
      description: parsed.data.description,
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
            <ConsoleCrudForm
              mode="create"
              cancelHref="/consoles"
              submitLabel="Guardar consola"
              pendingLabel="Guardando..."
              submitClassName="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-fuchsia-500/20"
              action={createConsole}
            />
          </div>
        </div>
      </div>
    </SideBar>
  );
}
