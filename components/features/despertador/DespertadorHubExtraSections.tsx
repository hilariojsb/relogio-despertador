import { FaqList, InfoCard } from '@/components/layout';

export function DespertadorHubExtraSections() {
  return (
    <>
      <InfoCard title="Dicas">
        <ul className="list-inside list-disc space-y-2">
          <li>Ajuste o volume com o controle ao lado do ícone de alto-falante antes do horário crítico.</li>
          <li>Para lembretes relativos, use os atalhos +5, +10 ou +30 minutos em vez de calcular o relógio na mão.</li>
          <li>Em notebooks, confira também o volume do sistema operacional — ele limita o som do navegador.</li>
        </ul>
      </InfoCard>
      <InfoCard title="Perguntas frequentes">
        <FaqList
          items={[
            {
              question: 'Quantos alarmes posso criar?',
              answer:
                'Você pode adicionar vários horários na lista. Mantenha apenas os que realmente usa para evitar confusão.',
            },
            {
              question: 'Funciona no celular?',
              answer:
                'Sim, em navegadores modernos no Android ou iOS. Permita áudio na página se o sistema pedir.',
            },
            {
              question: 'Preciso criar conta?',
              answer:
                'Não há cadastro obrigatório para usar o despertador. Preferências ficam armazenadas localmente no seu aparelho.',
            },
          ]}
        />
      </InfoCard>
    </>
  );
}
