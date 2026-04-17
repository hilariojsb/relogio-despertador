import type { Metadata } from 'next';
import AdBanner from '@/components/ads/AdBanner';
import { AppShell, FaqList, InfoCard, PageHeader } from '@/components/layout';
import Stopwatch from '@/components/features/stopwatch/Stopwatch';

export const metadata: Metadata = {
  title: 'Cronômetro Online Grátis (Preciso e Fácil de Usar)',
  description:
    'Cronômetro online grátis com alta precisão. Ideal para treino, estudo e atividades do dia a dia. Simples e rápido de usar.',
};

export default function CronometroPage() {
  return (
    <AppShell maxWidth="3xl">
      <AdBanner slot="top" />

      <PageHeader
        eyebrow="Cronômetro online"
        title="Cronômetro com voltas e milissegundos"
        description="Marcação de voltas com melhor parcial destacada."
      />

      <section className="animate-fade-up py-2 sm:py-4">
        <Stopwatch />
      </section>

      <AdBanner slot="middle" />

      <InfoCard title="Como usar">
        <ol className="list-inside list-decimal space-y-2">
          <li>Toque em iniciar para começar a contagem; use pausar para interromper sem zerar.</li>
          <li>Com o cronômetro em execução, use marcar volta para registrar tempos parciais.</li>
          <li>A melhor volta aparece em destaque na lista.</li>
          <li>Use zerar para reiniciar tudo quando precisar de uma nova medição.</li>
        </ol>
      </InfoCard>

      <InfoCard title="Dicas">
        <ul className="list-inside list-disc space-y-2">
          <li>
            <span className="font-mono text-xs text-muted-foreground">▶</span> Iniciar ou pausar — controle o fluxo
            da sessão.
          </li>
          <li>
            <span className="font-mono text-xs text-muted-foreground">⟳</span> Zerar — limpa tempo e voltas.
          </li>
          <li>
            <span className="font-mono text-xs text-muted-foreground">⚑</span> Marcar volta — só com o cronômetro
            rodando.
          </li>
          <li>Ideal para treinos, testes rápidos e qualquer medição que exija histórico de parciais.</li>
        </ul>
      </InfoCard>

      <InfoCard title="Perguntas frequentes">
        <FaqList
          items={[
            {
              question: 'A precisão depende do quê?',
              answer:
                'Do relógio do seu dispositivo e do navegador. Para medições laboratoriais críticas, use equipamento dedicado.',
            },
            {
              question: 'As voltas somem se eu atualizar a página?',
              answer:
                'Ao recarregar, o cronômetro volta ao estado inicial salvo pela ferramenta — confira antes de sair da página se precisar dos tempos.',
            },
            {
              question: 'Posso usar no celular?',
              answer: 'Sim, em navegadores atualizados. Mantenha a tela ligada durante a medição longa.',
            },
          ]}
        />
      </InfoCard>

      <AdBanner slot="bottom" />
    </AppShell>
  );
}
