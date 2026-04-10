import { PrismaClient } from '../../generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { revalidatePath } from 'next/cache'
import FormActionButton from '@/components/FormActionButton'

const prisma = new PrismaClient({
    adapter: new PrismaNeon({
        connectionString: process.env.DATABASE_URL!,
    }),
})

async function deleteGame(formData: FormData) {
    'use server'

    const id = Number(formData.get('id'))

    if (Number.isNaN(id)) {
        throw new Error('ID de juego invalido.')
    }

    await prisma.game.delete({
        where: { id },
    })

    revalidatePath('/games')
    redirect('/games')
}

type GameDetailProps = {
    params: Promise<{
        id: string
    }>
}

export default async function GameDetail({ params }: GameDetailProps) {
    const { id } = await params
    const gameId = Number(id)

    if (isNaN(gameId)) {
        notFound()
    }

    const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { console: true },
    })

    if (!game) {
        notFound()
    }
    return (
        <div className="min-h-screen bg-[#0a0f1f] text-white mt-0">
            <div className=" min-h-screen mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-4">
                    <Link
                        href="/games"
                        className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 mt-4"
                    >
                        ← Volver al catálogo
                    </Link>
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(260px,320px)_1fr]">
                        {/* Imagen */}
                    
                        <div className="relative h-56 w-full overflow-hidden">
                            <Image
                                src={`/img/${game.cover}`}
                                alt={game.title}
                                fill
                                className="object-cover transition duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute bottom-3 left-3 rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-300 backdrop-blur-sm">
                                {game.genre}
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-6 sm:p-8">
                            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-fuchsia-400/80">
                                Videojuego
                            </p>

                            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                                {game.title}
                            </h1>


                            <div className="mt-4 flex flex-wrap gap-3">
                                <span className="rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-sm text-cyan-300">
                                    {game.genre}
                                </span>

                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300">
                                    {game.console.name}
                                </span>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-wider text-gray-400">
                                        Desarrollador
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-white">
                                        {game.developer}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-xs uppercase tracking-wider text-gray-400">
                                        Precio
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-cyan-400">
                                        ${Number(game.price).toFixed(2)}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                                    <p className="text-xs uppercase tracking-wider text-gray-400">
                                        Lanzamiento
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-white">
                                        {new Date(game.releasedate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h2 className="mb-3 text-lg font-semibold text-white">
                                    Descripción
                                </h2>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <p className="leading-7 text-gray-300">
                                        {game.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href={`/games/${game.id}/edit`}
                                    className="rounded-2xl bg-amber-500/15 px-5 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/30"
                                >
                                    Editar
                                </Link>

                                <form action={deleteGame}>
                                    <input type="hidden" name="id" value={game.id} />
                                    <FormActionButton
                                        label="Eliminar"
                                        pendingLabel="Eliminando..."
                                        confirmMessage={`Estas seguro de eliminar "${game.title}"? Esta accion no se puede deshacer.`}
                                        className="rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/30"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
