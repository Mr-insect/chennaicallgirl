import { useEffect, useRef, useState } from 'react';
import { CONFIG, FEATURES, GALLERY_TITLES } from './siteConfig.js';

const digitsOnly = value => String(value || '').replace(/\D/g, '');
const phoneNumber = digitsOnly(CONFIG.callNumber);
const waNumber = digitsOnly(CONFIG.whatsappNumber);
const callUrl = phoneNumber ? `tel:+${CONFIG.countryCode}${phoneNumber}` : '#contact';
const whatsAppUrl = waNumber
  ? `https://wa.me/${CONFIG.countryCode}${waNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`
  : '#contact';
const tgUsername = String(CONFIG.telegramUsername || '').replace(/^@/, '').trim();
const telegramUrl = tgUsername ? `https://t.me/${encodeURIComponent(tgUsername)}` : '';
const gallery = GALLERY_TITLES.map((title, index) => ({ title, image: `/images/${index + 1}.jpg` }));
const externalLink = { target: '_blank', rel: 'noopener noreferrer' };

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2c1.1.4 2.3.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.2 1Z" /></svg>;
}
function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.4-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.4Z" /></svg>;
}
function TelegramIcon() {
  return <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M9.8 15.6l-.4 4c.6 0 .9-.3 1.2-.6l2.9-2.7 6 4.4c1.1.6 1.9.3 2.2-1L23.8 4.4c.4-1.6-.6-2.2-1.6-1.8L1.4 10.7c-1.5.6-1.5 1.5-.3 1.9l5.3 1.7L18.7 6.5c.6-.4 1.1-.2.7.2z" /></svg>;
}
const waExternal = waNumber ? externalLink : {};

function Header() {
  return <header className="header bleed"><div className="wrap bar">
    <a className="brand" href="#home">{CONFIG.brand}</a>
    <nav className="areas" aria-label="Main navigation">
     {[['Home','#home'],['About','#about'],['Gallery','#gallery'],['Contact','#contact']]
        .map(([name, href]) => <a key={name} href={href}>{name}</a>)}
    </nav>
  </div></header>;
}

function Hero() {
  return <section id="home" className="hero bleed">
    <div className="hero-in">
      <h1>{CONFIG.brand}</h1>
      <p></p>

      <div className="actions">
        <a className="btn btn-call" href={callUrl}>
          <PhoneIcon /> Call Now
        </a>

        <a
          className="btn btn-wa"
          href={whatsAppUrl}
          {...waExternal}
        >
          <WhatsAppIcon /> Contact Us
        </a>
      </div>
    </div>
  </section>;
}

