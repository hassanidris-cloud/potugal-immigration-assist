import Head from 'next/head'

const BEX_URL = 'https://bexsofts.com'
const LOGO = `${BEX_URL}/wp-content/uploads/2024/08/about-us-logo-1.png`
const FOOTER_LOGO = `${BEX_URL}/wp-content/uploads/2024/08/footer-logo-new-1-300x109.jpg`
const HERO_IMAGES = [
  `${BEX_URL}/wp-content/uploads/2024/08/1-scaled.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/08/2-scaled.jpg`,
]

const categories = [
  {
    title: 'STAFFING',
    href: `${BEX_URL}/staffing/`,
    image: `${BEX_URL}/wp-content/uploads/2024/11/pexels-tima-miroshnichenko-6694475-scaled.jpg`,
  },
  {
    title: 'IT Advisory',
    href: `${BEX_URL}/it-advisory/`,
    image: `${BEX_URL}/wp-content/uploads/2024/11/pexels-a-darmel-8134165-scaled.jpg`,
  },
  {
    title: 'SAP',
    href: `${BEX_URL}/sap-service-offers/`,
    image: `${BEX_URL}/wp-content/uploads/2024/11/pexels-yankrukov-7793745-scaled.jpg`,
  },
  {
    title: 'E-commerce',
    href: `${BEX_URL}/e-commerce-services/`,
    image: `${BEX_URL}/wp-content/uploads/2024/11/pexels-negativespace-34577-scaled.jpg`,
  },
]

const values = [
  {
    title: 'Integrity and Reliability',
    text: 'Building trust through transparent communication, timely delivery, and consistent high-quality results.',
  },
  {
    title: 'Customer-Centric Approach',
    text: 'Focus on understanding and addressing unique client needs to maximize performance and efficiency.',
  },
  {
    title: 'Innovation-Driven Excellence',
    text: 'Commitment to delivering cutting-edge, tailored digital solutions that exceed client expectations.',
  },
]

const services = [
  {
    title: 'Staffing',
    items: [
      ['Contract-to-Hire Staffing Service', `${BEX_URL}/service/contract-to-hire-staffing-service/`],
      ['Permanent Staffing Service', `${BEX_URL}/service/permanent-staffing-service/`],
      ['Staff Augmentation Service', `${BEX_URL}/service/staff-augmentation-service/`],
      ['Offshore Staffing Service', `${BEX_URL}/service/offshore-staffing-service/`],
    ],
  },
  {
    title: 'IT Advisory',
    items: [
      ['AI Advisory Services', `${BEX_URL}/service/ai-advisory-services/`],
      ['Digital Transformation Advisory Services', `${BEX_URL}/service/digital-transformation-advisory-services/`],
      ['IT Strategy Advisory Services', `${BEX_URL}/service/it-strategy-advisory-services/`],
      ['SAP Project Management Advisory Service', `${BEX_URL}/service/sap-project-management-advisory-service/`],
      ['SAP Advisory Service', `${BEX_URL}/service/sap-advisory-service/`],
    ],
  },
  {
    title: 'SAP',
    items: [
      ['SAP Training', `${BEX_URL}/service/sap-training/`],
      ['SAP Application Managed Services', `${BEX_URL}/service/sap-application-managed-services/`],
      ['SAP Custom Development', `${BEX_URL}/service/sap-custom-development/`],
      ['SAP S4 HANA Upgrade', `${BEX_URL}/service/sap-s4-hana-upgrade/`],
      ['SAP S4 HANA Implementation', `${BEX_URL}/service/sap-s4-hana-implementation/`],
    ],
  },
  {
    title: 'E-commerce',
    items: [
      ['E-Commerce Advisory Services', `${BEX_URL}/service/e-commerce-advisory-services/`],
      ['E-Commerce Insights', `${BEX_URL}/service/e-commerce-insights/`],
      ['E-commerce Project Workflow', `${BEX_URL}/service/e-commerce-project-workflow/`],
    ],
  },
]

