import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import SideBar from "@/components/SideBar";
import GamesInfo from "@/components/GamesInfo";

export default async function GamesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
}) {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/");
  }

  return (
    <SideBar currentPath="/games">
      <GamesInfo searchParams={searchParams}></GamesInfo>
    </SideBar>
  );
}
