'use client';

import { useState } from 'react';
import { CONTACT_EMAIL } from '@/lib/constants/site';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Contato — ${name || 'Site Relógio Despertador'}`);
    const body = encodeURIComponent(
      [`Nome: ${name || '(não informado)'}`, `E-mail de resposta: ${email || '(não informado)'}`, '', message].join('\n')
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-foreground/90">
          Nome
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full rounded-xl border border-[#E5EAF0] bg-white px-4 py-3 text-[#0F172A] shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-foreground/90">
          Seu e-mail
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full rounded-xl border border-[#E5EAF0] bg-white px-4 py-3 text-[#0F172A] shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-foreground/90">
          Mensagem
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="w-full resize-y rounded-xl border border-[#E5EAF0] bg-white px-4 py-3 text-[#0F172A] shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:w-auto"
      >
        Abrir e-mail para enviar
      </button>
      <p className="text-xs text-muted-foreground">
        Ao enviar, seu cliente de e-mail será aberto com a mensagem preenchida. Nenhum dado é armazenado em nossos
        servidores por este formulário.
      </p>
    </form>
  );
}
