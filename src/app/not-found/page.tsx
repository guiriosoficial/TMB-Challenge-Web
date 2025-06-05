import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        <h1>ERRO 404</h1>
        <span>Página não encontrada</span>

        <footer className="flex gap-4 items-center flex-col sm:flex-row">
          <Button>Voltar ao início</Button>
   
        </footer>
      </main>
    </div>
  );
}
