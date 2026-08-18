import { About } from '@/components/About';
import { Connector } from '@/components/Connector';
import { Contact } from '@/components/Contact';
import { Experience } from '@/components/Experience';
import { Hero } from '@/components/Hero';
import { HeroPhysics } from '@/components/HeroPhysics';
import { Nav, ScrollProgress, Wash } from '@/components/Nav';
import { SiteEffects } from '@/components/SiteEffects';
import { Stack } from '@/components/Stack';
import { Work } from '@/components/Work';
import s from './page.module.css';

export default function Page() {
  return (
    <div id="top" className={s.root}>
      <a href="#main" className="skipLink">
        Skip to content
      </a>
      <Wash />
      <ScrollProgress />
      <Nav />

      <div className={s.content}>
        <main id="main" tabIndex={-1}>
          <Hero />
          <Connector />
          <About />
          <Work />
          <Experience />
          <Stack />
        </main>
        <Contact />
      </div>

      <SiteEffects />
      <HeroPhysics />
    </div>
  );
}
