/* ============================================================
   PEAKCRAFT INNOVATIONS — SHARED JAVASCRIPT
   Mobile nav · Portfolio engine · Zite handoff
   ============================================================ */
const PC_CONFIG = {
  CONTACT: {
    ZITE_URL:  (window.SITE_CONFIG && SITE_CONFIG.contact && SITE_CONFIG.contact.ziteUrl) || "https://olvadk683f.zite.so",
    OPEN_MODE: (window.SITE_CONFIG && SITE_CONFIG.contact && SITE_CONFIG.contact.openMode) || "new-tab"
  },
  TOAST: { DURATION: 3500 },
  FORM:  { STORAGE_KEY: 'peakcraft_form_data', AUTO_SAVE_DELAY: 500 }
};

function escapeHtml(v){
  return String(v ?? '').replace(/[&<>"']/g, c => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
  ));
}
function debounce(fn, wait){
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}
function safeLiveUrl(v){
  if (typeof v !== 'string' || !v.trim() || v.includes('PASTE_') || v.includes('_HERE')) return '';
  try {
    const u = new URL(v.trim());
    if (u.protocol !== 'https:' || !u.hostname.includes('.')) return '';
    return u.href;
  } catch(_) { return ''; }
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  const header = document.getElementById('mainHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }
});

function showToast(message, type = 'info', duration = PC_CONFIG.TOAST.DURATION){
  const existing = document.getElementById('pc-toast');
  if (existing) existing.remove();
  const colors = {
    success:{ bg:'#19A86B', border:'#0B6B46' },
    error:  { bg:'#C62828', border:'#E53935' },
    warning:{ bg:'#B76E00', border:'#E65100' },
    info:   { bg:'#0B6B46', border:'#19A86B' }
  };
  const c = colors[type] || colors.info;
  const toast = document.createElement('div');
  toast.id = 'pc-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  Object.assign(toast.style, {
    position:'fixed', bottom:'1.5rem', left:'50%',
    transform:'translateX(-50%) translateY(20px)',
    background:c.bg, color:'#fff', padding:'.9rem 1.5rem',
    borderRadius:'12px', boxShadow:'0 8px 32px rgba(0,0,0,.3)',
    zIndex:'99999', maxWidth:'90vw', width:'max-content', minWidth:'260px',
    fontSize:'.95rem', fontFamily:"'Inter',sans-serif", lineHeight:'1.5',
    border:'2px solid '+c.border, opacity:'0',
    transition:'transform .35s ease,opacity .3s ease',
    textAlign:'center', pointerEvents:'auto'
  });
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
  }));
  const dismiss = () => {
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 350);
  };
  const t = setTimeout(dismiss, duration);
  toast.addEventListener('click', () => { clearTimeout(t); dismiss(); });
}

/* ============================================================
   ZITE HANDOFF
   ============================================================ */
let __ziteOverlay = null;
function ensureZiteOverlay(){
  if (__ziteOverlay) return __ziteOverlay;
  const el = document.createElement('div');
  el.id = 'pc-zite-overlay';
  el.setAttribute('aria-hidden', 'true');
  Object.assign(el.style, {
    position:'fixed', inset:'0', background:'#063D2E',
    zIndex:'99998', opacity:'0', pointerEvents:'none',
    transition:'opacity .35s ease',
    display:'grid', placeItems:'center',
    color:'#F1DDA5', fontFamily:"'Poppins','Inter',sans-serif"
  });
  el.innerHTML = `
    <div style="text-align:center;padding:1.5rem">
      <div style="font-size:.82rem;letter-spacing:.15em;text-transform:uppercase;color:#D6B46A;margin-bottom:.6rem">
        PeakCraft Innovations
      </div>
      <div style="font-size:1.3rem;font-weight:700;color:#fff">
        Opening your project form…
      </div>
      <div style="margin-top:1rem;width:52px;height:52px;margin-inline:auto;border-radius:50%;
                  border:3px solid rgba(241,221,165,.25);border-top-color:#F1DDA5;
                  animation:pc-spin 0.9s linear infinite"></div>
    </div>
    <style>
      @keyframes pc-spin { to { transform: rotate(360deg); } }
    </style>
  `;
  document.body.appendChild(el);
  __ziteOverlay = el;
  return el;
}

