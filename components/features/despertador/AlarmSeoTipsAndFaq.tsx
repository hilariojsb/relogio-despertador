import { FaqList, InfoCard } from '@/components/layout';

/** Blocos curtos de dicas + FAQ para páginas programáticas do despertador (complementa o artigo longo). */
export function AlarmSeoTipsAndFaq() {
  return (
    <>
      <InfoCard title="Dicas rápidas">
        <ul className="list-inside list-disc space-y-2">
          <li>Teste o volume do alarme uma vez antes de compromissos importantes.</li>
          <li>Mantenha a aba visível ou fixada; alguns navegadores reduzem áudio em segundo plano.</li>
          <li>Use rótulos nos alarmes para lembrar o contexto (estudo, remédio, pausa).</li>
        </ul>
      </InfoCard>
      <InfoCard title="Perguntas frequentes">
        <FaqList
          items={[
            {
              question: 'Preciso instalar um aplicativo?',
              answer:
                'Não. O despertador funciona no navegador; basta manter a página aberta no horário do alarme.',
            },
            {
              question: 'Os alarmes ficam salvos se eu fechar o site?',
              answer:
                'As configurações costumam ficar no armazenamento local do navegador. Se você limpar dados do site, os alarmes podem ser apagados.',
            },
            {
              question: 'O alarme toca com a aba em segundo plano?',
              answer:
                'Depende do navegador e do sistema. Em geral, mantenha a aba aberta e verifique permissões de áudio na barra de endereço.',
            },
          ]}
        />
      </InfoCard>
    </>
  );
}
