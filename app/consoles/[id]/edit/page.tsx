import { PrismaClient } from "../../../generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import SideBar from "@/components/SideBar";
import ConsoleCrudForm from "@/components/ConsoleCrudForm";
import {
  getValidationErrorMessage,
  getValidationFieldErrors,
  type CrudFormState,
  updateConsoleSchema,
} from "@/lib/crud-schemas";
import { resolveCoverName, saveGameCover } from "@/lib/game-cover";
import { stackServerApp } from "@/stack/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

type EditConsolePageProps = {
  params: Promise<{ id: string }>;
};

async function updateConsole(_: CrudFormState, formData: FormData): Promise<CrudFormState> {
  "use server";

  const rawValues = {
    id: String(formData.get("id") ?? ""),
    current_image: String(formData.get("current_image") ?? ""),
    name: String(formData.get("name") ?? ""),
    manufacturer: String(formData.get("manufacturer") ?? ""),
    releasedate: String(formData.get("releasedate") ?? ""),
    description: String(formData.get("description") ?? ""),
  };

  const parsed = updateConsoleSchema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      formError: getValidationErrorMessage(parsed.error),
      fieldErrors: getValidationFieldErrors(parsed.error),
      values: rawValues,
    };
  }

  let consoleId: number;

  try {
    const currentImage = rawValues.current_image.trim();
    const uploadedImage = await saveGameCover(formData.get("image"), parsed.data.name);
    const image = resolveCoverName(uploadedImage, currentImage);

    const consoleItem = await prisma.console.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        manufacturer: parsed.data.manufacturer,
        releasedate: new Date(parsed.data.releasedate),
        description: parsed.data.description,
        image,
      },
    });

    consoleId = consoleItem.id;
  } catch (error) {
    return {
      formError:
        error instanceof Error
          ? error.message
          : "No fue posible actualizar la consola en este momento.",
      fieldErrors: {},
      values: rawValues,
    };
  }

  revalidatePath("/consoles");
  revalidatePath(`/consoles/${consoleId}`);
  redirect(`/consoles/${consoleId}?alert=console-updated`);
}

function formatDateForInput(date: Date) {
  return new Date(date).toISOString().split("T")[0];
}

export default async function EditConsolePage({ params }: EditConsolePageProps) {
  const user = await stackServerApp.getUser();
  if (!user) redirect("/");

  const { id } = await params;
  const consoleId = Number(id);
  if (Number.isNaN(consoleId)) notFound();

  const consoleItem = await prisma.console.findUnique({ where: { id: consoleId } });
  if (!consoleItem) notFound();

  return (
    <SideBar currentPath="/consoles">
      <div className="min-h-screen bg-[#0a0f1f] text-white">
        <div className="mx-auto max-w-4xl p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-fuchsia-400/80">CRUD Consoles</p>
              <h1 className="text-3xl font-bold md:text-4xl">Editar consola</h1>
              <p className="mt-2 text-sm text-gray-400">Actualiza la informacion de {consoleItem.name}.</p>
            </div>

            <Link href={`/consoles/${consoleItem.id}`} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Volver
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
            <ConsoleCrudForm
              mode="edit"
              initialValues={{
                id: consoleItem.id,
                image: consoleItem.image,
                name: consoleItem.name,
                manufacturer: consoleItem.manufacturer,
                releasedate: formatDateForInput(consoleItem.releasedate),
                description: consoleItem.description,
              }}
              cancelHref={`/consoles/${consoleItem.id}`}
              submitLabel="Guardar cambios"
              pendingLabel="Guardando..."
              confirmMessage={`Estas seguro de guardar los cambios de "${consoleItem.name}"?`}
              submitClassName="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-amber-500/20"
              action={updateConsole}
            />
          </div>
        </div>
      </div>
    </SideBar>
  );
}