const reasons = [
  {
    title: 'Tailored Digital Solutions',
    text: 'BEX specializes in creating custom, innovative solutions to address your unique business needs, ensuring maximum performance and productivity.',
  },
  {
    title: 'Comprehensive Expertise',
    text: 'From website and mobile app development to ERP, CRM, and SAP services, BEX provides a full spectrum of IT solutions under one roof.',
  },
  {
    title: 'Cutting-Edge Technology',
    text: 'Leverage the latest advancements in AI integration, cloud computing, and advanced software frameworks to stay ahead in your industry.',
  },
  {
    title: 'End-to-End Support',
    text: "Enjoy seamless project execution with BEX's full-cycle development, IT advisory, and ongoing support to ensure success beyond deployment.",
  },
]

const process = [
  {
    title: 'Discovery and Analysis',
    text: 'Engage with clients to understand their unique business needs, goals, and challenges through in-depth consultations and requirement gathering.',
  },
  {
    title: 'Strategic Planning',
    text: 'Develop a customized roadmap outlining the best-suited technologies, frameworks, and solutions to address client objectives effectively.',
  },
  {
    title: 'Tailored Solution Design',
    text: 'Design and propose a scalable, high-quality IT solution aligned with client goals, ensuring seamless integration and long-term efficiency.',
  },
]

const storyImages = [
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-fauxels-3184339-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-fauxels-3184357-1-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-pavel-danilyuk-8112180-1-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-anna-nekrashevich-7552374-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-cottonbro-6153354-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-cristian-rojas-10041276-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2016/01/pexels-shvets-production-9052581-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2016/01/qw2-400x400.png`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-shvetsa-5325104-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-rdne-9034736-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-ekrulila-2261059-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-mikhail-nilov-8939054-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-lara-jameson-9363535-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-fauxels-3184416-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-rdne-8069475-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-julio-lopez-75309646-29502378-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/11/pexels-divinetechygirl-1181345-scaled-400x400.jpg`,
  `${BEX_URL}/wp-content/uploads/2024/12/pexels-erfin-ekarana-494408160-29583970-scaled-360x190.jpg`,
]

const stories = [
  ['Empowering Industrial Manufacturing Staffing with SAP Training Services', `${BEX_URL}/works/empowering-industrial-manufacturing-with-sap-training-services/`],
  ['Boosting Fashion Retail Performance with E-Commerce Solutions', `${BEX_URL}/works/boosting-fashion-retail-performance-with-e-commerce-solutions/`],
  ['Empowering BPO Operations with SAP Offshore Staffing Services', `${BEX_URL}/works/empowering-bpo-operations-with-sap-offshore-staffing-services/`],
  ['Optimizing Automobile Operations with SAP Application Managed Services', `${BEX_URL}/works/optimizing-automobile-operations-with-sap-application-managed-services/`],
  ['Transforming Utility Operations with a Custom SAP S/4HANA Upgrade', `${BEX_URL}/works/transforming-utility-operations-with-a-custom-sap-s-4hana-upgrade/`],
  ['Empowering Consumer Goods Operations with SAP S/4HANA Upgrade', `${BEX_URL}/works/empowering-consumer-goods-operations-with-sap-s-4hana-upgrade/`],
  ['Revolutionizing Textile Manufacturing with Digital Transformation Advisory', `${BEX_URL}/works/revolutionizing-textile-manufacturing-with-digital-transformation-advisory/`],
  ['Driving Operational Excellence in Wholesale Distribution with IT Strategy Advisory', `${BEX_URL}/works/driving-operational-excellence-in-wholesale-distribution-with-it-strategy-advisory/`],
  ['Transforming Financial Operations with SAP AI Advisory Services', `${BEX_URL}/works/transforming-financial-operations-with-sap-ai-advisory-services/`],
  ['Streamlining Retail Operations with Third-Party SAP Project Management Advisory', `${BEX_URL}/works/streamlining-retail-operations-with-third-party-sap-project-management-advisory/`],
  ['SAP Greenfield Implementation & Data Migration (ERP)', `${BEX_URL}/works/sap-greenfield-implementation-data-migration-erp/`],
  ['SAP Basis Setup, Integrate with Middleware & DR setup', `${BEX_URL}/works/sap-basis-setup-integrate-with-middleware-dr-setup/`],
  ['SAP ECC Integration with FactoryTalk - Automobile Sector', `${BEX_URL}/works/sap-ecc-integration-with-factorytalk-automobile-sector/`],
  ['SAP Solution Implementation for Construction Industry', `${BEX_URL}/works/sap-solution-implementation-for-construction-industry/`],
  ['SAP Solution Implementation for Healthcare Industry', `${BEX_URL}/works/sap-solution-implementation-for-healthcare-industry/`],
  ['SAP Solution Implementation for Manufacturing Industry', `${BEX_URL}/works/sap-solution-implementation-for-manufacturing-industry/`],
  ['SAP Implementation for Oil and Gas Industry', `${BEX_URL}/works/sap-implementation-for-oil-and-gas-industry/`],
  ['SAP Implementation for Utilities Sector', `${BEX_URL}/works/healthcare-giant-overcomes-merger-risks-for-growth/`],
]

