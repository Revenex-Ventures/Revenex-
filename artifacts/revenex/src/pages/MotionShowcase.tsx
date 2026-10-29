import { useHindiText as useSiteText } from "@/lib/hindi-text";

import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Sparkles, ArrowRight, Play, Info, Layers, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Tilt } from '@/components/motion-primitives/tilt';
import { Magnetic } from '@/components/motion-primitives/magnetic';
import { GlowEffect } from '@/components/motion-primitives/glow-effect';
import { BorderTrail } from '@/components/motion-primitives/border-trail';
import { Spotlight } from '@/components/motion-primitives/spotlight';
import { TextEffect } from '@/components/motion-primitives/text-effect';
import { TextMorph } from '@/components/motion-primitives/text-morph';
import { TextLoop } from '@/components/motion-primitives/text-loop';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
} from '@/components/motion-primitives/morphing-dialog';

export default function MotionShowcase() {
  const siteText = useSiteText();
  const [morphWord, setMorphWord] = useState('Incredible');
  const words = ['Incredible', 'Premium', 'Cinematic', 'Stunning', 'Interactive', 'Performant'];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % words.length;
      setMorphWord(words[index]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen bg-[#18120E] text-[#F9F6F0] font-sans antialiased overflow-x-hidden selection:bg-[#D49A58] selection:text-[#18120E]'>
      <Navbar />

      {/* Hero Section */}
      <section className='relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center z-10'>
        <div className='absolute inset-0 -z-10 flex items-center justify-center pointer-events-none'>
          <div className='w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,154,88,0.06)_0%,transparent_70%)] blur-3xl' />
        </div>

        <span className='inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#221A13] border border-[#D49A58]/20 text-[#D49A58] text-xs font-mono tracking-wider uppercase mb-6'>
          <Sparkles className='w-3.5 h-3.5 animate-pulse' />{siteText(" Motion Primitives Installed")}</span>

        <h1 className='text-5xl md:text-7xl font-serif font-light mb-6 tracking-tight leading-none'>{siteText("Create ")}<span className='italic text-[#D49A58] font-normal'>
            <TextMorph>{siteText(morphWord)}</TextMorph>
          </span>{' '}{siteText("Interfaces")}</h1>

        <div className='max-w-2xl mx-auto mb-10'>
          <TextEffect per='char' preset='fade-in-blur' className='text-lg md:text-xl text-[#F9F6F0]/70 font-light leading-relaxed'>{siteText("We have downloaded and configured 9 premium React motion primitive components designed to elevate your application's user experience.")}</TextEffect>
        </div>

        <div className='flex flex-wrap justify-center gap-4 mb-16'>
          <Magnetic>
            <a
              href='#components-grid'
              className='px-6 py-3 rounded-full bg-[#D49A58] text-[#18120E] font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#D49A58]/20 inline-flex items-center gap-2 group'
            >{siteText("Explore Components")}<ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
            </a>
          </Magnetic>
        </div>

        {/* Text Loop Feature Row */}
        <div className='border-t border-[#F9F6F0]/10 pt-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-mono text-[#F9F6F0]/50'>
          <span>{siteText("COMPONENTS INCLUDE:")}</span>
          <div className='text-[#D49A58] font-semibold tracking-wide'>
            <TextLoop interval={3}>
              <span>{siteText("3D TILT EFFECT")}</span>
              <span>{siteText("CURSOR HOVER GLOW")}</span>
              <span>{siteText("BORDER LIGHT TRAILS")}</span>
              <span>{siteText("RADIAL SPOTLIGHT MASK")}</span>
              <span>{siteText("MAGNETIC ATTRACTION")}</span>
              <span>{siteText("MORPHING DIALOG MODAL")}</span>
            </TextLoop>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section id='components-grid' className='py-20 px-6 max-w-7xl mx-auto relative z-10'>
        <h2 className='text-3xl md:text-4xl font-serif font-light mb-12 text-center border-b border-[#F9F6F0]/10 pb-4'>{siteText("Interactive Preview Playground")}</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          
          {/* Card 1: 3D Tilt */}
          <Tilt className='h-[350px] group'>
            <div className='relative h-full w-full rounded-2xl bg-[#221A13] border border-[#F9F6F0]/10 p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 group-hover:border-[#D49A58]/30 shadow-2xl'>
              <div className='absolute inset-0 bg-gradient-to-br from-[#D49A58]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              <div>
                <span className='font-mono text-xs text-[#D49A58] tracking-widest uppercase'>{siteText("01 · Parallax Hover")}</span>
                <h3 className='text-2xl font-serif font-light mt-3 mb-2'>{siteText("3D Tilt Effect")}</h3>
                <p className='text-sm text-[#F9F6F0]/60 leading-relaxed'>{siteText("Hover over this card to see it tilt dynamically in 3D perspective based on your cursor's position.")}</p>
              </div>
              <div className='flex items-center gap-2 text-xs font-mono text-[#D49A58] group-hover:translate-x-2 transition-transform duration-300'>{siteText("MOVE CURSOR OVER CARD ")}<ArrowRight className='w-3 h-3' />
              </div>
            </div>
          </Tilt>

          {/* Card 2: Border Trail */}
          <div className='h-[350px] rounded-2xl bg-[#221A13] border border-[#F9F6F0]/10 p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl hover:border-[#D49A58]/20 transition-all duration-300'>
            <BorderTrail size={120} className='bg-gradient-to-r from-[#D49A58] to-amber-200' />
            <div>
              <span className='font-mono text-xs text-[#D49A58] tracking-widest uppercase'>{siteText("02 · Perimeter Light")}</span>
              <h3 className='text-2xl font-serif font-light mt-3 mb-2'>{siteText("Border Trail")}</h3>
              <p className='text-sm text-[#F9F6F0]/60 leading-relaxed'>{siteText("An animated perimeter border trail. Perfect for drawing focus to premium cards, buttons, or dynamic containers.")}</p>
            </div>
            <div className='text-xs font-mono text-[#F9F6F0]/40'>{siteText("ANIMATES CONTINUOUSLY")}</div>
          </div>

          {/* Card 3: Glow Effect */}
          <div className='h-[350px] rounded-2xl bg-[#221A13] border border-[#F9F6F0]/10 p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl hover:border-[#D49A58]/20 transition-all duration-300'>
            <GlowEffect colors={['#D49A58', '#A34E17', '#F9F6F0', '#D49A58']} mode='rotate' blur='medium' scale={1.05} />
            <div className='relative z-10'>
              <span className='font-mono text-xs text-[#D49A58] tracking-widest uppercase'>{siteText("03 · Gradient Glow")}</span>
              <h3 className='text-2xl font-serif font-light mt-3 mb-2'>{siteText("Glow Effect")}</h3>
              <p className='text-sm text-[#F9F6F0]/60 leading-relaxed'>{siteText("A smooth, animated glow effect backface that utilizes conic gradients to create a premium radiant border effect.")}</p>
            </div>
            <div className='relative z-10 text-xs font-mono text-[#F9F6F0]/40'>{siteText("ROTATES AUTOMATICALLY")}</div>
          </div>

          {/* Card 4: Spotlight */}
          <div className='h-[350px] rounded-2xl bg-[#221A13] border border-[#F9F6F0]/10 p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl hover:border-[#D49A58]/20 transition-all duration-300'>
            <Spotlight size={220} className='from-[#D49A58]/20 via-[#D49A58]/10 to-transparent' />
            <div>
              <span className='font-mono text-xs text-[#D49A58] tracking-widest uppercase'>{siteText("04 · Cursor Spotlight")}</span>
              <h3 className='text-2xl font-serif font-light mt-3 mb-2'>{siteText("Spotlight Hover")}</h3>
              <p className='text-sm text-[#F9F6F0]/60 leading-relaxed'>{siteText("A radial light overlay follows your cursor movement perfectly across the parent container, providing fluid illumination.")}</p>
            </div>
            <div className='text-xs font-mono text-[#D49A58]'>{siteText("HOVER TO SHINE LIGHT")}</div>
          </div>

          {/* Card 5: Magnetic Hover */}
          <div className='h-[350px] rounded-2xl bg-[#221A13] border border-[#F9F6F0]/10 p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl hover:border-[#D49A58]/20 transition-all duration-300'>
            <div>
              <span className='font-mono text-xs text-[#D49A58] tracking-widest uppercase'>{siteText("05 · Physical Attraction")}</span>
              <h3 className='text-2xl font-serif font-light mt-3 mb-2'>{siteText("Magnetic Interaction")}</h3>
              <p className='text-sm text-[#F9F6F0]/60 leading-relaxed'>{siteText("Buttons or cards attract towards the cursor with customized physics spring properties. Try hovering over the button.")}</p>
            </div>
            <div className='flex justify-center my-4'>
              <Magnetic intensity={0.4} range={80}>
                <button className='px-6 py-3 rounded-xl bg-[#221A13] border border-[#D49A58] text-[#D49A58] font-mono text-xs tracking-wider uppercase hover:bg-[#D49A58] hover:text-[#18120E] transition-colors duration-300'>{siteText("MAGNETIC BUTTON")}</button>
              </Magnetic>
            </div>
            <div className='text-xs font-mono text-[#F9F6F0]/40'>{siteText("STIFFNESS: 26.7 | DAMPING: 4.1")}</div>
          </div>

          {/* Card 6: Morphing Dialog */}
          <div className='h-[350px] rounded-2xl bg-[#221A13] border border-[#F9F6F0]/10 p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl hover:border-[#D49A58]/20 transition-all duration-300'>
            <div>
              <span className='font-mono text-xs text-[#D49A58] tracking-widest uppercase'>{siteText("06 · Fluid Container")}</span>
              <h3 className='text-2xl font-serif font-light mt-3 mb-2'>{siteText("Morphing Dialog")}</h3>
              <p className='text-sm text-[#F9F6F0]/60 leading-relaxed'>{siteText("Clicking the trigger button morphs it organically into a beautiful dialog overlay instead of simple fade-ins.")}</p>
            </div>
            <div className='flex justify-center'>
              <MorphingDialog
                transition={{
                  type: 'spring',
                  bounce: 0.05,
                  duration: 0.45,
                }}
              >
                <MorphingDialogTrigger className='px-6 py-2.5 rounded-full bg-[#D49A58] text-[#18120E] font-medium text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform duration-300'>
                  <Play className='w-3.5 h-3.5 fill-current' />{siteText(" Open Dialog")}</MorphingDialogTrigger>
                <MorphingDialogContainer>
                  <MorphingDialogContent className='w-full max-w-md bg-[#221A13] border border-[#D49A58]/30 rounded-3xl p-8 relative text-[#F9F6F0] shadow-2xl'>
                    <MorphingDialogTitle className='text-3xl font-serif font-light text-[#D49A58] mb-2'>{siteText("Morphing Container")}</MorphingDialogTitle>
                    <MorphingDialogSubtitle className='text-xs font-mono text-[#F9F6F0]/50 uppercase tracking-widest mb-4'>{siteText("Layout Shared Transition")}</MorphingDialogSubtitle>
                    <MorphingDialogDescription>
                      <p className='text-[#F9F6F0]/70 text-sm leading-relaxed mb-6'>{siteText("This modal overlay uses layout transitions inside framer-motion. The modal container animates out directly from the button's coordinates, producing a continuous fluid transition.")}</p>
                      <div className='space-y-2.5 mb-6'>
                        <div className='flex items-center gap-2 text-xs font-mono text-[#F9F6F0]/80'>
                          <CheckCircle2 className='w-4 h-4 text-[#D49A58]' />{siteText(" Supports Keyboard Trapping")}</div>
                        <div className='flex items-center gap-2 text-xs font-mono text-[#F9F6F0]/80'>
                          <CheckCircle2 className='w-4 h-4 text-[#D49A58]' />{siteText(" Focus Restoring & Esc Closing")}</div>
                        <div className='flex items-center gap-2 text-xs font-mono text-[#F9F6F0]/80'>
                          <CheckCircle2 className='w-4 h-4 text-[#D49A58]' />{siteText(" Custom Animations Setup")}</div>
                      </div>
                    </MorphingDialogDescription>
                    <div className='flex justify-end gap-3'>
                      <MorphingDialogClose className='px-5 py-2.5 rounded-full border border-[#F9F6F0]/10 text-xs font-mono hover:bg-[#F9F6F0]/5 transition-colors relative top-0 right-0' />
                    </div>
                  </MorphingDialogContent>
                </MorphingDialogContainer>
              </MorphingDialog>
            </div>
            <div className='text-xs font-mono text-[#F9F6F0]/40'>{siteText("CLICK TO TRIGGER OVERLAY")}</div>
          </div>

        </div>
      </section>

      {/* Integration Guide */}
      <section className='py-16 bg-[#221A13] border-t border-b border-[#F9F6F0]/10 px-6'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-3xl font-serif font-light mb-8 text-center text-[#D49A58]'>{siteText("How to Use in Code")}</h2>
          <div className='bg-[#18120E] rounded-2xl p-6 border border-[#F9F6F0]/10 font-mono text-sm overflow-x-auto leading-relaxed shadow-xl'>
            <span className='text-emerald-500'>{siteText("// 1. Import your desired component")}</span><br />
            <span className='text-[#D49A58]'>{siteText("import")}</span> {siteText('{ Tilt }')} <span className='text-[#D49A58]'>{siteText("from")}</span> <span className='text-amber-200'>{siteText("'@/components/motion-primitives/tilt'")}</span>;<br />
            <span className='text-[#D49A58]'>{siteText("import")}</span> {siteText('{ BorderTrail }')} <span className='text-[#D49A58]'>{siteText("from")}</span> <span className='text-amber-200'>{siteText("'@/components/motion-primitives/border-trail'")}</span>;<br /><br />

            <span className='text-emerald-500'>{siteText("// 2. Wrap your layout or apply animation")}</span><br />
            <span className='text-[#D49A58]'>{siteText("export default function")}</span> <span className='text-amber-200'>{siteText("MyFeature")}</span>() {'{'}<br />
            &nbsp;&nbsp;<span className='text-[#D49A58]'>{siteText("return")}</span> (<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className='text-amber-200'>{siteText("Tilt")}</span>&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className='text-amber-200'>{siteText("div")}</span>{siteText(" className=")}<span className='text-emerald-400'>{siteText("'relative p-8 bg-[#221A13]'")}</span>&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className='text-amber-200'>{siteText("BorderTrail")}</span>{siteText(" size=")}{'{80}'}{siteText(" className=")}<span className='text-emerald-400'>{siteText("'bg-amber-400'")}</span> /&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className='text-amber-200'>{siteText("h3")}</span>{siteText(">Interactive Element</")}<span className='text-amber-200'>{siteText("h3")}</span>&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className='text-amber-200'>{siteText("div")}</span>&gt;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className='text-amber-200'>{siteText("Tilt")}</span>&gt;<br />
            &nbsp;&nbsp;);<br />
            {'}'}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