function openZiteForm(service){
  const url = new URL(PC_CONFIG.CONTACT.ZITE_URL);
  if (service) url.searchParams.set('service', service);
  const overlay = ensureZiteOverlay();
  overlay.style.pointerEvents = 'auto';
  requestAnimationFrame(() => { overlay.style.opacity = '1'; });
  setTimeout(() => {
    if (PC_CONFIG.CONTACT.OPEN_MODE === 'same-tab') {
      window.location.href = url.toString();
    } else {
      const w = window.open(url.toString(), '_blank', 'noopener');
      if (!w) {
        window.location.href = url.toString();
        return;
      }
      setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      }, 900);
    }
  }, 380);
}

function contactWithService(service){ openZiteForm(service); }
function startProject(){ openZiteForm(''); }

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-zite]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openZiteForm(el.dataset.ziteService || el.dataset.zite || '');
    });
  });
});

/* ============================================================
   PORTFOLIO ENGINE — 36 concepts, real concept images
   ============================================================ */
const U = (id, w=800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const PORTFOLIO_PROJECTS = [
  { name:"ZedPlate", category:"Websites", audience:"Zambian restaurant website", description:"An interactive restaurant website demo with sample menu categories, opening hours, location and contact actions.", status:"Working Demo", previewImage:U("1552566626-52f8b828add9"), publishedUrl:"PASTE_ZEDPLATE_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Business Website" },
  { name:"Groundwork", category:"Websites", audience:"Construction and handyman website", description:"A practical contractor website concept with service categories, project highlights and a quote-request pathway.", status:"Working Demo", previewImage:U("1541888946425-d81bb19240f5"), publishedUrl:"PASTE_GROUNDWORK_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Business Website" },
  { name:"StockPilot", category:"Digital Registers", audience:"Inventory and stock register", description:"An interactive stock register prototype with sample products, quantities, category filters, search and low-stock indicators.", status:"Working Demo", previewImage:U("1553413077-190dd305871c"), publishedUrl:"PASTE_STOCKPILOT_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Digital Register" },
  { name:"Toe", category:"Business Systems", audience:"Financial management platform concept", description:"A finance workspace concept focused on transaction records, categories, spreadsheet workflows and careful financial data handling.", status:"Working Demo", previewImage:U("1554224155-6726b3ff858f"), publishedUrl:"PASTE_TOE_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"ShiftFlow", category:"Business Systems", audience:"Staff scheduling and shift management", description:"An interactive weekly scheduling prototype with sample staff, shift states and assignment controls.", status:"Working Demo", previewImage:U("1521737604893-d14cc237f11d"), publishedUrl:"PASTE_SHIFTFLOW_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"Operations Desk", category:"Business Systems", audience:"Tasks, follow-ups and operational visibility", description:"An interactive operations prototype with task priorities, follow-up dates, statuses and a summary dashboard.", status:"Working Demo", previewImage:U("1484480974693-6ca0a78fb36b"), publishedUrl:"PASTE_OPERATIONS_DESK_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"Copper & Crown", category:"Websites", audience:"Premium barber studio website", description:"A high-contrast barber studio website concept built around services, style, booking enquiries and location.", status:"Design Concept", previewImage:U("1503951914875-452162b0f3f1"), publishedUrl:"PASTE_COPPER_CROWN_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Business Website" },
  { name:"AfyaRegister", category:"Digital Registers", audience:"Clinic recordkeeping concept", description:"A structured clinic recordkeeping concept. Sample-only data; not a clinical record system or production healthcare deployment.", status:"Design Concept", previewImage:U("1576091160399-112ba8d25d1d"), publishedUrl:"PASTE_AFYAREGISTER_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Digital Register" },
  { name:"ClassLedger", category:"Digital Registers", audience:"School register", description:"A school recordkeeping concept for class lists, attendance records and searchable student information.", status:"Design Concept", previewImage:U("1497633762265-9d179a990aa6"), publishedUrl:"PASTE_CLASSLEDGER_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Digital Register" },
  { name:"LeadDesk", category:"Business Systems", audience:"Enquiry and lead tracker", description:"A lightweight lead tracker concept for organising enquiries, follow-up dates and pipeline status.", status:"Design Concept", previewImage:U("1460925895917-afdab827c52f"), publishedUrl:"PASTE_LEADDESK_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Business Tool" },
  { name:"MarketPulse", category:"Business Systems", audience:"Daily sales tracker", description:"A simple daily sales logging concept with category totals and a quick overview for small operators.", status:"Design Concept", previewImage:U("1551288049-bebda4e38f71"), publishedUrl:"PASTE_MARKETPULSE_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Business Tool" },
  { name:"FixFlow", category:"Business Systems", audience:"Maintenance and repair tracker", description:"A maintenance log concept for recording issues, assigning next steps and tracking repair status.", status:"Design Concept", previewImage:U("1581093458791-9d42e3c7e117"), publishedUrl:"PASTE_FIXFLOW_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Business Tool" },
  { name:"ServiceRoster", category:"Business Systems", audience:"Hospitality workforce scheduling", description:"A workforce scheduling concept for hospitality teams, availability and coverage planning.", status:"Design Concept", previewImage:U("1414235077428-338989a2e8c0"), publishedUrl:"PASTE_SERVICEROSTER_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"GuardRoster", category:"Business Systems", audience:"Security staffing and handover", description:"A security roster concept for duty assignments, handover notes and shift coverage.", status:"Design Concept", previewImage:U("1557597774-9d273605dfa9"), publishedUrl:"PASTE_GUARDROSTER_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"KwachaBooks", category:"Business Systems", audience:"Small-business money tracker", description:"A simple money-tracking concept for logging income and expenses and viewing basic totals.", status:"Design Concept", previewImage:U("1554224154-26032ffc0d07"), publishedUrl:"PASTE_KWACHABOOKS_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Business Tool" },
  { name:"BuildBudget", category:"Business Systems", audience:"Project cost tracking tool", description:"A project cost concept for tracking planned costs, actual spend and budget variance.", status:"Design Concept", previewImage:U("1454165804606-c3d57bc86b40"), publishedUrl:"PASTE_BUILDBUDGET_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"SiteTrack", category:"Business Systems", audience:"Construction project operations", description:"A site operations concept for tracking work items, progress notes, materials and project issues.", status:"Design Concept", previewImage:U("1503387762-592deb58ef4e"), publishedUrl:"PASTE_SITETRACK_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"CareConnect Desk", category:"Business Systems", audience:"Care coordination workflow concept", description:"A care coordination workflow concept for enquiries, visit planning and status tracking; not a clinical system.", status:"Design Concept", previewImage:U("1576091160550-2173dba999ef"), publishedUrl:"PASTE_CARECONNECT_DESK_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"ZedEats", category:"Apps & SaaS", audience:"Food ordering application", description:"A food ordering app concept focused on browsing menus, basket review and clear order enquiry steps.", status:"Design Concept", previewImage:U("1504674900247-0877df9cc836"), publishedUrl:"PASTE_ZEDEATS_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"ZedMarket", category:"Apps & SaaS", audience:"Local marketplace", description:"A local marketplace concept for browsing categories, discovering sellers and viewing product cards.", status:"Design Concept", previewImage:U("1556742049-0cfed4f6a45d"), publishedUrl:"PASTE_ZEDMARKET_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"RouteZed", category:"Apps & SaaS", audience:"Transport booking concept", description:"A transport booking concept for route requests, trip details and booking status visibility.", status:"Design Concept", previewImage:U("1449965408869-eaa3f722e40d"), publishedUrl:"PASTE_ROUTEZED_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"BusinessHub", category:"Apps & SaaS", audience:"Small-business workspace", description:"A SaaS workspace concept bringing common small-business records and shortcuts into one place.", status:"Design Concept", previewImage:U("1497366754035-f200968a6e72"), publishedUrl:"PASTE_BUSINESSHUB_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"BookWise", category:"Apps & SaaS", audience:"Booking and appointment platform", description:"An appointment platform concept for service availability, booking requests and schedule visibility.", status:"Design Concept", previewImage:U("1517245386807-bb43f82c33c4"), publishedUrl:"PASTE_BOOKWISE_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"SkillSpring", category:"Apps & SaaS", audience:"Online learning platform", description:"An online learning concept with course cards, learning progress and learner navigation.", status:"Design Concept", previewImage:U("1503676260728-1c00da094a0b"), publishedUrl:"PASTE_SKILLSPRING_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"FlowBridge", category:"Automation", audience:"Workflow automation", description:"A workflow concept that maps triggers, decisions and actions to make repeatable processes easier to understand.", status:"Design Concept", previewImage:U("1451187580459-43490279c0fa"), publishedUrl:"PASTE_FLOWBRIDGE_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"SheetSync", category:"Automation", audience:"Spreadsheet processing and validation", description:"A spreadsheet workflow concept for importing rows, checking data and presenting validation feedback.", status:"Design Concept", previewImage:U("1460925895917-afdab827c52f"), publishedUrl:"PASTE_SHEETSYNC_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"AssistIQ", category:"Automation", audience:"AI-assisted business support concept", description:"An AI-assistance concept for drafting responses and organising business knowledge; requires individual scoping and safeguards.", status:"Design Concept", previewImage:U("1620712943543-bcc4688e7485"), publishedUrl:"PASTE_ASSISTIQ_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"Munda & Home", category:"Websites", audience:"Homewares and crafts e-commerce", description:"An online shop concept celebrating homewares and crafts with product storytelling and clear product browsing.", status:"Design Concept", previewImage:U("1522708323590-d24dbb6b0267"), publishedUrl:"PASTE_MUNDA_HOME_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Business Website" },
  { name:"KwachaVision", category:"Business Systems", audience:"Advanced finance application concept", description:"An advanced finance application concept for dashboards, reporting and structured financial workflows.", status:"Design Concept", previewImage:U("1611974789855-9c2a0a7236a3"), publishedUrl:"PASTE_KWACHAVISION_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"Discover Zambia", category:"Websites", audience:"Travel and cultural website", description:"A travel and culture website concept with editorial storytelling, destination discovery and locally grounded content.", status:"Design Concept", previewImage:U("1516426122078-c23e76319801"), publishedUrl:"PASTE_DISCOVER_ZAMBIA_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Business Website" },
  { name:"Chitenge Studio", category:"Websites", audience:"Fashion and boutique website", description:"A contemporary fashion website concept for collections, brand storytelling and boutique enquiries.", status:"Design Concept", previewImage:U("1441984904996-e0b6ba687e04"), publishedUrl:"PASTE_CHITENGE_STUDIO_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Business Website" },
  { name:"FarmGate ZM", category:"Apps & SaaS", audience:"Produce ordering concept", description:"A produce ordering concept connecting buyers with listed produce, quantities and enquiry details.", status:"Design Concept", previewImage:U("1500382017468-9049fed747ef"), publishedUrl:"PASTE_FARMGATE_ZM_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"AfyaBook", category:"Apps & SaaS", audience:"Clinic appointment portal", description:"A clinic appointment concept for service information and appointment requests; not a deployed patient portal.", status:"Design Concept", previewImage:U("1631217868264-e5b90bb7e133"), publishedUrl:"PASTE_AFYABOOK_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"ToolTrack", category:"Digital Registers", audience:"Equipment rental register", description:"An equipment register concept for tracking items, availability, rentals and returns.", status:"Design Concept", previewImage:U("1581094794329-c8112a89af12"), publishedUrl:"PASTE_TOOLTRACK_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Digital Register" },
  { name:"MyWork ZM", category:"Apps & SaaS", audience:"Employee self-service concept", description:"An employee self-service concept for viewing roster information, submitting requests and checking notices.", status:"Design Concept", previewImage:U("1522071820081-009f0129c71c"), publishedUrl:"PASTE_MYWORK_ZM_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" },
  { name:"DocuFlow AI", category:"Automation", audience:"Document processing concept", description:"A document workflow concept for classifying, extracting and reviewing information with human oversight.", status:"Design Concept", previewImage:U("1554224155-1696413565d3"), publishedUrl:"PASTE_DOCUFLOW_AI_GITHUB_PAGES_URL_HERE", videoUrl:"", serviceCategory:"Custom Software" }
];

function projectCard(p, i){
  const live = safeLiveUrl(p.publishedUrl);
  const status = live ? 'Live Demo' : p.status;
  return `<article class="portfolio-card" data-project-index="${i}">
    <div class="card-img-wrap">
      <img src="${escapeHtml(p.previewImage)}"
           alt="${escapeHtml(p.name)} — ${escapeHtml(p.audience)}"
           loading="lazy"
           onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,#eaf4ed,#ffffff)';" />
    </div>
    <div class="card-body">
      <div class="project-card-topline">
        <span class="project-category">${escapeHtml(p.category)}</span>
        <span class="project-status" data-status="${escapeHtml(status)}">${escapeHtml(status)}</span>
      </div>
      <h4>${escapeHtml(p.name)}</h4>
      <p>${escapeHtml(p.description)}</p>
      <div class="project-actions">
        <button type="button" class="primary-project-action" data-preview-project="${i}">View Preview</button>
        ${live ? `<a href="${escapeHtml(live)}" target="_blank" rel="noopener noreferrer">View Live Demo ↗</a>` : ''}
        <button type="button" data-quote-project="${i}">Build Similar</button>
      </div>
    </div>
  </article>`;
}

function renderPortfolio(){
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  const filter = document.querySelector('.portfolio-filter.is-active')?.dataset.filter || 'all';
  const q = (document.getElementById('portfolio-search')?.value || '').trim().toLowerCase();
  const shown = PORTFOLIO_PROJECTS.map((p,i)=>({...p,_i:i}))
    .filter(p =>
      (filter === 'all' || p.category === filter) &&
      (!q || [p.name,p.audience,p.description,p.category,p.serviceCategory].join(' ').toLowerCase().includes(q))
    );
  grid.innerHTML = shown.map(p => projectCard(p, p._i)).join('');
  const counter = document.getElementById('portfolio-total');
  if (counter) counter.textContent = PORTFOLIO_PROJECTS.length;
  const status = document.getElementById('portfolio-results-status');
  if (status) status.textContent =
    `Showing ${shown.length} of ${PORTFOLIO_PROJECTS.length} project concepts${filter!=='all'?' in '+filter:''}${q?' matching "'+q+'"':''}.`;
  grid.querySelectorAll('[data-preview-project]').forEach(b =>
    b.addEventListener('click', () => openProjectPreview(Number(b.dataset.previewProject))));
  grid.querySelectorAll('[data-quote-project]').forEach(b =>
    b.addEventListener('click', () => {
      const p = PORTFOLIO_PROJECTS[Number(b.dataset.quoteProject)];
      openZiteForm(p?.serviceCategory || 'Custom Software');
    }));
}

function openProjectPreview(i){
  const p = PORTFOLIO_PROJECTS[i];
  if (!p) return;
  const dlg = document.getElementById('project-dialog');
  const content = document.getElementById('project-dialog-content');
  const statusEl = document.getElementById('project-dialog-status');
  if (statusEl) statusEl.textContent = safeLiveUrl(p.publishedUrl) ? 'Live Demo' : p.status;
  content.innerHTML = `<div class="project-dialog-body">
    <span class="project-category">${escapeHtml(p.category)} · ${escapeHtml(p.audience)}</span>
    <h2 id="project-dialog-title">${escapeHtml(p.name)}</h2>
    <img src="${escapeHtml(p.previewImage)}" alt="${escapeHtml(p.name)} preview"
         style="width:100%;border-radius:12px;margin:.9rem 0;aspect-ratio:16/9;object-fit:cover"
         loading="lazy" onerror="this.style.display='none'" />
    <p>${escapeHtml(p.description)}</p>
    <div class="project-detail-panel">
      <h3>Concept overview</h3>
      <p>This is a design concept or prototype, not a claim of a completed client deployment. Final features, data handling, hosting and integrations would be defined during project scoping.</p>
    </div>
    <div class="project-actions">
      <button type="button" class="primary-project-action" id="project-quote-action">Build Something Similar</button>
      ${safeLiveUrl(p.publishedUrl) ? `<a href="${escapeHtml(safeLiveUrl(p.publishedUrl))}" target="_blank" rel="noopener noreferrer">View Live Demo ↗</a>` : ''}
    </div>
  </div>`;
  document.getElementById('project-quote-action').addEventListener('click', () => {
    dlg.close();
    openZiteForm(p.serviceCategory || 'Custom Software');
  });
  if (typeof dlg.showModal === 'function') dlg.showModal();
  else dlg.setAttribute('open','');
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('portfolio-grid')) return;
  renderPortfolio();
  document.querySelectorAll('.portfolio-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.portfolio-filter').forEach(b => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      renderPortfolio();
    });
  });
  document.getElementById('portfolio-search')?.addEventListener('input', renderPortfolio);
  document.querySelectorAll('[data-close-dialog]').forEach(b =>
    b.addEventListener('click', () => document.getElementById('project-dialog')?.close()));
  document.getElementById('project-dialog')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) e.currentTarget.close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const d = document.getElementById('project-dialog');
      if (d?.open) d.close();
    }
  });
});