function Feature({ data, flipped=false, className='', id }) {
  const url = data.kind === 'gallery' ? '#gallery' : data.kind === 'wa' ? whatsAppUrl : callUrl;
  const external = data.kind === 'wa' ? waExternal : {};
  return <section id={id} className={`feature ${flipped?'rev':''} ${className}`.trim()}>
    <div className="fimg"><img src={data.image} alt={data.alt} loading="lazy" decoding="async" /></div>
    <div><span className="eyebrow">{data.eyebrow}</span>
      <h2>{data.title}</h2>
      {data.paragraphs.map((paragraph, idx) => <p key={idx}>{paragraph}</p>)}
      <div className="actions"><a className="btn btn-pink" href={url} {...external}>{data.action}</a></div>
    </div>
  </section>;
}
function Gallery() {
  const [active, setActive] = useState(null);
  const closeRef = useRef(null);
  const previousFocus = useRef(null);
  const touchStart = useRef(0);
  const previousRef = useRef(null);
  const nextRef = useRef(null);
  const groups=[];
  for(let start=0;start<gallery.length;start+=CONFIG.groupSize) groups.push(gallery.slice(start,start+CONFIG.groupSize));
  function open(index,element){previousFocus.current=element;setActive(index);}
  function close(){setActive(null);}
  function shift(delta){setActive(n => (n+delta+gallery.length)%gallery.length);}

  useEffect(()=>{
    if(active===null)return;
    const oldOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    closeRef.current?.focus();
    return()=>{document.body.style.overflow=oldOverflow;previousFocus.current?.focus?.();};
  },[active===null]);
  useEffect(()=>{
    if(active===null)return;
    const keyHandler=e=>{
      if(e.key==='Escape'){e.preventDefault();close();}
      if(e.key==='ArrowLeft'){e.preventDefault();shift(-1);}
      if(e.key==='ArrowRight'){e.preventDefault();shift(1);}
      if(e.key==='Tab'){
        const els=[closeRef.current,previousRef.current,nextRef.current].filter(Boolean);
        if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els.at(-1).focus();}
        else if(!e.shiftKey&&document.activeElement===els.at(-1)){e.preventDefault();els[0].focus();}
      }
    };
    document.addEventListener('keydown',keyHandler);
    return()=>document.removeEventListener('keydown',keyHandler);
  },[active]);

  return <>
    <section id="gallery" className="gallery"><h2>Our Beautiful Girls</h2>
      <p className="sub"></p>
      {groups.map((group,groupIndex)=><div key={groupIndex}>
        <div className="grid">{group.map((item,i)=>{
          const index=groupIndex*CONFIG.groupSize+i;
          return <div className="tile" key={item.image}>
            <button className="open" type="button" onClick={event=>open(index,event.currentTarget)} aria-label={`View ${item.title}`}>
              <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
            </button>
            <div className="tbtns">
              <a className="tb" href={callUrl} title={phoneNumber?'Call Us':'Contact'} aria-label="Contact"><PhoneIcon /></a>
              <a className="tb w" href={whatsAppUrl} {...waExternal} title={waNumber?'WhatsApp':'Contact'} aria-label="WhatsApp or contact"><WhatsAppIcon /></a>
            </div>
          </div>;
        })}</div>
        {groupIndex<groups.length-1&&<div className="gnote" aria-hidden="true" />}
      </div>)}
    </section>
    {active!==null&&<div className="lb" role="dialog" aria-modal="true" aria-label="Food gallery enlarged image"
        onMouseDown={event=>{if(event.target===event.currentTarget)close();}}>
      <div className="lb-stage" onTouchStart={event=>touchStart.current=event.changedTouches[0].screenX}
        onTouchEnd={event=>{const diff=event.changedTouches[0].screenX-touchStart.current;if(Math.abs(diff)>50)shift(diff<0?1:-1);}}>
        <img src={gallery[active].image} alt={gallery[active].title} />
      </div>
      <button className="lb-btn lb-x" type="button" ref={closeRef} onClick={close} aria-label="Close">×</button>
      <button className="lb-btn lb-p" type="button" ref={previousRef} onClick={()=>shift(-1)} aria-label="Previous">‹</button>
      <button className="lb-btn lb-n" type="button" ref={nextRef} onClick={()=>shift(1)} aria-label="Next">›</button>
    </div>}
  </>;
}
function Footer() {
  const items=['Chennai Call Girl','T.nagar','Adyar','Nandanam','R A Puram',];
  return <footer id="contact" className="footer">
   
    <div className="copy">&copy; {new Date().getFullYear()} {CONFIG.brand}, {CONFIG.city}</div>
    <div className="marquee" aria-label="Food gallery categories"><div className="track">
      {[...items,...items].map((item,index)=><span key={index}>{item}<i>✦</i></span>)}
    </div></div><div className="dock-pad" />
  </footer>;
}

function FloatingContact() {
  const displayNumber = "+91 7375830372";

  return (
    <>
      {telegramUrl && (
        <a className="float-tg" href={telegramUrl} {...externalLink} aria-label="Telegram">
          <TelegramIcon />
        </a>
      )}

      <nav className="dock" aria-label="Contact options">

        <a className="d-call" href={callUrl}>
          <PhoneIcon />
          <span className="dock-text">
            <span className="dock-label">Call Now</span>
            <span className="dock-number">{displayNumber}</span>
          </span>
        </a>

        <a className="d-wa" href={whatsAppUrl} {...waExternal}>
          <WhatsAppIcon />
          <span className="dock-text">
            <span className="dock-label">WhatsApp</span>
            <span className="dock-number">{displayNumber}</span>
          </span>
        </a>

      </nav>
    </>
  );
}

export default function App() {
  return <><Header /><main><Hero /><div className="wrap">
    <Feature id="about" data={FEATURES[0]} />
    <Feature id="food" data={FEATURES[1]} flipped />
    <p className="lead"></p>
    <Gallery />
    <Feature className="closing" data={FEATURES[2]} />
  </div></main><Footer /><FloatingContact /></>;
}
