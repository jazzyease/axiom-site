import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion, useScroll, useTransform, useMotionValue, useSpring, useInView, useAnimationControls, animate } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]
const SPRING = { type: 'spring', stiffness: 100, damping: 30 }

/* ─── Data ─── */

const services = [
  {
    title: 'AI Infrastructure',
    description: 'AXIOM designs and deploys the compute, orchestration, and data pipeline architecture that enterprise AI models run on.',
    image: '/ai_infrastructure_visual_1779112618866.png',
    tag: 'SYS-INFRA // COMPUTE'
  },
  {
    title: 'Digital Twin Platforms',
    description: 'Real-time virtual replicas of physical systems — factories, supply chains, energy grids. The twin mirrors the real-world system live.',
    image: '/digital_twin_visual_1779112636799.png',
    tag: 'TWIN-PLAN // REPLICA'
  },
  {
    title: 'Agentic AI Systems',
    description: 'Autonomous AI agents that reason, plan, and execute multi-step tasks across enterprise systems and existing workflows.',
    image: '/agentic_ai_visual_1779112655747.png',
    tag: 'AGENT-FLOW // AUTONOMY'
  },
  {
    title: 'Enterprise Solutions',
    description: 'End-to-end implementation, system integration, change management, and ongoing support for the full delivery lifecycle.',
    image: '/enterprise_tech_visual_1779112674600.png',
    tag: 'ENTERPRISE // OPERATE'
  },
]

const capabilities = [
  { title: 'Low-Latency Inference', desc: 'Sub-2ms response on optimised GPU clusters for real-time decision making at enterprise scale.', metric: '<2ms', label: 'avg latency' },
  { title: 'Enterprise Security', desc: 'SOC 2 Type II compliant infrastructure with end-to-end encryption and zero-trust architecture.', metric: 'SOC 2', label: 'certified' },
  { title: 'Real-Time Telemetry', desc: 'Continuous monitoring and anomaly detection across all deployed systems and endpoints.', metric: '24/7', label: 'monitoring' },
  { title: 'Auto-Scaling Compute', desc: 'Dynamic GPU and compute allocation that scales with demand — zero manual intervention.', metric: '10x', label: 'burst capacity' },
  { title: 'Global Edge Network', desc: 'Optimised inference infrastructure across 4 continents with guaranteed uptime SLA.', metric: '99.99%', label: 'uptime' },
  { title: 'Multi-Model Orchestration', desc: 'Route between LLMs, vision models, and domain-specific agents in a unified pipeline.', metric: '12+', label: 'model types' },
]

const expanded = [
  {
    title: 'System Design',
    kicker: 'PLATFORM CORE // 01',
    description: 'Platform architecture, interaction systems, brand logic, and the decision layer that makes AXIOM feel coherent from first touch to rollout.',
    chips: ['Architecture Map', 'Design Tokens', 'Component Library', 'Interaction Specs', 'Style Guidelines']
  },
  {
    title: 'Product Interface',
    kicker: 'OPERATIONAL SURFACE // 02',
    description: 'Operational UI patterns for dashboards, twin surfaces, admin tooling, and enterprise workflows that need clarity under pressure.',
    chips: ['Control Consoles', 'Telemetry Displays', 'Interactive Twins', 'Data Frameworks', 'Admin Interfaces']
  },
  {
    title: 'Launch Narrative',
    kicker: 'BRAND NARRATIVE // 03',
    description: 'A sharper positioning story, product messaging, and go-to-market surface that helps complex technology land with confidence.',
    chips: ['Strategic Positioning', 'Launch Surfaces', 'Technical Copy', 'Positioning Maps', 'GTM Deliverables']
  }
]

const process = [
  {
    step: '01',
    title: 'Discovery & Architecture Review',
    description: 'We audit existing infrastructure, data systems, and AI readiness. We map the gaps and define the architecture before writing a single line of code.',
  },
  {
    step: '02',
    title: 'Build & Integration',
    description: 'Our engineering teams build the infrastructure, platform, or agent system from the ground up — integrated directly into existing enterprise stack.',
  },
  {
    step: '03',
    title: 'Deploy, Monitor & Scale',
    description: 'Post-deployment, AXIOM provides ongoing monitoring, optimisation, and scaling support until systems perform at agreed-upon levels.',
  },
]

const proof = [
  { value: '40+', label: 'Enterprise environments deployed' },
  { value: '12', label: 'Industries served globally' },
  { value: '99.99%', label: 'Uptime SLA across infrastructure' },
  { value: '2ms', label: 'Average inference latency' },
]

const notes = [
  'Built for companies where the product surface and the underlying intelligence layer need to mature together.',
  'Best fit for deep tech, enterprise software, industrial platforms, and teams with real system complexity.',
  'Every engagement is intentionally compact, opinionated, and structured to create momentum quickly.',
]

const heroNotes = [
  ['Focus', 'AI infrastructure, digital twins, and agent systems for enterprise operators.'],
  ['Format', 'Compact strategy and systems sprint with output built to survive implementation.'],
  ['Outcome', 'A clearer product story, stronger operating model, and a launch surface that doesn\'t feel generic.'],
]

const serviceDetails = [
  ['Internal LLM infrastructure', 'Inference at scale', 'Legacy-to-AI migration', 'GPU cluster management'],
  ['Manufacturing & energy', 'Simulate before you operate', 'Predictive maintenance'],
  ['Complex decision automation', 'Multi-step reasoning', 'Autonomous workflows'],
  ['Full lifecycle delivery', 'Change management', 'Ongoing optimisation'],
]

const logos = [
  'Meridian Capital',
  'Vantara Industrial',
  'Solaris Energy',
  'Nexbridge Financial',
  'Aurion Health',
  'Castleford Logistics',
  'Delphos Mfg',
  'Ironveil Tech',
]

const testimonials = [
  {
    id: 'meridian',
    num: '01',
    quote: "AXIOM didn't come in with a pitch deck. They came in with an architecture plan. That's when we knew they were different.",
    author: "Chief Technology Officer",
    company: "Meridian Capital Group",
    sector: "FINANCIAL SYSTEM ARCHITECTURE",
    impact: "-40% COMPUTE DRIFT",
    duration: "9-WEEK DEPLOYMENT",
    region: "US-EAST-1 (AWS)",
    deployment: "AXIOM DATA HIGHWAY CORE",
    color: "#0ea5e9",
    highlight: "Infrastructure Shift"
  },
  {
    id: 'vantara',
    num: '02',
    quote: "The Digital Twin platform gave our operations team something they'd never had — the ability to see what's about to go wrong before it does.",
    author: "VP of Operations",
    company: "Vantara Industrial",
    sector: "HEAVY MANUFACTURING & AUTOMATION",
    impact: "ZERO SEVERITY-1 DRIFT INCIDENTS",
    duration: "CONTINUOUS TELEMETRY SYNC",
    region: "EU-CENTRAL-1 (HYBRID EDGE)",
    deployment: "AXIOM DIGITAL TWIN ENGINE v2.0",
    color: "#818cf8",
    highlight: "Predictive Operations"
  },
  {
    id: 'solaris',
    num: '03',
    quote: "We evaluated 12 vendors. AXIOM was the only one that understood we didn't need another dashboard — we needed infrastructure that could think.",
    author: "Chief Data Officer",
    company: "Solaris Energy Systems",
    sector: "RENEWABLE UTILITIES GRID",
    impact: "+22% ENERGY DISTRIBUTION OPTIMIZATION",
    duration: "12-WEEK INTEGRATION",
    region: "US-WEST-2 (MULTI-GRID REGIONAL)",
    deployment: "AXIOM GRID INTELLIGENCE DEPLOYMENT",
    color: "#34d399",
    highlight: "Autonomous Energy grid"
  },
  {
    id: 'nexbridge',
    num: '04',
    quote: "Their agentic AI deployment reduced our manual compliance review time by 70%. The system doesn't just flag issues — it resolves them.",
    author: "Head of Engineering",
    company: "Nexbridge Financial",
    sector: "FINTECH COMPLIANCE & AML",
    impact: "-70% REVIEWS PIPELINE DURATION",
    duration: "6-WEEK HOT DEPLOY",
    region: "AP-NORTHEAST-1 (AWS SECURE CLOUD)",
    deployment: "AXIOM AGENTIC COMPLIANCE CORE",
    color: "#a78bfa",
    highlight: "Autonomous Compliance"
  }
]

const highlightRows = [
  ['Platform direction', 'A tighter product thesis and operating model around how intelligence actually flows through the business.'],
  ['Experience system', 'UI patterns and content structure shaped for clarity, credibility, and internal adoption.'],
  ['Execution path', 'A practical line from brand and product decisions into engineering-ready interfaces and infrastructure choices.'],
]

const faqs = [
  { question: 'What do we actually get from AXIOM?', answer: 'A focused strategy and execution sprint across platform design, product UX, infrastructure planning, and launch-ready narrative systems.' },
  { question: 'How long does an engagement take?', answer: 'Most focused engagements run two to three weeks, depending on the amount of system definition and stakeholder review required.' },
  { question: 'Can AXIOM work with an existing product team?', answer: 'Yes. The ideal setup is direct collaboration with founders, product leads, and engineering stakeholders so decisions survive implementation.' },
  { question: 'Do you help beyond visuals?', answer: 'Yes. We work across structure, system thinking, interaction design, product strategy, and the intelligence layer behind the experience.' },
  { question: 'Can this include digital twin or agent work?', answer: 'That is the point. AXIOM is built for companies where the product surface and the underlying AI system need to evolve together.' },
  { question: 'Is booking a demo the next step?', answer: 'Yes. Use the contact form to share context and we will shape the right scope from there.' },
]

const dashboardMetrics = [
  { label: 'Inference Load', value: 73, color: '#6366f1' },
  { label: 'Model Accuracy', value: 96, color: '#34d399' },
  { label: 'Pipeline Health', value: 88, color: '#818cf8' },
  { label: 'Throughput', value: 64, color: '#fb7185' },
]

const markers = ['top', 'services', 'capabilities', 'method', 'platform', 'proof', 'faq', 'contact']
const marqueeText = 'AXIOM SYSTEMS LAB — AI INFRASTRUCTURE — DIGITAL TWINS — AGENTIC WORKFLOWS — ENTERPRISE TECHNOLOGY — '

/* ─── Animated Components ─── */

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 50 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

function GrainOverlay() {
  return <div className="grain-overlay" />
}

function WordReveal({ children, className = '', delay = 0, block = false }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const words = children.split(' ')
  const Tag = block ? 'div' : 'span'
  return (
    <Tag ref={ref} className={`word-reveal-container ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="word-wrap">
          <motion.span
            className="word-reveal"
            initial={{ y: '110%' }}
            animate={isInView ? { y: '0%' } : {}}
            transition={{ duration: 0.7, delay: delay + i * 0.04, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

function CountUp({ value }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (!isInView) return
    const match = value.match(/^([^0-9]*)([\d.]+)(.*)$/)
    if (!match) { setDisplay(value); return }
    const [, prefix, numStr, suffix] = match
    const target = parseFloat(numStr)
    const decimalPlaces = numStr.includes('.') ? (numStr.split('.')[1] || '').length : 0
    const duration = 2000
    const startTime = performance.now()
    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      const current = eased * target
      setDisplay(prefix + (decimalPlaces > 0 ? current.toFixed(decimalPlaces) : Math.floor(current).toString()) + suffix)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, value])

  return <span ref={ref}>{display}</span>
}

function MagneticButton({ children, className = '', ...props }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 120, damping: 24 })
  const springY = useSpring(y, { stiffness: 120, damping: 24 })

  const textX = useTransform(springX, (val) => val * 0.5)
  const textY = useTransform(springY, (val) => val * 0.5)

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.08)
    y.set((e.clientY - cy) * 0.08)
  }

  return (
    <motion.a
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      {...props}
    >
      <motion.span style={{ x: textX, y: textY, display: 'inline-block' }}>
        {children}
      </motion.span>
    </motion.a>
  )
}

function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRX = useSpring(rotateX, { stiffness: 200, damping: 25 })
  const springRY = useSpring(rotateY, { stiffness: 200, damping: 25 })

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    rotateX.set(y * -8)
    rotateY.set(x * 8)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0) }}
      style={{ rotateX: springRX, rotateY: springRY, transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  )
}

function Marquee() {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="marquee-text">{marqueeText}</span>
        ))}
      </div>
    </div>
  )
}

function RevealSection({ id, className = '', children }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.08 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } },
      }}
    >
      {children}
    </motion.section>
  )
}

function SectionDivider() {
  return (
    <motion.div
      className="section-divider"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1, ease: EASE }}
    />
  )
}

function FloatingTile({ className = '', badge = 'AX' }) {
  return (
    <div className={`tile-wrap ${className}`}>
      <div className="tile-stack tile-layer-3" />
      <div className="tile-stack tile-layer-2" />
      <div className="tile-face">
        <div className="tile-emblem">
          <span>{badge}</span>
        </div>
      </div>
    </div>
  )
}

function AccordionItem({ item, open, onToggle }) {
  return (
    <motion.div
      layout="position"
      className={`faq-item ${open ? 'faq-item--open' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <button type="button" className="faq-trigger" onClick={onToggle}>
        <span>{item.question}</span>
        <motion.span
          className="faq-plus"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="faq-answer-wrap"
          >
            <p className="faq-answer">{item.answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 100, damping: 22, mass: 1 },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1, scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
}

const lineGrow = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1, ease: EASE } },
}

