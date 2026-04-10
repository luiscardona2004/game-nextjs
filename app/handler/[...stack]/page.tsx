import BackHomeButton from "@/components/BackHome";
import { StackHandler } from "@stackframe/stack";
import Link from "next/link";
import Image from "next/image";


export default async function Handler() {
  return (
    <div className="relative min-h-dvh flex items-center justify-center 
                    bg-[#0b0f1a] bg-[url(/img/bg-home-image.png)] 
                    bg-cover bg-center overflow-hidden">

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/70 "></div>

      {/* Card principal */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl 
                      bg-white/5 backdrop-blur-md border border-cyan-400/20
                      shadow-[0_0_30px_rgba(0,255,255,0.2)]">

        {/* Logo */}
        <Image
          src="/img/logo.png"
          width={200}
          height={200}
          alt="GameNext Logo"
          className="mx-auto mb-4 drop-shadow-[0_0_10px_#00f0ff]"
        />

        {/* Título */}
       

        {/* SignIn */}
        <div className="p-4 rounded-xl bg-black/40">
          <StackHandler fullPage={false} />
        </div>

        <BackHomeButton />
      </div>
    </div>
  );
}