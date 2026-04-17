import type { Metadata } from 'next';
import AdBanner from '@/components/ads/AdBanner';
import { AppShell, FaqList, InfoCard, PageHeader } from '@/components/layout';
import ClockDisplay from '@/components/features/clock/ClockDisplay';
import AlarmManager from '@/components/features/alarm/AlarmManager';
import FullscreenButton from '@/components/features/fullscreen/FullscreenButton';

export const metadata: Metadata = {
  title: 'Relógio Despertador Online Grátis (Com Alarme, Cronômetro e Temporizador)',
  description:
    'Use o relógio despertador online grátis com alarme, cronômetro e temporizador. Simples, rápido e funciona no celular e computador sem instalar.',
};

export default function HomePage() {
  return (
    <AppShell maxWidth="4xl">
      <AdBanner slot="top" />

      <section className="space-y-6 text-center sm:space-y-8">
        <PageHeader
          eyebrow="Relógio digital online"
          title="Relógio online grátis com alarmes"
          description="Hora local em tempo real, alarmes e dados salvos no seu dispositivo."
        />
        <div className="animate-fade-up py-4 sm:py-6">
          <ClockDisplay size="xl" showSeconds showDate />
        </div>
        <div className="flex justify-center">
          <FullscreenButton />
        </div>
      </section>

      <AdBanner slot="middle" />

      <section className="animate-fade-up [animation-delay:60ms]">
        <AlarmManager />
      </section>

      <InfoCard title="Como usar">
        <ol className="list-inside list-decimal space-y-2">
          <li>Confira o horário local no display principal — ele segue o relógio do seu dispositivo.</li>
          <li>Role até a área de alarmes, defina horário ou use atalhos de minutos e adicione à lista.</li>
          <li>Ajuste o volume do alarme e mantenha a aba aberta para o alerta tocar no horário.</li>
          <li>Use tela cheia, se quiser, para ver apenas o relógio.</li>
        </ol>
      </InfoCard>

      <InfoCard title="Dicas">
        <ul className="list-inside list-disc space-y-2">
          <li>Em notebooks, verifique o volume do sistema — ele limita o som do navegador.</li>
          <li>Em alguns navegadores, é preciso interagir com a página uma vez para liberar áudio.</li>
          <li>Nomeie alarmes para lembrar o contexto (reunião, remédio, pausa).</li>
        </ul>
      </InfoCard>

      <InfoCard title="Perguntas frequentes">
        <FaqList
          items={[
            {
              question: 'Preciso instalar algum programa?',
              answer: 'Não. Tudo roda no navegador; basta acessar o site em um dispositivo compatível.',
            },
            {
              question: 'Os alarmes funcionam sem internet?',
              answer:
                'O relógio e as configurações já salvas costumam funcionar offline no navegador; a primeira visita pode exigir conexão para carregar a página.',
            },
            {
              question: 'Meus dados ficam em um servidor?',
              answer:
                'As preferências das ferramentas são armazenadas localmente no seu aparelho, sem cadastro obrigatório para o uso básico.',
            },
          ]}
        />
      </InfoCard>

      <InfoCard title="Por que usar o Relógio Despertador" className="[&_h2]:text-center">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-foreground">Precisão</p>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Sincronizado com o relógio do seu dispositivo para leitura estável e previsível.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-foreground">Despertador</p>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Configure vários alarmes com volume ajustável e alerta sonoro no horário certo.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-2 text-sm font-semibold text-foreground">Local e offline</p>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Preferências guardadas no navegador; o essencial continua disponível sem rede.
            </p>
          </div>
        </div>
      </InfoCard>

      <AdBanner slot="bottom" />
    </AppShell>
  );
}
