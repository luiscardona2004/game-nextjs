import { PrismaClient } from '../../../generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import SideBar from '@/components/SideBar'
import FormActionButton from '@/components/FormActionButton'
import GameImageInput from '@/components/GameImageInput'
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

async function updateGame(formData: FormData) {
  'use server'

  const id = Number(formData.get('id'))
  const title = String(formData.get('title') ?? '').trim()
  const currentCover = String(formData.get('current_cover') ?? '').trim()
  const developer = String(formData.get('developer') ?? '').trim()
  const releasedate = String(formData.get('releasedate') ?? '').trim()
  const genre = String(formData.get('genre') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const consoleId = Number(formData.get('console_id'))
  const price = Number(formData.get('price'))
  const uploadedCover = await saveGameCover(formData.get('cover'), title)
  const cover = resolveCoverName(uploadedCover, currentCover)

  if (
    Number.isNaN(id) ||
    !title ||
    !developer ||
    !releasedate ||
    !genre ||
    !description ||
    Number.isNaN(consoleId) ||
    Number.isNaN(price)
  ) {
    throw new Error('Todos los campos obligatorios deben estar completos.')
  }

  const game = await prisma.game.update({
    where: { id },
    data: {
      title,
      cover,
      developer,
      releasedate: new Date(releasedate),
      price,
      genre,
      description,
      console_id: consoleId,
    },
  })

  revalidatePath('/games')
  revalidatePath(`/games/${game.id}`)
  redirect(`/games/${game.id}`)
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
            <form
              action={updateGame}
              encType="multipart/form-data"
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              <input type="hidden" name="id" value={game.id} />
              <input type="hidden" name="current_cover" value={game.cover} />

              <div className="md:col-span-2">
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-200">
                  Titulo
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={game.title}
                  className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="developer" className="mb-2 block text-sm font-medium text-gray-200">
                  Desarrollador
                </label>
                <input
                  id="developer"
                  name="developer"
                  type="text"
                  required
                  defaultValue={game.developer}
                  className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="genre" className="mb-2 block text-sm font-medium text-gray-200">
                  Genero
                </label>
                <input
                  id="genre"
                  name="genre"
                  type="text"
                  required
                  defaultValue={game.genre}
                  className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-200">
                  Precio
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={game.price}
                  className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="releasedate" className="mb-2 block text-sm font-medium text-gray-200">
                  Fecha de lanzamiento
                </label>
                <input
                  id="releasedate"
                  name="releasedate"
                  type="date"
                  required
                  defaultValue={formatDateForInput(game.releasedate)}
                  className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label htmlFor="console_id" className="mb-2 block text-sm font-medium text-gray-200">
                  Consola
                </label>
                <select
                  id="console_id"
                  name="console_id"
                  required
                  defaultValue={String(game.console_id)}
                  className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                >
                  {consoles.map((console) => (
                    <option key={console.id} value={console.id}>
                      {console.name}
                    </option>
                  ))}
                </select>
              </div>

              <GameImageInput
              
                label="Cambiar imagen del juego"
                helperText={`Imagen actual: ${game.cover}. Si no eliges otra, se conserva la actual.`}
                currentImage={game.cover}
              />
              

              <div className="md:col-span-2">
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-200">
                  Descripcion
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  defaultValue={game.description}
                  className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                />
              </div>

              <div className="md:col-span-2 flex flex-wrap justify-end gap-3 pt-2">
                <Link
                  href={`/games/${game.id}`}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cancelar
                </Link>

                <FormActionButton
                  label="Guardar cambios"
                  pendingLabel="Guardando..."
                  confirmMessage={`Estas seguro de guardar los cambios de "${game.title}"?`}
                  className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-amber-500/20"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </SideBar>
  )
}
