import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { InstitutionalPage, InstitutionalSection } from '@/components/layout';
import { CONTACT_EMAIL } from '@/lib/constants/site';

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Entre em contato com o Relógio Despertador para dúvidas, sugestões ou suporte.',
};

export default function ContatoPage() {
  return (
    <InstitutionalPage title="Contato">
      <InstitutionalSection title="Fale conosco">
        <p>Para dúvidas, sugestões ou suporte, utilize o e-mail abaixo ou o formulário:</p>
        <p className="!mt-8">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex break-all rounded-xl border-2 border-primary/30 bg-primary/10 px-6 py-4 text-lg font-bold tracking-tight text-primary shadow-md transition-colors duration-200 hover:border-primary/50 hover:bg-primary/[0.15] dark:bg-primary/15"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="!mt-6 text-sm text-muted-foreground">
          Responderemos quando possível. Mensagens de spam ou conteúdo inadequado podem ser ignoradas.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="Enviar mensagem">
        <ContactForm />
      </InstitutionalSection>
    </InstitutionalPage>
  );
}
