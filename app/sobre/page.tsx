import type { Metadata } from 'next';
import { InstitutionalPage, InstitutionalSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Sobre',
  description:
    'Conheça o Relógio Despertador: ferramentas gratuitas de tempo, despertador online, cronômetro e temporizador no navegador.',
};

export default function SobrePage() {
  return (
    <InstitutionalPage title="Sobre o Relógio Despertador">
      <InstitutionalSection title="1. Quem criou este site">
        <p>
          Este projeto foi criado para oferecer uma ferramenta <strong>simples</strong>, <strong>eficiente</strong> e{' '}
          <strong>acessível</strong> para o controle de tempo no dia a dia. A ideia é que qualquer pessoa possa ver a
          hora, programar alarmes e usar cronômetros ou temporizadores sem complicação — direto no navegador, em
          qualquer dispositivo compatível.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="2. Objetivo">
        <p>O objetivo é ajudar você a organizar rotinas e lembretes com recursos como:</p>
        <ul className="list-inside list-disc space-y-2 pl-1 pt-2">
          <li>despertador online com vários alarmes e som ajustável;</li>
          <li>cronômetro com marcação de voltas;</li>
          <li>temporizador com contagem regressiva;</li>
          <li>técnicas de foco e produtividade (por exemplo, Pomodoro) e hora mundial para fusos diferentes.</li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection title="3. Proposta">
        <ul className="list-inside list-disc space-y-2 pl-1">
          <li>
            <strong>Facilidade de uso</strong> — interface direta, sem passos desnecessários.
          </li>
          <li>
            <strong>Acesso rápido</strong> — sem instalação de aplicativo para o uso principal.
          </li>
          <li>
            <strong>Ferramentas gratuitas</strong> — o essencial disponível para quem precisa de tempo e alarmes no dia
            a dia.
          </li>
          <li>
            <strong>Experiência simples e direta</strong> — foco no que importa: hora, alertas e timers confiáveis.
          </li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection title="4. Compromisso">
        <p>
          Buscamos <strong>melhoria contínua</strong> das páginas e das ferramentas, priorizando{' '}
          <strong>confiabilidade</strong> na leitura do horário e nos alarmes, e uma{' '}
          <strong>experiência do usuário</strong> clara — do primeiro acesso ao uso recorrente ao longo das semanas.
        </p>
      </InstitutionalSection>
    </InstitutionalPage>
  );
}
