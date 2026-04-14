import { PrismaClient } from '../../../generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import SideBar from '@/components/SideBar'
import GameCrudForm from '@/components/GameCrudForm'
import {
  getValidationErrorMessage,
  getValidationFieldErrors,
  type CrudFormState,
  updateGameSchema,
} from '@/lib/crud-schemas'
import { resolveCoverName, saveGameCover } from '@/lib/game-cover'
import { stackServerApp } from '@/stack/server'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
})

type EditGamePageProps = {
  params: Promise<{
    id: string
  }>
}

async function updateGame(_: CrudFormState, formData: FormData): Promise<CrudFormState> {
  'use server'

  const rawValues = {
    id: String(formData.get('id') ?? ''),
    current_cover: String(formData.get('current_cover') ?? ''),
    title: String(formData.get('title') ?? ''),
    developer: String(formData.get('developer') ?? ''),
    releasedate: String(formData.get('releasedate') ?? ''),
    genre: String(formData.get('genre') ?? ''),
    description: String(formData.get('description') ?? ''),
    console_id: String(formData.get('console_id') ?? ''),
    price: String(formData.get('price') ?? ''),
  }

  const parsed = updateGameSchema.safeParse(rawValues)

  if (!parsed.success) {
    return {
      formError: getValidationErrorMessage(parsed.error),
      fieldErrors: getValidationFieldErrors(parsed.error),
      values: rawValues,
    }
  }

  let gameId: number

  try {
    const currentCover = rawValues.current_cover.trim()
    const uploadedCover = await saveGameCover(formData.get('cover'), parsed.data.title)
    const cover = resolveCoverName(uploadedCover, currentCover)

    const game = await prisma.game.update({
      where: { id: parsed.data.id },
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

    gameId = game.id
  } catch (error) {
    return {
      formError:
        error instanceof Error
          ? error.message
          : 'No fue posible actualizar el juego en este momento.',
      fieldErrors: {},
      values: rawValues,
    }
  }

  revalidatePath('/games')
  revalidatePath(`/games/${gameId}`)
  redirect(`/games/${gameId}?alert=game-updated`)
}

function formatDateForInput(date: Date) {
  return new Date(date).toISOString().split('T')[0]
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  const user = await stackServerApp.getUser()

  if (!user) {
    redirect('/')
  }

  const { id } = await params
  const gameId = Number(id)

  if (Number.isNaN(gameId)) {
    notFound()
  }

  const [game, consoles] = await Promise.all([
    prisma.game.findUnique({
      where: { id: gameId },
    }),
    prisma.console.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  if (!game) {
    notFound()
  }

  return (
    <SideBar currentPath="/games">
      <div className="min-h-screen bg-[#0a0f1f] text-white">
        <div className="mx-auto max-w-4xl p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-fuchsia-400/80">
                CRUD Games
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">Editar juego</h1>
              <p className="mt-2 text-sm text-gray-400">
                Actualiza la informacion de {game.title}.
              </p>
            </div>

            <Link
              href={`/games/${game.id}`}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Volver
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
            <GameCrudForm
              mode="edit"
              consoles={consoles}
              initialValues={{
                id: game.id,
                cover: game.cover,
                title: game.title,
                developer: game.developer,
                releasedate: formatDateForInput(game.releasedate),
                genre: game.genre,
                description: game.description,
                console_id: String(game.console_id),
                price: String(game.price),
              }}
              cancelHref={`/games/${game.id}`}
              submitLabel="Guardar cambios"
              pendingLabel="Guardando..."
              confirmMessage={`Estas seguro de guardar los cambios de "${game.title}"?`}
              submitClassName="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-amber-500/20"
              action={updateGame}
            />
          </div>
        </div>
      </div>
    </SideBar>
  )
}