function GlowCard({ children, className = '' }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springX = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 150, damping: 20 })
  const springY = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 150, damping: 20 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const xVal = e.clientX - rect.left
    const yVal = e.clientY - rect.top
    setPos({ x: xVal, y: yVal })
    mouseX.set(xVal / rect.width)
    mouseY.set(yVal / rect.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      className={`glow-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--glow-x': `${pos.x}px`,
        '--glow-y': `${pos.y}px`,
        rotateX: springY,
        rotateY: springX,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Interactive Components ─── */

function AnimatedBorderCard({ children, className = '' }) {
  return (
    <div className={`anim-border-card ${className}`}>
      <div className="anim-border-glow" />
      <div className="anim-border-content">
        {children}
      </div>
    </div>
  )
}

function ProgressBar({ value, color, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <div ref={ref} className="progress-bar-track">
      <motion.div
        className="progress-bar-fill"
        initial={{ width: 0 }}
        animate={isInView ? { width: `${value}%` } : {}}
        transition={{ duration: 1.5, delay, ease: EASE }}
        style={{ background: color, position: 'relative' }}
      >
        <span className="progress-bar-bead" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
      </motion.div>
    </div>
  )
}

const OPERATIONAL_NODES = [
  {
    id: 'ingest',
    name: 'IoT INGEST HUB',
    status: 'ACTIVE',
    ip: '10.240.0.12',
    metrics: { rate: '1.8M/s', integrity: '99.98%', latency: '1.1ms', capacity: '42%' },
    x: 150,
    y: 60,
    color: 'var(--accent)'
  },
  {
    id: 'pipeline',
    name: 'NEURAL CORE PIPELINE',
    status: 'SYNCED',
    ip: '10.240.2.84',
    metrics: { rate: '2.4M/s', integrity: '100.00%', latency: '0.4ms', capacity: '68%' },
    x: 350,
    y: 60,
    color: 'var(--accent)'
  },
  {
    id: 'edge',
    name: 'EDGE COMPUTING CLUSTER',
    status: 'BALANCED',
    ip: '192.168.42.105',
    metrics: { rate: '1.2M/s', integrity: '99.95%', latency: '1.8ms', capacity: '31%' },
    x: 550,
    y: 60,
    color: '#818cf8'
  },
  {
    id: 'action',
    name: 'ACTION DISPATCH GATEWAY',
    status: 'READY',
    ip: '10.0.8.210',
    metrics: { rate: '0.8M/s', integrity: '99.99%', latency: '0.2ms', capacity: '15%' },
    x: 720,
    y: 60,
    color: '#34d399'
  }
]

function OperationalConsole() {
  const [activeTab, setActiveTab] = useState('topology')
  const [selectedNode, setSelectedNode] = useState(OPERATIONAL_NODES[0])
  const [simulatedLoad, setSimulatedLoad] = useState(65)
  const [terminalLogs, setTerminalLogs] = useState([
    { time: '19:01:02', type: 'INFO', text: 'Initializing AXIOM Operational Twin Core...' },
    { time: '19:01:04', type: 'SUCCESS', text: 'All operational interfaces online.' },
    { time: '19:01:08', type: 'INFO', text: 'Connecting to ingest sector [ING-A1]...' }
  ])

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (activeTab !== 'terminal') return
    const logTemplates = [
      { type: 'INFO', text: 'Ingest node integrity check completed successfully.' },
      { type: 'WARN', text: 'Telemetry fluctuation observed at Edge gateway sector 4.' },
      { type: 'SUCCESS', text: 'Auto-scaled GPU cluster allocation dynamically.' },
      { type: 'INFO', text: 'Predictive simulation completed. Confidence score: 98.42%.' },
      { type: 'ALERT', text: 'Network routing latency spike detected: 2.1ms.' },
      { type: 'RESOLVE', text: 'Rerouted pipeline load to standby edge router. Resolved latency.' },
      { type: 'SUCCESS', text: 'Zero data loss during hot-standby migration.' }
    ]
    
    const interval = setInterval(() => {
      const randomTemplate = logTemplates[Math.floor(Math.random() * logTemplates.length)]
      const now = new Date()
      const timeStr = now.toTimeString().split(' ')[0]
      setTerminalLogs(prev => {
        const next = [...prev, { time: timeStr, ...randomTemplate }]
        if (next.length > 25) next.shift() // keep last 25
        return next
      })
    }, 2000)
    
    return () => clearInterval(interval)
  }, [activeTab])

  return (
    <div className="console-container" ref={ref}>
      {/* macOS Header chrome dots */}
      <div className="console-header">
        <div className="dash-chrome-dots">
          <span className="dash-chrome-dot dash-chrome-dot--red" />
          <span className="dash-chrome-dot dash-chrome-dot--yellow" />
          <span className="dash-chrome-dot dash-chrome-dot--green" />
        </div>
        <div className="console-header-title">
          AXIOM TWIN // SYSTEM CONTROL CONSOLE v2.0
        </div>
        <div className="console-header-status">
          <span className="console-pulse-indicator" /> REAL-TIME CONNECTED
        </div>
      </div>
      
      {/* Main Console Split Pane */}
      <div className="console-body">
        {/* Left Navigation Sidebar */}
        <div className="console-sidebar">
          <div className="sidebar-group">
            <span className="sidebar-group-title">CONSOLE CONTROL</span>
            <div className="sidebar-nav">
              <button 
                className={`sidebar-nav-btn ${activeTab === 'topology' ? 'active' : ''}`}
                onClick={() => setActiveTab('topology')}
              >
                <span className="btn-mono">[ 01 ]</span> TOPOLOGY MAP
              </button>
              <button 
                className={`sidebar-nav-btn ${activeTab === 'simulation' ? 'active' : ''}`}
                onClick={() => setActiveTab('simulation')}
              >
                <span className="btn-mono">[ 02 ]</span> PREDICTIVE ENGINE
              </button>
              <button 
                className={`sidebar-nav-btn ${activeTab === 'terminal' ? 'active' : ''}`}
                onClick={() => setActiveTab('terminal')}
              >
                <span className="btn-mono">[ 03 ]</span> DIAGNOSTICS STREAM
              </button>
            </div>
          </div>
          
          <div className="sidebar-group separator">
            <span className="sidebar-group-title">SYSTEM STATUS</span>
            <div className="sidebar-status-list">
              <div className="status-item">
                <span className="status-item-label">INGEST RATE</span>
                <span className="status-item-val color-indigo">{(simulatedLoad * 43.1).toFixed(0)} KB/s</span>
              </div>
              <div className="status-item">
                <span className="status-item-label">CPU DRIFT</span>
                <span className="status-item-val">{(simulatedLoad * 0.002).toFixed(3)}%</span>
              </div>
              <div className="status-item">
                <span className="status-item-label">LATENCY</span>
                <span className="status-item-val color-green">1.82ms</span>
              </div>
              <div className="status-item">
                <span className="status-item-label">SYS HEALTH</span>
                <span className="status-item-val color-green">NOMINAL</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Central Visualizer Canvas */}
        <div className="console-canvas">
          <AnimatePresence mode="wait">
            {activeTab === 'topology' && (
              <motion.div 
                key="topology"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="canvas-inner"
              >
                <div className="canvas-header">
                  <span className="canvas-title">OPERATIONAL ARCHITECTURE TOPOLOGY</span>
                  <span className="canvas-subtitle">Click nodes to inspect technical properties</span>
                </div>
                <div className="topology-map-container">
                  <svg viewBox="0 0 800 160" className="topology-svg" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="node-line-gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    
                    {/* Connection routes */}
                    <motion.path 
                      d="M 150 80 H 720"
                      fill="none"
                      stroke="url(#node-line-gradient)"
                      strokeWidth="2"
                      strokeDasharray="8,6"
                      animate={{ strokeDashoffset: [-100, 0] }}
                      transition={{ repeat: Infinity, ease: "linear", duration: 10 }}
                    />
                    
                    {/* Animated packets moving between nodes */}
                    <motion.circle cx="150" cy="80" r="4" fill="var(--accent)"
                      animate={{ cx: [150, 350, 550, 720] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    />
                    <motion.circle cx="150" cy="80" r="4" fill="#818cf8"
                      animate={{ cx: [150, 350, 550, 720] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 1.3 }}
                    />
                    <motion.circle cx="150" cy="80" r="4" fill="#34d399"
                      animate={{ cx: [150, 350, 550, 720] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 2.6 }}
                    />

                    {/* Nodes */}
                    {OPERATIONAL_NODES.map((node) => {
                      const isSelected = selectedNode.id === node.id
                      return (
                        <g 
                          key={node.id} 
                          className={`topology-node-group ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedNode(node)}
                          style={{ cursor: 'pointer' }}
                        >
                          <circle 
                            cx={node.x} 
                            cy={80} 
                            r={isSelected ? 14 : 9} 
                            fill="var(--bg-base)" 
                            stroke={node.color} 
                            strokeWidth="2.5"
                            className="node-ring"
                          />
                          <circle 
                            cx={node.x} 
                            cy={80} 
                            r={isSelected ? 6 : 4} 
                            fill={node.color} 
                            className="node-core"
                          />
                          
                          {/* Label */}
                          <text
                            x={node.x}
                            y={125}
                            textAnchor="middle"
                            fill={isSelected ? '#fff' : 'var(--text-muted)'}
                            fontSize="9"
                            fontFamily="'IBM Plex Mono', monospace"
                            fontWeight={isSelected ? '600' : '400'}
                          >
                            {node.name}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </motion.div>
            )}

            {activeTab === 'simulation' && (
              <motion.div 
                key="simulation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="canvas-inner"
              >
                <div className="canvas-header">
                  <span className="canvas-title">PREDICTIVE SIMULATION OSCILLOSCOPE</span>
                  <span className="canvas-subtitle">Compare live actual vs. simulated outcomes</span>
                </div>
                
                {simulatedLoad > 85 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sim-alert-banner"
                  >
                    [ ALERT // CRITICAL ] PIPELINE LOAD EXCEEDS SAFETY MARGIN ({simulatedLoad}%)
                  </motion.div>
                )}

                <div className="waveform-sim-container">
                  <svg viewBox="0 0 800 150" className="topology-svg" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="actual-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="sim-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Background grid */}
                    <line x1="0" y1="75" x2="800" y2="75" stroke="var(--line)" strokeDasharray="3,3" />

                    {/* Actual data wave (static) */}
                    <path
                      d="M0,75 C100,30 200,120 300,75 C400,20 500,130 600,60 C700,10 800,75 L 800,150 L 0,150 Z"
                      fill="url(#actual-gradient)"
                    />
                    <path
                      d="M0,75 C100,30 200,120 300,75 C400,20 500,130 600,60 C700,10 800,75"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2"
                    />

                    {/* Simulated data wave (amplitude controlled dynamically by slider) */}
                    <path
                      d={`M0,75 C100,${75 - (simulatedLoad * 0.7)} 200,${75 + (simulatedLoad * 0.9)} 300,75 C400,${75 - (simulatedLoad * 1.1)} 500,${75 + (simulatedLoad * 0.8)} 600,75 C700,${75 - (simulatedLoad * 0.9)} 800,75 L 800,150 L 0,150 Z`}
                      fill="url(#sim-gradient)"
                      style={{ transition: 'd 0.1s ease-out' }}
                    />
                    <path
                      d={`M0,75 C100,${75 - (simulatedLoad * 0.7)} 200,${75 + (simulatedLoad * 0.9)} 300,75 C400,${75 - (simulatedLoad * 1.1)} 500,${75 + (simulatedLoad * 0.8)} 600,75 C700,${75 - (simulatedLoad * 0.9)} 800,75`}
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="1.5"
                      strokeDasharray="4,2"
                      style={{ transition: 'd 0.1s ease-out' }}
                    />
                  </svg>
                </div>

                <div className="slider-control-row">
                  <div className="slider-label-group">
                    <span className="slider-label">SIMULATE PIPELINE STRESS</span>
                    <span className="slider-value" style={{ color: simulatedLoad > 85 ? '#ff5f56' : 'var(--accent)' }}>
                      {simulatedLoad}% LOAD
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={simulatedLoad}
                    onChange={(e) => setSimulatedLoad(Number(e.target.value))}
                    className="console-slider"
                  />
                  <div className="slider-ticks">
                    <span>[ 10% IDLE ]</span>
                    <span>[ 50% HEALTHY ]</span>
                    <span>[ 100% EXTREME ]</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'terminal' && (
              <motion.div 
                key="terminal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="canvas-inner"
              >
                <div className="canvas-header">
                  <span className="canvas-title">DIAGNOSTIC LOG STREAM</span>
                  <span className="canvas-subtitle">Real-time system decision events and anomalies</span>
                </div>
                <div className="console-terminal">
                  <div className="terminal-scroller">
                    {terminalLogs.map((log, index) => {
                      let typeColor = 'var(--text-muted)'
                      if (log.type === 'SUCCESS') typeColor = '#34d399'
                      if (log.type === 'WARN') typeColor = 'var(--accent)'
                      if (log.type === 'ALERT') typeColor = '#ff5f56'
                      if (log.type === 'RESOLVE') typeColor = '#818cf8'

                      return (
                        <div key={index} className="terminal-line">
                          <span className="term-time">{log.time}</span>
                          <span className="term-type" style={{ color: typeColor }}>[{log.type}]</span>
                          <span className="term-text">{log.text}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Right Inspector Panel */}
        <div className="console-inspector">
          <div className="inspector-title-row">
            <span className="inspector-title">NODE INSPECTOR</span>
            <span className="inspector-pill">SYNCED</span>
          </div>
          
          <div className="inspector-card">
            <div className="inspector-node-name">{selectedNode.name}</div>
            <div className="inspector-node-ip">{selectedNode.ip}</div>
            
            <div className="inspector-grid">
              <div className="inspect-spec">
                <span className="inspect-spec-label">STATUS</span>
                <span className="inspect-spec-val color-green">{selectedNode.status}</span>
              </div>
              <div className="inspect-spec">
                <span className="inspect-spec-label">INTEGRITY</span>
                <span className="inspect-spec-val">{selectedNode.metrics.integrity}</span>
              </div>
              <div className="inspect-spec">
                <span className="inspect-spec-label">DATA RATE</span>
                <span className="inspect-spec-val color-indigo">
                  {activeTab === 'simulation' ? `${(simulatedLoad * 0.04).toFixed(2)} M/s` : selectedNode.metrics.rate}
                </span>
              </div>
              <div className="inspect-spec">
                <span className="inspect-spec-label">NODE LATENCY</span>
                <span className="inspect-spec-val">{selectedNode.metrics.latency}</span>
              </div>
              
              {/* Custom integrated Progress Bar with glowing bead */}
              <div className="inspect-spec full-width">
                <span className="inspect-spec-label">RESOURCE UTILISATION</span>
                <ProgressBar 
                  value={activeTab === 'simulation' ? simulatedLoad : parseInt(selectedNode.metrics.capacity)} 
                  color={selectedNode.color} 
                />
              </div>
            </div>
            
            <div className="inspector-footer">
              <div className="inspector-blueprint-box">
                <span className="blueprint-tag">MODEL GRAPHICS CORE</span>
                <div className="blueprint-visual">
                  <div className="blueprint-bar animate-blueprint-pulse" />
                  <div className="blueprint-bar animate-blueprint-pulse delay-1" />
                  <div className="blueprint-bar animate-blueprint-pulse delay-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Bento Widgets ─── */

function LatencyVisualizer() {
  const containerRef = useRef(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const cols = [30, 65, 100, 135, 170, 205, 240, 275]
  const rows = [25, 45, 65, 85, 105]

  const layerLatencies = [
    '0.42 ms',
    '0.65 ms',
    '0.88 ms',
    '1.05 ms',
    '1.24 ms',
    '1.45 ms',
    '1.62 ms',
    '1.84 ms'
  ]

  // Pre-calculate synapses connection mesh (connect col c to col c+1)
  const synapses = []
  for (let c = 0; c < cols.length - 1; c++) {
    for (let r = 0; r < rows.length; r++) {
      const targets = [r, r - 1, r + 1].filter(t => t >= 0 && t < rows.length)
      targets.forEach(t => {
        synapses.push({
          fromCol: c,
          fromRow: r,
          toCol: c + 1,
          toRow: t,
          key: `s-${c}-${r}-${t}`
        })
      })
    }
  }

  // Pre-compute SMIL opacity pulse values and keyTimes for each column
  const getPulseAnimation = (i) => {
    const p1 = i / 14
    const p2 = (14 - i) / 14
    
    if (i === 0) {
      return {
        keyTimes: "0; 0.08; 0.92; 1",
        values: "0.95; 0.2; 0.2; 0.95"
      }
    }
    if (i === 7) {
      return {
        keyTimes: "0; 0.42; 0.5; 0.58; 1",
        values: "0.2; 0.2; 0.95; 0.2; 0.2"
      }
    }
    
    const kt = [
      0,
      parseFloat((p1 - 0.05).toFixed(3)),
      parseFloat(p1.toFixed(3)),
      parseFloat((p1 + 0.05).toFixed(3)),
      parseFloat((p2 - 0.05).toFixed(3)),
      parseFloat(p2.toFixed(3)),
      parseFloat((p2 + 0.05).toFixed(3)),
      1
    ]
    const vals = [0.2, 0.2, 0.95, 0.2, 0.2, 0.95, 0.2, 0.2]
    return {
      keyTimes: kt.join('; '),
      values: vals.join('; ')
    }
  }

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    const currentX = percentage * 300 // SVG viewBox coordinates width is 300

    let closestIndex = 0
    let minDiff = Math.abs(currentX - cols[0])
    for (let i = 1; i < cols.length; i++) {
      const diff = Math.abs(currentX - cols[i])
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = i
      }
    }

    setHoveredIndex(closestIndex)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  const activeLatency = hoveredIndex !== null ? layerLatencies[hoveredIndex] : '1.24 ms'
  const activeLabel = hoveredIndex !== null ? `LAYER ${hoveredIndex + 1} //` : 'SPEED //'

  return (
    <div 
      ref={containerRef} 
      className="widget-latency" 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
    >
      {/* Premium Header Bar (Prevents text clipping) */}
      <div className="latency-header-bar">
        <div className="latency-title-segment">
          <span className="latency-status-dot pulsing" />
          <span>INFERENCE // NEURAL_LATTICE</span>
        </div>
        <div className="latency-value-segment">
          <span className="latency-label">{activeLabel}</span>
          <span className="latency-val-glow">{activeLatency}</span>
        </div>
      </div>

      <div className="latency-chart-container">
        <svg viewBox="0 0 300 130" className="widget-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="latency-scan-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
              <stop offset="50%" stopColor="rgba(99, 102, 241, 0.35)" />
              <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
            </linearGradient>
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Coordinate system backdrop grid */}
          <g className="latency-grid-lines" opacity="0.45">
            {/* Horizontal major lines */}
            <line x1="0" y1="25" x2="300" y2="25" stroke="rgba(99, 102, 241, 0.03)" strokeWidth="0.8" strokeDasharray="1 2" />
            <line x1="0" y1="45" x2="300" y2="45" stroke="rgba(99, 102, 241, 0.03)" strokeWidth="0.8" strokeDasharray="1 2" />
            <line x1="0" y1="65" x2="300" y2="65" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="0.8" />
            <line x1="0" y1="85" x2="300" y2="85" stroke="rgba(99, 102, 241, 0.03)" strokeWidth="0.8" strokeDasharray="1 2" />
            <line x1="0" y1="105" x2="300" y2="105" stroke="rgba(99, 102, 241, 0.03)" strokeWidth="0.8" strokeDasharray="1 2" />
          </g>

          {/* Synapse Connection Paths */}
          {synapses.map(s => {
            const isHighlighted = hoveredIndex !== null && (s.fromCol === hoveredIndex || s.toCol === hoveredIndex);
            return (
              <line
                key={s.key}
                x1={cols[s.fromCol]}
                y1={rows[s.fromRow]}
                x2={cols[s.toCol]}
                y2={rows[s.toRow]}
                stroke="var(--accent)"
                strokeWidth={isHighlighted ? "0.8" : "0.5"}
                opacity={isHighlighted ? "0.15" : "0.015"}
                style={{ transition: 'opacity 0.3s ease, stroke-width 0.3s ease' }}
              />
            )
          })}

          {/* Active Scanner Line (sweeps left to right) */}
          {hoveredIndex === null && (
            <line
              x1="0"
              y1="10"
              x2="0"
              y2="120"
              stroke="url(#latency-scan-grad)"
              strokeWidth="1.5"
              pointerEvents="none"
            >
              <animate attributeName="x1" values="30;275;30" dur="4s" repeatCount="indefinite" />
              <animate attributeName="x2" values="30;275;30" dur="4s" repeatCount="indefinite" />
            </line>
          )}

          {/* Hover Snapped Column Focus Line */}
          {hoveredIndex !== null && (
            <line
              x1={cols[hoveredIndex]}
              y1="10"
              x2={cols[hoveredIndex]}
              y2="120"
              stroke="rgba(99, 102, 241, 0.25)"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              pointerEvents="none"
            />
          )}

          {/* Nodes Grid */}
          {cols.map((colX, c) => {
            const anim = getPulseAnimation(c);
            const isColumnHovered = hoveredIndex === c;
            
            return rows.map((rowY, r) => {
              const nodeKey = `n-${c}-${r}`;
              return (
                <circle
                  key={nodeKey}
                  cx={colX}
                  cy={rowY}
                  r={isColumnHovered ? 3.5 : 2}
                  fill={isColumnHovered ? "var(--text-primary)" : "var(--accent)"}
                  filter={isColumnHovered ? "url(#node-glow)" : undefined}
                  opacity={hoveredIndex === null ? undefined : (isColumnHovered ? 1 : 0.15)}
                  style={{ transition: 'r 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), fill 0.3s ease, opacity 0.3s ease' }}
                >
                  {hoveredIndex === null && (
                    <animate
                      attributeName="opacity"
                      values={anim.values}
                      keyTimes={anim.keyTimes}
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              )
            })
          })}
        </svg>
      </div>

      {/* Glassmorphic floating statistics table (bottom center) */}
      <div className="latency-status-pill">
        <div className="latency-stat">
          <span className="latency-stat-dot" />
          <span>CORES // 256 ACTIVE</span>
        </div>
        <div className="latency-stat">
          <span>JITTER // 0.02ms</span>
        </div>
        <div className="latency-stat">
          <span>SLO // 99.98%</span>
        </div>
      </div>
    </div>
  )
}


function SecurityShield() {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="widget-security"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="security-visual-container">
        <svg viewBox="0 0 100 100" className="security-svg-canvas" style={{ width: '100%', height: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="shield-glass-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(15, 15, 25, 0.85)" />
              <stop offset="100%" stopColor="rgba(8, 8, 14, 0.96)" />
            </linearGradient>
            <radialGradient id="sentinel-glow-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#a5b4fc" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
            <filter id="shield-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Single Sentinel Orbit Guide Line */}
          <circle 
            cx="50" 
            cy="50" 
            r="38" 
            fill="none" 
            stroke={hovered ? "rgba(99, 102, 241, 0.25)" : "var(--line)"} 
            strokeWidth="0.8" 
            style={{ transition: 'stroke 0.4s ease' }} 
          />

          {/* Rotating Sentinel Guardian Pulse Group */}
          <g className="sentinel-orbit-group">
            {/* Outer soft bloom */}
            <circle 
              cx="50" 
              cy="12" 
              r="6.5" 
              fill="url(#sentinel-glow-grad)" 
              style={{ opacity: hovered ? 1 : 0.6, transition: 'opacity 0.4s ease' }} 
            />
            {/* Core sentinel particle */}
            <circle 
              cx="50" 
              cy="12" 
              r="1.8" 
              fill="#a5b4fc" 
            />
          </g>

          {/* Central Pristine Glassmorphic Shield */}
          <g className="security-core-group">
            {/* Outer Shield Shell */}
            <path 
              d="M 50 30 L 65 34 V 52 C 65 64 50 72 50 72 C 50 72 35 64 35 52 V 34 Z" 
              fill="url(#shield-glass-fill)" 
              stroke="url(#shield-grad)" 
              strokeWidth="1.2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              filter="url(#shield-glow)"
              style={{ 
                stroke: hovered ? "url(#shield-grad)" : "rgba(99, 102, 241, 0.4)",
                transition: 'stroke 0.4s ease' 
              }}
            />
            
            {/* Inner nested outline */}
            <path 
              d="M 50 35 L 60 38 V 50 C 60 59 50 65 50 65 C 50 65 40 59 40 50 V 38 Z" 
              fill="none" 
              stroke="url(#shield-grad)" 
              strokeWidth="0.6" 
              opacity={hovered ? 0.45 : 0.2}
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ transition: 'opacity 0.4s ease' }}
            />
            
            {/* Fine Vertical Facet Divider */}
            <line 
              x1="50" 
              y1="30" 
              x2="50" 
              y2="72" 
              stroke="url(#shield-grad)" 
              strokeWidth="0.5" 
              opacity="0.15" 
            />

            {/* Slow Breathing Keyhole Core */}
            <g className="security-keyhole-breath">
              <circle cx="50" cy="46.5" r="1.8" fill="url(#shield-grad)" />
              <path d="M 48.8 47.8 L 51.2 47.8 L 51.8 52.2 L 48.2 52.2 Z" fill="url(#shield-grad)" />
              <circle cx="50" cy="48" r="6" fill="url(#sentinel-glow-grad)" opacity={hovered ? 0.35 : 0.15} style={{ transition: 'opacity 0.4s ease' }} />
            </g>
          </g>
        </svg>
      </div>

      <div className="security-status-badge" style={{
        borderColor: hovered ? 'var(--accent)' : 'var(--line-subtle)',
        background: hovered ? 'rgba(99, 102, 241, 0.04)' : 'rgba(255,255,255,0.01)',
        transition: 'all 0.4s ease',
        cursor: 'default'
      }}>
        <span className="security-status-dot" style={{
          background: hovered ? 'var(--accent-light)' : 'var(--accent)',
          boxShadow: hovered ? '0 0 12px var(--accent-light)' : '0 0 8px var(--accent)'
        }} />
        <span className="security-status-text" style={{
          color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontFamily: 'IBM Plex Mono',
          fontSize: '7.5px',
          letterSpacing: '0.08em',
          transition: 'color 0.4s ease'
        }}>
          {hovered ? 'PROTOCOL ACTIVE // SECURE' : 'AES-256 SYSTEM PROTECTED'}
        </span>
      </div>
    </div>
  )
}

function TelemetryWaveform() {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="widget-telemetry"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="telemetry-chart-container">
        <svg viewBox="0 0 280 130" className="telemetry-wave-svg" preserveAspectRatio="none">
          <defs>
            {/* Linear gradients for waves */}
            <linearGradient id="telemetry-wave-alpha" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="telemetry-wave-beta" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.15)" />
              <stop offset="50%" stopColor="rgba(14, 165, 233, 0.25)" />
              <stop offset="100%" stopColor="rgba(99, 102, 241, 0.15)" />
            </linearGradient>
            <linearGradient id="telemetry-scan-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
              <stop offset="50%" stopColor="rgba(99, 102, 241, 0.5)" />
              <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
            </linearGradient>
            
            {/* Soft glow filter */}
            <filter id="telemetry-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Coordinate system grid lines */}
          <g className="telemetry-grid-lines" opacity="0.75">
            {/* Horizontal major lines */}
            <line x1="10" y1="30" x2="270" y2="30" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" strokeDasharray="2 3" />
            <line x1="10" y1="65" x2="270" y2="65" stroke="rgba(99, 102, 241, 0.08)" strokeWidth="0.8" />
            <line x1="10" y1="100" x2="270" y2="100" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" strokeDasharray="2 3" />

            {/* Vertical grid lines */}
            <line x1="45" y1="15" x2="45" y2="115" stroke="rgba(99, 102, 241, 0.03)" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="90" y1="15" x2="90" y2="115" stroke="rgba(99, 102, 241, 0.03)" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="135" y1="15" x2="135" y2="115" stroke="rgba(99, 102, 241, 0.05)" strokeWidth="0.8" />
            <line x1="180" y1="15" x2="180" y2="115" stroke="rgba(99, 102, 241, 0.03)" strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="225" y1="15" x2="225" y2="115" stroke="rgba(99, 102, 241, 0.03)" strokeWidth="0.8" strokeDasharray="2 2" />
          </g>

          {/* Primary Wave: Alpha */}
          <path
            fill="none"
            stroke="url(#telemetry-wave-alpha)"
            strokeWidth={hovered ? "1.8" : "1.2"}
            filter="url(#telemetry-glow)"
            style={{ transition: 'stroke-width 0.4s ease' }}
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values={
                hovered 
                  ? `
                    M 10 65 C 50 30, 80 100, 120 65 C 160 30, 200 100, 240 65 C 255 45, 265 85, 270 65;
                    M 10 65 C 50 100, 80 30, 120 65 C 160 100, 200 30, 240 65 C 255 85, 265 45, 270 65;
                    M 10 65 C 50 30, 80 100, 120 65 C 160 30, 200 100, 240 65 C 255 45, 265 85, 270 65
                  `
                  : `
                    M 10 65 C 50 45, 80 85, 120 65 C 160 45, 200 85, 240 65 C 255 55, 265 75, 270 65;
                    M 10 65 C 50 85, 80 45, 120 65 C 160 85, 200 45, 240 65 C 255 75, 265 55, 270 65;
                    M 10 65 C 50 45, 80 85, 120 65 C 160 45, 200 85, 240 65 C 255 55, 265 75, 270 65
                  `
              }
            />
          </path>

          {/* Secondary Wave: Beta (dimmer offset) */}
          <path
            fill="none"
            stroke="url(#telemetry-wave-beta)"
            strokeWidth="0.8"
          >
            <animate
              attributeName="d"
              dur="6s"
              repeatCount="indefinite"
              values={
                hovered
                  ? `
                    M 10 65 C 40 85, 70 45, 110 65 C 150 85, 190 45, 230 65 C 250 80, 260 50, 270 65;
                    M 10 65 C 40 45, 70 85, 110 65 C 150 45, 190 85, 230 65 C 250 50, 260 80, 270 65;
                    M 10 65 C 40 85, 70 45, 110 65 C 150 85, 190 45, 230 65 C 250 80, 260 50, 270 65
                  `
                  : `
                    M 10 65 C 40 75, 70 55, 110 65 C 150 75, 190 55, 230 65 C 250 70, 260 60, 270 65;
                    M 10 65 C 40 55, 70 75, 110 65 C 150 55, 190 75, 230 65 C 250 60, 260 70, 270 65;
                    M 10 65 C 40 75, 70 55, 110 65 C 150 75, 190 55, 230 65 C 250 70, 260 60, 270 65
                  `
              }
            />
          </path>

          {/* Sweeping Vertical Scanning probe */}
          <g>
            <line
              x1="0"
              y1="15"
              x2="0"
              y2="115"
              stroke="url(#telemetry-scan-grad)"
              strokeWidth={hovered ? "1.5" : "1.0"}
              style={{ transition: 'stroke-width 0.4s ease' }}
            >
              <animate
                attributeName="x1"
                values="10; 270; 10"
                dur={hovered ? "4s" : "6s"}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              />
              <animate
                attributeName="x2"
                values="10; 270; 10"
                dur={hovered ? "4s" : "6s"}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              />
            </line>
            
            {/* Soft scan head dot intersecting primary wave area */}
            <circle
              r="2.5"
              fill="#a5b4fc"
              filter="url(#telemetry-glow)"
              opacity={hovered ? "0.95" : "0.75"}
              style={{ transition: 'opacity 0.4s ease' }}
            >
              <animate
                attributeName="cx"
                values="10; 270; 10"
                dur={hovered ? "4s" : "6s"}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              />
              <animate
                attributeName="cy"
                values="65; 65; 65"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>

        {/* Floating status pill */}
        <div className="telemetry-status-pill">
          <div className="telemetry-stat">
            <span className="telemetry-stat-dot" />
            <span>SYNC // ACTIVE</span>
          </div>
          <div className="telemetry-stat">
            <span>JITTER // 0.04ms</span>
          </div>
          <div className="telemetry-stat">
            <span>LOSS // 0.00%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function IsometricComputeStack() {
  const [hovered, setHovered] = useState(false)

  return (
    <div 
      className="widget-compute"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="compute-stack-container">
        {/* Layer 3 (Top) */}
        <motion.div 
          className="compute-layer compute-layer--top"
          animate={{ y: hovered ? -32 : 0 }}
          transition={SPRING}
        >
          <div className="compute-chip-surface">
            <span className="compute-led" />
            <span className="compute-led compute-led--indigo" />
          </div>
        </motion.div>

        {/* Laser Connection Pillars */}
        <motion.div 
          className="compute-connection-beams"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 0.8 : 0, scaleY: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="beam beam-1" />
          <div className="beam beam-2" />
          <div className="beam beam-3" />
        </motion.div>

        {/* Layer 2 (Middle) */}
        <motion.div 
          className="compute-layer compute-layer--middle"
          animate={{ y: hovered ? -10 : 0 }}
          transition={SPRING}
        >
          <div className="compute-chip-surface">
            <span className="compute-led compute-led--green" />
            <span className="compute-led" />
          </div>
        </motion.div>

        {/* Layer 1 (Bottom) */}
        <motion.div 
          className="compute-layer compute-layer--bottom"
          animate={{ y: hovered ? 12 : 0 }}
          transition={SPRING}
        >
          <div className="compute-chip-surface">
            <span className="compute-led" />
            <span className="compute-led compute-led--indigo" />
          </div>
        </motion.div>
      </div>

      <div className="compute-scale-indicator">
        <span className="compute-scale-label">DYNAMIC GPU CORES:</span>
        <motion.span className="compute-scale-val">
          {hovered ? '10x BURST ACTIVE' : '1x IDLE'}
        </motion.span>
      </div>
    </div>
  )
}

function GlobalEdgeNetwork() {
  return (
    <div className="widget-edge">
      <div className="edge-map-container">
        <svg viewBox="0 0 280 130" className="edge-map-svg">
          <defs>
            <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="pillar-stem-grad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
              <stop offset="100%" stopColor="rgba(99, 102, 241, 0.65)" />
            </linearGradient>
            <radialGradient id="packet-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#c7d2fe" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Holographic Isometric floor mesh & pillars */}
          <g className="edge-grid-group">
            {/* Isometric grid lines (faint indigo floor) */}
            <g opacity="0.4">
              {/* Row lines */}
              <path d="M 140 30 L 220 70" fill="none" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" />
              <path d="M 120 40 L 200 80" fill="none" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" />
              <path d="M 100 50 L 180 90" fill="none" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" />
              <path d="M 80 60 L 160 100" fill="none" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" />
              <path d="M 60 70 L 140 110" fill="none" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" />

              {/* Column lines */}
              <path d="M 140 30 L 60 70" fill="none" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" />
              <path d="M 160 40 L 80 80" fill="none" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" />
              <path d="M 180 50 L 100 90" fill="none" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" />
              <path d="M 200 60 L 120 100" fill="none" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" />
              <path d="M 220 70 L 140 110" fill="none" stroke="rgba(99, 102, 241, 0.04)" strokeWidth="0.8" />
            </g>

            {/* Connection routing paths (floating in 3D perspective between pillar top caps) */}
            <path className="edge-route-line" d="M 80 40 Q 110 30, 140 30" fill="none" />
            <path className="edge-route-line" d="M 140 30 Q 170 30, 200 40" fill="none" />
            <path className="edge-route-line" d="M 200 40 Q 170 60, 140 70" fill="none" />
            <path className="edge-route-line" d="M 140 70 Q 110 60, 80 40" fill="none" />
            <path className="edge-route-line" d="M 140 30 L 140 70" fill="none" />
            <path className="edge-route-line" d="M 80 40 Q 140 35, 200 40" fill="none" />

            {/* Hardware-accelerated floating data packet streams */}
            <g filter="url(#glow-filter)" opacity="0.85">
              <circle r="1.4" fill="#a5b4fc">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 80 40 Q 110 30, 140 30" />
              </circle>
              <circle r="1.4" fill="#a5b4fc">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 140 30 Q 170 30, 200 40" />
              </circle>
              <circle r="1.4" fill="#a5b4fc">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M 200 40 Q 170 60, 140 70" />
              </circle>
              <circle r="1.4" fill="#a5b4fc">
                <animateMotion dur="2.7s" repeatCount="indefinite" path="M 140 70 Q 110 60, 80 40" />
              </circle>
              <circle r="1.2" fill="#a5b4fc">
                <animateMotion dur="1.8s" repeatCount="indefinite" path="M 140 30 L 140 70" />
              </circle>
              <circle r="1.2" fill="#a5b4fc">
                <animateMotion dur="3.2s" repeatCount="indefinite" path="M 80 40 Q 140 35, 200 40" />
              </circle>
            </g>

            {/* Server Pillars & Staggered perspective base beacon pulses */}
            {/* Pillar 1 (Left): base (80,60), top (80,40) */}
            <g>
              <ellipse cx="80" cy="60" rx="4" ry="2" fill="none" stroke="url(#edge-grad)" strokeWidth="0.6">
                <animate attributeName="rx" values="4;16" dur="3s" repeatCount="indefinite" />
                <animate attributeName="ry" values="2;8" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.65;0" dur="3s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="80" cy="60" rx="4" ry="2" fill="none" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.8" />
              <line x1="80" y1="60" x2="80" y2="40" stroke="url(#pillar-stem-grad)" strokeWidth="1.2" />
              <circle cx="80" cy="40" r="1.8" fill="#a5b4fc" filter="url(#glow-filter)" />
              <circle cx="80" cy="40" r="4.5" fill="url(#packet-glow)" opacity="0.3" />
            </g>

            {/* Pillar 2 (Top): base (140,50), top (140,30) */}
            <g>
              <ellipse cx="140" cy="50" rx="4" ry="2" fill="none" stroke="url(#edge-grad)" strokeWidth="0.6">
                <animate attributeName="rx" values="4;16" begin="0.75s" dur="3s" repeatCount="indefinite" />
                <animate attributeName="ry" values="2;8" begin="0.75s" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.65;0" begin="0.75s" dur="3s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="140" cy="50" rx="4" ry="2" fill="none" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.8" />
              <line x1="140" y1="50" x2="140" y2="30" stroke="url(#pillar-stem-grad)" strokeWidth="1.2" />
              <circle cx="140" cy="30" r="1.8" fill="#a5b4fc" filter="url(#glow-filter)" />
              <circle cx="140" cy="30" r="4.5" fill="url(#packet-glow)" opacity="0.3" />
            </g>

            {/* Pillar 3 (Right): base (200,60), top (200,40) */}
            <g>
              <ellipse cx="200" cy="60" rx="4" ry="2" fill="none" stroke="url(#edge-grad)" strokeWidth="0.6">
                <animate attributeName="rx" values="4;16" begin="1.5s" dur="3s" repeatCount="indefinite" />
                <animate attributeName="ry" values="2;8" begin="1.5s" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.65;0" begin="1.5s" dur="3s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="200" cy="60" rx="4" ry="2" fill="none" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.8" />
              <line x1="200" y1="60" x2="200" y2="40" stroke="url(#pillar-stem-grad)" strokeWidth="1.2" />
              <circle cx="200" cy="40" r="1.8" fill="#a5b4fc" filter="url(#glow-filter)" />
              <circle cx="200" cy="40" r="4.5" fill="url(#packet-glow)" opacity="0.3" />
            </g>

            {/* Pillar 4 (Bottom): base (140,90), top (140,70) */}
            <g>
              <ellipse cx="140" cy="90" rx="4" ry="2" fill="none" stroke="url(#edge-grad)" strokeWidth="0.6">
                <animate attributeName="rx" values="4;16" begin="2.25s" dur="3s" repeatCount="indefinite" />
                <animate attributeName="ry" values="2;8" begin="2.25s" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.65;0" begin="2.25s" dur="3s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="140" cy="90" rx="4" ry="2" fill="none" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.8" />
              <line x1="140" y1="90" x2="140" y2="70" stroke="url(#pillar-stem-grad)" strokeWidth="1.2" />
              <circle cx="140" cy="70" r="1.8" fill="#a5b4fc" filter="url(#glow-filter)" />
              <circle cx="140" cy="70" r="4.5" fill="url(#packet-glow)" opacity="0.3" />
            </g>
          </g>
        </svg>

        {/* Floating Translucent Glass status capsule */}
        <div className="edge-status-pill">
          <div className="ping-location">
            <span className="ping-dot" />
            <span>US-EAST · 8ms</span>
          </div>
          <div className="ping-location">
            <span className="ping-dot" />
            <span>EU-WEST · 12ms</span>
          </div>
          <div className="ping-location">
            <span className="ping-dot" />
            <span>AP-SOUTH · 18ms</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const STARDUST_COUNT = 15;
const stardustBase = Array.from({ length: STARDUST_COUNT }).map((_, i) => {
  const t = 0.08 + (i / (STARDUST_COUNT - 1)) * 0.84; // t from 0.08 to 0.92
  
  // Idle coordinates scattered nicely across the canvas
  const angle = (i / STARDUST_COUNT) * Math.PI * 2;
  const dist = 55 + (i % 3) * 35;
  const idleX = Math.max(30, Math.min(470, 250 + Math.cos(angle) * dist));
  const idleY = Math.max(20, Math.min(140, 80 + Math.sin(angle) * dist * 0.7));

  // Calculate curve target coordinates
  // LLM Q-curve: P0(250,80), P1(180,40), P2(110,40)
  const llmX = 250 * Math.pow(1 - t, 2) + 2 * 180 * t * (1 - t) + 110 * Math.pow(t, 2);
  const llmY = 80 * Math.pow(1 - t, 2) + 2 * 40 * t * (1 - t) + 40 * Math.pow(t, 2);

  // Vision straight: 250 -> 110 at y=80
  const visionX = 250 - 140 * t;
  const visionY = 80;

  // Agents Q-curve: P0(250,80), P1(180,120), P2(110,120)
  const agentsX = 250 * Math.pow(1 - t, 2) + 2 * 180 * t * (1 - t) + 110 * Math.pow(t, 2);
  const agentsY = 80 * Math.pow(1 - t, 2) + 2 * 120 * t * (1 - t) + 120 * Math.pow(t, 2);

  return {
    id: i,
    idleX,
    idleY,
    llmX,
    llmY,
    visionX,
    visionY,
    agentsX,
    agentsY,
    offsetX: (i % 2 === 0 ? 1 : -1) * (2 + (i % 3)),
    offsetY: (i % 2 === 0 ? -1 : 1) * (2 + (i % 2))
  };
});

function NeuralRouter() {
  const [hoveredNode, setHoveredNode] = useState(null)
  const [recoilState, setRecoilState] = useState(false)
  const [scrambledTexts, setScrambledTexts] = useState({
    llm: '[ RTT: 1.2ms // COG_01 ]',
    vision: '[ FPS: 120 // CAP_02 ]',
    agents: '[ THREADS: 16 // ORCH_03 ]'
  })

  const handleMouseEnter = (node, targetText) => {
    setHoveredNode(node);
    setRecoilState(true);
    setTimeout(() => setRecoilState(false), 500);

    // Sub-pixel Telemetry Text Scramble Effect
    let iterations = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*@[]_//';
    const interval = setInterval(() => {
      setScrambledTexts(prev => ({
        ...prev,
        [node]: targetText.split('').map((char, index) => {
          if (char === ' ' || char === '[' || char === ']' || char === ':') return char;
          if (index < iterations) return targetText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      }));
      iterations += 1.5;
      if (iterations >= targetText.length) {
        clearInterval(interval);
        setScrambledTexts(prev => ({ ...prev, [node]: targetText }));
      }
    }, 30);
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div className="widget-router">
      <div className="router-diagram-container">
        <svg viewBox="0 0 500 160" className="router-svg">
          <defs>
            <linearGradient id="llm-glow" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="vision-glow" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="agents-glow" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <filter id="plasma-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Faint ambient stardust magnetically captured on hover */}
          {stardustBase.map(p => {
            let targetX = p.idleX;
            let targetY = p.idleY;
            
            if (hoveredNode === 'llm') {
              targetX = p.llmX + p.offsetX;
              targetY = p.llmY + p.offsetY;
            } else if (hoveredNode === 'vision') {
              targetX = p.visionX + p.offsetX;
              targetY = p.visionY + p.offsetY;
            } else if (hoveredNode === 'agents') {
              targetX = p.agentsX + p.offsetX;
              targetY = p.agentsY + p.offsetY;
            }

            return (
              <circle
                key={p.id}
                cx={targetX}
                cy={targetY}
                r="1.2"
                fill={hoveredNode === 'llm' ? 'url(#llm-glow)' : hoveredNode === 'vision' ? 'url(#vision-glow)' : hoveredNode === 'agents' ? 'url(#agents-glow)' : 'var(--accent)'}
                className="stardust-particle"
                style={{
                  opacity: hoveredNode ? 0.65 : 0.15,
                  transition: hoveredNode 
                    ? 'cx 0.6s cubic-bezier(0.25, 1, 0.5, 1), cy 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease' 
                    : 'cx 1.4s cubic-bezier(0.25, 0.1, 0.25, 1), cy 1.4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1.4s ease',
                }}
              />
            );
          })}

          {/* Paths connecting center hub to outer destinations */}
          {/* Path 1: Core -> LLMs */}
          <path 
            d="M 250 80 Q 180 40, 110 40" 
            fill="none" 
            stroke={hoveredNode === 'llm' ? 'url(#llm-glow)' : 'var(--line)'} 
            strokeWidth={hoveredNode === 'llm' ? '2' : '1'} 
            style={{ transition: 'stroke 0.4s ease, stroke-width 0.4s ease', opacity: hoveredNode && hoveredNode !== 'llm' ? 0.3 : 1 }}
          />
          {(hoveredNode === null || hoveredNode === 'llm') && (
            <>
              <path 
                d="M 250 80 Q 180 40, 110 40" 
                fill="none" 
                stroke="url(#llm-glow)" 
                strokeWidth="2.5"
                strokeDasharray="40 180"
                filter="url(#plasma-glow)"
                style={{
                  opacity: hoveredNode === 'llm' ? 1 : 0.3,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="220;0"
                  dur={hoveredNode === 'llm' ? "1.6s" : "3.2s"}
                  repeatCount="indefinite"
                  keyTimes="0;1"
                  keySplines="0.25 0.1 0.25 1"
                  calcMode="spline"
                />
              </path>
              <path 
                d="M 250 80 Q 180 40, 110 40" 
                fill="none" 
                stroke="url(#llm-glow)" 
                strokeWidth="1.8"
                strokeDasharray="25 180"
                style={{
                  opacity: hoveredNode === 'llm' ? 0.7 : 0.15,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="220;0"
                  begin={hoveredNode === 'llm' ? "0.8s" : "1.6s"}
                  dur={hoveredNode === 'llm' ? "1.6s" : "3.2s"}
                  repeatCount="indefinite"
                  keyTimes="0;1"
                  keySplines="0.25 0.1 0.25 1"
                  calcMode="spline"
                />
              </path>
            </>
          )}

          {/* Path 2: Core -> Vision */}
          <path 
            d="M 250 80 H 110" 
            fill="none" 
            stroke={hoveredNode === 'vision' ? 'url(#vision-glow)' : 'var(--line)'} 
            strokeWidth={hoveredNode === 'vision' ? '2' : '1'} 
            style={{ transition: 'stroke 0.4s ease, stroke-width 0.4s ease', opacity: hoveredNode && hoveredNode !== 'vision' ? 0.3 : 1 }}
          />
          {(hoveredNode === null || hoveredNode === 'vision') && (
            <>
              <path 
                d="M 250 80 H 110" 
                fill="none" 
                stroke="url(#vision-glow)" 
                strokeWidth="2.5"
                strokeDasharray="40 180"
                filter="url(#plasma-glow)"
                style={{
                  opacity: hoveredNode === 'vision' ? 1 : 0.3,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="220;0"
                  dur={hoveredNode === 'vision' ? "1.6s" : "3.2s"}
                  repeatCount="indefinite"
                  keyTimes="0;1"
                  keySplines="0.25 0.1 0.25 1"
                  calcMode="spline"
                />
              </path>
              <path 
                d="M 250 80 H 110" 
                fill="none" 
                stroke="url(#vision-glow)" 
                strokeWidth="1.8"
                strokeDasharray="25 180"
                style={{
                  opacity: hoveredNode === 'vision' ? 0.7 : 0.15,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="220;0"
                  begin={hoveredNode === 'vision' ? "0.8s" : "1.6s"}
                  dur={hoveredNode === 'vision' ? "1.6s" : "3.2s"}
                  repeatCount="indefinite"
                  keyTimes="0;1"
                  keySplines="0.25 0.1 0.25 1"
                  calcMode="spline"
                />
              </path>
            </>
          )}

          {/* Path 3: Core -> Agents */}
          <path 
            d="M 250 80 Q 180 120, 110 120" 
            fill="none" 
            stroke={hoveredNode === 'agents' ? 'url(#agents-glow)' : 'var(--line)'} 
            strokeWidth={hoveredNode === 'agents' ? '2' : '1'} 
            style={{ transition: 'stroke 0.4s ease, stroke-width 0.4s ease', opacity: hoveredNode && hoveredNode !== 'agents' ? 0.3 : 1 }}
          />
          {(hoveredNode === null || hoveredNode === 'agents') && (
            <>
              <path 
                d="M 250 80 Q 180 120, 110 120" 
                fill="none" 
                stroke="url(#agents-glow)" 
                strokeWidth="2.5"
                strokeDasharray="40 180"
                filter="url(#plasma-glow)"
                style={{
                  opacity: hoveredNode === 'agents' ? 1 : 0.3,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="220;0"
                  dur={hoveredNode === 'agents' ? "1.6s" : "3.2s"}
                  repeatCount="indefinite"
                  keyTimes="0;1"
                  keySplines="0.25 0.1 0.25 1"
                  calcMode="spline"
                />
              </path>
              <path 
                d="M 250 80 Q 180 120, 110 120" 
                fill="none" 
                stroke="url(#agents-glow)" 
                strokeWidth="1.8"
                strokeDasharray="25 180"
                style={{
                  opacity: hoveredNode === 'agents' ? 0.7 : 0.15,
                  transition: 'opacity 0.4s ease',
                }}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="220;0"
                  begin={hoveredNode === 'agents' ? "0.8s" : "1.6s"}
                  dur={hoveredNode === 'agents' ? "1.6s" : "3.2s"}
                  repeatCount="indefinite"
                  keyTimes="0;1"
                  keySplines="0.25 0.1 0.25 1"
                  calcMode="spline"
                />
              </path>
            </>
          )}

          {/* Central AXIOM Core Node */}
          {hoveredNode && (
            <circle
              cx="250"
              cy="80"
              r="9"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              className="router-core-ripple"
              style={{ transformOrigin: '250px 80px' }}
            />
          )}

          <circle 
            cx="250" 
            cy="80" 
            r="18" 
            fill="none" 
            stroke="var(--accent)" 
            strokeWidth="0.8" 
            className={recoilState ? "router-core-recoil" : "router-core-breath"} 
            style={{ transformOrigin: '250px 80px' }} 
          />
          <circle cx="250" cy="80" r="9" fill="var(--bg-raised)" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="1.5" />
          <circle cx="250" cy="80" r="4" fill="var(--accent)" />

          {/* Destination Nodes */}
          {/* LLM Node */}
          <g 
            className="router-dest-node"
            onMouseEnter={() => handleMouseEnter('llm', '[ RTT: 1.2ms // COG_01 ]')}
            onMouseLeave={handleMouseLeave}
            style={{ opacity: hoveredNode && hoveredNode !== 'llm' ? 0.35 : 1, transition: 'opacity 0.4s ease' }}
          >
            <circle cx="110" cy="40" r="9" fill="var(--bg-surface)" stroke={hoveredNode === 'llm' ? '#0ea5e9' : 'var(--line)'} strokeWidth="1" style={{ transition: 'stroke 0.4s ease' }} />
            <circle cx="110" cy="40" r="3" fill={hoveredNode === 'llm' ? '#7dd3fc' : 'rgba(14, 165, 233, 0.25)'} style={{ transition: 'fill 0.4s ease' }} />
            <text x="88" y="38" fill={hoveredNode === 'llm' ? 'var(--text-primary)' : 'var(--text-secondary)'} fontSize="9" fontFamily="IBM Plex Mono" letterSpacing="0.05em" textAnchor="end" style={{ transition: 'fill 0.4s ease', opacity: hoveredNode === 'llm' ? 0.9 : 0.4 }}>LLM REASONER</text>
            <text x="88" y="47" fill="#0ea5e9" fontSize="6.5" fontFamily="IBM Plex Mono" letterSpacing="0.05em" textAnchor="end" style={{ opacity: hoveredNode === 'llm' ? 0.85 : 0.2, transition: 'opacity 0.4s ease' }}>{scrambledTexts.llm}</text>
          </g>

          {/* Vision Node */}
          <g 
            className="router-dest-node"
            onMouseEnter={() => handleMouseEnter('vision', '[ FPS: 120 // CAP_02 ]')}
            onMouseLeave={handleMouseLeave}
            style={{ opacity: hoveredNode && hoveredNode !== 'vision' ? 0.35 : 1, transition: 'opacity 0.4s ease' }}
          >
            <circle cx="110" cy="80" r="9" fill="var(--bg-surface)" stroke={hoveredNode === 'vision' ? '#6366f1' : 'var(--line)'} strokeWidth="1" style={{ transition: 'stroke 0.4s ease' }} />
            <circle cx="110" cy="80" r="3" fill={hoveredNode === 'vision' ? '#c084fc' : 'rgba(99, 102, 241, 0.25)'} style={{ transition: 'fill 0.4s ease' }} />
            <text x="88" y="78" fill={hoveredNode === 'vision' ? 'var(--text-primary)' : 'var(--text-secondary)'} fontSize="9" fontFamily="IBM Plex Mono" letterSpacing="0.05em" textAnchor="end" style={{ transition: 'fill 0.4s ease', opacity: hoveredNode === 'vision' ? 0.9 : 0.4 }}>VISION NETWORK</text>
            <text x="88" y="87" fill="#6366f1" fontSize="6.5" fontFamily="IBM Plex Mono" letterSpacing="0.05em" textAnchor="end" style={{ opacity: hoveredNode === 'vision' ? 0.85 : 0.2, transition: 'opacity 0.4s ease' }}>{scrambledTexts.vision}</text>
          </g>

          {/* Agents Node */}
          <g 
            className="router-dest-node"
            onMouseEnter={() => handleMouseEnter('agents', '[ THREADS: 16 // ORCH_03 ]')}
            onMouseLeave={handleMouseLeave}
            style={{ opacity: hoveredNode && hoveredNode !== 'agents' ? 0.35 : 1, transition: 'opacity 0.4s ease' }}
          >
            <circle cx="110" cy="120" r="9" fill="var(--bg-surface)" stroke={hoveredNode === 'agents' ? '#34d399' : 'var(--line)'} strokeWidth="1" style={{ transition: 'stroke 0.4s ease' }} />
            <circle cx="110" cy="120" r="3" fill={hoveredNode === 'agents' ? '#6ee7b7' : 'rgba(52, 211, 153, 0.25)'} style={{ transition: 'fill 0.4s ease' }} />
            <text x="88" y="118" fill={hoveredNode === 'agents' ? 'var(--text-primary)' : 'var(--text-secondary)'} fontSize="9" fontFamily="IBM Plex Mono" letterSpacing="0.05em" textAnchor="end" style={{ transition: 'fill 0.4s ease', opacity: hoveredNode === 'agents' ? 0.9 : 0.4 }}>AGENT PIPELINE</text>
            <text x="88" y="127" fill="#34d399" fontSize="6.5" fontFamily="IBM Plex Mono" letterSpacing="0.05em" textAnchor="end" style={{ opacity: hoveredNode === 'agents' ? 0.85 : 0.2, transition: 'opacity 0.4s ease' }}>{scrambledTexts.agents}</text>
          </g>
        </svg>

        <div className="router-metrics-badge">
          <div className="router-stat">
            <span className="label">ACTIVE ROUTING LINK</span>
            <span className="value" style={{ 
              color: hoveredNode ? 'var(--accent-light)' : 'var(--accent)'
            }}>
              {hoveredNode === 'llm' ? 'ROUTING TO COGNITIVE LLM' : hoveredNode === 'vision' ? 'STREAMING REAL-TIME VISION' : hoveredNode === 'agents' ? 'ORCHESTRATING SUB-AGENTS' : 'MULTI-ROUTE ACTIVE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CapabilityCard({ item, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  let bentoClass = "bento-col-1"
  let widget = null

  if (item.title === 'Low-Latency Inference') {
    bentoClass = "bento-col-2"
    widget = <LatencyVisualizer />
  } else if (item.title === 'Enterprise Security') {
    bentoClass = "bento-col-1"
    widget = <SecurityShield />
  } else if (item.title === 'Real-Time Telemetry') {
    bentoClass = "bento-col-1"
    widget = <TelemetryWaveform />
  } else if (item.title === 'Auto-Scaling Compute') {
    bentoClass = "bento-col-1"
    widget = <IsometricComputeStack />
  } else if (item.title === 'Global Edge Network') {
    bentoClass = "bento-col-1"
    widget = <GlobalEdgeNetwork />
  } else if (item.title === 'Multi-Model Orchestration') {
    bentoClass = "bento-col-3"
    widget = <NeuralRouter />
  }

  return (
    <motion.div
      ref={ref}
      className={`capability-card ${bentoClass}`}
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      whileHover={{ y: -4, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
    >
      <GlowCard className="capability-inner">
        <div className="bento-card-main">
          <div className="bento-card-text" style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
            {item.title === 'Low-Latency Inference' && (
              <div className="capability-card-header">
                <span className="capability-header-dot pulsing" />
                <span>[ CAPABILITY_01 // INFERENCE ]</span>
              </div>
            )}
            <h3 className="capability-title">{item.title}</h3>
            <p className="capability-desc">{item.desc}</p>
            <div className="capability-metric-row">
              <span className="capability-metric">{item.metric}</span>
              <span className="capability-label">{item.label}</span>
            </div>
            
            {item.title === 'Low-Latency Inference' && (
              <div className="bento-telemetry-meta">
                <div className="bento-meta-block">
                  <span className="bento-meta-label">ACTIVE_CORES</span>
                  <span className="bento-meta-value">256 / 256</span>
                </div>
                <div className="bento-meta-block">
                  <span className="bento-meta-label">OVERFLOW</span>
                  <span className="bento-meta-value">HYPER_AUTO</span>
                </div>
              </div>
            )}
          </div>
          
          {widget && (
            <div className="bento-card-widget" style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
              {widget}
            </div>
          )}
        </div>
      </GlowCard>
    </motion.div>
  )
}

function ServiceHoverList() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 200 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e) => {
    x.set(e.clientX)
    y.set(e.clientY)
  }

  return (
    <div className="service-list-container" onMouseMove={handleMouseMove}>
      <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} className="service-list">
        {services.map((item, index) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            className="service-row hover-row"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {hoveredIndex === index && (
              <motion.div
                layoutId="servicesBackdrop"
                className="services-row-backdrop"
                transition={{ type: 'spring', stiffness: 140, damping: 22 }}
              />
            )}
            <div className="service-row-left" style={{ position: 'relative', zIndex: 1 }}>
              <div className="service-num-wrap">
                <span className="service-num">0{index + 1}</span>
                <span className="service-tag">[ {item.tag} ]</span>
              </div>
              <div className="service-title">{item.title}</div>
            </div>
            <div className="service-row-right" style={{ position: 'relative', zIndex: 1 }}>
              <p className="service-desc">{item.description}</p>
              <div className="service-chips">
                {serviceDetails[index].map((detail) => (
                  <span key={detail} className="service-chip">{detail}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="hover-image-cursor"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: hoveredIndex !== null ? 1 : 0,
          scale: hoveredIndex !== null ? 1 : 0.8,
        }}
        transition={{ opacity: { duration: 0.3 }, scale: { duration: 0.3 } }}
      >
        <AnimatePresence mode="wait">
          {hoveredIndex !== null && (
            <motion.img
              key={hoveredIndex}
              src={services[hoveredIndex].image}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              alt={services[hoveredIndex].title}
              className="hover-image-asset"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function LogoMarquee() {
  return (
    <div className="logo-marquee-wrap">
      <motion.div
        className="logo-marquee-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ ease: 'linear', duration: 30, repeat: Infinity }}
      >
        {[...logos, ...logos].map((logo, index) => (
          <div key={index} className="logo-item">
            <span className="logo-badge">{logo}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function StickyProcessList() {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  return (
    <div ref={containerRef} className="sticky-process-container">
      <div className="sticky-process-left">
        <motion.div variants={fadeUp} className="section-header">
          <div className="section-kicker" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulsing-kicker-dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
            PROCESS
          </div>
          <h2 className="section-title">How AXIOM Delivers</h2>
          <p className="section-sub">A structured engagement model built for enterprise complexity. No handoffs — direct delivery.</p>
        </motion.div>
      </div>
      <div className="sticky-process-right">
        <div className="process-timeline-line">
          <motion.div 
            className="process-timeline-progress" 
            style={{ 
              scaleY: scrollYProgress, 
              transformOrigin: 'top',
            }} 
          />
        </div>
        {process.map((item, index) => {
          const isHovered = hoveredIdx === index
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ amount: 0.4 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="process-card-stack"
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              animate={{ opacity: hoveredIdx === null || isHovered ? 1 : 0.4 }}
              whileHover={{ y: -6 }}
            >
              <TiltCard className="method-row stacked-card">
                <div 
                  className="method-step-badge"
                  style={{
                    borderColor: isHovered ? 'var(--accent)' : 'rgba(99, 102, 241, 0.15)',
                    background: isHovered ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
                    boxShadow: isHovered ? '0 0 12px rgba(99, 102, 241, 0.25)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span>{item.step}</span>
                </div>
                <div className="method-row-title">{item.title}</div>
                <div className="method-row-copy">{item.description}</div>
              </TiltCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function MeridianBlueprint() {
  const [hoveredTrack, setHoveredTrack] = useState(null)
  const [mouseX, setMouseX] = useState(140)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 280
    setMouseX(x)
  }

  return (
    <div className="blueprint-widget-wrap">
      <div className="blueprint-widget-header">
        <span className="bp-mono-tag">[ SYS-COMPARE // ROUTER ]</span>
        <span className="bp-status-pill color-indigo">LIVE FLOW</span>
      </div>
      
      <div 
        className="bp-visual-canvas"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHoveredTrack('axiom')}
        onMouseLeave={() => setHoveredTrack(null)}
      >
        <svg viewBox="0 0 280 180" className="bp-svg-element">
          <defs>
            <linearGradient id="axiom-lane-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="legacy-lane-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255, 95, 86, 0.4)" />
              <stop offset="100%" stopColor="rgba(255, 95, 86, 0.1)" />
            </linearGradient>
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines in background */}
          <g opacity="0.1">
            <line x1="10" y1="30" x2="270" y2="30" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="1 4" />
            <line x1="10" y1="65" x2="270" y2="65" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="1 4" />
            <line x1="10" y1="100" x2="270" y2="100" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="1 4" />
            <line x1="10" y1="135" x2="270" y2="135" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="1 4" />
          </g>

          {/* Hotspots for hover tracking */}
          <rect 
            x="10" y="25" width="260" height="60" 
            fill="transparent" 
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => { e.stopPropagation(); setHoveredTrack('legacy') }}
          />
          <rect 
            x="10" y="110" width="260" height="50" 
            fill="transparent" 
            style={{ cursor: 'pointer' }}
            onMouseEnter={(e) => { e.stopPropagation(); setHoveredTrack('axiom') }}
          />

          {/* Legacy winding retry maze */}
          <path 
            d="M 20,50 H 80 V 75 H 140 V 35 H 200 V 65 H 260" 
            fill="none" 
            stroke="url(#legacy-lane-grad)" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <path 
            d="M 20,50 H 80 V 75 H 140 V 35 H 200 V 65 H 260" 
            fill="none" 
            stroke="#ff5f56" 
            strokeWidth="1" 
            strokeDasharray="3,5" 
            className="legacy-slow-path"
            opacity={hoveredTrack === 'legacy' ? 1 : 0.6}
          />

          {/* Legacy Bottleneck Nodes */}
          {[80, 140, 200].map((x, idx) => {
            const y = idx === 0 ? 50 : idx === 1 ? 75 : 35;
            return (
              <g key={idx}>
                <circle 
                  cx={x} cy={y} r="6" 
                  fill="rgba(15, 12, 10, 0.9)" 
                  stroke="#ff5f56" 
                  strokeWidth="1.2"
                  opacity={hoveredTrack === 'legacy' ? 1 : 0.75} 
                />
                <circle cx={x} cy={y} r="2.2" fill="#ff5f56">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" delay={`${idx * 0.5}s`} />
                </circle>
                {hoveredTrack === 'legacy' && (
                  <circle cx={x} cy={y} r="10" fill="none" stroke="#ff5f56" strokeWidth="0.5" opacity="0.5">
                    <animate attributeName="r" values="6;16" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            )
          })}

          {/* Axiom Speed Line */}
          <path 
            d="M 20,130 H 260" 
            fill="none" 
            stroke="rgba(14, 165, 233, 0.08)" 
            strokeWidth="5" 
            strokeLinecap="round"
          />
          <motion.path 
            d="M 20,130 H 260" 
            fill="none" 
            stroke="url(#axiom-lane-grad)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeDasharray="12,12"
            animate={{ strokeDashoffset: [-120, 0] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 1.5 }}
          />

          {/* Axiom Continuous Fast Stream Particles */}
          <motion.circle cx="20" cy="130" r="4.2" fill="#0ea5e9" filter="url(#glow-filter)"
            animate={{ cx: [20, 260] }}
            transition={{ repeat: Infinity, duration: 1.0, ease: "linear" }}
          />
          <motion.circle cx="20" cy="130" r="3.2" fill="#a78bfa" filter="url(#glow-filter)"
            animate={{ cx: [20, 260] }}
            transition={{ repeat: Infinity, duration: 1.0, ease: "linear", delay: 0.25 }}
          />
          <motion.circle cx="20" cy="130" r="3.8" fill="#38bdf8" filter="url(#glow-filter)"
            animate={{ cx: [20, 260] }}
            transition={{ repeat: Infinity, duration: 1.0, ease: "linear", delay: 0.5 }}
          />
          <motion.circle cx="20" cy="130" r="2.8" fill="#818cf8" filter="url(#glow-filter)"
            animate={{ cx: [20, 260] }}
            transition={{ repeat: Infinity, duration: 1.0, ease: "linear", delay: 0.75 }}
          />

          {/* Legacy slow jittery packets */}
          <motion.circle cx="20" cy="50" r="2.8" fill="#ff5f56"
            animate={{ 
              cx: [20, 80, 80, 140, 140, 200, 200, 260],
              cy: [50, 50, 75, 75, 35, 35, 65, 65]
            }}
            transition={{ repeat: Infinity, duration: 7.2, ease: "linear" }}
          />
          <motion.circle cx="20" cy="50" r="2.4" fill="#ff5f56" opacity="0.65"
            animate={{ 
              cx: [20, 80, 80, 140, 140, 200, 200, 260],
              cy: [50, 50, 75, 75, 35, 35, 65, 65]
            }}
            transition={{ repeat: Infinity, duration: 7.2, ease: "linear", delay: 2.4 }}
          />
          <motion.circle cx="20" cy="50" r="2.2" fill="#ff5f56" opacity="0.4"
            animate={{ 
              cx: [20, 80, 80, 140, 140, 200, 200, 260],
              cy: [50, 50, 75, 75, 35, 35, 65, 65]
            }}
            transition={{ repeat: Infinity, duration: 7.2, ease: "linear", delay: 4.8 }}
          />

          {/* Interactive Laser Tracking Line */}
          {hoveredTrack === 'axiom' && (
            <g pointerEvents="none">
              <line x1={mouseX} y1="10" x2={mouseX} y2="170" stroke="rgba(14, 165, 233, 0.25)" strokeWidth="0.8" strokeDasharray="2 2" />
              <circle cx={mouseX} cy="130" r="7" fill="none" stroke="#38bdf8" strokeWidth="1" filter="url(#glow-filter)">
                <animate attributeName="r" values="4;8;4" dur="1.2s" repeatCount="indefinite" />
              </circle>
              <circle cx={mouseX} cy="130" r="2" fill="#fff" />
            </g>
          )}

          {/* Overlay Texts */}
          <text x="20" y="22" fill="#ff5f56" fontSize="7.5" fontFamily="monospace" fontWeight="500" letterSpacing="0.05em">
            {hoveredTrack === 'legacy' ? "CONGESTED ROUTING // DETOURS DETECTED [480ms]" : "LEGACY RETRY MAZE [480ms]"}
          </text>
          <text x="20" y="112" fill="#0ea5e9" fontSize="7.5" fontFamily="monospace" fontWeight="500" letterSpacing="0.05em">
            {hoveredTrack === 'axiom' ? "OPTICAL DATA HIGHWAY // ACTIVE [1.2ms]" : "AXIOM PIPELINE [1.2ms]"}
          </text>
        </svg>

        {/* Hover details cards floating */}
        <AnimatePresence>
          {hoveredTrack === 'legacy' && (
            <motion.div 
              className="bp-hover-detail-card color-red"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              style={{ top: 10 }}
            >
              <div>QUEUE OVERFLOW // 15.4% LOSS RISK</div>
            </motion.div>
          )}
          {hoveredTrack === 'axiom' && (
            <motion.div 
              className="bp-hover-detail-card color-green"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              style={{ bottom: 10, top: 'auto' }}
            >
              <div>ZERO BOTTLE-NECKS // 100% DISPATCHED</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bp-footer-stats">
        <div className="bp-footer-stat-item">
          <span className="bp-lbl">LEGACY RETRIES</span>
          <span className="bp-val color-red">34 / MIN</span>
        </div>
        <div className="bp-footer-stat-item">
          <span className="bp-lbl">AXIOM LOSS RATE</span>
          <span className="bp-val color-green">0.000%</span>
        </div>
      </div>
    </div>
  )
}

function SmoothCounter({ value, format }) {
  const springValue = useSpring(value, { stiffness: 45, damping: 14 })
  const ref = useRef(null)

  useEffect(() => {
    springValue.set(value)
  }, [value, springValue])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = format(latest)
      }
    })
  }, [springValue, format])

  return <span ref={ref}>{format(value)}</span>
}

function VantaraBlueprint() {
  const [drift, setDrift] = useState(false)
  const [healing, setHealing] = useState(false)
  const [meters, setMeters] = useState({ thermal: 45, vibration: 20, pressure: 1.2 })

  const sweepX = useMotionValue(280)

  useEffect(() => {
    const timer = setInterval(() => {
      if (drift && !healing) {
        setMeters({
          thermal: parseFloat((82 + Math.random() * 10).toFixed(1)),
          vibration: parseFloat((70 + Math.random() * 18).toFixed(1)),
          pressure: parseFloat((3.2 + Math.random() * 0.6).toFixed(2))
        })
      } else if (healing) {
        setMeters({
          thermal: parseFloat((50 + Math.random() * 4).toFixed(1)),
          vibration: parseFloat((25 + Math.random() * 5).toFixed(1)),
          pressure: parseFloat((1.4 + Math.random() * 0.2).toFixed(2))
        })
      } else {
        setMeters({
          thermal: parseFloat((44 + Math.random() * 2).toFixed(1)),
          vibration: parseFloat((19 + Math.random() * 2).toFixed(1)),
          pressure: parseFloat((1.15 + Math.random() * 0.1).toFixed(2))
        })
      }
    }, 400)
    return () => clearInterval(timer)
  }, [drift, healing])

  const triggerDrift = () => {
    if (drift || healing) return
    setDrift(true)
    sweepX.set(0)
    
    setTimeout(() => {
      setHealing(true)
      animate(sweepX, 280, {
        duration: 2.0,
        ease: [0.22, 1, 0.36, 1]
      })
      
      setTimeout(() => {
        setDrift(false)
        setHealing(false)
      }, 2000)
    }, 2500)
  }

  const color = drift ? (healing ? '#818cf8' : '#ff5f56') : '#34d399'

  const pathNominal = "M 0,18 Q 10,13 20,18 T 40,18 T 60,18 T 80,18 T 100,18 T 120,18 T 140,18 T 160,18 T 180,18 T 200,18 T 220,18 T 240,18 T 260,18 T 280,18 T 300,18 T 320,18 T 340,18 T 360,18 T 380,18 T 400,18 L 400,36 L 0,36 Z"
  const strokeNominal = "M 0,18 Q 10,13 20,18 T 40,18 T 60,18 T 80,18 T 100,18 T 120,18 T 140,18 T 160,18 T 180,18 T 200,18 T 220,18 T 240,18 T 260,18 T 280,18 T 300,18 T 320,18 T 340,18 T 360,18 T 380,18 T 400,18"
  
  const pathDrift = "M 0,18 Q 5,4 10,18 T 20,18 T 30,18 T 40,18 T 50,18 T 60,18 T 70,18 T 80,18 T 90,18 T 100,18 T 110,18 T 120,18 T 130,18 T 140,18 T 150,18 T 160,18 T 170,18 T 180,18 T 190,18 T 200,18 T 210,18 T 220,18 T 230,18 T 240,18 T 250,18 T 260,18 T 270,18 T 280,18 T 290,18 T 300,18 T 310,18 T 320,18 T 330,18 T 340,18 T 360,18 T 380,18 T 400,18 L 400,36 L 0,36 Z"
  const strokeDrift = "M 0,18 Q 5,4 10,18 T 20,18 T 30,18 T 40,18 T 50,18 T 60,18 T 70,18 T 80,18 T 90,18 T 100,18 T 110,18 T 120,18 T 130,18 T 140,18 T 150,18 T 160,18 T 170,18 T 180,18 T 190,18 T 200,18 T 210,18 T 220,18 T 230,18 T 240,18 T 250,18 T 260,18 T 270,18 T 280,18 T 290,18 T 300,18 T 310,18 T 320,18 T 330,18 T 345,18 T 360,18 T 380,18 T 400,18"

  const renderTurbineStages = (themeColor) => {
    const gradId = themeColor === '#34d399' ? 'rotor-grad-green' : (themeColor === '#ff5f56' ? 'rotor-grad-red' : 'rotor-grad-indigo')
    return (
      <>
        {/* Central shaft line */}
        <motion.line 
          x1="30" y1="40" x2="250" y2="40" 
          stroke={themeColor} 
          strokeWidth="1.2" 
          opacity="0.25"
          animate={{ stroke: themeColor }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Stage 1 (Left 3D Fan) */}
        <g transform="translate(90, 40)">
          {/* Diagnostic vertical tick */}
          <line x1="0" y1="-30" x2="0" y2="-27" stroke={themeColor} strokeWidth="0.5" opacity="0.3" />
          <line x1="0" y1="27" x2="0" y2="30" stroke={themeColor} strokeWidth="0.5" opacity="0.3" />
          
          {/* Counter-rotating outer tick ring */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 8.0, ease: "linear" }}
          >
            <circle cx="0" cy="0" r="27" fill="none" stroke={themeColor} strokeWidth="0.6" strokeDasharray="2 3" opacity="0.25" />
          </motion.g>
          
          {/* Inner ring */}
          <circle cx="0" cy="0" r="24" fill="none" stroke={themeColor} strokeWidth="0.4" strokeDasharray="1 4" opacity="0.3" />
          
          {/* Spinning rotor blades group (3D projected scale) */}
          <motion.g 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
          >
            <g transform="scale(1, 0.35)">
              {Array.from({ length: 8 }).map((_, i) => (
                <path 
                  key={i} 
                  d="M 0,0 Q 5,-12 10,-22 Q -2,-18 -4,-10 Z" 
                  transform={`rotate(${i * 45})`} 
                  fill={`url(#${gradId})`}
                  stroke={themeColor}
                  strokeWidth="0.6"
                  opacity="0.9"
                />
              ))}
            </g>
          </motion.g>
          
          {/* Center Hub */}
          <circle cx="0" cy="0" r="3.5" fill={themeColor} />
          <circle cx="0" cy="0" r="1.5" fill="#fff" />
          
          {/* Tiny text label */}
          <text x="0" y="-33" fill={themeColor} fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.5">STG_01</text>
        </g>

        {/* Stage 2 (Center 3D Fan - Larger) */}
        <g transform="translate(140, 40)">
          {/* Diagnostic vertical tick */}
          <line x1="0" y1="-43" x2="0" y2="-40" stroke={themeColor} strokeWidth="0.5" opacity="0.3" />
          <line x1="0" y1="40" x2="0" y2="43" stroke={themeColor} strokeWidth="0.5" opacity="0.3" />

          {/* Counter-rotating outer tick ring */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6.0, ease: "linear" }}
          >
            <circle cx="0" cy="0" r="40" fill="none" stroke={themeColor} strokeWidth="0.6" strokeDasharray="3 4" opacity="0.25" />
          </motion.g>

          {/* Inner ring */}
          <circle cx="0" cy="0" r="36" fill="none" stroke={themeColor} strokeWidth="0.4" strokeDasharray="1 5" opacity="0.3" />

          {/* Spinning rotor blades group */}
          <motion.g 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
          >
            <g transform="scale(1, 0.35)">
              {Array.from({ length: 10 }).map((_, i) => (
                <path 
                  key={i} 
                  d="M 0,0 Q 8,-18 15,-34 Q -3,-28 -6,-15 Z" 
                  transform={`rotate(${i * 36})`} 
                  fill={`url(#${gradId})`}
                  stroke={themeColor}
                  strokeWidth="0.6"
                  opacity="0.9"
                />
              ))}
            </g>
          </motion.g>
          
          {/* Center Hub */}
          <circle cx="0" cy="0" r="4.5" fill={themeColor} />
          <circle cx="0" cy="0" r="1.8" fill="#fff" />

          {/* Tiny text label */}
          <text x="0" y="-46" fill={themeColor} fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.5">STG_02_MAIN</text>
        </g>

        {/* Stage 3 (Right 3D Fan) */}
        <g transform="translate(190, 40)">
          {/* Diagnostic vertical tick */}
          <line x1="0" y1="-30" x2="0" y2="-27" stroke={themeColor} strokeWidth="0.5" opacity="0.3" />
          <line x1="0" y1="27" x2="0" y2="30" stroke={themeColor} strokeWidth="0.5" opacity="0.3" />

          {/* Counter-rotating outer tick ring */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 8.0, ease: "linear" }}
          >
            <circle cx="0" cy="0" r="27" fill="none" stroke={themeColor} strokeWidth="0.6" strokeDasharray="2 3" opacity="0.25" />
          </motion.g>

          {/* Inner ring */}
          <circle cx="0" cy="0" r="24" fill="none" stroke={themeColor} strokeWidth="0.4" strokeDasharray="1 4" opacity="0.3" />

          {/* Spinning rotor blades group */}
          <motion.g 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
          >
            <g transform="scale(1, 0.35)">
              {Array.from({ length: 8 }).map((_, i) => (
                <path 
                  key={i} 
                  d="M 0,0 Q 5,-12 10,-22 Q -2,-18 -4,-10 Z" 
                  transform={`rotate(${i * 45})`} 
                  fill={`url(#${gradId})`}
                  stroke={themeColor}
                  strokeWidth="0.6"
                  opacity="0.9"
                />
              ))}
            </g>
          </motion.g>
          
          {/* Center Hub */}
          <circle cx="0" cy="0" r="3.5" fill={themeColor} />
          <circle cx="0" cy="0" r="1.5" fill="#fff" />

          {/* Tiny text label */}
          <text x="0" y="-33" fill={themeColor} fontSize="5" fontFamily="monospace" textAnchor="middle" opacity="0.5">STG_03</text>
        </g>
      </>
    )
  }

  return (
    <div className="blueprint-widget-wrap">
      <div className="blueprint-widget-header">
        <span className="bp-mono-tag">[ TWIN-HEAL // METERS ]</span>
        <motion.span 
          className="bp-status-pill"
          animate={{
            color: color,
            borderColor: `${color}40`,
            backgroundColor: `${color}0b`
          }}
          transition={{ duration: 0.4 }}
        >
          {drift ? (healing ? 'RESOLVING DRIFT' : 'ANOMALY DETECTED') : 'NOMINAL SAFE'}
        </motion.span>
      </div>

      <div className="bp-visual-canvas" style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: 'auto', padding: '12px 0' }}>
        {/* Kinetic Isometric 3D Turbine Rotor */}
        <div style={{ width: '100%', height: '80px', position: 'relative', overflow: 'hidden', background: 'var(--bg-raised)', borderRadius: '6px', border: '1px solid var(--line)' }}>
          <svg viewBox="0 0 280 80" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="rotor-grad-green" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="rotor-grad-red" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff5f56" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ff5f56" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="rotor-grad-indigo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.05" />
              </linearGradient>
              <radialGradient id="glow-stage-green" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow-stage-red" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff5f56" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ff5f56" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="glow-stage-indigo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="healing-beam-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
              </linearGradient>
              <filter id="v-glow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <clipPath id="sweep-clip-rotor">
                <motion.rect x="0" y="0" width={sweepX} height="80" />
              </clipPath>
              <clipPath id="sweep-clip-rotor-right">
                <motion.rect x={sweepX} y="0" width="280" height="80" />
              </clipPath>
            </defs>

            {/* Stable Background grid */}
            <g opacity="0.08" stroke="var(--accent)" strokeWidth="0.5" fill="none">
              <circle cx="140" cy="40" r="25" strokeDasharray="1 3" />
              <circle cx="140" cy="40" r="50" strokeDasharray="1 3" />
              <circle cx="140" cy="40" r="75" strokeDasharray="1 3" />
              <line x1="140" y1="0" x2="140" y2="80" strokeDasharray="2 4" />
              <line x1="30" y1="40" x2="250" y2="40" strokeDasharray="2 4" />
            </g>

            {/* Ambient glows behind the stages */}
            <g pointerEvents="none">
              <motion.circle 
                cx="90" cy="40" r="35" 
                animate={{ fill: drift ? (healing ? 'url(#glow-stage-indigo)' : 'url(#glow-stage-red)') : 'url(#glow-stage-green)' }} 
                transition={{ duration: 0.4 }} 
              />
              <motion.circle 
                cx="140" cy="40" r="50" 
                animate={{ fill: drift ? (healing ? 'url(#glow-stage-indigo)' : 'url(#glow-stage-red)') : 'url(#glow-stage-green)' }} 
                transition={{ duration: 0.4 }} 
              />
              <motion.circle 
                cx="190" cy="40" r="35" 
                animate={{ fill: drift ? (healing ? 'url(#glow-stage-indigo)' : 'url(#glow-stage-red)') : 'url(#glow-stage-green)' }} 
                transition={{ duration: 0.4 }} 
              />
            </g>

            {/* 1. Drift/Warning Group (Red) - Wobbles erratically, clipped to right of sweep line */}
            <g clipPath="url(#sweep-clip-rotor-right)">
              <motion.g
                animate={drift ? {
                  rotate: [0, 4, -3, 3, -4, 2, -2, 0],
                  x: [0, 1.5, -1.5, 2, -2, 1, -1, 0],
                  y: [0, -1, 1.5, -1.5, 2, -1, 0.5, 0]
                } : { rotate: 0, x: 0, y: 0 }}
                transition={drift ? {
                  repeat: Infinity,
                  duration: 0.45,
                  ease: "linear"
                } : { duration: 0.4 }}
              >
                {renderTurbineStages('#ff5f56')}
              </motion.g>
            </g>

            {/* 2. Nominal/Safe Group (Green) - Perfectly aligned and calm, revealed behind sweep clip */}
            <g clipPath="url(#sweep-clip-rotor)">
              {renderTurbineStages('#34d399')}
            </g>

            {/* Telemetry flow particles */}
            {!drift && (
              <>
                <motion.circle r="1.5" fill="#34d399" filter="url(#v-glow)"
                  animate={{ cx: [30, 250], cy: [40, 40] }}
                  transition={{ repeat: Infinity, duration: 2.0, ease: "linear" }}
                />
                <motion.circle r="1.2" fill="#34d399" opacity="0.7"
                  animate={{ cx: [30, 250], cy: [40, 40] }}
                  transition={{ repeat: Infinity, duration: 2.0, ease: "linear", delay: 0.67 }}
                />
                <motion.circle r="1.2" fill="#34d399" opacity="0.4"
                  animate={{ cx: [30, 250], cy: [40, 40] }}
                  transition={{ repeat: Infinity, duration: 2.0, ease: "linear", delay: 1.33 }}
                />
              </>
            )}
            {drift && !healing && (
              <>
                <motion.circle r="1.5" fill="#ff5f56" filter="url(#v-glow)"
                  animate={{ 
                    cx: [30, 250],
                    cy: [40, 43, 37, 42, 38, 40]
                  }}
                  transition={{ repeat: Infinity, duration: 4.0, ease: "linear" }}
                />
                <motion.circle r="1.2" fill="#ff5f56" opacity="0.6"
                  animate={{ 
                    cx: [30, 250],
                    cy: [40, 38, 42, 37, 43, 40]
                  }}
                  transition={{ repeat: Infinity, duration: 4.0, ease: "linear", delay: 1.33 }}
                />
              </>
            )}
            {healing && (
              <>
                <motion.circle r="1.8" fill="#818cf8" filter="url(#v-glow)"
                  animate={{ cx: [30, 250], cy: [40, 40] }}
                  transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }}
                />
                <motion.circle r="1.5" fill="#818cf8" opacity="0.8"
                  animate={{ cx: [30, 250], cy: [40, 40] }}
                  transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut", delay: 0.33 }}
                />
                <motion.circle r="1.2" fill="#818cf8" opacity="0.5"
                  animate={{ cx: [30, 250], cy: [40, 40] }}
                  transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut", delay: 0.67 }}
                />
              </>
            )}

            {/* Healing Sweep Beam */}
            {healing && (
              <motion.g style={{ x: sweepX }}>
                <rect x="-25" y="0" width="50" height="80" fill="url(#healing-beam-grad)" />
                <line x1="0" y1="0" x2="0" y2="80" stroke="#818cf8" strokeWidth="2.5" filter="url(#v-glow)" />
                <line x1="0" y1="0" x2="0" y2="80" stroke="#ffffff" strokeWidth="1.0" />
                {/* Lens Flare center circle */}
                <circle cx="0" cy="40" r="6" fill="#ffffff" filter="url(#v-glow)" />
                <circle cx="0" cy="40" r="3" fill="#818cf8" />
                
                {/* Horizontal flare line */}
                <ellipse cx="0" cy="40" rx="25" ry="1.5" fill="#818cf8" filter="url(#v-glow)" />
                <ellipse cx="0" cy="40" rx="12" ry="0.6" fill="#ffffff" />
              </motion.g>
            )}
          </svg>
        </div>

        {/* Dynamic Oscilloscope Wave */}
        <div style={{ width: '100%', height: '36px', position: 'relative', overflow: 'hidden', background: 'var(--bg-raised)', borderRadius: '6px', border: '1px solid var(--line)' }}>
          <svg viewBox="0 0 280 36" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="wave-glow-nominal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="wave-glow-drift" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff5f56" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ff5f56" stopOpacity="0" />
              </linearGradient>
              <clipPath id="sweep-clip-wave">
                <motion.rect x="0" y="0" width={sweepX} height="36" />
              </clipPath>
              <clipPath id="sweep-clip-wave-right">
                <motion.rect x={sweepX} y="0" width="280" height="36" />
              </clipPath>
            </defs>

            {/* Stable center baseline */}
            <line x1="0" y1="18" x2="280" y2="18" stroke="var(--line)" strokeWidth="0.8" strokeDasharray="3 3" />

            {/* 1. Background Drift Wave (Red) - Clipped to right of sweep line */}
            <g clipPath="url(#sweep-clip-wave-right)">
              {/* Secondary Drift Trace */}
              <motion.path
                d={strokeDrift}
                fill="none"
                stroke="#ff5f56"
                strokeWidth="0.8"
                opacity="0.3"
                strokeDasharray="3 2"
                animate={{ x: [0, -40] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
              />
              {/* Glow Fill */}
              <motion.path
                d={pathDrift}
                fill="url(#wave-glow-drift)"
                animate={{ x: [0, -40] }}
                transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
              />
              {/* Primary Drift Trace */}
              <motion.path
                d={strokeDrift}
                fill="none"
                stroke="#ff5f56"
                strokeWidth="1.5"
                animate={{ x: [0, -40] }}
                transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
              />
              
              {/* Jittery particles riding the drift wave */}
              <circle r="1.8" fill="#ff5f56" filter="url(#v-glow)">
                <animateMotion 
                  dur="1.2s" 
                  repeatCount="indefinite" 
                  path={strokeDrift}
                />
              </circle>
            </g>

            {/* 2. Foreground Nominal Wave (Green) - Clipped */}
            <g clipPath="url(#sweep-clip-wave)">
              {/* Secondary Nominal Trace */}
              <motion.path
                d={strokeNominal}
                fill="none"
                stroke="#34d399"
                strokeWidth="0.8"
                opacity="0.35"
                strokeDasharray="2 2"
                animate={{ x: [0, -40] }}
                transition={{ repeat: Infinity, duration: 3.8, ease: "linear" }}
              />
              {/* Glow Fill */}
              <motion.path
                d={pathNominal}
                fill="url(#wave-glow-nominal)"
                animate={{ x: [0, -40] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
              />
              {/* Primary Nominal Trace */}
              <motion.path
                id="nominal-wave-path"
                d={strokeNominal}
                fill="none"
                stroke="#34d399"
                strokeWidth="1.5"
                animate={{ x: [0, -40] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
              />
              
              {/* Riding particles */}
              <circle r="1.8" fill="#ffffff" filter="url(#v-glow)">
                <animateMotion 
                  dur="4s" 
                  repeatCount="indefinite" 
                  path={strokeNominal}
                />
              </circle>
              <circle r="1.5" fill="#34d399" filter="url(#v-glow)" opacity="0.8">
                <animateMotion 
                  dur="4s" 
                  repeatCount="indefinite" 
                  path={strokeNominal}
                  begin="1.5s"
                />
              </circle>
            </g>

            {/* Healing sweep line overlay on the wave */}
            {healing && (
              <motion.g style={{ x: sweepX }}>
                <line x1="0" y1="0" x2="0" y2="36" stroke="#818cf8" strokeWidth="2.0" filter="url(#v-glow)" />
                <line x1="0" y1="0" x2="0" y2="36" stroke="#ffffff" strokeWidth="0.8" />
                {/* Lens flare */}
                <circle cx="0" cy="18" r="4.5" fill="#ffffff" filter="url(#v-glow)" />
                <circle cx="0" cy="18" r="2" fill="#818cf8" />
                <ellipse cx="0" cy="18" rx="15" ry="1.2" fill="#818cf8" filter="url(#v-glow)" />
              </motion.g>
            )}
          </svg>
        </div>

        {/* Sensor meters */}
        <div className="sensor-meters-grid" style={{ width: '100%' }}>
          {/* Thermal Meter */}
          <div className="sensor-meter-row">
            <div className="sensor-info-labels">
              <span className="sensor-name">THERMAL ENGINE [AX-1]</span>
              <motion.span 
                className="sensor-value"
                animate={{ color: drift && !healing ? '#ff5f56' : 'var(--text-primary)' }}
                transition={{ duration: 0.3 }}
              >
                <SmoothCounter value={meters.thermal} format={v => `${v.toFixed(1)}°C`} />
              </motion.span>
            </div>
            <div className="sensor-bar-bg">
              <motion.div 
                className="sensor-bar-fill" 
                animate={{ 
                  width: `${Math.min(100, (meters.thermal / 110) * 100)}%`,
                  backgroundColor: color
                }}
                transition={{ type: 'spring', stiffness: 80, damping: 14 }}
                style={{ position: 'relative' }}
              >
                <motion.span 
                  style={{ 
                    position: 'absolute', 
                    right: '-3px', 
                    top: '-1px', 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'inline-block'
                  }} 
                  animate={{ boxShadow: `0 0 8px ${color}` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>
          </div>

          {/* Vibration Meter */}
          <div className="sensor-meter-row">
            <div className="sensor-info-labels">
              <span className="sensor-name">VIBRATION DRIFT [AX-2]</span>
              <motion.span 
                className="sensor-value"
                animate={{ color: drift && !healing ? '#ff5f56' : 'var(--text-primary)' }}
                transition={{ duration: 0.3 }}
              >
                <SmoothCounter value={meters.vibration} format={v => `${v.toFixed(1)}% G`} />
              </motion.span>
            </div>
            <div className="sensor-bar-bg">
              <motion.div 
                className="sensor-bar-fill" 
                animate={{ 
                  width: `${Math.min(100, (meters.vibration / 100) * 100)}%`,
                  backgroundColor: color
                }}
                transition={{ type: 'spring', stiffness: 80, damping: 14 }}
                style={{ position: 'relative' }}
              >
                <motion.span 
                  style={{ 
                    position: 'absolute', 
                    right: '-3px', 
                    top: '-1px', 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'inline-block'
                  }} 
                  animate={{ boxShadow: `0 0 8px ${color}` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>
          </div>

          {/* Pressure Meter */}
          <div className="sensor-meter-row">
            <div className="sensor-info-labels">
              <span className="sensor-name">PRESSURE FLOW [AX-3]</span>
              <motion.span 
                className="sensor-value"
                animate={{ color: drift && !healing ? '#ff5f56' : 'var(--text-primary)' }}
                transition={{ duration: 0.3 }}
              >
                <SmoothCounter value={meters.pressure} format={v => `${v.toFixed(2)} BAR`} />
              </motion.span>
            </div>
            <div className="sensor-bar-bg">
              <motion.div 
                className="sensor-bar-fill" 
                animate={{ 
                  width: `${Math.min(100, (meters.pressure / 4.5) * 100)}%`,
                  backgroundColor: color
                }}
                transition={{ type: 'spring', stiffness: 80, damping: 14 }}
                style={{ position: 'relative' }}
              >
                <motion.span 
                  style={{ 
                    position: 'absolute', 
                    right: '-3px', 
                    top: '-1px', 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'inline-block'
                  }} 
                  animate={{ boxShadow: `0 0 8px ${color}` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="bp-footer-action-row">
        <button 
          className={`bp-trigger-btn ${(drift || healing) ? 'disabled' : ''}`}
          onClick={triggerDrift}
          disabled={drift || healing}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={drift ? (healing ? 'healing' : 'drift') : 'nominal'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              {drift ? (
                healing ? (
                  <>
                    <motion.span 
                      className="btn-spinner" 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      style={{
                        width: '10px',
                        height: '10px',
                        border: '1.5px solid currentColor',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        display: 'inline-block'
                      }}
                    />
                    AXIOM HOT-MIGRATING...
                  </>
                ) : (
                  '⚠️ DRIFT FLAGGED!'
                )
              ) : (
                'TRIGGER SIMULATED DRIFT'
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}

function SolarisBlueprint() {
  const [loads, setLoads] = useState([42, 58, 35, 48])
  const [trippedNode, setTrippedNode] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [balancing, setBalancing] = useState(false)

  const nodes = [
    { name: 'CELL-01 (NORTH)', x: 140, y: 25, labelX: 140, labelY: 15 },
    { name: 'CELL-02 (EAST)', x: 215, y: 75, labelX: 245, labelY: 78 },
    { name: 'CELL-03 (SOUTH)', x: 140, y: 125, labelX: 140, labelY: 140 },
    { name: 'CELL-04 (WEST)', x: 65, y: 75, labelX: 35, labelY: 78 }
  ]

  const triggerTrip = (idx) => {
    if (balancing || trippedNode !== null) return
    setTrippedNode(idx)
    setBalancing(true)

    setLoads(prev => {
      const next = [...prev]
      next[idx] = 96
      return next
    })

    setTimeout(() => {
      setLoads(prev => {
        const next = [...prev]
        next[idx] = 0
        const share = Math.round(96 / 3)
        for (let i = 0; i < 4; i++) {
          if (i !== idx) {
            next[i] = prev[i] + share
          }
        }
        return next
      })

      setTimeout(() => {
        setLoads([45, 52, 48, 50])
        setTrippedNode(null)
        setBalancing(false)
      }, 1800)
    }, 1200)
  }

  return (
    <div className="blueprint-widget-wrap">
      <div className="blueprint-widget-header">
        <span className="bp-mono-tag">[ GRID-AUTONOMY // RADAR ]</span>
        <span className={`bp-status-pill ${balancing ? 'color-indigo active-blink' : 'color-green'}`}>
          {balancing ? 'BALANCING LOAD' : 'ACTIVE BALANCING'}
        </span>
      </div>

      <div className="bp-visual-canvas">
        <svg viewBox="0 0 280 180" className="bp-svg-element">
          <defs>
            <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </radialGradient>
            <filter id="green-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid backdrop */}
          <g opacity="0.08" stroke="#34d399" strokeWidth="0.5">
            <line x1="20" y1="75" x2="260" y2="75" />
            <line x1="45" y1="50" x2="235" y2="50" />
            <line x1="45" y1="100" x2="235" y2="100" />
            <line x1="140" y1="10" x2="140" y2="140" />
            <line x1="65" y1="75" x2="215" y2="75" />
            <line x1="20" y1="30" x2="260" y2="120" />
            <line x1="20" y1="120" x2="260" y2="30" />
          </g>

          <circle cx="140" cy="75" r="30" fill="url(#hub-glow)" />

          {/* Connection lines */}
          {nodes.map((node, idx) => {
            const isTripped = trippedNode === idx
            const isTarget = trippedNode !== null && idx !== trippedNode
            return (
              <g key={idx}>
                <line 
                  x1="140" y1="75" 
                  x2={node.x} y2={node.y} 
                  stroke={isTripped ? '#ff5f56' : (isTarget ? '#818cf8' : '#34d399')} 
                  strokeWidth={isTripped || isTarget ? "1.5" : "0.8"}
                  opacity={isTripped ? 0.8 : (isTarget ? 0.6 : 0.25)}
                  style={{ transition: 'stroke 0.4s, stroke-width 0.4s' }}
                />

                {!isTripped && (
                  <motion.circle 
                    r="2.2" 
                    fill={isTarget ? '#818cf8' : '#34d399'} 
                    filter="url(#green-glow)"
                    animate={{
                      cx: [140, node.x],
                      cy: [75, node.y]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: isTarget ? 1.0 : 2.0,
                      ease: "easeInOut",
                      delay: idx * 0.4
                    }}
                  />
                )}

                {isTripped && balancing && (
                  <motion.circle 
                    r="3" 
                    fill="#ff5f56" 
                    filter="url(#green-glow)"
                    animate={{
                      cx: [node.x, 140],
                      cy: [node.y, 75]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: "linear"
                    }}
                  />
                )}
              </g>
            )
          })}

          <circle cx="140" cy="75" r="6" fill="#1c1a24" stroke="#34d399" strokeWidth="1.5" filter="url(#green-glow)" />
          <circle cx="140" cy="75" r="2" fill="#34d399" />

          {/* Towers */}
          {nodes.map((node, idx) => {
            const isTripped = trippedNode === idx
            const isHovered = hoveredNode === idx
            const loadVal = loads[idx]
            const height = (loadVal / 100) * 35
            
            return (
              <g 
                key={idx} 
                className="solaris-node-group" 
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredNode(idx)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => triggerTrip(idx)}
              >
                <line 
                  x1={node.x} y1={node.y} 
                  x2={node.x} y2={node.y - height} 
                  stroke={isTripped ? '#ff5f56' : (isHovered ? '#38bdf8' : '#34d399')}
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  style={{ transition: 'stroke 0.3s, y2 0.3s ease' }}
                  opacity="0.35"
                />
                <line 
                  x1={node.x} y1={node.y} 
                  x2={node.x} y2={node.y - height} 
                  stroke={isTripped ? '#ff5f56' : (isHovered ? '#38bdf8' : '#34d399')}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{ transition: 'stroke 0.3s, y2 0.3s ease' }}
                  filter="url(#green-glow)"
                />

                <ellipse 
                  cx={node.x} cy={node.y} rx="6" ry="2.2" 
                  fill="none" 
                  stroke={isTripped ? '#ff5f56' : '#34d399'} 
                  strokeWidth="0.8" 
                />

                <circle 
                  cx={node.x} cy={node.y - height} r={isHovered ? "3.5" : "2.2"} 
                  fill={isTripped ? '#ff5f56' : (isHovered ? '#fff' : '#34d399')} 
                  style={{ transition: 'cy 0.3s ease, r 0.2s' }}
                  filter="url(#green-glow)" 
                />

                <text 
                  x={node.labelX} y={node.labelY} 
                  fill={isTripped ? '#ff5f56' : (isHovered ? '#38bdf8' : '#a0aec0')}
                  fontSize="6.2" 
                  fontFamily="monospace"
                  textAnchor="middle"
                  style={{ transition: 'fill 0.3s' }}
                >
                  {isTripped ? 'OVERLOAD' : `CELL-0${idx + 1}`}
                </text>
              </g>
            )
          })}
        </svg>

        <AnimatePresence>
          {hoveredNode !== null && (
            <motion.div 
              className="solaris-tooltip"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="tooltip-title">{nodes[hoveredNode].name}</div>
              <div className="tooltip-row">
                <span>LOAD FACTOR:</span>
                <span className={loads[hoveredNode] > 80 ? 'color-red' : 'color-green'}>{loads[hoveredNode]}%</span>
              </div>
              <div className="tooltip-action">CLICK NODE TO OVERLOAD & BALANCE</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bp-footer-stats">
        <div className="bp-footer-stat-item">
          <span className="bp-lbl">GRID BALANCE</span>
          <span className="bp-val color-green">{trippedNode !== null ? 'REBALANCING' : 'OPTIMAL'}</span>
        </div>
        <div className="bp-footer-stat-item">
          <span className="bp-lbl">ACTIVE STATIONS</span>
          <span className="bp-val">{trippedNode !== null ? '3 / 4' : '4 / 4'} ACTIVE</span>
        </div>
      </div>
    </div>
  )
}

function NexbridgeBlueprint() {
  const [packetX, setPacketX] = useState(20)
  const [activeStage, setActiveStage] = useState(null)
  const [verifiedFiles, setVerifiedFiles] = useState([])

  const stages = [
    { name: 'INGEST DECRYPT', x: 65, y: 55 },
    { name: 'COGNITIVE CLASSIFY', x: 140, y: 55 },
    { name: 'SECURE DISPATCH', x: 215, y: 55 }
  ]

  useEffect(() => {
    const fileTemplates = ['SEC-10K', 'AML-KYC', 'FINRA-21', 'BSA-REPORT', 'CFTC-REG']
    let lastCycle = -1
    
    const timer = setInterval(() => {
      const time = Date.now()
      const cycle = Math.floor(time / 4000)
      const elapsed = time % 4000
      
      if (elapsed < 800) {
        const pct = elapsed / 800
        setPacketX(20 + pct * 45)
        setActiveStage(null)
      } else if (elapsed < 1400) {
        setPacketX(65)
        setActiveStage(0)
      } else if (elapsed < 2200) {
        const pct = (elapsed - 1400) / 800
        setPacketX(65 + pct * 75)
        setActiveStage(null)
      } else if (elapsed < 2800) {
        setPacketX(140)
        setActiveStage(1)
      } else if (elapsed < 3600) {
        const pct = (elapsed - 2800) / 800
        setPacketX(140 + pct * 75)
        setActiveStage(null)
      } else {
        setPacketX(215)
        setActiveStage(2)
        
        if (cycle !== lastCycle) {
          lastCycle = cycle
          const randomFile = fileTemplates[Math.floor(Math.random() * fileTemplates.length)]
          const timestamp = new Date().toTimeString().split(' ')[0]
          const hash = '0x' + Math.random().toString(16).substring(2, 6).toUpperCase()
          const score = (Math.random() * 0.02).toFixed(4)
          setVerifiedFiles(prev => {
            const next = [{ name: randomFile, time: timestamp, hash, score }, ...prev]
            if (next.length > 3) next.pop()
            return next
          })
        }
      }
    }, 30)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="blueprint-widget-wrap">
      <div className="blueprint-widget-header">
        <span className="bp-mono-tag">[ COMPLIANCE // SCANNER ]</span>
        <span className="bp-status-pill color-purple">AGENT STREAM</span>
      </div>

      <div className="bp-visual-canvas" style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: 'auto', padding: '12px 0' }}>
        <div className="compliance-scanner-grid">
          <div style={{ width: '100%', height: '90px', position: 'relative', overflow: 'hidden', background: 'var(--bg-raised)', borderRadius: '6px', border: '1px solid var(--line)' }}>
            <svg viewBox="0 0 280 90" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="purple-trace-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(167, 139, 250, 0.1)" />
                  <stop offset="50%" stopColor="rgba(167, 139, 250, 0.4)" />
                  <stop offset="100%" stopColor="rgba(167, 139, 250, 0.1)" />
                </linearGradient>
                <filter id="purple-glow">
                  <feGaussianBlur stdDeviation="2.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g opacity="0.06" stroke="#a78bfa" strokeWidth="0.5">
                <line x1="0" y1="55" x2="280" y2="55" />
                <line x1="65" y1="0" x2="65" y2="90" strokeDasharray="1 3" />
                <line x1="140" y1="0" x2="140" y2="90" strokeDasharray="1 3" />
                <line x1="215" y1="0" x2="215" y2="90" strokeDasharray="1 3" />
              </g>

              <line 
                x1="20" y1="55" x2="260" y2="55" 
                stroke="url(#purple-trace-grad)" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />

              {stages.map((stage, idx) => {
                const isActive = activeStage === idx
                return (
                  <g key={idx} transform={`translate(${stage.x}, ${stage.y})`}>
                    <circle 
                      r="14" 
                      fill="none" 
                      stroke={isActive ? '#a78bfa' : 'var(--line)'} 
                      strokeWidth="0.8" 
                      strokeDasharray="4 2"
                      style={{ transition: 'stroke 0.3s' }}
                    >
                      <animateTransform 
                        attributeName="transform" 
                        type="rotate" 
                        from="0" to="360" 
                        dur={isActive ? "2s" : "8s"} 
                        repeatCount="indefinite" 
                      />
                    </circle>

                    <circle 
                      r="9" 
                      fill="none" 
                      stroke={isActive ? '#38bdf8' : 'var(--line)'} 
                      strokeWidth="0.6" 
                      strokeDasharray="6 4"
                      style={{ transition: 'stroke 0.3s' }}
                    >
                      <animateTransform 
                        attributeName="transform" 
                        type="rotate" 
                        from="360" to="0" 
                        dur={isActive ? "1.5s" : "6s"} 
                        repeatCount="indefinite" 
                      />
                    </circle>

                    <circle 
                      r="4.5" 
                      fill="var(--bg-base)" 
                      stroke={isActive ? '#a78bfa' : 'var(--line)'} 
                      strokeWidth="1.2"
                      style={{ transition: 'stroke 0.3s' }}
                    />
                    <circle r="1.8" fill={isActive ? '#a78bfa' : 'var(--text-muted)'} />

                    {isActive && (
                      <circle cx="0" cy="0" r="18" fill="none" stroke="#a78bfa" strokeWidth="0.5" opacity="0.3">
                        <animate attributeName="r" values="14;22;14" dur="1s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="1s" repeatCount="indefinite" />
                      </circle>
                    )}

                    <text 
                      x="0" y="30" 
                      fill={isActive ? '#a78bfa' : 'var(--text-muted)'} 
                      fontSize="5.8" 
                      fontFamily="monospace" 
                      textAnchor="middle"
                      style={{ transition: 'fill 0.3s' }}
                    >
                      {stage.name}
                    </text>
                  </g>
                )
              })}

              <g transform={`translate(${packetX}, 55)`}>
                <rect 
                  x="-4.5" y="-4.5" width="9" height="9" rx="1.5" 
                  fill="var(--bg-base)" 
                  stroke="#a78bfa" 
                  strokeWidth="1.2"
                  filter="url(#purple-glow)" 
                />
                <circle cx="0" cy="0" r="1.2" fill="#a78bfa" />
              </g>
            </svg>
          </div>

          <div className="compliance-scan-top">
            <div className="scanner-progress-header">
              <span className="scan-file-label">PIPELINE THROUGHPUT</span>
              <span className="scan-pct-val color-purple">AGENT DEPLOYMENT ACTIVE</span>
            </div>
            <div className="scanner-bar-container">
              <div className="scanner-bar-fill bg-purple" style={{ width: `${(packetX - 20) / 195 * 100}%` }} />
              <div className="scanner-laser-glow bg-purple" style={{ left: `${(packetX - 20) / 195 * 100}%` }} />
            </div>
          </div>

          <div className="compliance-verified-logs">
            <span className="logs-section-title">REAL-TIME COMPLIANCE VERIFICATION DISPATCH RECORD</span>
            <div className="ticker-list">
              {verifiedFiles.length === 0 ? (
                <div className="ticker-empty">WAITING FOR PIPELINE PROCESSOR DISPATCH...</div>
              ) : (
                verifiedFiles.map((file, idx) => (
                  <div key={idx} className="ticker-log-row animate-slide-in">
                    <span className="ticker-bullet">[OK]</span>
                    <span className="ticker-file">
                      {file.name} <span style={{ color: 'var(--text-muted)' }}>// SHA-256: {file.hash}</span>
                    </span>
                    <span className="ticker-time" style={{ marginRight: 6 }}>{file.time}</span>
                    <span className="ticker-status color-green">RISK:{file.score}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bp-footer-stats">
        <div className="bp-footer-stat-item">
          <span className="bp-lbl">MANUAL COMPLIANCE OVERRIDE</span>
          <span className="bp-val color-green">0.00%</span>
        </div>
        <div className="bp-footer-stat-item">
          <span className="bp-lbl">SCANNED DOCUMENTS</span>
          <span className="bp-val">1.2K // MIN</span>
        </div>
      </div>
    </div>
  )
}

function CaseStudiesDashboard() {
  const [activeIdx, setActiveIdx] = useState(0)
  const currentCase = testimonials[activeIdx]

  return (
    <div className="case-cockpit-container">
      {/* 1. Left Selector Tabs Sidebar */}
      <div className="case-selector-sidebar">
        <div className="sidebar-group-title" style={{ paddingLeft: 8, marginBottom: 12 }}>CASE ENGAGEMENTS</div>
        <div className="case-selector-list">
          {testimonials.map((test, index) => {
            const isActive = activeIdx === index
            return (
              <motion.div 
                key={test.id}
                className={`case-selector-card ${isActive ? 'active' : ''}`}
                onClick={() => setActiveIdx(index)}
                style={{ '--client-theme': test.color }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeCaseBackdrop"
                    className="active-case-backdrop"
                    transition={{ type: 'spring', stiffness: 140, damping: 22 }}
                  />
                )}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <div className="selector-card-top">
                    <span className="card-num">{test.num}</span>
                    <span className="card-sector">{test.sector}</span>
                  </div>
                  <div className="selector-card-company">{test.company}</div>
                  <div className="selector-card-impact" style={{ color: isActive ? test.color : 'var(--text-secondary)' }}>
                    {test.impact}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 2. Central Detailed Content View */}
      <div className="case-main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCase.id}
            initial={{ opacity: 0, x: -12, filter: 'blur(3px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 12, filter: 'blur(3px)' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <div className="case-quote-wrap">
              <div className="case-quote-mark">“</div>
              <p className="case-quote-text">{currentCase.quote}</p>
              
              <div className="case-quote-author">
                <span className="author-name">{currentCase.author}</span>
                <span className="author-divider">//</span>
                <span className="author-company">{currentCase.company}</span>
              </div>
            </div>

            {/* Technical Metadata Columns */}
            <div className="case-metadata-grid">
              <div className="meta-col">
                <span className="meta-lbl">CORE DEPLOYMENT</span>
                <span className="meta-val">{currentCase.deployment}</span>
              </div>
              <div className="meta-col">
                <span className="meta-lbl">REGION</span>
                <span className="meta-val">{currentCase.region}</span>
              </div>
              <div className="meta-col">
                <span className="meta-lbl">ENGAGEMENT TIMELINE</span>
                <span className="meta-val">{currentCase.duration}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Right Blueprint Visualizer Panel */}
      <div className="case-blueprint-panel">
        <div className="blueprint-panel-header">
          <span className="panel-title-mono">ENGAGEMENT RUNTIME VISUAL</span>
          <span className="panel-indicator-dot" style={{ backgroundColor: currentCase.color, boxShadow: `0 0 10px ${currentCase.color}` }} />
        </div>

        <div className="blueprint-panel-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCase.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="blueprint-motion-container"
            >
              {currentCase.id === 'meridian' && <MeridianBlueprint />}
              {currentCase.id === 'vantara' && <VantaraBlueprint />}
              {currentCase.id === 'solaris' && <SolarisBlueprint />}
              {currentCase.id === 'nexbridge' && <NexbridgeBlueprint />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ─── App ─── */

function App() {
  const [openFaq, setOpenFaq] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredNav, setHoveredNav] = useState(null)
  const heroRef = useRef(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const tileY = useTransform(heroScroll, [0, 1], [0, 120])
  const tileRotate = useTransform(heroScroll, [0, 1], [0, 15])
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0])
  const heroScale = useTransform(heroScroll, [0, 0.6], [1, 0.96])
  const orbY1 = useTransform(heroScroll, [0, 1], [0, -180])
  const orbY2 = useTransform(heroScroll, [0, 1], [0, -80])
  const orbY3 = useTransform(heroScroll, [0, 1], [0, -250])
  const wordScale = useTransform(heroScroll, [0, 0.5], [1, 1.15])
  const wordOpacity = useTransform(heroScroll, [0, 0.4], [1, 0])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="page-shell">
      <ScrollProgress />
      <GrainOverlay />

      <aside className="right-markers" aria-hidden="true">
        {markers.map((marker) => (
          <a key={marker} href={`#${marker}`} className="marker-dot" />
        ))}
      </aside>

      <header className={`topbar ${scrolled ? 'topbar--scrolled' : ''}`} id="top">
        <div className="topbar-inner">
          <div className="brand-lockup">
            <span className="brand-small" style={{ textTransform: 'uppercase' }}>axiom</span>
            <span className="brand-slash">//</span>
            <span className="brand-mono-tag-small">SYSTEMS</span>
          </div>

          <nav className="topnav" onMouseLeave={() => setHoveredNav(null)}>
            {[
              { label: 'SOLUTIONS', href: '#solutions' },
              { label: 'PLATFORM', href: '#platform' },
              { label: 'CASE STUDIES', href: '#case-studies' },
              { label: 'ABOUT', href: '#about' },
              { label: 'CONTACT', href: '#contact' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHoveredNav(link.label)}
                style={{ position: 'relative' }}
              >
                {hoveredNav === link.label && (
                  <motion.div
                    layoutId="activeNavBackdrop"
                    className="active-nav-backdrop"
                    transition={{ type: 'spring', stiffness: 140, damping: 22 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{link.label}</span>
              </a>
            ))}
          </nav>

          <div className="topbar-actions">
            <MagneticButton href="#contact" className="apply-button">
              Book a Call
            </MagneticButton>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <motion.section
          ref={heroRef}
          className="hero"
          aria-labelledby="hero-title"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            className="hero-word"
            style={{ scale: wordScale, opacity: wordOpacity }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
          >AXIOM</motion.div>

          <motion.div className="hero-orb hero-orb-1" style={{ y: orbY1 }} />
          <motion.div className="hero-orb hero-orb-2" style={{ y: orbY2 }} />
          <motion.div className="hero-orb hero-orb-3" style={{ y: orbY3 }} />

          <motion.div
            className="hero-tile"
            style={{ y: tileY, rotate: tileRotate, x: '-50%', scale: 0.44 }}
          >
            <FloatingTile badge="A/" />
          </motion.div>

          <div className="hero-content-block">
            <motion.div
              className="hero-kicker"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
            >
              <span className="status-light" />
              Now deploying across enterprise environments
            </motion.div>

            <motion.h1
              className="hero-headline"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.9, ease: EASE }}
            >
              Enterprise AI starts at the{' '}
              <span className="text-gradient">infrastructure</span> layer.
            </motion.h1>

            <motion.p
              className="hero-subheadline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.9, ease: EASE }}
            >
              AXIOM builds AI infrastructure, Digital Twin platforms, and Agentic AI systems for enterprises that operate at scale.
            </motion.p>

            <motion.div
              className="hero-ctas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.8, ease: EASE }}
            >
              <MagneticButton href="#contact" className="btn-primary">
                Book a Discovery Call →
              </MagneticButton>
              <MagneticButton href="#platform" className="btn-secondary">
                Explore Platform
              </MagneticButton>
            </motion.div>
          </div>

          <motion.div
            className="hero-notes-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8, ease: EASE }}
          >
            {heroNotes.map(([label, text]) => (
              <div key={label} className="hero-note">
                <div className="hero-note-label">{label}</div>
                <div className="hero-note-text">{text}</div>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── LOGOS ── */}
        <RevealSection id="logos" className="logos-section">
          <motion.div variants={fadeUp} className="logos-label">
            Trusted by enterprises across industries
          </motion.div>
          <LogoMarquee />
        </RevealSection>

        <SectionDivider />

        {/* ── SOLUTIONS ── */}
        <RevealSection id="solutions" className="services-section">
          <motion.div variants={fadeUp} className="section-header">
            <div className="section-kicker">SOLUTIONS</div>
            <h2 className="section-title">
              <WordReveal>The Full Stack of Enterprise AI</WordReveal>
            </h2>
            <p className="section-sub">
              From infrastructure to intelligent agents — AXIOM covers the entire operational layer.
            </p>
          </motion.div>
          <ServiceHoverList />
        </RevealSection>

        <SectionDivider />

        {/* ── CAPABILITIES ── */}
        <RevealSection id="capabilities" className="capabilities-section">
          <motion.div variants={fadeUp} className="section-header" style={{ textAlign: 'center', margin: '0 auto 56px' }}>
            <div className="section-kicker">CAPABILITIES</div>
            <h2 className="section-title" style={{ margin: '0 auto 16px' }}>
              <WordReveal>Built for Production, Not Proof of Concept</WordReveal>
            </h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Every component is designed for enterprise-grade performance, security, and reliability.
            </p>
          </motion.div>
          <div className="capability-grid">
            {capabilities.map((item, index) => (
              <CapabilityCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </RevealSection>

        <SectionDivider />

        {/* ── PROCESS ── */}
        <RevealSection id="method" className="method-section">
          <StickyProcessList />
        </RevealSection>

        <SectionDivider />

        {/* ── PLATFORM / DIGITAL TWIN ── */}
        <RevealSection id="platform" className="digital-twin-section">
          <motion.div variants={fadeUp} className="section-header" style={{ textAlign: 'center', margin: '0 auto 48px' }}>
            <div className="section-kicker">PLATFORM</div>
            <h2 className="section-title" style={{ margin: '0 auto 16px' }}>
              <WordReveal>A Living Model of Your Entire Operation</WordReveal>
            </h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              AXIOM's Digital Twin creates a real-time virtual replica of your physical operation — updating continuously, simulating outcomes, and flagging anomalies before they become incidents.
            </p>
          </motion.div>

          <motion.div variants={scaleIn}>
            <OperationalConsole />
          </motion.div>

          <motion.div variants={fadeUp} className="dt-stats-row">
            {/* Column 1: Hero Stat Card */}
            <GlowCard className="dt-stat-card dt-stat-hero-card">
              <div className="dt-stat-blueprint-bg" />
              
              {/* Header Telemetry Bar */}
              <div className="dt-stat-hero-header">
                <div className="dt-stat-tag">[ AXIOM UPTIME ENGINE ]</div>
                <div className="dt-stat-header-meta">
                  <span className="dt-stat-meta-item"><span className="status-dot pulsing" /> SYS: ACTIVE</span>
                  <span className="dt-stat-meta-divider">|</span>
                  <span className="dt-stat-meta-item">SECURE_NODE: MULTI_AZ</span>
                  <span className="dt-stat-meta-divider">|</span>
                  <span className="dt-stat-meta-item">LATENCY: 1.2ms</span>
                </div>
              </div>
              
              <div className="dt-stat-hero-content">
                <div className="dt-stat-hero-left">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '8px', letterSpacing: '0.08em', color: 'rgba(14, 165, 233, 0.85)' }}>[ GAIN RATIO ]</div>
                    <div className="dt-stat-value" style={{ margin: 0, lineHeight: 1.1 }}><CountUp value="34%" /></div>
                  </div>
                  
                  {/* Micro Sparkline Trend Graph */}
                  <div className="dt-stat-sparkline-container">
                    <svg className="dt-stat-sparkline-svg" viewBox="0 0 160 28">
                      <defs>
                        <linearGradient id="sparkline-grad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="50%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                      <rect width="160" height="28" fill="none" stroke="var(--line-subtle)" strokeWidth="0.5" />
                      <line x1="0" y1="18" x2="160" y2="18" stroke="var(--line)" strokeWidth="0.8" strokeDasharray="2,2" />
                      <path 
                        className="dt-stat-sparkline-glow"
                        d="M0,8 Q20,12 40,6 T80,18 T120,4 T160,2"
                      />
                      <path 
                        className="dt-stat-sparkline-path"
                        d="M0,8 Q20,12 40,6 T80,18 T120,4 T160,2"
                      />
                      <circle cx="160" cy="2" r="1.5" fill="#34d399" />
                      <motion.circle cx="160" cy="2" r="5" fill="none" stroke="#34d399" strokeWidth="0.5" animate={{ r: [1.5, 6], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                    </svg>
                  </div>

                  <div className="dt-stat-label">Reduction in unplanned enterprise system downtime through predictive hot-standby node migration.</div>
                  
                  <div className="dt-stat-sub-telemetry">
                    <div className="telemetry-block">
                      <span className="telemetry-block-label">CORE_FAILOVER</span>
                      <span className="telemetry-block-value">PREDICTIVE</span>
                    </div>
                    <div className="telemetry-block">
                      <span className="telemetry-block-label">MIG_WINDOW</span>
                      <span className="telemetry-block-value">&lt; 180ms</span>
                    </div>
                  </div>
                </div>
                
                {/* Visualizer showing a glowing circular target or scope */}
                <div className="dt-stat-hero-right">
                  <div className="blueprint-circle-visual" style={{ border: 'none', borderRadius: '0px', boxShadow: 'none', background: 'transparent', width: '280px', height: '140px', overflow: 'visible' }}>
                    <svg viewBox="0 0 280 140" style={{ width: '280px', height: '140px', background: 'var(--bg-raised)', borderRadius: '8px', border: '1px solid var(--line)' }}>
                      {/* Grid pattern background */}
                      <defs>
                        <pattern id="node-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <circle cx="1" cy="1" r="0.5" fill="var(--line-subtle)" />
                        </pattern>
                        <linearGradient id="mig-bar-grad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                      <rect width="280" height="140" fill="url(#node-grid)" />

                      {/* --- LEFT TELEMETRY DECK --- */}
                      <text x="12" y="20" fill="rgba(14, 165, 233, 0.95)" fontSize="7" fontFamily="monospace" fontWeight="bold" letterSpacing="0.08em">[ SYSTEM MIGRATION STATS ]</text>
                      <line x1="12" y1="25" x2="105" y2="25" stroke="rgba(14, 165, 233, 0.2)" strokeWidth="0.8" />
                      
                      {/* Diagnostics list */}
                      <text x="12" y="42" fill="var(--text-secondary)" fontSize="6" fontFamily="monospace">SRC ENGINE:</text>
                      <text x="68" y="42" fill="#6366f1" fontSize="6" fontFamily="monospace" fontWeight="bold">NODE_04_A</text>
                      
                      <text x="12" y="54" fill="var(--text-secondary)" fontSize="6" fontFamily="monospace">TRG ENGINE:</text>
                      <text x="68" y="54" fill="#34d399" fontSize="6" fontFamily="monospace" fontWeight="bold">NODE_04_B</text>
                      
                      <text x="12" y="66" fill="var(--text-secondary)" fontSize="6" fontFamily="monospace">BANDWIDTH:</text>
                      <text x="68" y="66" fill="var(--text-primary)" fontSize="6" fontFamily="monospace">4.8 GW/s</text>
                      
                      <text x="12" y="78" fill="var(--text-secondary)" fontSize="6" fontFamily="monospace">LATENCY:</text>
                      <text x="68" y="78" fill="var(--text-primary)" fontSize="6" fontFamily="monospace">1.2ms</text>
                      
                      <text x="12" y="90" fill="var(--text-secondary)" fontSize="6" fontFamily="monospace">INTEGRITY:</text>
                      <text x="68" y="90" fill="#34d399" fontSize="6" fontFamily="monospace">100% SECURE</text>

                      {/* Progress bar */}
                      <text x="12" y="108" fill="var(--text-muted)" fontSize="5.5" fontFamily="monospace">MIGRATION PROGRESS</text>
                      <rect x="12" y="114" width="93" height="4" fill="var(--line-subtle)" rx="2" stroke="var(--line)" strokeWidth="0.5" />
                      <motion.rect 
                        x="12" 
                        y="114" 
                        height="4" 
                        fill="url(#mig-bar-grad)" 
                        rx="2" 
                        animate={{ width: [0, 93, 0] }} 
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} 
                      />

                      {/* Division line between decks */}
                      <line x1="125" y1="12" x2="125" y2="128" stroke="var(--line)" strokeWidth="1" strokeDasharray="3,3" />

                      {/* --- RIGHT 3D ISOMETRIC DECK (X center = 195) --- */}
                      
                      {/* Bounding box guidelines (thin gray grid) */}
                      <line x1="140" y1="40" x2="140" y2="110" stroke="var(--line-subtle)" strokeWidth="0.8" />
                      <line x1="250" y1="40" x2="250" y2="110" stroke="var(--line-subtle)" strokeWidth="0.8" />
                      <line x1="195" y1="18" x2="195" y2="132" stroke="var(--line-subtle)" strokeWidth="0.8" strokeDasharray="2,2" />

                      {/* TIER C: Bottom Plane */}
                      <polygon points="140,110 195,88 250,110 195,132" fill="rgba(15, 23, 42, 0.04)" stroke="var(--line)" strokeWidth="0.8" strokeDasharray="2,1" />
                      
                      {/* TIER B: Middle Plane */}
                      <polygon points="140,75 195,53 250,75 195,97" fill="rgba(15, 23, 42, 0.02)" stroke="var(--line-subtle)" strokeWidth="0.8" strokeDasharray="3,1" />
                      
                      {/* TIER A: Top Plane */}
                      <polygon points="140,40 195,18 250,40 195,62" fill="rgba(15, 23, 42, 0.04)" stroke="var(--line)" strokeWidth="0.8" strokeDasharray="2,1" />

                      {/* Middle layer secondary nodes */}
                      <circle cx="170" cy="75" r="1.5" fill="var(--text-muted)" />
                      <circle cx="220" cy="75" r="1.5" fill="var(--text-muted)" />
                      <line x1="170" y1="75" x2="195" y2="78" stroke="var(--line)" strokeWidth="0.5" />
                      <line x1="220" y1="75" x2="195" y2="78" stroke="var(--line)" strokeWidth="0.5" />

                      {/* Hot Migration vertical pipeline */}
                      <line x1="195" y1="118" x2="195" y2="32" stroke="rgba(99, 102, 241, 0.12)" strokeWidth="1" strokeDasharray="3,3" />

                      {/* Target Active Node (Top Tier) */}
                      <g>
                        <circle cx="195" cy="32" r="3" fill="#34d399" />
                        <motion.circle
                          cx="195"
                          cy="32"
                          r="10"
                          fill="none"
                          stroke="#34d399"
                          strokeWidth="1"
                          animate={{ r: [3, 13], opacity: [0.8, 0] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                        />
                        <text x="202" y="29" fill="#34d399" fontSize="4.5" fontFamily="monospace" fontWeight="bold">STANDBY // UP</text>
                      </g>

                      {/* Source Node (Bottom Tier) */}
                      <g>
                        <circle cx="195" cy="118" r="3" fill="#6366f1" />
                        <motion.circle
                          cx="195"
                          cy="118"
                          r="8"
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="0.8"
                          animate={{ r: [3, 10], opacity: [0.6, 0] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
                        />
                        <text x="202" y="122" fill="#6366f1" fontSize="4.5" fontFamily="monospace">DISMOUNT</text>
                      </g>

                      {/* Ascending glowing migration stream particles */}
                      <motion.circle
                        cx="195"
                        cy="118"
                        r="2.2"
                        fill="#34d399"
                        style={{ filter: "drop-shadow(0 0 3px #34d399)" }}
                        animate={{ cy: [118, 32], opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      />
                      <motion.circle
                        cx="195"
                        cy="118"
                        r="2.2"
                        fill="#6366f1"
                        style={{ filter: "drop-shadow(0 0 3px #6366f1)" }}
                        animate={{ cy: [118, 32], opacity: [0, 1, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 1.1 }}
                      />

                      {/* Micro tier tags */}
                      <text x="142" y="132" fill="var(--text-muted)" fontSize="4.5" fontFamily="monospace">TIER_C</text>
                      <text x="142" y="32" fill="var(--text-muted)" fontSize="4.5" fontFamily="monospace">TIER_A</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Console Deck */}
              <div className="dt-stat-hero-bottom">
                <div className="dt-stat-grid-cluster">
                  <div className="cluster-header">
                    <span>[ SYSTEM CLUSTER MATRIX AZ_04 ]</span>
                    <span>CORE_UPTIME: 99.9997%</span>
                  </div>
                  <div className="cluster-cells">
                    {Array.from({ length: 28 }).map((_, i) => {
                      let status = 'active'; // active (green), standby (indigo), offline (gray)
                      if (i === 11 || i === 12 || i === 23) status = 'standby';
                      if (i === 18 || i === 19) status = 'offline';
                      
                      // Alternate pulsing cells to make it look active
                      const isPulsing = i % 5 === 0;
                      return (
                        <div 
                          key={i} 
                          className={`cluster-cell cell-${status} ${isPulsing ? 'pulsing' : ''}`}
                          title={`Core ${i + 1}: ${status.toUpperCase()}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </GlowCard>

            {/* Column 2: Stacked Secondary Stats Cards */}
            <div className="dt-stats-column">
              <GlowCard className="dt-stat-card dt-stat-side-card">
                <div className="dt-stat-blueprint-bg" />
                <div className="dt-stat-tag">[ RESPONSE MATRIX ]</div>
                <div className="dt-stat-value"><CountUp value="2.4x" /></div>
                <div className="dt-stat-label">faster incident response time</div>
              </GlowCard>
              
              <GlowCard className="dt-stat-card dt-stat-side-card">
                <div className="dt-stat-blueprint-bg" />
                <div className="dt-stat-tag">[ CAPITAL EFFICIENCY ]</div>
                <div className="dt-stat-value"><CountUp value="18%" /></div>
                <div className="dt-stat-label">operational cost reduction</div>
              </GlowCard>
            </div>
          </motion.div>
        </RevealSection>

        <SectionDivider />

        {/* ── PROOF / STATS ── */}
        <RevealSection className="proof-section">
          <motion.div variants={fadeUp} className="section-header" style={{ textAlign: 'center', margin: '0 auto 56px' }}>
            <div className="section-kicker">BY THE NUMBERS</div>
            <h2 className="section-title" style={{ margin: '0 auto 16px' }}>
              <WordReveal>Enterprise-Grade Results</WordReveal>
            </h2>
          </motion.div>
          <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }} className="proof-grid">
            {proof.map((item) => (
              <motion.div key={item.value} variants={fadeUp} className="proof-card">
                <div className="proof-value">
                  <CountUp value={item.value} />
                </div>
                <p>{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </RevealSection>

        <SectionDivider />

        {/* ── TESTIMONIALS ── */}
        <RevealSection id="case-studies" className="testimonials-section">
          <motion.div variants={fadeUp} className="section-header" style={{ marginBottom: 48, textAlign: 'center', margin: '0 auto 48px' }}>
            <div className="section-kicker">CASE STUDIES</div>
            <h2 className="section-title" style={{ margin: '0 auto 16px' }}>
              <WordReveal>Enterprise Outcomes in Production</WordReveal>
            </h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Explore interactive operational blueprints and tangible metrics from our high-scale enterprise deployments.
            </p>
          </motion.div>
          <CaseStudiesDashboard />
        </RevealSection>

        <Marquee />

        {/* ── OFFERINGS / BENTO ── */}
        <RevealSection id="offerings" className="offerings-section">
          <motion.div variants={fadeUp} className="section-header" style={{ textAlign: 'center', margin: '0 auto 56px' }}>
            <div className="section-kicker">WHAT WE DELIVER</div>
            <h2 className="section-title" style={{ margin: '0 auto 16px' }}>
              <WordReveal>Beyond the Interface</WordReveal>
            </h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              AXIOM works at the intersection of design, infrastructure, and intelligence.
            </p>
          </motion.div>
          <div className="bento-grid">
            {expanded.map((item, index) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                className="offering-card-wrap"
              >
                <div className="offering-card">
                  <div className="offering-card-text">
                    <span className="offering-kicker">{item.kicker}</span>
                    <h3 className="bento-title">{item.title}</h3>
                    <p className="bento-desc">{item.description}</p>
                    <div className="offering-chips-grid">
                      {item.chips.map(chip => (
                        <span key={chip} className="offering-chip">{chip}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </RevealSection>

        {/* ── HIGHLIGHTS ── */}
        <RevealSection id="highlights" className="highlights-section">
          <motion.div variants={fadeUp} className="section-header">
            <div className="section-kicker">HIGHLIGHTS</div>
            <h2 className="section-title">
              <WordReveal>What the Engagement Produces</WordReveal>
            </h2>
          </motion.div>
          {highlightRows.map(([title, desc], index) => (
            <motion.div key={title} variants={fadeUp} className="highlight-row">
              <motion.div className="highlight-line" variants={lineGrow} />
              <div className="highlight-num">0{index + 1}</div>
              <div className="highlight-title">{title}</div>
              <div className="highlight-desc">{desc}</div>
            </motion.div>
          ))}
        </RevealSection>

        {/* ── FAQ ── */}
        <RevealSection id="faq" className="faq-section">
          <motion.div variants={fadeUp} className="section-header" style={{ textAlign: 'center', margin: '0 auto 48px' }}>
            <div className="section-kicker">FAQ</div>
            <h2 className="section-title" style={{ margin: '0 auto 16px' }}>
              <WordReveal>Common Questions</WordReveal>
            </h2>
          </motion.div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                item={faq}
                open={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? -1 : index)}
              />
            ))}
          </div>
        </RevealSection>

        {/* ── NOTES ── */}
        <RevealSection className="notes-section">
          <motion.div variants={fadeUp} className="notes-inner">
            {notes.map((note, index) => (
              <motion.div key={index} variants={fadeUp} className="note-row">
                <span className="note-bullet">→</span>
                <span>{note}</span>
              </motion.div>
            ))}
          </motion.div>
        </RevealSection>

        {/* ── CTA BANNER ── */}
        <RevealSection id="contact" className="cta-banner-section">
          <motion.div variants={scaleIn} className="cta-banner">
            <div className="cta-glow" />
            <div className="cta-orb cta-orb-1" />
            <div className="cta-orb cta-orb-2" />
            <h2 className="cta-headline">Your AI Infrastructure Shouldn't Be an Afterthought</h2>
            <p className="cta-sub">Talk to AXIOM's engineering team about what serious AI deployment actually looks like.</p>
            <MagneticButton href="#contact" className="btn-primary cta-btn">
              Book a Discovery Call →
            </MagneticButton>
            <div className="cta-note">Typically a 45-minute working session. No sales pitch.</div>
          </motion.div>
        </RevealSection>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          {/* Brand & Newsletter Column */}
          <div className="footer-brand-column">
            <div className="footer-brand-lockup">
              <span className="brand-small">[ AXIOM ]</span>
              <div className="footer-tagline">Enterprise AI Infrastructure. Built to last.</div>
            </div>
            {/* Engineering Log Subscription */}
            <div className="footer-newsletter">
              <div className="newsletter-title">Subscribe to the Engineering Log</div>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="email@address.com" className="newsletter-input" required />
                <button type="submit" className="newsletter-submit">
                  <span>→</span>
                </button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div className="footer-links-grid">
            <div className="footer-links-col">
              <div className="footer-links-header">Product</div>
              <a href="#solutions">Solutions</a>
              <a href="#platform">Platform</a>
              <a href="#case-studies">Case Studies</a>
            </div>
            <div className="footer-links-col">
              <div className="footer-links-header">Company</div>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-links-col">
              <div className="footer-links-header">Legal</div>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © 2026 AXIOM Technologies. All rights reserved. 
            <span className="footer-globe-badge">
              <span className="footer-globe-dot" /> Deployed across 4 continents.
            </span>
          </div>
          <div className="footer-social">
            <a href="mailto:hello@axiom.ai">hello@axiom.ai</a>
            <a href="#linkedin">LinkedIn</a>
          </div>
        </div>

        {/* Ambient Brand Watermark backdrop */}
        <div className="footer-giant-brand">AXIOM</div>
      </footer>
    </div>
  )
}

export default App
