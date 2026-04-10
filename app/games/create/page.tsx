import { PrismaClient } from '../../generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import FormActionButton from '@/components/FormActionButton'
import GameImageInput from '@/components/GameImageInput'
import SideBar from '@/components/SideBar'
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

async function createGame(formData: FormData) {
  'use server'

  const title = String(formData.get('title') ?? '').trim()
  const developer = String(formData.get('developer') ?? '').trim()
  const releasedate = String(formData.get('releasedate') ?? '').trim()
  const genre = String(formData.get('genre') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const consoleId = Number(formData.get('console_id'))
  const price = Number(formData.get('price'))
  const uploadedCover = await saveGameCover(formData.get('cover'), title)
  const cover = resolveCoverName(uploadedCover)

  if (
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

  const game = await prisma.game.create({
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
  redirect(`/games/${game.id}`)
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
            <form
              action={createGame}
              encType="multipart/form-data"
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-200">
                  Titulo
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                  placeholder="Ej. God of War Ragnarok"
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
                  className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                  placeholder="Ej. Santa Monica Studio"
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
                  className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                  placeholder="Ej. Accion / Aventura"
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
                  className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                  placeholder="Ej. 59.99"
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
                  defaultValue=""
                  className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                >
                  <option value="" disabled>
                    Selecciona una consola
                  </option>
                  {consoles.map((console) => (
                    <option key={console.id} value={console.id}>
                      {console.name}
                    </option>
                  ))}
                </select>
              </div>

              <GameImageInput
                label="Imagen del juego"
                helperText="Selecciona una imagen desde tu equipo. Si no eliges ninguna, se usara no-image.png."
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
                  className="w-full rounded-2xl border border-white/10 bg-[#11182d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
                  placeholder="Describe el juego, su historia o su jugabilidad..."
                />
              </div>

              <div className="md:col-span-2 flex flex-wrap justify-end gap-3 pt-2">
                <Link
                  href="/games"
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cancelar
                </Link>

                <FormActionButton
                  label="Guardar juego"
                  pendingLabel="Guardando..."
                  className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-fuchsia-500/20"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </SideBar>
  )
}