const navLinks = [
  ['Home', '#home'],
  ['About us', '#about'],
  ['Services', '#services'],
  ['Staffing', `${BEX_URL}/staffing/`],
  ['IT Advisory', `${BEX_URL}/it-advisory/`],
  ['SAP', `${BEX_URL}/sap-service-offers/`],
  ['E-commerce', `${BEX_URL}/e-commerce-services/`],
  ['Success Stories', '#success-stories'],
  ['Jobs', `${BEX_URL}/jobs/`],
  ['Contact us', `${BEX_URL}/contact/`],
]

export default function TemporaryLandingPage() {
  return (
    <>
      <Head>
        <title>BEX - We empower your digital transformation.</title>
        <meta name="landing-page-version" content="temporary" />
        <meta
          name="description"
          content="BEX Software Solutions empowers digital transformation through staffing, IT advisory, SAP, and e-commerce services."
        />
        <meta property="og:title" content="BEX - We empower your digital transformation." />
        <meta property="og:description" content="Strategic Advisory, Advanced SAP Integration, and Scalable E-Commerce Services for Lasting Success." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={BEX_URL} />
        <meta property="og:image" content={LOGO} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BEX - We empower your digital transformation." />
        <meta name="twitter:description" content="Strategic Advisory, Advanced SAP Integration, and Scalable E-Commerce Services for Lasting Success." />
        <meta name="twitter:image" content={LOGO} />
        <link rel="canonical" href={BEX_URL} />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div className="bex-home" id="home">
        <header className="bex-header">
          <a className="bex-logo" href="#home" aria-label="BEX home">
            <img src={LOGO} alt="BEX" />
          </a>
          <nav className="bex-nav" aria-label="Primary navigation">
            {navLinks.map(([label, href]) => (
              <a href={href} key={label}>{label}</a>
            ))}
          </nav>
        </header>

        <main>
          <section className="bex-hero" aria-labelledby="bex-hero-title">
            <div className="bex-hero-bg" aria-hidden>
              <img src={HERO_IMAGES[0]} alt="" />
              <img src={HERO_IMAGES[1]} alt="" />
            </div>
            <div className="bex-hero-overlay" aria-hidden />
            <div className="bex-container bex-hero-content">
              <p className="bex-super">We empower your digital transformation.</p>
              <h1 id="bex-hero-title">BEX SOFTWARE SOLUTIONS</h1>
              <div className="bex-hero-actions">
                <a href={`${BEX_URL}/contact/`} className="bex-btn bex-btn-link">talk to us</a>
              </div>
              <p className="bex-hero-lead">
                Empowering Your Business with End-to-End Digital Solutions
              </p>
              <p className="bex-hero-sub">
                Strategic Advisory, Advanced SAP Integration, and Scalable E-Commerce Services for Lasting Success.
              </p>
              <a href={`${BEX_URL}/service-categories/`} className="bex-btn bex-btn-primary">BROWSE SERVICES</a>
            </div>
          </section>

          <section className="bex-section bex-about" id="about" aria-labelledby="bex-about-title">
            <div className="bex-container bex-about-grid">
              <div className="bex-copy">
                <h2 id="bex-about-title">About us</h2>
                <p>
                  <strong>BEX Software Solutions</strong> is a global transformational enterprise <strong>based in Qatar</strong>, with a presence in UAE, Pakistan, Saudi Arabia, and Philippines. Partnered with SAP, BEX brings certified expertise and industry experience to deliver smart, customer-focused solutions tailored to clients' needs.
                </p>
                <p>
                  We offer a comprehensive suite of services, spanning <strong>Staffing services</strong>, <strong>IT Advisory services</strong>, <strong>SAP services</strong>, and <strong>E-commerce services</strong>. Our customer-centric approach emphasizes high-quality, innovative business solutions designed to maximize client performance, streamline operations, and drive productivity.
                </p>
              </div>
              <div className="bex-logo-panel">
                <div className="bex-dot-map" aria-hidden />
                <img src={LOGO} alt="BEX" />
              </div>
            </div>
          </section>

          <section className="bex-section bex-what" aria-labelledby="bex-what-title">
            <div className="bex-container">
              <h2 id="bex-what-title" className="bex-centered-title">What we do</h2>
              <div className="bex-category-grid">
                {categories.map((category) => (
                  <a href={category.href} className="bex-category" key={category.title}>
                    <img src={category.image} alt="" />
                    <span>{category.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="bex-values" aria-labelledby="bex-values-title">
            <div className="bex-container">
              <h2 id="bex-values-title" className="bex-centered-title">Our Values</h2>
              <div className="bex-values-grid">
                {values.map((value, index) => (
                  <article className="bex-value" key={value.title}>
                    <span className="bex-value-icon">{index + 1}</span>
                    <div>
                      <h3>{value.title}</h3>
                      <p>{value.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bex-section" id="services" aria-labelledby="bex-services-title">
            <div className="bex-container">
              <h2 id="bex-services-title" className="bex-centered-title">Our Services</h2>
              <div className="bex-service-grid">
                {services.map((group) => (
                  <article className="bex-service-group" key={group.title}>
                    <h3>{group.title}</h3>
                    <ul>
                      {group.items.map(([name, href]) => (
                        <li key={name}>
                          <a href={href}>
                            <span>{name}</span>
                            <em>Read more</em>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bex-numbers" aria-labelledby="bex-numbers-title">
            <div className="bex-container">
              <h2 id="bex-numbers-title">BEX by the numbers</h2>
              <div className="bex-number-grid">
                <div><strong>50+</strong><span>Projects Completed</span></div>
                <div><strong>22</strong><span>In house SAP Resources</span></div>
                <div><strong>30</strong><span>Satisfied Customers</span></div>
              </div>
            </div>
          </section>

          <section className="bex-section bex-why" aria-labelledby="bex-why-title">
            <div className="bex-container bex-why-grid">
              <h2 id="bex-why-title">Why Choose us</h2>
              <div className="bex-reason-grid">
                {reasons.map((reason) => (
                  <article className="bex-reason" key={reason.title}>
                    <h3>{reason.title}</h3>
                    <p>{reason.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bex-process" aria-labelledby="bex-process-title">
            <div className="bex-container">
              <p className="bex-process-kicker">BEX Service Approach Identification Process</p>
              <h2 id="bex-process-title">BEX Service Approach Identification Process</h2>
              <div className="bex-process-grid">
                {process.map((step) => (
                  <article className="bex-process-card" key={step.title}>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bex-section bex-stories" id="success-stories" aria-labelledby="bex-stories-title">
            <div className="bex-container">
              <h2 id="bex-stories-title" className="bex-centered-title">Success Stories</h2>
              <div className="bex-story-grid">
                {stories.map(([title, href], index) => (
                  <article className="bex-story" key={title}>
                    <a href={href}>
                      <img src={storyImages[index] || storyImages[0]} alt="" />
                      <span>{title}</span>
                    </a>
                    <a className="bex-read-more" href={href}>Read more</a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="bex-footer">
          <div className="bex-container bex-footer-grid">
            <div>
              <img className="bex-footer-logo" src={FOOTER_LOGO} alt="BEX" />
              <p>We empower your digital transformation.</p>
            </div>
            <div>
              <h2>Contact Info</h2>
              <p>Email: <a href="mailto:info@bexsofts.com">info@bexsofts.com</a></p>
              <p>Doha, Qatar</p>
            </div>
            <div>
              <h2>Our Service Categories</h2>
              <a href={`${BEX_URL}/staffing/`}>Staffing</a>
              <a href={`${BEX_URL}/it-advisory/`}>IT Advisory</a>
              <a href={`${BEX_URL}/sap-service-offers/`}>SAP</a>
              <a href={`${BEX_URL}/e-commerce-services/`}>E-commerce</a>
            </div>
          </div>
          <div className="bex-copyright">© 2026 BEX SOFTWARE SOLUTIONS</div>
        </footer>
      </div>

      <style jsx global>{`
        .bex-home {
          --bex-teal: #64adbd;
          --bex-teal-dark: #3f94a4;
          --bex-gold: #b1a05f;
          --bex-ink: #252938;
          --bex-muted: #5f6572;
          --bex-line: #d9e5e8;
          background: #fff;
          color: var(--bex-ink);
          font-family: "Plus Jakarta Sans", "DM Sans", Arial, sans-serif;
          overflow-x: hidden;
        }

        .bex-home *,
        .bex-home *::before,
        .bex-home *::after {
          box-sizing: border-box;
        }

        .bex-home h1,
        .bex-home h2,
        .bex-home h3,
        .bex-home p {
          margin-top: 0;
          letter-spacing: 0;
          max-width: 100%;
          overflow-wrap: break-word;
          white-space: normal !important;
        }

        .bex-header {
          height: 92px;
          width: 100%;
          padding: 0 max(24px, calc((100vw - 1120px) / 2));
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
        }

        .bex-logo {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }

        .bex-logo img {
          width: 145px;
          height: auto;
          display: block;
        }

        .bex-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 18px;
          flex-wrap: wrap;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .bex-nav a,
        .bex-home a {
          color: inherit;
          text-decoration: none;
        }

        .bex-nav a:hover,
        .bex-home a:hover {
          color: var(--bex-teal-dark);
        }

        .bex-container {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .bex-hero {
          min-height: calc(100svh - 92px);
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: #101827;
        }

        .bex-hero-bg,
        .bex-hero-bg img,
        .bex-hero-overlay {
          position: absolute;
          inset: 0;
        }

        .bex-hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          animation: bexFade 12s infinite;
        }

        .bex-hero-bg img:nth-child(2) {
          animation-delay: 6s;
        }

        .bex-hero-overlay {
          background: linear-gradient(90deg, rgba(18, 24, 36, 0.88), rgba(18, 24, 36, 0.54), rgba(18, 24, 36, 0.18));
          z-index: 1;
        }

        .bex-hero-content {
          position: relative;
          z-index: 2;
          color: #fff;
          padding-top: 80px;
          padding-bottom: 80px;
        }

        .bex-super {
          color: rgba(255, 255, 255, 0.88);
          font-size: clamp(2.2rem, 5vw, 4.8rem);
          line-height: 1.02;
          max-width: 700px;
          margin-bottom: 12px;
          font-weight: 800;
        }

        .bex-hero h1 {
          max-width: 760px;
          margin-bottom: 18px;
          color: #fff;
          font-size: clamp(1.15rem, 2vw, 1.8rem);
          line-height: 1.1;
          font-weight: 800;
          text-transform: uppercase;
        }

        .bex-hero-lead {
          max-width: 760px;
          margin: 34px 0 10px;
          color: #fff;
          font-size: clamp(1.6rem, 3.3vw, 3rem);
          line-height: 1.15;
          font-weight: 800;
        }

        .bex-hero-sub {
          max-width: 650px;
          color: rgba(255, 255, 255, 0.86);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 28px;
        }

        .bex-btn {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 22px;
          border-radius: 3px;
          border: 1px solid transparent;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .bex-btn-primary {
          color: #fff !important;
          background: var(--bex-teal);
          border-color: var(--bex-teal);
        }

        .bex-btn-link {
          padding: 0;
          min-height: auto;
          color: #fff !important;
          text-transform: lowercase;
          border: 0;
        }

        .bex-section {
          padding: 90px 0;
          background: #fff;
        }

        .bex-about-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.96fr) minmax(320px, 1.04fr);
          gap: 70px;
          align-items: center;
        }

        .bex-copy h2,
        .bex-centered-title,
        .bex-why h2,
        .bex-process h2 {
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.1;
          margin-bottom: 24px;
          color: var(--bex-ink);
          font-weight: 900;
        }

        .bex-copy p {
          color: var(--bex-muted);
          font-size: 1rem;
          line-height: 1.75;
        }

        .bex-copy strong {
          color: var(--bex-ink);
          font-weight: 900;
        }

        .bex-logo-panel {
          min-height: 360px;
          position: relative;
          display: grid;
          place-items: center;
          overflow: hidden;
        }

        .bex-logo-panel img {
          width: min(420px, 86%);
          height: auto;
          position: relative;
          z-index: 2;
        }

        .bex-dot-map {
          position: absolute;
          inset: 0;
          opacity: 0.42;
          background-image: radial-gradient(circle, rgba(100, 173, 189, 0.34) 1.4px, transparent 1.4px);
          background-size: 11px 11px;
          mask-image: radial-gradient(ellipse, #000 0%, #000 58%, transparent 72%);
        }

        .bex-centered-title {
          text-align: center;
        }

        .bex-category-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 54px;
          margin-top: 50px;
        }

        .bex-category {
          display: grid;
          gap: 26px;
          color: var(--bex-ink);
          text-align: center;
          font-weight: 800;
          font-size: 0.86rem;
        }

        .bex-category img {
          width: 100%;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          border-radius: 3px;
        }

        .bex-category span {
          display: block;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--bex-teal);
        }

        .bex-values,
        .bex-process {
          padding: 90px 0;
          color: #fff;
          background:
            linear-gradient(rgba(38, 42, 59, 0.94), rgba(38, 42, 59, 0.94)),
            repeating-linear-gradient(60deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 42px),
            repeating-linear-gradient(120deg, rgba(255, 255, 255, 0.06) 0 1px, transparent 1px 42px),
            #282c3d;
        }

        .bex-values h2,
        .bex-process h2 {
          color: #fff;
        }

        .bex-values-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 54px;
          margin-top: 46px;
        }

        .bex-value {
          display: grid;
          grid-template-columns: 54px minmax(0, 1fr);
          gap: 22px;
          align-items: start;
        }

        .bex-value-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--bex-teal);
          color: #fff;
          font-weight: 900;
        }

        .bex-value h3,
        .bex-process-card h3 {
          color: #fff;
          font-size: 1.05rem;
          line-height: 1.3;
          margin-bottom: 10px;
        }

        .bex-value p,
        .bex-process-card p {
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.65;
          margin-bottom: 0;
        }

        .bex-service-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
          margin-top: 48px;
        }

        .bex-service-group {
          padding: 28px 24px;
          border: 1px solid var(--bex-line);
          border-radius: 4px;
          background: #fff;
          box-shadow: 0 18px 48px rgba(31, 42, 50, 0.06);
        }

        .bex-service-group h3 {
          margin-bottom: 18px;
          font-size: 1.2rem;
          color: var(--bex-teal-dark);
        }

        .bex-service-group ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .bex-service-group li + li {
          border-top: 1px solid #eef3f4;
        }

        .bex-service-group a {
          min-height: 58px;
          display: grid;
          gap: 4px;
          padding: 12px 0;
          color: var(--bex-ink);
        }

        .bex-service-group em,
        .bex-read-more {
          color: var(--bex-teal-dark);
          font-size: 0.75rem;
          font-style: normal;
          font-weight: 800;
        }

        .bex-numbers {
          padding: 78px 0;
          color: #fff;
          background: var(--bex-teal-dark);
        }

        .bex-numbers .bex-container {
          display: grid;
          grid-template-columns: minmax(220px, 0.7fr) minmax(0, 1.3fr);
          gap: 44px;
          align-items: center;
        }

        .bex-numbers h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.1;
          margin-bottom: 0;
        }

        .bex-number-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .bex-number-grid div {
          padding: 24px 20px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.24);
        }

        .bex-number-grid strong {
          display: block;
          font-size: clamp(3rem, 7vw, 5rem);
          line-height: 0.9;
        }

        .bex-number-grid span {
          display: block;
          margin-top: 12px;
          color: rgba(255, 255, 255, 0.84);
          font-weight: 800;
        }

        .bex-why-grid {
          display: grid;
          grid-template-columns: minmax(240px, 0.66fr) minmax(0, 1.34fr);
          gap: 60px;
          align-items: start;
        }

        .bex-reason-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .bex-reason {
          padding: 26px 24px;
          border-left: 3px solid var(--bex-teal);
          background: #f6f9fa;
        }

        .bex-reason h3 {
          font-size: 1.08rem;
          margin-bottom: 10px;
        }

        .bex-reason p {
          color: var(--bex-muted);
          line-height: 1.65;
          margin-bottom: 0;
        }

        .bex-process-kicker {
          color: var(--bex-teal);
          text-align: center;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .bex-process h2 {
          text-align: center;
        }

        .bex-process-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          margin-top: 46px;
        }

        .bex-process-card {
          padding: 30px 26px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.06);
        }

        .bex-story-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 26px;
          margin-top: 48px;
        }

        .bex-story {
          border: 1px solid var(--bex-line);
          background: #fff;
          box-shadow: 0 18px 48px rgba(31, 42, 50, 0.06);
        }

        .bex-story img {
          width: 100%;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          display: block;
        }

        .bex-story span {
          min-height: 84px;
          display: block;
          padding: 20px 20px 8px;
          color: var(--bex-ink);
          font-weight: 800;
          line-height: 1.35;
        }

        .bex-read-more {
          display: inline-flex;
          padding: 0 20px 20px;
        }

        .bex-footer {
          padding: 58px 0 0;
          color: #fff;
          background: #202432;
        }

        .bex-footer-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) repeat(2, minmax(190px, 0.5fr));
          gap: 48px;
        }

        .bex-footer-logo {
          width: 178px;
          height: auto;
          display: block;
          margin-bottom: 18px;
        }

        .bex-footer h2 {
          color: #fff;
          font-size: 1rem;
          margin-bottom: 18px;
        }

        .bex-footer p,
        .bex-footer a {
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.7;
        }

        .bex-footer a {
          display: table;
          margin-bottom: 9px;
        }

        .bex-copyright {
          margin-top: 42px;
          padding: 18px 24px;
          text-align: center;
          color: rgba(255, 255, 255, 0.72);
          background: rgba(0, 0, 0, 0.18);
          font-size: 0.86rem;
          font-weight: 700;
        }

        @keyframes bexFade {
          0%,
          42% {
            opacity: 1;
          }
          50%,
          92% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @media (max-width: 1040px) {
          .bex-header {
            height: auto;
            min-height: 92px;
            align-items: flex-start;
            flex-direction: column;
            padding: 18px 24px;
          }

          .bex-nav {
            justify-content: flex-start;
          }

          .bex-about-grid,
          .bex-numbers .bex-container,
          .bex-why-grid {
            grid-template-columns: 1fr;
          }

          .bex-category-grid,
          .bex-service-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .bex-story-grid,
          .bex-process-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .bex-container {
            padding-left: 18px;
            padding-right: 18px;
            max-width: 360px;
            margin-left: 0;
            margin-right: auto;
          }

          .bex-home h1,
          .bex-home h2,
          .bex-home h3,
          .bex-home p,
          .bex-home span {
            overflow-wrap: anywhere;
          }

          .bex-logo img {
            width: 120px;
          }

          .bex-nav {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            width: 100%;
            gap: 10px 16px;
            font-size: 0.68rem;
          }

          .bex-hero {
            min-height: 78svh;
          }

          .bex-hero-content {
            max-width: 340px;
            margin-left: 0;
            margin-right: auto;
            padding-top: 58px;
            padding-bottom: 58px;
          }

          .bex-super,
          .bex-hero h1,
          .bex-hero-lead,
          .bex-hero-sub {
            max-width: 315px;
          }

          .bex-super {
            font-size: 1.95rem;
            line-height: 1.08;
          }

          .bex-hero-lead {
            font-size: 1.32rem;
            line-height: 1.18;
          }

          .bex-hero-sub {
            font-size: 0.92rem;
          }

          .bex-section,
          .bex-values,
          .bex-process {
            padding: 64px 0;
          }

          .bex-about-grid {
            gap: 34px;
          }

          .bex-copy h2,
          .bex-centered-title,
          .bex-why h2,
          .bex-process h2 {
            font-size: 2rem;
          }

          .bex-category-grid,
          .bex-service-grid,
          .bex-values-grid,
          .bex-number-grid,
          .bex-reason-grid,
          .bex-story-grid,
          .bex-process-grid,
          .bex-footer-grid {
            grid-template-columns: 1fr;
          }

          .bex-category-grid {
            gap: 30px;
          }

          .bex-logo-panel {
            min-height: 230px;
          }

          .bex-value {
            grid-template-columns: 44px minmax(0, 1fr);
          }

          .bex-story span {
            min-height: auto;
          }
        }
      `}</style>
    </>
  )
}
