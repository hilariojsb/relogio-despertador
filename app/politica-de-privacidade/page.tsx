import type { Metadata } from 'next';
import { InstitutionalPage, InstitutionalSection } from '@/components/layout';
import { CONTACT_EMAIL } from '@/lib/constants/site';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Como o Relógio Despertador trata dados, cookies, publicidade Google AdSense e seus direitos (LGPD).',
};

export default function PoliticaDePrivacidadePage() {
  return (
    <InstitutionalPage title="Política de Privacidade">
      <InstitutionalSection title="1. Introdução">
        <p>
          O site <strong>Relógio Despertador</strong> (doravante &quot;nós&quot; ou &quot;site&quot;) respeita a
          privacidade dos usuários. Esta política descreve como tratamos informações quando você utiliza nossas
          ferramentas online e navega pelas páginas. Recomendamos a leitura integral. Em caso de dúvidas, use o
          contato:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-primary underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="2. Dados e bases legais (LGPD)">
        <p>
          Quando aplicável à Lei Geral de Proteção de Dados (Lei nº 13.709/2018), podemos tratar dados com base em
          <strong> legítimo interesse</strong> (funcionamento e segurança do site), <strong>consentimento</strong>{' '}
          (cookies não essenciais e publicidade, quando exigido) ou <strong>execução de serviços</strong> à sua
          solicitação (ex.: exibir o relógio e alarmes no navegador).
        </p>
        <p>
          Você tem direito de <strong>confirmar</strong> a existência de tratamento, <strong>acessar</strong> e{' '}
          <strong>corrigir</strong> dados, solicitar <strong>anonimização ou eliminação</strong> quando aplicável,{' '}
          <strong>revogar consentimentos</strong> e manifestar <strong>oposição</strong> a tratamentos, além de
          portabilidade e informações sobre compartilhamentos, nos limites da lei. Para exercer direitos, envie
          solicitação para o e-mail acima.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="3. Uso de cookies e armazenamento local" id="cookies-anuncios">
        <p>
          Utilizamos <strong>cookies</strong> e tecnologias similares para lembrar preferências (por exemplo, tema
          claro ou escuro), medir uso de forma agregada quando aplicável e viabilizar publicidade. O site também pode
          usar <strong>armazenamento local</strong> do navegador para salvar configurações das ferramentas (como
          alarmes), sem que isso implique cadastro em nossos servidores para o uso básico.
        </p>
        <p>
          Você pode <strong>gerenciar ou bloquear cookies</strong> nas configurações do seu navegador. A remoção de
          cookies pode afetar lembretes de preferências e, em alguns casos, a exibição de anúncios. Limpar dados do
          site pode apagar alarmes e configurações salvas localmente.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="4. Google AdSense e dados de terceiros">
        <p>
          Podemos utilizar o <strong>Google AdSense</strong> para exibir anúncios. O Google pode usar cookies e
          identificadores para veicular anúncios com base nos interesses, medir desempenho e evitar fraudes, conforme
          as políticas do Google. Esses tratamentos são de responsabilidade do Google em parte dos seus sistemas.
        </p>
        <p>
          Recomendamos consultar as políticas oficiais do Google sobre privacidade e publicidade, por exemplo:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-1">
          <li>
            <a
              href="https://policies.google.com/privacy?hl=pt-BR"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2"
            >
              Política de Privacidade do Google
            </a>
          </li>
          <li>
            <a
              href="https://policies.google.com/technologies/ads?hl=pt-BR"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2"
            >
              Como o Google usa informações de sites ou apps que usam os serviços dele
            </a>
          </li>
        </ul>
      </InstitutionalSection>

      <InstitutionalSection title="5. Dados coletados por terceiros">
        <p>
          Prestadores como o Google podem coletar ou processar dados técnicos (como endereço IP, tipo de navegador,
          identificadores de dispositivo) para fins de publicidade, segurança e estatísticas agregadas. Não
          controlamos integralmente esses tratamentos; consulte as políticas dos respectivos fornecedores.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="6. Dados que não solicitamos de forma obrigatória">
        <p>
          As ferramentas principais não exigem cadastro com nome ou e-mail. Não coletamos intencionalmente dados
          pessoais sensíveis por essas páginas. Se você nos enviar um e-mail voluntariamente, usaremos o endereço e o
          conteúdo apenas para responder à sua mensagem.
        </p>
      </InstitutionalSection>

      <InstitutionalSection title="7. Consentimento e alterações">
        <p>
          Ao continuar utilizando o site após avisos sobre cookies e esta política, você declara ciência das
          práticas descritas. Podemos atualizar esta política; a versão vigente estará sempre nesta página. Recomendamos
          revisitar periodicamente.
        </p>
      </InstitutionalSection>
    </InstitutionalPage>
  );
}
