/** @type {import('next').NextConfig} */
const DESPERTADOR_TIMER_MINUTES = [5, 10, 15, 30, 45, 60];

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dtqplznus/**',
      },
    ],
  },
  async redirects() {
    const hyphenTimerRedirects = DESPERTADOR_TIMER_MINUTES.flatMap(minutes => [
      {
        source: `/despertador-${minutes}minutos`,
        destination: `/despertador-${minutes}-minutos`,
        permanent: true,
      },
      {
        source: `/despertador/${minutes}-minutos`,
        destination: `/despertador-${minutes}-minutos`,
        permanent: true,
      },
    ]);

    return [
      ...hyphenTimerRedirects,
      {
        source: '/despertador/para-estudar',
        destination: '/blog/despertador-estudar',
        permanent: true,
      },
      {
        source: '/blog/tecnica-pomodoro-blocos-foco-produtividade',
        destination: '/blog/pomodoro',
        permanent: true,
      },
      {
        source: '/blog/tecnica-pomodoro',
        destination: '/blog/pomodoro',
        permanent: true,
      },
      {
        source: '/blog/pomodoro-25-minutos',
        destination: '/blog/pomodoro',
        permanent: true,
      },
      {
        source: '/blog/despertador-estudar-melhor-disciplina',
        destination: '/blog/despertador-estudar',
        permanent: true,
      },
      {
        source: '/blog/alarmes-5-minutos-lembretes-curtos',
        destination: '/blog/lembretes-5-minutos',
        permanent: true,
      },
      {
        source: '/blog/alarmes-5-minutos',
        destination: '/blog/lembretes-5-minutos',
        permanent: true,
      },
      {
        source: '/blog/fuso-horario-explicado-impacto-rotina',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/fuso-horario',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/organizar-dia-blocos-tempo-time-blocking',
        destination: '/blog/disciplina-planejamento',
        permanent: true,
      },
      {
        source: '/blog/time-blocking',
        destination: '/blog/disciplina-planejamento',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
