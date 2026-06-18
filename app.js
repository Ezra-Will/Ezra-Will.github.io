/* ═══════════════════════════════════════════════════════
   APP.JS — Austin Williams Portfolio
   Handles: nav, scroll reveal, project modals, lightbox
═══════════════════════════════════════════════════════ */

'use strict';

/* ─── NAV SCROLL EFFECT ─────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── MOBILE MENU ───────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ─── SCROLL REVEAL ──────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger cards slightly
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── LIGHTBOX ───────────────────────────────────────── */
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" id="lightboxClose">✕</button>
  <img id="lightboxImg" src="" alt="Full view" />
`;
document.body.appendChild(lightbox);

const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt = '') {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* ─── MODAL ──────────────────────────────────────────── */
const overlay   = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');

function openModal(html) {
  modalBody.innerHTML = html;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Wire up gallery images inside modal to lightbox
  modalBody.querySelectorAll('.modal-gallery img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  // Wire up any code-load buttons
  modalBody.querySelectorAll('[data-load-code]').forEach(btn => {
    btn.addEventListener('click', () => loadCodeFile(btn.dataset.loadCode, btn.dataset.target));
  });
}

function closeProjectModal() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  // Pause any videos
  overlay.querySelectorAll('video').forEach(v => v.pause());
}

function closeModal(e) {
  if (e.target === overlay) closeProjectModal();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeProjectModal(); closeLightbox(); }
});

async function loadCodeFile(path, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.textContent = 'Loading…';
  try {
    const res = await fetch(path);
    const text = await res.text();
    target.textContent = text;
  } catch {
    target.textContent = '⚠ Could not load file (may need a local server).';
  }
}

/* ═══════════════════════════════════════════════════════
   PROJECT DATA
═══════════════════════════════════════════════════════ */

function openProject(id) {
  const projects = {

    /* ── WORK ─────────────────────────────────────────── */

    dept69: {
      title: 'Dept69 — Electrical Enclosure Rebuild',
      subtitle: 'Work Experience · Electrical',
      desc: `Inherited a "jungle" of disorganized wiring inside industrial electrical enclosures and led the cleanup and rebuild effort. 
             Each enclosure was fully documented before teardown, rewired to standard, and photographed after completion. 
             The result was a safe, maintainable, and inspection-ready installation.`,
      html: () => `
        <p class="modal-section-label">Before &amp; After Gallery</p>
        <div class="modal-gallery">
          <div class="img-compare-wrap">
            <p style="color:var(--text-muted);font-size:0.78rem;margin-bottom:4px;">BEFORE</p>
            <img src="Work/1_/8718Before.jpg"  alt="Enclosure 8718 Before" />
          </div>
          <div class="img-compare-wrap">
            <p style="color:var(--accent-2);font-size:0.78rem;margin-bottom:4px;">AFTER</p>
            <img src="Work/1_/8718After.jpg"   alt="Enclosure 8718 After" />
          </div>
          <div class="img-compare-wrap">
            <p style="color:var(--text-muted);font-size:0.78rem;margin-bottom:4px;">BEFORE</p>
            <img src="Work/1_/8720Before.jpg"  alt="Enclosure 8720 Before" />
          </div>
          <div class="img-compare-wrap">
            <p style="color:var(--accent-2);font-size:0.78rem;margin-bottom:4px;">AFTER</p>
            <img src="Work/1_/8720AfterInstall.jpg" alt="Enclosure 8720 After" />
          </div>
        </div>
      `
    },

    rolling: {
      title: 'Rolling Machines — Build Documentation',
      subtitle: 'Work Experience · Fabrication & Electrical',
      desc: `Comprehensive photo documentation of rolling machine builds throughout various stages of assembly, wiring, and final installation. 
             These machines were built and commissioned on-site, requiring coordination of mechanical, electrical, and controls work.`,
      html: () => `
        <p class="modal-section-label">Photo Documentation</p>
        <div class="modal-gallery">
          ${[
            'IMG_2249','IMG_2251','IMG_2254','IMG_2257',
            'IMG_2258','IMG_2259','IMG_2260','IMG_2264',
            'IMG_2265','IMG_2275','IMG_2276'
          ].map(n =>
            `<img src="Work/3_/${n}.JPG" alt="${n}" />`
          ).join('')}
        </div>
      `
    },

    powder: {
      title: 'Rolling Machine — Controls Package',
      subtitle: 'Work Experience · PLC · HMI · Wiring',
      desc: `Controls documentation for a rolling machine build — encompassing PLC documentation, exported logic, wiring schematics,
             and support files. The package gives future troubleshooting work a clear path from code to wiring to field I/O.`,
      html: () => `
        <p class="modal-section-label">PLC Documentation (PDF)</p>
        <div class="modal-pdf-wrap">
          <iframe src="Work/2_/01 PLC & HMI/Rolling_Machine_PLC_V1.01.pdf" title="Rolling Machine PLC Documentation"></iframe>
        </div>
        <p class="modal-section-label">Electrical Schematics</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.6rem;margin-bottom:1.5rem;">
          ${[
            ['02 Wiring Schematics/English Electrical Prints.pdf','Original Prints'],
            ['02 Wiring Schematics/New Rolling Machine Electrical Prints.pdf','New Electrical Prints'],
            ['02 Wiring Schematics/New Rolling Machine Electrical Prints_2.pdf','Revised Electrical Prints'],
            ['02 Wiring Schematics/Rolling Machine w Transformer.pdf','Transformer Prints'],
          ].map(([file, label]) =>
            `<a href="Work/2_/${file}" target="_blank" class="btn btn-sm">📄 ${label}</a>`
          ).join('')}
        </div>
        <p class="modal-section-label">Code &amp; I/O References</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.6rem;margin-bottom:1.5rem;">
          ${[
            ['01 PLC & HMI/Exported_PLC_Logic/ProgPou.txt','Exported PLC Logic'],
            ['01 PLC & HMI/Exported_PLC_Logic/ProgPou.html','PLC Logic HTML'],
            ['03 Support Documents/Rolling_Machine_IOSheet.xlsx','I/O Sheet'],
          ].map(([file, label]) =>
            `<a href="Work/2_/${file}" target="_blank" class="btn btn-sm">📄 ${label}</a>`
          ).join('')}
        </div>
      `
    },

    batchmaster: {
      title: 'Batchmaster — Network Architecture',
      subtitle: 'Work Experience · IT/OT · Network Design',
      desc: `Designed and documented a full network architecture for a Batchmaster production system. 
             Work included topology planning, IT/OT boundary definition, wiring overview drawings in CAD, 
             and PDF deliverable packages for handoff to the customer.`,
      html: () => `
        <p class="modal-section-label">Network Diagram</p>
        <div class="modal-gallery">
          <img src="Work/4_/NetworkArchitecture/network example.png" alt="Network Architecture Diagram"
               onerror="this.style.display='none'" />
        </div>
        <p class="modal-section-label">Architecture Overview (PDF)</p>
        <div class="modal-pdf-wrap">
          <iframe src="Work/4_/NetworkArchitecture/OVERVIEW.pdf" title="Network Architecture Overview"></iframe>
        </div>
        <p class="modal-section-label">Schematic Package</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.6rem;">
          ${[
            ['Cover_Page.pdf','Cover Page'],
            ['OVERVIEW_A-B.pdf','Overview A-B'],
            ['OVERVIEW_C-D.pdf','Overview C-D'],
            ['combined.pdf','Full Combined PDF'],
          ].map(([file, label]) =>
            `<a href="Work/4_/NetworkArchitecture/${file}" target="_blank" class="btn btn-sm">📄 ${label}</a>`
          ).join('')}
        </div>
      `
    },

    /* ── SCHOOL ───────────────────────────────────────── */

    delta: {
      title: 'Delta Robot — Full Build',
      subtitle: 'School Project · Robotics · CAD · PLC · Video',
      desc: `End-to-end design and build of a delta parallel robot. The project spanned mechanical design in CAD, 
             fabrication, electrical enclosure wiring, and PLC/motion programming. 
             Two video demonstrations show the machine in operation.`,
      html: () => `
        <p class="modal-section-label">Demo Videos</p>
        <div class="modal-video-wrap" style="margin-bottom:1rem;">
          <video controls preload="metadata">
            <source src="School/2_/Video1.MP4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <p class="modal-section-label" style="margin-top:1.5rem;">Machine Photos</p>
        <div class="modal-gallery">
          <img src="School/2_/Machine_FrontView1.JPG" alt="Machine Front View 1" />
          <img src="School/2_/Machine_FrontView2.JPG" alt="Machine Front View 2" />
          <img src="School/2_/Electrical_Enclosure.jpeg" alt="Electrical Enclosure" />
          <img src="School/2_/CAD_Final_S1.jpg" alt="CAD Final Design" />
          <img src="School/2_/IMG_2665.jpeg" alt="Build Photo" />
          <img src="School/2_/IMG_2670.jpeg" alt="Build Photo 2" />
        </div>
        <p class="modal-section-label">PLC Documentation</p>
        <div class="modal-pdf-wrap">
          <iframe src="School/2_/4580_PLC_V4.04.pdf" title="PLC Documentation"></iframe>
        </div>
        <p class="modal-section-label">PLC Source Code</p>
        <div class="modal-code-block">
          <pre id="deltaCode">Click to load…</pre>
        </div>
        <button class="btn btn-sm" data-load-code="School/2_/Auto_V4.04.txt" data-target="deltaCode">
          Load PLC Code
        </button>
      `
    },

    pid: {
      title: 'Dancer Arm — PID Tension Control',
      subtitle: 'School Project · Controls · MATLAB · ENGR3540',
      desc: `Designed and tuned a PID controller for a dancer arm tension control system as part of ENGR3540. 
             The project involved MATLAB simulation, root locus stability analysis, step response characterization, 
             and real hardware validation using a stepper motor and custom PLC structured text program.`,
      html: () => `
        <p class="modal-section-label">Analysis Plots</p>
        <div class="modal-gallery">
          <img src="School/1_/PID Project/Root Locus.png" alt="Root Locus Plot" />
          <img src="School/1_/PID Project/System Stability (Root Locus).png" alt="System Stability" />
          <img src="School/1_/PID Project/Step Response.png" alt="Step Response" />
          <img src="School/1_/PID Project/Step Response Analysis.png" alt="Step Response Analysis" />
          <img src="School/1_/PID Project/Theoretical Step Response.png" alt="Theoretical Step Response" />
          <img src="School/1_/PID Project/Final Project Validation.png" alt="Final Validation" />
        </div>
        <p class="modal-section-label">Project Report (PDF)</p>
        <div class="modal-pdf-wrap">
          <iframe src="School/1_/PID Project/ENGR3540 Final Project Report.pdf" title="PID Project Report"></iframe>
        </div>
        <p class="modal-section-label">MATLAB Source Code</p>
        <div class="modal-code-block">
          <pre id="matlabCode">Click to load…</pre>
        </div>
        <button class="btn btn-sm" data-load-code="School/1_/PID Project/DancerArm_Analysis_V2.m" data-target="matlabCode" style="margin-bottom:1.5rem;">
          Load MATLAB Script
        </button>
        <p class="modal-section-label">PLC Structured Text (Tension Control)</p>
        <div class="modal-code-block">
          <pre id="stCode">Click to load…</pre>
        </div>
        <button class="btn btn-sm" data-load-code="School/1_/PID Project/TensionControl_ST_V2.txt" data-target="stCode">
          Load ST Code
        </button>
      `
    },

    speaker: {
      title: 'Audio Amplifier — Speaker Build',
      subtitle: 'School Project · Electronics · Circuit Design · ENGR3530',
      desc: `Designed a Class AB audio amplifier from the ground up for ENGR3530 Phase 2. 
             The project covered component selection, hand calculations, Multisim circuit simulation, 
             oscilloscope waveform verification, and a full written report documenting findings.`,
      html: () => `
        <p class="modal-section-label">Circuit Simulations</p>
        <div class="modal-gallery">
          <img src="School/1_/Speaker Project/SIM_CIRC1.PNG" alt="Circuit Sim 1" />
          <img src="School/1_/Speaker Project/SIM_CIRC2.PNG" alt="Circuit Sim 2" />
          <img src="School/1_/Speaker Project/SIM_CIRC3.PNG" alt="Circuit Sim 3" />
          <img src="School/1_/Speaker Project/SIM_CIRC4.PNG" alt="Circuit Sim 4" />
        </div>
        <p class="modal-section-label">Oscilloscope / Sweep Results</p>
        <div class="modal-gallery">
          <img src="School/1_/Speaker Project/Sweep1.PNG" alt="Frequency Sweep 1" />
          <img src="School/1_/Speaker Project/Sweep2.PNG" alt="Frequency Sweep 2" />
          <img src="School/1_/Speaker Project/XSC1_1.PNG" alt="Oscilloscope 1" />
          <img src="School/1_/Speaker Project/XSC1_2.PNG" alt="Oscilloscope 2" />
          <img src="School/1_/Speaker Project/XSC1_3.PNG" alt="Oscilloscope 3" />
        </div>
        <p class="modal-section-label">Project Report (PDF)</p>
        <div class="modal-pdf-wrap">
          <iframe src="School/1_/Speaker Project/ENGR3530 Project Phase 2 Report.pdf" title="Amplifier Report"></iframe>
        </div>
        <p class="modal-section-label">Design Notes &amp; Calculations</p>
        <div class="modal-code-block">
          <pre id="speakerDesignCode">Click to load…</pre>
        </div>
        <button class="btn btn-sm" data-load-code="School/1_/Speaker Project/Circuit_Design_and_Math.txt" data-target="speakerDesignCode">
          Load Design Notes
        </button>
      `
    },

    /* ── HOBBIES ──────────────────────────────────────── */

    vms: {
      title: 'Virtual Machine Fleet',
      subtitle: 'Hobby · VMware Workstation Pro',
      desc: `Maintains a large VMware Workstation Pro fleet used professionally, educationally, and as a hobby. 
             Each VM serves a specific purpose — from running licensed industrial software in isolation to security testing and CAD work.`,
      html: () => `
        <p class="modal-section-label">VM Inventory</p>
        <ul class="vm-list">
          <li>Windows 10 Sandbox</li>
          <li>Windows 10 — Mitsubishi Software</li>
          <li>Windows 11 — Mitsubishi Software</li>
          <li>Windows 10 — TIA Portal (Siemens)</li>
          <li>Windows 11 — TIA Portal (Siemens)</li>
          <li>Autodesk CAD VM</li>
          <li>Linux — Arch</li>
          <li>Linux — Ubuntu</li>
          <li>Linux — Kali (Security)</li>
          <li>School Software VM (MATLAB, Multisim)</li>
          <li>E-SyS VM (BMW Programming)</li>
        </ul>
        <p class="modal-desc">
          Used professionally for running locked-down industrial software in reproducible environments, 
          educationally for MATLAB and circuit simulation, and for hobby projects like BMW ECU coding 
          and network security testing with Kali Linux.
        </p>
      `
    },

    server: {
      title: 'Home Server &amp; Networking',
      subtitle: 'Hobby · Linux · Security · Self-Hosting',
      desc: `Built and maintains a home server environment with a focus on network security testing, monitoring, 
             and custom configurations. Includes Kali Linux penetration testing practice with Kismet, Nmap, and Metasploit, 
             as well as home network assignment and DNS configuration work.`,
      html: () => `
        <p class="modal-section-label">Kali Security Tools Used</p>
        <ul class="vm-list" style="margin-bottom:1.5rem;">
          <li>Kismet (Wireless Monitoring)</li>
          <li>Nmap (Port/Service Scanning)</li>
          <li>Metasploit Framework</li>
          <li>DNS Loop Debugging</li>
          <li>Network Assignment / Segmentation</li>
        </ul>
        <p class="modal-desc">
          The detailed server and home-network notes stay private, but the public summary highlights the same practical skill set:
          Linux administration, VM isolation, network debugging, DNS troubleshooting, and security lab workflows.
        </p>
      `
    },

    linux: {
      title: 'Linux &amp; Windows Systems',
      subtitle: 'Hobby · System Administration · Networking',
      desc: `Daily experience across multiple Linux distributions and Windows environments. 
             Comfortable with network debugging, system administration, scripting, and troubleshooting across both ecosystems.`,
      html: () => `
        <p class="modal-section-label">Skills &amp; Experience</p>
        <ul class="vm-list">
          <li>Arch Linux</li>
          <li>Ubuntu / Debian</li>
          <li>Kali Linux</li>
          <li>Windows 10 / 11</li>
          <li>Network Debugging</li>
          <li>Bash Scripting</li>
          <li>DNS / DHCP Config</li>
          <li>Firewall Rules</li>
          <li>SSH / Remote Admin</li>
          <li>System Monitoring</li>
        </ul>
        <p class="modal-desc" style="margin-top:1rem;">
          This experience spans professional use (industrial automation networks), educational (school labs), 
          and personal hobby projects including home server administration and virtual machine management.
        </p>
      `
    },

    bmw: {
      title: 'BMW E-SyS Programming',
      subtitle: 'Hobby · ECU Coding · Vehicle Electronics',
      desc: `ECU feature coding on BMW F-series vehicles using the E-SyS software suite along with BimmerCode. 
             Work includes FA/VO modification, hidden feature enabling, and reading/writing control unit parameters. 
             Documented with step-by-step guides and a demonstration video.`,
      html: () => `
        <p class="modal-section-label">Demonstration Video</p>
        <div class="modal-video-wrap">
          <video controls preload="metadata">
            <source src="Hobbies/4_/RR_Logo.MOV" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <p class="modal-section-label" style="margin-top:1.5rem;">Reference Guides (PDF)</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.6rem;margin-bottom:1.5rem;">
          <a href="Hobbies/4_/E-SyS 3.18.4 step-by-step (MWPos) V 5-19-2013.pdf" target="_blank" class="btn btn-sm">📄 E-SyS Step-by-Step Guide</a>
          <a href="Hobbies/4_/FA (VO) Step-By-Step (MWPos) 8-24-2013.pdf"         target="_blank" class="btn btn-sm">📄 FA/VO Modification Guide</a>
          <a href="Hobbies/4_/By Function Cheat Sheet F10 2011-LCI (MWPos) 10-24-2013.pdf" target="_blank" class="btn btn-sm">📄 F10 Function Cheat Sheet</a>
          <a href="Hobbies/4_/F10 Cheatsheet - F10 Cheatsheet clean.pdf"            target="_blank" class="btn btn-sm">📄 F10 Cheatsheet (Clean)</a>
        </div>
        <p class="modal-section-label">BimmerCode ECU Settings</p>
        <p class="modal-desc">
          A spreadsheet of custom ECU coding settings is maintained in an Excel document tracking all applied codes, 
          their functions, and original/modified values for traceability.
        </p>
        <a href="Hobbies/4_/19_08_15 BimmerCode ECU Settings.xlsx" target="_blank" class="btn btn-sm">📊 Open ECU Settings Spreadsheet</a>
      `
    }

  };

  const proj = projects[id];
  if (!proj) return;

  openModal(`
    <p class="modal-subtitle">${proj.subtitle}</p>
    <h2 class="modal-title">${proj.title}</h2>
    <p class="modal-desc">${proj.desc}</p>
    <hr style="border:none;border-top:1px solid var(--border);margin-bottom:1.75rem;" />
    ${proj.html()}
  `);
}

/* ─── MARKDOWN RENDERER (simple) ─────────────────────── */
async function loadMarkdown(path, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = '<em style="color:var(--text-muted);">Loading…</em>';
  try {
    const res  = await fetch(path);
    const text = await res.text();
    // Very lightweight markdown → HTML conversion
    const html = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
      .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/gs, m => `<ul>${m}</ul>`)
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/^(?!<[hul])(.+)$/gm, '$1');
    target.innerHTML = `<p>${html}</p>`;
  } catch {
    target.innerHTML = '<em style="color:var(--text-muted);">⚠ Could not load file (may require a local server to read local files).</em>';
  }
}

// Expose to global scope for inline onclick handlers
window.openProject      = openProject;
window.closeProjectModal = closeProjectModal;
window.closeModal       = closeModal;
window.loadMarkdown     = loadMarkdown;
