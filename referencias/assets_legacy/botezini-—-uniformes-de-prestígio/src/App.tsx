/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from "motion/react";
import { Menu, X, ArrowRight, ChevronRight, Star, MapPin, Phone, Mail } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const collections = [
  {
    title: "Linha Executiva",
    desc: "Cortes impecáveis para lideranças que inspiram confiança.",
    image: "https://picsum.photos/seed/executive/800/1000",
  },
  {
    title: "Hospitalidade",
    desc: "A primeira impressão que define o padrão de excelência.",
    image: "https://picsum.photos/seed/hotel/800/1000",
  },
  {
    title: "Saúde & Bem-estar",
    desc: "Proteção técnica com o conforto que a jornada exige.",
    image: "https://picsum.photos/seed/medical/800/1000",
  },
];

const stats = [
  { label: "Anos de Tradição", value: "25+" },
  { label: "Clientes Atendidos", value: "1.2k" },
  { label: "Peças Produzidas", value: "500k" },
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-ink text-paper selection:bg-gold/30 selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 h-20 flex items-center justify-between backdrop-blur-md border-b ${
          isScrolled ? "bg-ink/90 border-gold/20" : "bg-transparent border-transparent"
        }`}
      >
        <div className="flex items-center gap-12">
          <a href="#" className="font-display text-gold text-2xl font-bold tracking-widest">
            BOTEZINI
          </a>
          <div className="hidden lg:flex items-center gap-8">
            {["Coleções", "Tradição", "Processo", "Contato"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[10px] tracking-[2px] uppercase text-gray1 hover:text-gold transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="hidden md:flex items-center gap-2 text-[10px] tracking-[2px] uppercase text-gold border border-gold/30 px-6 py-2.5 hover:bg-gold hover:text-ink transition-all duration-300">
            Solicitar Orçamento <ChevronRight size={14} />
          </button>
          <button
            className="lg:hidden text-gold"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed inset-0 z-40 bg-ink flex flex-col justify-center items-center gap-8 lg:hidden"
        >
          {["Coleções", "Tradição", "Processo", "Contato"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-4xl text-paper hover:text-gold transition-colors"
            >
              {item}
            </a>
          ))}
          <button className="mt-8 text-gold border border-gold/30 px-8 py-4 uppercase tracking-widest text-xs">
            Solicitar Orçamento
          </button>
        </motion.div>
      )}

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2071"
            alt="Executive Fashion"
            className="w-full h-full object-cover opacity-40 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/60 to-ink" />
        </motion.div>

        <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-5xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold tracking-[8px] uppercase text-xs mb-6 block"
          >
            Est. 2000 — São João del-Rei
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-[clamp(48px,10vw,120px)] leading-[0.9] font-black uppercase mb-8"
          >
            Elegância que <br /> <span className="text-gold italic">Trabalha</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-body text-xl md:text-2xl text-gray1 max-w-2xl mx-auto mb-12"
          >
            Transformamos o uniforme corporativo em um ativo estratégico de prestígio e autoridade.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <button className="bg-gold text-ink px-10 py-4 uppercase tracking-[2px] text-xs font-bold hover:bg-white transition-colors w-full md:w-auto">
              Ver Coleções
            </button>
            <button className="text-white border border-white/20 px-10 py-4 uppercase tracking-[2px] text-xs font-bold hover:bg-white/10 transition-colors w-full md:w-auto">
              Nossa História
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/50"
        >
          <div className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-gold/10 bg-ink2">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display text-6xl text-gold mb-2">{stat.value}</h3>
              <p className="text-[10px] tracking-[3px] uppercase text-gray2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Collections Section */}
      <section id="coleções" className="page-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="sec-label">01. Coleções</span>
              <h2 className="sec-title">Soluções sob medida para cada setor</h2>
            </div>
            <p className="font-body text-xl text-gray1 max-w-sm">
              Desenvolvemos modelagens que equilibram ergonomia técnica e estética de alto padrão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-ink/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <h4 className="font-display text-2xl mb-2 group-hover:text-gold transition-colors">
                  {item.title}
                </h4>
                <p className="font-body text-gray1 text-lg leading-snug">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tradition Section */}
      <section id="tradição" className="page-section bg-paper text-ink">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-ink3 overflow-hidden rounded-full p-4 border border-ink/5">
              <img
                src="https://picsum.photos/seed/tradition/1000/1000"
                alt="Atelier"
                className="w-full h-full object-cover rounded-full grayscale"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gold rounded-full flex items-center justify-center text-center p-6 shadow-2xl">
              <span className="font-display text-ink text-sm font-bold leading-tight">
                Qualidade <br /> Certificada
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="sec-label">02. Tradição</span>
            <h2 className="sec-title">A Alma de São João del-Rei</h2>
            <div className="sec-rule" />
            <p className="font-body text-2xl text-gray2 mb-8 leading-relaxed">
              Nascemos no coração de Minas Gerais, onde a arte da tecelagem é um legado. Cada peça
              Botezini carrega décadas de conhecimento técnico e um olhar contemporâneo sobre a
              moda corporativa.
            </p>
            <ul className="space-y-4">
              {["Matérias-primas nobres", "Modelagem ergonômica", "Acabamento artesanal"].map(
                (text, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm tracking-widest uppercase">
                    <div className="w-2 h-2 bg-gold rounded-full" />
                    {text}
                  </li>
                )
              )}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="page-section bg-ink3">
        <div className="max-w-4xl mx-auto text-center">
          <Star className="text-gold mx-auto mb-8" fill="currentColor" size={32} />
          <h2 className="font-body text-3xl md:text-5xl italic text-paper/90 mb-12 leading-tight">
            "A Botezini elevou a percepção de valor da nossa marca. Nossos colaboradores sentem o
            orgulho de vestir uma peça que reflete a excelência do nosso serviço."
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-16 h-px bg-gold mb-4" />
            <span className="text-xs tracking-[4px] uppercase text-gold">Ricardo Alencar</span>
            <span className="text-[10px] tracking-[2px] uppercase text-gray2 mt-1">
              Diretor de Operações, Grand Hotel
            </span>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="processo" className="page-section bg-ink2 border-y border-gold/5">
        <div className="max-w-7xl mx-auto">
          <span className="sec-label">03. Processo</span>
          <h2 className="sec-title mb-16">Do conceito à entrega impecável</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { step: "01", title: "Consultoria", desc: "Análise da identidade visual e necessidades técnicas da sua empresa." },
              { step: "02", title: "Design", desc: "Desenvolvimento de protótipos e seleção de têxteis de alta performance." },
              { step: "03", title: "Produção", desc: "Confecção artesanal com rigoroso controle de qualidade em cada ponto." },
              { step: "04", title: "Logística", desc: "Entrega personalizada e suporte contínuo para reposições." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <span className="font-display text-4xl text-gold/20 absolute -top-8 left-0">{item.step}</span>
                <h4 className="font-display text-xl text-gold mb-4 relative z-10">{item.title}</h4>
                <p className="font-body text-gray1 text-lg leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="page-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <span className="sec-label">03. Contato</span>
              <h2 className="sec-title">Vamos elevar o padrão da sua equipe?</h2>
              <p className="font-body text-xl text-gray1 mb-12">
                Agende uma consultoria de imagem corporativa e conheça nossas soluções personalizadas.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-ink2 border border-gold/20 flex items-center justify-center text-gold">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs tracking-widest uppercase text-paper mb-1">Showroom</h5>
                    <p className="text-gray1 text-sm">Rua das Rosas, 120 — São João del-Rei, MG</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-ink2 border border-gold/20 flex items-center justify-center text-gold">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs tracking-widest uppercase text-paper mb-1">Telefone</h5>
                    <p className="text-gray1 text-sm">+55 (32) 3371-0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-ink2 border border-gold/20 flex items-center justify-center text-gold">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs tracking-widest uppercase text-paper mb-1">E-mail</h5>
                    <p className="text-gray1 text-sm">contato@botezini.com.br</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-ink2 p-8 md:p-12 border border-gold/10">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray2">Nome</label>
                    <input
                      type="text"
                      className="w-full bg-ink border-b border-gold/20 py-2 focus:border-gold outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-gray2">Empresa</label>
                    <input
                      type="text"
                      className="w-full bg-ink border-b border-gold/20 py-2 focus:border-gold outline-none transition-colors text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray2">E-mail</label>
                  <input
                    type="email"
                    className="w-full bg-ink border-b border-gold/20 py-2 focus:border-gold outline-none transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray2">Mensagem</label>
                  <textarea
                    rows={4}
                    className="w-full bg-ink border-b border-gold/20 py-2 focus:border-gold outline-none transition-colors text-sm resize-none"
                  />
                </div>
                <button className="w-full bg-gold text-ink py-4 uppercase tracking-[3px] text-xs font-bold hover:bg-white transition-colors mt-4">
                  Enviar Solicitação
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-10 border-t border-gold/10 bg-ink2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <div className="font-display text-gold text-3xl font-bold tracking-[8px] mb-4">
              BOTEZINI
            </div>
            <p className="text-gray2 text-xs tracking-widest uppercase">
              Uniformes de Prestígio desde 2000
            </p>
          </div>
          <div className="flex gap-8">
            {["Instagram", "LinkedIn", "WhatsApp"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[10px] tracking-[2px] uppercase text-gray1 hover:text-gold transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
          <p className="text-[10px] tracking-[2px] text-gray2 uppercase">
            © 2025 Botezini. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
