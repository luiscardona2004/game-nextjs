import { PrismaClient } from '../../generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import GameCrudForm from '@/components/GameCrudForm'
import SideBar from '@/components/SideBar'
import {
  createGameSchema,
  getValidationErrorMessage,
  getValidationFieldErrors,
  type CrudFormState,
} from '@/lib/crud-schemas'
import { resolveCoverName, saveGameCover } from '@/lib/game-cover'
import { stackServerApp } from '@/stack/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
})

async function createGame(_: CrudFormState, formData: FormData): Promise<CrudFormState> {
  'use server'

  const rawValues = {
    title: String(formData.get('title') ?? ''),
    developer: String(formData.get('developer') ?? ''),
    releasedate: String(formData.get('releasedate') ?? ''),
    genre: String(formData.get('genre') ?? ''),
    description: String(formData.get('description') ?? ''),
    console_id: String(formData.get('console_id') ?? ''),
    price: String(formData.get('price') ?? ''),
  }

  const parsed = createGameSchema.safeParse(rawValues)

  if (!parsed.success) {
    return {
      formError: getValidationErrorMessage(parsed.error),
      fieldErrors: getValidationFieldErrors(parsed.error),
      values: rawValues,
    }
  }

  const uploadedCover = await saveGameCover(formData.get('cover'), parsed.data.title)
  const cover = resolveCoverName(uploadedCover)

  const game = await prisma.game.create({
    data: {
      title: parsed.data.title,
      cover,
      developer: parsed.data.developer,
      releasedate: new Date(parsed.data.releasedate),
      price: parsed.data.price,
      genre: parsed.data.genre,
      description: parsed.data.description,
      console_id: parsed.data.console_id,
    },
  })

  revalidatePath('/games')
  redirect(`/games/${game.id}?alert=game-created`)
}

export default async function CreateGamePage() {
  const user = await stackServerApp.getUser()

  if (!user) {
    redirect('/')
  }

  const consoles = await prisma.console.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <SideBar currentPath="/games">
      <div className="min-h-screen bg-[#0a0f1f] text-white">
        <div className="mx-auto max-w-4xl p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-fuchsia-400/80">
                CRUD Games
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">Agregar juego</h1>
              <p className="mt-2 text-sm text-gray-400">
                Crea un nuevo videojuego para el catalogo.
              </p>
            </div>

            <Link
              href="/games"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Volver
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
            <GameCrudForm
              mode="create"
              consoles={consoles}
              cancelHref="/games"
              submitLabel="Guardar juego"
              pendingLabel="Guardando..."
              confirmMessage="Estas seguro de guardar este juego?"
              submitClassName="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-fuchsia-500/20"
              action={createGame}
            />
          </div>
        </div>
      </div>
    </SideBar>
  )
}
