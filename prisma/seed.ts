import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {

  console.log('🌱 Starting seed...')

  // -----------------------------
  // 1. Clean database
  // -----------------------------

  await prisma.game.deleteMany()
  await prisma.console.deleteMany()

  console.log('🧹 Database cleaned')

  // -----------------------------
  // 2. Create Consoles
  // -----------------------------

  const consoles = await prisma.console.createMany({
    data: [
      {
        name: 'PlayStation 5',
        manufacturer: 'Sony Interactive Entertainment',
        releasedate: new Date('2020-11-12'),
        description:
          'The PlayStation 5 (PS5) is a home video game console bringing 4K gaming at 120Hz and ray tracing support.',
      },
      {
        name: 'Xbox Series X',
        manufacturer: 'Microsoft',
        releasedate: new Date('2020-11-10'),
        description:
          'The Xbox Series X is a high-performance console, featuring a custom AMD processor and 12 TFLOPS of graphical power.',
      },
      {
        name: 'Nintendo Switch OLED Model',
        manufacturer: 'Nintendo',
        releasedate: new Date('2021-10-08'),
        description:
          'A hybrid console that can be used as a home console and a portable handheld device, now with a vibrant OLED screen.',
      },
      {
        name: 'Nintendo Switch 2',
        manufacturer: 'Nintendo',
        releasedate: new Date('2025-06-05'),
        description:
          'The successor to the popular Nintendo Switch, featuring larger magnetic Joy-cons and enhanced performance.',
      },
      {
        name: 'Steam Deck OLED',
        manufacturer: 'Valve',
        releasedate: new Date('2023-11-16'),
        description:
          'A powerful handheld gaming computer that plays PC games from your Steam library on the go.',
      },
    ],
  })

  console.log('🎮 5 consoles seeded')

  // -----------------------------
  // 3. Get consoles from DB
  // -----------------------------

  const allConsoles = await prisma.console.findMany()

  const ps5 = allConsoles.find(c => c.name === 'PlayStation 5')
  const xbox = allConsoles.find(c => c.name === 'Xbox Series X')
  const switchOLED = allConsoles.find(c => c.name === 'Nintendo Switch OLED Model')
  const switch2 = allConsoles.find(c => c.name === 'Nintendo Switch 2')
  const steamDeck = allConsoles.find(c => c.name === 'Steam Deck OLED')

  // -----------------------------
  // 4. Create Games
  // -----------------------------

  const gamesData = [
    {
      title: 'God of War Ragnarök',
      developer: 'Santa Monica Studio',
      releasedate: new Date('2022-11-09'),
      price: 69.99,
      genre: 'Action-adventure',
      description:
        'Kratos and Atreus must journey to each of the Nine Realms and find answers as the forces of Asgard prepare for a prophesied battle.',
      console_id: ps5?.id,
    },
    {
      title: 'Halo Infinite',
      developer: '343 Industries',
      releasedate: new Date('2021-12-08'),
      price: 59.99,
      genre: 'First-person shooter',
      description:
        'Master Chief returns in the most expansive Halo campaign yet.',
      console_id: xbox?.id,
    },
    {
      title: 'The Legend of Zelda: Tears of the Kingdom',
      developer: 'Nintendo EPD',
      releasedate: new Date('2023-05-12'),
      price: 69.99,
      genre: 'Action-adventure',
      description:
        'Link soars through the skies and explores new areas of Hyrule.',
      console_id: switchOLED?.id,
    },
    {
      title: 'Elden Ring',
      developer: 'FromSoftware',
      releasedate: new Date('2022-02-25'),
      price: 59.99,
      genre: 'Action role-playing',
      description:
        'A fantasy action RPG adventure set within a world created by Hidetaka Miyazaki.',
      console_id: ps5?.id,
    },
    {
      title: 'Forza Horizon 5',
      developer: 'Playground Games',
      releasedate: new Date('2021-11-09'),
      price: 59.99,
      genre: 'Racing',
      description:
        'Explore the vibrant open world landscapes of Mexico.',
      console_id: xbox?.id,
    },
    {
      title: 'Pokémon Scarlet',
      developer: 'Game Freak',
      releasedate: new Date('2022-11-18'),
      price: 59.99,
      genre: 'Role-playing',
      description:
        'Embark on a new journey in the Paldea region.',
      console_id: switchOLED?.id,
    },
    {
      title: 'Spider-Man 2',
      developer: 'Insomniac Games',
      releasedate: new Date('2023-10-20'),
      price: 69.99,
      genre: 'Action-adventure',
      description:
        'Peter Parker and Miles Morales face the Symbiote threat.',
      console_id: ps5?.id,
    },
    {
      title: 'Starfield',
      developer: 'Bethesda Game Studios',
      releasedate: new Date('2023-09-06'),
      price: 69.99,
      genre: 'Role-playing',
      description:
        'Explore the vastness of space and create your own story.',
      console_id: xbox?.id,
    },
    {
      title: 'Mario Kart 9',
      developer: 'Nintendo EPD',
      releasedate: new Date('2025-12-01'),
      price: 59.99,
      genre: 'Racing',
      description:
        'The next installment in the popular Mario Kart series.',
      console_id: switch2?.id,
    },
    {
      title: 'Hogwarts Legacy',
      developer: 'Avalanche Software',
      releasedate: new Date('2023-02-10'),
      price: 59.99,
      genre: 'Action role-playing',
      description:
        'Experience a new story set in the wizarding world.',
      console_id: steamDeck?.id,
    },

    // 50 juegos adicionales

    {
      title: 'Demon’s Souls',
      developer: 'Bluepoint Games',
      releasedate: new Date('2020-11-12'),
      price: 69.99,
      genre: 'Action role-playing',
      description:
        'A stunning remake of the classic action RPG with brutal combat and atmospheric world design.',
      console_id: ps5?.id,
    },
    {
      title: 'Ratchet & Clank: Rift Apart',
      developer: 'Insomniac Games',
      releasedate: new Date('2021-06-11'),
      price: 69.99,
      genre: 'Action-platformer',
      description:
        'Travel between dimensions in a fast-paced adventure starring Ratchet, Clank, and Rivet.',
      console_id: ps5?.id,
    },
    {
      title: 'Returnal',
      developer: 'Housemarque',
      releasedate: new Date('2021-04-30'),
      price: 69.99,
      genre: 'Roguelike shooter',
      description:
        'Fight to survive on a hostile alien planet in this third-person roguelike shooter.',
      console_id: ps5?.id,
    },
    {
      title: 'Final Fantasy XVI',
      developer: 'Square Enix',
      releasedate: new Date('2023-06-22'),
      price: 69.99,
      genre: 'Action role-playing',
      description:
        'A dark fantasy entry in the Final Fantasy series with large-scale battles and political intrigue.',
      console_id: ps5?.id,
    },
    {
      title: 'Final Fantasy VII Rebirth',
      developer: 'Square Enix',
      releasedate: new Date('2024-02-29'),
      price: 69.99,
      genre: 'Action role-playing',
      description:
        'Cloud and his allies continue their journey beyond Midgar in this expansive remake sequel.',
      console_id: ps5?.id,
    },
    {
      title: 'Gran Turismo 7',
      developer: 'Polyphony Digital',
      releasedate: new Date('2022-03-04'),
      price: 69.99,
      genre: 'Racing',
      description:
        'A realistic driving simulator featuring a huge collection of cars, tracks, and tuning options.',
      console_id: ps5?.id,
    },
    {
      title: 'Horizon Forbidden West',
      developer: 'Guerrilla Games',
      releasedate: new Date('2022-02-18'),
      price: 69.99,
      genre: 'Action role-playing',
      description:
        'Aloy journeys west to uncover the secrets behind a deadly new threat to the planet.',
      console_id: ps5?.id,
    },
    {
      title: 'Stellar Blade',
      developer: 'Shift Up',
      releasedate: new Date('2024-04-26'),
      price: 69.99,
      genre: 'Action-adventure',
      description:
        'A stylish sci-fi action game featuring fast combat and cinematic storytelling.',
      console_id: ps5?.id,
    },
    {
      title: 'Death Stranding 2: On the Beach',
      developer: 'Kojima Productions',
      releasedate: new Date('2025-06-26'),
      price: 69.99,
      genre: 'Action-adventure',
      description:
        'Sam embarks on a new journey in a strange and emotional world shaped by connection and isolation.',
      console_id: ps5?.id,
    },
    {
      title: 'Astro Bot',
      developer: 'Team Asobi',
      releasedate: new Date('2024-09-06'),
      price: 59.99,
      genre: 'Platformer',
      description:
        'A colorful platforming adventure packed with creativity, charm, and inventive DualSense features.',
      console_id: ps5?.id,
    },

    {
      title: 'Microsoft Flight Simulator',
      developer: 'Asobo Studio',
      releasedate: new Date('2021-07-27'),
      price: 59.99,
      genre: 'Simulation',
      description:
        'Pilot aircraft around a beautifully recreated world with realistic weather and flight systems.',
      console_id: xbox?.id,
    },
    {
      title: 'Gears 5',
      developer: 'The Coalition',
      releasedate: new Date('2019-09-10'),
      price: 39.99,
      genre: 'Third-person shooter',
      description:
        'Fight across a collapsing world in this action-packed chapter of the Gears saga.',
      console_id: xbox?.id,
    },
    {
      title: 'Redfall',
      developer: 'Arkane Austin',
      releasedate: new Date('2023-05-02'),
      price: 39.99,
      genre: 'First-person shooter',
      description:
        'Battle vampires in an open-world cooperative shooter set in a haunted island town.',
      console_id: xbox?.id,
    },
    {
      title: 'Hi-Fi Rush',
      developer: 'Tango Gameworks',
      releasedate: new Date('2023-01-25'),
      price: 29.99,
      genre: 'Action rhythm',
      description:
        'An energetic action game where combat and movement sync to the beat of the music.',
      console_id: xbox?.id,
    },
    {
      title: 'Avowed',
      developer: 'Obsidian Entertainment',
      releasedate: new Date('2025-02-18'),
      price: 69.99,
      genre: 'Action role-playing',
      description:
        'A first-person fantasy RPG set in the world of Eora, filled with magic, mystery, and player choice.',
      console_id: xbox?.id,
    },
    {
      title: 'Senua’s Saga: Hellblade II',
      developer: 'Ninja Theory',
      releasedate: new Date('2024-05-21'),
      price: 49.99,
      genre: 'Action-adventure',
      description:
        'Senua returns in a haunting cinematic journey through myth, trauma, and survival.',
      console_id: xbox?.id,
    },
    {
      title: 'Fable',
      developer: 'Playground Games',
      releasedate: new Date('2026-03-01'),
      price: 69.99,
      genre: 'Action role-playing',
      description:
        'A modern reimagining of the beloved fantasy RPG franchise filled with humor and adventure.',
      console_id: xbox?.id,
    },
    {
      title: 'State of Decay 3',
      developer: 'Undead Labs',
      releasedate: new Date('2026-10-15'),
      price: 59.99,
      genre: 'Survival',
      description:
        'Survive a brutal post-apocalyptic world and build your community against overwhelming odds.',
      console_id: xbox?.id,
    },
    {
      title: 'Perfect Dark',
      developer: 'The Initiative',
      releasedate: new Date('2026-11-20'),
      price: 69.99,
      genre: 'Action-adventure',
      description:
        'A futuristic espionage thriller starring agent Joanna Dark in a high-tech world.',
      console_id: xbox?.id,
    },
    {
      title: 'Indiana Jones and the Great Circle',
      developer: 'MachineGames',
      releasedate: new Date('2024-12-09'),
      price: 69.99,
      genre: 'Action-adventure',
      description:
        'Step into the shoes of Indiana Jones in a globe-trotting first-person adventure.',
      console_id: xbox?.id,
    },

    {
      title: 'Super Mario Bros. Wonder',
      developer: 'Nintendo EPD',
      releasedate: new Date('2023-10-20'),
      price: 59.99,
      genre: 'Platformer',
      description:
        'A vibrant side-scrolling Mario adventure packed with new Wonder effects and surprises.',
      console_id: switchOLED?.id,
    },
    {
      title: 'Metroid Dread',
      developer: 'MercurySteam',
      releasedate: new Date('2021-10-08'),
      price: 59.99,
      genre: 'Action-adventure',
      description:
        'Samus faces relentless robotic threats in a tense and fast-paced side-scrolling adventure.',
      console_id: switchOLED?.id,
    },
    {
      title: 'Animal Crossing: New Horizons',
      developer: 'Nintendo EPD',
      releasedate: new Date('2020-03-20'),
      price: 59.99,
      genre: 'Life simulation',
      description:
        'Build your own island paradise and enjoy a relaxing life with charming animal neighbors.',
      console_id: switchOLED?.id,
    },
    {
      title: 'Splatoon 3',
      developer: 'Nintendo EPD',
      releasedate: new Date('2022-09-09'),
      price: 59.99,
      genre: 'Third-person shooter',
      description:
        'Compete in colorful ink-based battles with new weapons, stages, and customization options.',
      console_id: switchOLED?.id,
    },
    {
      title: 'Luigi’s Mansion 3',
      developer: 'Next Level Games',
      releasedate: new Date('2019-10-31'),
      price: 59.99,
      genre: 'Action-adventure',
      description:
        'Luigi explores a haunted hotel using his ghost-catching vacuum to rescue his friends.',
      console_id: switchOLED?.id,
    },
    {
      title: 'Xenoblade Chronicles 3',
      developer: 'Monolith Soft',
      releasedate: new Date('2022-07-29'),
      price: 59.99,
      genre: 'Role-playing',
      description:
        'A massive RPG adventure featuring emotional storytelling, real-time combat, and vast environments.',
      console_id: switchOLED?.id,
    },
    {
      title: 'Fire Emblem Engage',
      developer: 'Intelligent Systems',
      releasedate: new Date('2023-01-20'),
      price: 59.99,
      genre: 'Tactical role-playing',
      description:
        'Lead heroes from across the Fire Emblem universe in strategic turn-based battles.',
      console_id: switchOLED?.id,
    },
    {
      title: 'Kirby and the Forgotten Land',
      developer: 'HAL Laboratory',
      releasedate: new Date('2022-03-25'),
      price: 59.99,
      genre: 'Platformer',
      description:
        'Kirby explores a mysterious abandoned world in his first full 3D platforming adventure.',
      console_id: switchOLED?.id,
    },
    {
      title: 'Donkey Kong Country Returns HD',
      developer: 'Forever Entertainment',
      releasedate: new Date('2025-01-16'),
      price: 49.99,
      genre: 'Platformer',
      description:
        'A remastered version of the classic platformer featuring challenging levels and cooperative play.',
      console_id: switch2?.id,
    },
    {
      title: 'Pokémon Legends: Z-A',
      developer: 'Game Freak',
      releasedate: new Date('2025-10-16'),
      price: 59.99,
      genre: 'Action role-playing',
      description:
        'A new Pokémon adventure set in Lumiose City with exploration and real-time action elements.',
      console_id: switch2?.id,
    },

    {
      title: 'Cyberpunk 2077',
      developer: 'CD Projekt Red',
      releasedate: new Date('2020-12-10'),
      price: 49.99,
      genre: 'Action role-playing',
      description:
        'Become a cyber-enhanced mercenary in the sprawling futuristic city of Night City.',
      console_id: steamDeck?.id,
    },
    {
      title: 'Baldur’s Gate 3',
      developer: 'Larian Studios',
      releasedate: new Date('2023-08-03'),
      price: 59.99,
      genre: 'Role-playing',
      description:
        'A deep party-based RPG with rich storytelling, tactical combat, and meaningful player choices.',
      console_id: steamDeck?.id,
    },
    {
      title: 'Hades',
      developer: 'Supergiant Games',
      releasedate: new Date('2020-09-17'),
      price: 24.99,
      genre: 'Roguelike action',
      description:
        'Battle out of the Underworld in a fast-paced roguelike with memorable characters and story progression.',
      console_id: steamDeck?.id,
    },
    {
      title: 'Hades II',
      developer: 'Supergiant Games',
      releasedate: new Date('2024-05-06'),
      price: 29.99,
      genre: 'Roguelike action',
      description:
        'The sequel expands the mythological action formula with a new protagonist and fresh powers.',
      console_id: steamDeck?.id,
    },
    {
      title: 'Resident Evil 4',
      developer: 'Capcom',
      releasedate: new Date('2023-03-24'),
      price: 59.99,
      genre: 'Survival horror',
      description:
        'A modern remake of the horror classic, featuring intense combat and reimagined environments.',
      console_id: steamDeck?.id,
    },
    {
      title: 'Monster Hunter Rise',
      developer: 'Capcom',
      releasedate: new Date('2022-01-12'),
      price: 39.99,
      genre: 'Action role-playing',
      description:
        'Hunt giant monsters with fluid movement and cooperative gameplay in a richly crafted world.',
      console_id: steamDeck?.id,
    },
    {
      title: 'Lies of P',
      developer: 'Neowiz',
      releasedate: new Date('2023-09-19'),
      price: 49.99,
      genre: 'Action role-playing',
      description:
        'A dark soulslike inspired by Pinocchio, set in a grim Belle Époque-inspired city.',
      console_id: steamDeck?.id,
    },
    {
      title: 'Dave the Diver',
      developer: 'Mintrocket',
      releasedate: new Date('2023-06-28'),
      price: 19.99,
      genre: 'Adventure',
      description:
        'Dive by day, manage a sushi restaurant by night, and uncover secrets beneath the sea.',
      console_id: steamDeck?.id,
    },
    {
      title: 'Vampire Survivors',
      developer: 'Poncle',
      releasedate: new Date('2022-10-20'),
      price: 4.99,
      genre: 'Roguelike action',
      description:
        'Survive relentless enemy waves and create absurdly powerful builds in a minimalist action game.',
      console_id: steamDeck?.id,
    },
    {
      title: 'Disco Elysium - The Final Cut',
      developer: 'ZA/UM',
      releasedate: new Date('2021-03-30'),
      price: 39.99,
      genre: 'Role-playing',
      description:
        'Solve a murder and shape your identity in a deeply narrative detective RPG.',
      console_id: steamDeck?.id,
    },

    {
      title: 'Assassin’s Creed Mirage',
      developer: 'Ubisoft Bordeaux',
      releasedate: new Date('2023-10-05'),
      price: 49.99,
      genre: 'Action-adventure',
      description:
        'Follow Basim through the bustling streets of بغداد in a stealth-focused Assassin’s Creed experience.',
      console_id: ps5?.id,
    },
    {
      title: 'Call of Duty: Modern Warfare III',
      developer: 'Sledgehammer Games',
      releasedate: new Date('2023-11-10'),
      price: 69.99,
      genre: 'First-person shooter',
      description:
        'A blockbuster military shooter with cinematic missions and competitive multiplayer modes.',
      console_id: xbox?.id,
    },
    {
      title: 'EA Sports FC 24',
      developer: 'EA Vancouver',
      releasedate: new Date('2023-09-29'),
      price: 69.99,
      genre: 'Sports',
      description:
        'A football simulation featuring licensed clubs, leagues, and multiple competitive game modes.',
      console_id: ps5?.id,
    },
    {
      title: 'NBA 2K24',
      developer: 'Visual Concepts',
      releasedate: new Date('2023-09-08'),
      price: 69.99,
      genre: 'Sports',
      description:
        'A basketball simulation with realistic gameplay, career modes, and iconic NBA content.',
      console_id: xbox?.id,
    },
    {
      title: 'Mortal Kombat 1',
      developer: 'NetherRealm Studios',
      releasedate: new Date('2023-09-19'),
      price: 69.99,
      genre: 'Fighting',
      description:
        'A reimagined Mortal Kombat universe with brutal combat and a cinematic story mode.',
      console_id: ps5?.id,
    },
    {
      title: 'Street Fighter 6',
      developer: 'Capcom',
      releasedate: new Date('2023-06-02'),
      price: 59.99,
      genre: 'Fighting',
      description:
        'A polished fighting game with modern controls, strong online play, and an expansive World Tour mode.',
      console_id: steamDeck?.id,
    },
    {
      title: 'Tekken 8',
      developer: 'Bandai Namco Studios',
      releasedate: new Date('2024-01-26'),
      price: 69.99,
      genre: 'Fighting',
      description:
        'Continue the Mishima saga in a cinematic fighting game with aggressive mechanics and flashy battles.',
      console_id: ps5?.id,
    },
    {
      title: 'Prince of Persia: The Lost Crown',
      developer: 'Ubisoft Montpellier',
      releasedate: new Date('2024-01-18'),
      price: 49.99,
      genre: 'Action-platformer',
      description:
        'A stylish metroidvania adventure with precise combat, platforming, and time-based powers.',
      console_id: switchOLED?.id,
    },
    {
      title: 'Sea of Stars',
      developer: 'Sabotage Studio',
      releasedate: new Date('2023-08-29'),
      price: 34.99,
      genre: 'Role-playing',
      description:
        'A retro-inspired turn-based RPG with charming pixel art and modernized gameplay systems.',
      console_id: steamDeck?.id,
    },
    {
      title: 'Octopath Traveler II',
      developer: 'Square Enix',
      releasedate: new Date('2023-02-24'),
      price: 59.99,
      genre: 'Role-playing',
      description:
        'Eight new travelers set out on intersecting journeys in a beautifully crafted HD-2D world.',
      console_id: switchOLED?.id,
    },
  ]

  for (const game of gamesData) {
    if (!game.console_id) continue

    await prisma.game.createMany({
      data: gamesData.filter(game => game.console_id),
    })
  }

  console.log(`🕹️ ${gamesData.length} games seeded`)

  console.log('✅ Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })