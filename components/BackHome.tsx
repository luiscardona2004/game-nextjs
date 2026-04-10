"use client"
import { SkipBack } from "phosphor-react";
import Link from "next/link";


export default function BackHomeButton (){
    return (
        <Link href="/" className="flex w-full" >
            <SkipBack size={28} />
           Volver al inicio
        </Link>
    )
}