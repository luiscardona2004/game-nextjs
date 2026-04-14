"use client";
import Link from "next/link";
import { UserPlus, FingerprintSimple} from "phosphor-react";


export default function HomeInfo() {
  return (
    <div className=" bg-[#1db9e9] bg-[url(/img/bg-home-image.png)] min-h-dvh flex flex-col gap-2 p-4 items-center justify-center overflow-hidden">
      <div className="hero">
        <div className="hero-overlay bg-black/80 w-120"></div>
        <div className="hero-content text-neutral-content text-center ">
          <div className="max-w-md">
            <img
             src="/img/logo.png"
             width={300}
             height={300}
             className="flex mx-auto"  />
            <p className="my-8 text-justify">
              <strong>GameNext.js</strong> is a modern platform to manage and organize
              videogames. Built with Next.js, it uses Prisma, Neon database, and
              Stack Auth to provide secure authentication, fast performance, and scalable
              data management.
            </p>

            <Link href="handler/sign-in" className="btn btn-outline me-4 px-10">
              <FingerprintSimple size={32} />
              SignIn
            </Link>

            <Link href="handler/sign-up" className="btn btn-outline me-4 px-10">
              <UserPlus size={28} />
              SignUp
            </Link>
          </div>
        </div>
      </div>
    </div>



  )
}