/* ============================================================
   CONTACT FORM — local validation then Zite handoff
   ============================================================ */
function saveFormData(){
  try {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const data = {};
    ['name','email','phone','whatsapp','projectType','startDate','endDate','budget','timeline','description']
      .forEach(id => { data[id] = document.getElementById(id)?.value || ''; });
    data.savedAt = new Date().toISOString();
    localStorage.setItem(PC_CONFIG.FORM.STORAGE_KEY, JSON.stringify(data));
  } catch(_) {}
}
function restoreFormData(){
  try {
    const raw = localStorage.getItem(PC_CONFIG.FORM.STORAGE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    ['name','email','phone','whatsapp','projectType','startDate','endDate','budget','timeline','description']
      .forEach(id => {
        if (d[id]) { const el = document.getElementById(id); if (el) el.value = d[id]; }
      });
  } catch(_) {}
}
const debouncedSave = debounce(saveFormData, PC_CONFIG.FORM.AUTO_SAVE_DELAY);

function setupContactForm(){
  const form = document.getElementById('contact-form');
  if (!form) return;
  ['name','email','phone','whatsapp','projectType','startDate','endDate','budget','timeline','description']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.addEventListener('input', debouncedSave); el.addEventListener('change', debouncedSave); }
    });
  restoreFormData();
  const sel = document.getElementById('projectType');
  if (sel) {
    const param = new URLSearchParams(window.location.search).get('service');
    if (param) {
      const opt = Array.from(sel.options).find(o => o.value === param);
      if (opt) sel.value = param;
    }
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const getVal = id => document.getElementById(id)?.value?.trim() || '';
    const required = {
      'Full Name': getVal('name'),
      'Email':     getVal('email'),
      'Phone':     getVal('phone'),
      'WhatsApp':  getVal('whatsapp'),
      'Project Type': sel?.value || '',
      'Project Description': getVal('description')
    };
    const missing = Object.entries(required).filter(([,v]) => !v).map(([k]) => k);
    if (missing.length) {
      showToast('Please fill in: ' + missing.join(', '), 'warning');
      const map = { 'Full Name':'name','Email':'email','Phone':'phone','WhatsApp':'whatsapp','Project Type':'projectType','Project Description':'description' };
      const first = document.getElementById(map[missing[0]]);
      if (first) { first.focus(); first.scrollIntoView({ behavior:'smooth', block:'center' }); }
      return;
    }
    openZiteForm(sel?.value || '');
  });
}
document.addEventListener('DOMContentLoaded', setupContactForm);

window.contactWithService = contactWithService;
window.startProject = startProject;
window.openZiteForm = openZiteForm;
window.showToast = showToast;