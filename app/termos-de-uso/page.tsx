import type { Metadata } from 'next';
import { InstitutionalPage, InstitutionalSection } from '@/components/layout';
import { CONTACT_EMAIL } from '@/lib/constants/site';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description:
    'Condições de uso do Relógio Despertador: aceitação, limitações de responsabilidade e alterações dos termos.',
};

export default function TermosDeUsoPage() {
  return (
    <InstitutionalPage title="Termos de Uso">
      <InstitutionalSection title="1. Aceitação dos termos">
        <p>
          Ao acessar e utilizar este site, você concorda em cumprir estes Termos de Uso e a legislação
          aplicável. Se não concordar com qualquer parte destes termos, não deve utilizar o serviço.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="2. Uso do serviço">
        <p>
          As ferramentas (relógio, despertador, cronômetro, temporizador, Pomodoro, hora mundial, entre
          outras) são oferecidas para uso pessoal e informativo. É vedado o uso que viole leis, direitos de
          terceiros ou que sobrecarregue de forma abusiva os sistemas.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="3. Isenção de responsabilidade">
        <p>
          O Relógio Despertador é fornecido &quot;como está&quot;. Não garantimos precisão absoluta em todos os contextos
          (por exemplo, dependência de relógio do dispositivo ou conectividade). Não nos responsabilizamos
          por decisões ou prejuízos decorrentes do uso das informações ou ferramentas disponibilizadas.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="4. Modificações">
        <p>
          Podemos atualizar estes termos ou o funcionamento do site a qualquer momento. A versão vigente
          estará sempre publicada nesta página. O uso continuado após alterações constitui aceitação dos
          novos termos.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="5. Contato">
        <p>
          Dúvidas sobre estes termos:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </InstitutionalSection>
    </InstitutionalPage>
  );
}
