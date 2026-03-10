import db from "../src/db";
import { contentTable } from "../src/db/schema";

type ContentInsert = typeof contentTable.$inferInsert;

const now = Date.now();

async function insert(
  data: Omit<ContentInsert, "createdAt" | "updatedAt">
): Promise<number> {
  const [row] = await db
    .insert(contentTable)
    .values({ ...data, createdAt: now, updatedAt: now })
    .returning({ id: contentTable.id });
  return row.id;
}

async function insertMany(
  items: Omit<ContentInsert, "createdAt" | "updatedAt">[]
) {
  for (const item of items) {
    await insert(item);
  }
}

async function main() {
  const existing = await db.select({ id: contentTable.id }).from(contentTable).limit(1);
  if (existing.length > 0) {
    console.log("Content already seeded, skipping.");
    return;
  }
  console.log("Seeding content...");

  // ─── SITE INFO ───
  const siteInfoId = await insert({
    key: "site-info",
    type: "section",
    order: 0,
  });
  await insertMany([
    { key: "company-name", type: "text", value: "Light Detail Studio", parentId: siteInfoId, order: 0 },
    { key: "phone-1", type: "text", value: "+40740488935", parentId: siteInfoId, order: 1 },
    { key: "phone-2", type: "text", value: "+40751195354", parentId: siteInfoId, order: 2 },
    { key: "email-1", type: "text", value: "bianca.cimpean@lightdetail.eu", parentId: siteInfoId, order: 3 },
    { key: "email-2", type: "text", value: "camelia.popa@lightdetail.eu", parentId: siteInfoId, order: 4 },
    { key: "address", type: "text", value: "Memorandumului 10", parentId: siteInfoId, order: 5 },
    { key: "city", type: "text", value: "Cluj-Napoca", parentId: siteInfoId, order: 6 },
    { key: "country", type: "text", value: "Romania", parentId: siteInfoId, order: 7 },
    { key: "website", type: "text", value: "https://lightdetail.eu", parentId: siteInfoId, order: 8 },
    { key: "facebook", type: "text", value: "https://www.facebook.com/lightdetailstudio", parentId: siteInfoId, order: 9 },
    { key: "instagram", type: "text", value: "https://www.instagram.com/lightdetailstudio", parentId: siteInfoId, order: 10 },
  ]);
  console.log("  site-info done");

  // ─── PAGES ───
  const pagesId = await insert({
    key: "pages",
    type: "section",
    order: 1,
  });

  // ── HOME ──
  const homeId = await insert({
    key: "home",
    type: "section",
    parentId: pagesId,
    order: 0,
  });
  await insertMany([
    { key: "seo-title", type: "text", value: "Light Detail Studio | Interior Design Cluj-Napoca", parentId: homeId, order: 0 },
    { key: "seo-description", type: "text", value: "Light Detail Studio — design interior Cluj-Napoca. Amenajari interioare Cluj, randari 3D si vizualizari arhitecturale. Transformam spatii cu design functional si estetic.", parentId: homeId, order: 1 },
    { key: "seo-keywords", type: "text", value: "design interior Cluj, amenajari interioare Cluj-Napoca, interior design Cluj-Napoca, randari 3D, Light Detail Studio", parentId: homeId, order: 2 },
    { key: "banner-img", type: "image", value: "/img/cover.jpg", parentId: homeId, order: 3 },
    { key: "banner-vid", type: "video", value: "/vid/home-landscape.webm", parentId: homeId, order: 4, metadata: { mobile: "/vid/home-portrait.webm" } },
    { key: "banner-title", type: "text", value: "our|mission", parentId: homeId, order: 5 },
    { key: "banner-subtitle", type: "text", value: "Light Detail Studio's mission is to design and implement functionally-aesthetically balanced spaces tailored to the client's personality traits.", parentId: homeId, order: 6 },
  ]);
  console.log("  home done");

  // ── ABOUT ──
  const aboutId = await insert({
    key: "about",
    type: "section",
    parentId: pagesId,
    order: 1,
  });
  await insertMany([
    { key: "seo-title", type: "text", value: "About Us | Light Detail Studio - Interior Design Cluj-Napoca", parentId: aboutId, order: 0 },
    { key: "seo-description", type: "text", value: "Echipa design interior Cluj — cunoaste echipa Light Detail Studio. Duo de inspiratie si colaborare in design interior Cluj-Napoca.", parentId: aboutId, order: 1 },
    { key: "seo-keywords", type: "text", value: "echipa design interior Cluj, despre noi Light Detail, interior designers Cluj-Napoca", parentId: aboutId, order: 2 },
    { key: "banner-img", type: "image", value: "/img/about-us-new.webp", parentId: aboutId, order: 3, metadata: { mobile: "/img/about-us-mobile.webp" } },
    { key: "banner-title", type: "text", value: "about|us", parentId: aboutId, order: 4 },
    { key: "banner-subtitle", type: "text", value: "Duo of inspiration and collaboration in the form of a friendly partnership created to freely bring bold ideas into life.", parentId: aboutId, order: 5 },
  ]);
  console.log("  about done");

  // ── INTERIOR DESIGN ──
  const interiorId = await insert({
    key: "interior-design",
    type: "section",
    parentId: pagesId,
    order: 2,
  });
  await insertMany([
    { key: "banner-img", type: "image", value: "/img/interior-design.webp", parentId: interiorId, order: 0 },
    { key: "banner-title", type: "text", value: "interior design|portfolio", parentId: interiorId, order: 1 },
    { key: "banner-subtitle", type: "text", value: "Light Detail Studio's mission is to design and implement functionally-aesthetically balanced spaces tailored to the client's personality traits.", parentId: interiorId, order: 2 },
  ]);
  console.log("  interior-design done");

  // ── SERVICES ──
  const servicesId = await insert({
    key: "services",
    type: "section",
    parentId: pagesId,
    order: 3,
  });
  await insertMany([
    { key: "seo-title", type: "text", value: "Interior Design Services Cluj-Napoca | Light Detail Studio", parentId: servicesId, order: 0 },
    { key: "seo-description", type: "text", value: "Servicii design interior Cluj-Napoca — pachete personalizate de amenajari interioare, randari 3D si management de proiect. Light Detail Studio.", parentId: servicesId, order: 1 },
    { key: "seo-keywords", type: "text", value: "servicii design interior Cluj-Napoca, randari 3D, amenajari interioare Cluj, pachete design interior", parentId: servicesId, order: 2 },
    { key: "banner-img", type: "image", value: "/img/services_1.png", parentId: servicesId, order: 3 },
    { key: "banner-title", type: "text", value: "our|services", parentId: servicesId, order: 4 },
    { key: "banner-subtitle", type: "text", value: "We design homes that mirrors and shelters each and every lifestyle.", parentId: servicesId, order: 5 },
    { key: "section-title", type: "text", value: "Discover the right pack for you", parentId: servicesId, order: 6 },
    { key: "section-subtitle", type: "text", value: "We offer 3 tailored service packages designed to meet a variety of needs, lifestyles, and budgets. Whether you're looking for a solid design foundation, personalized guidance during implementation, or a fully managed, stress-free transformation, we've got you covered. Explore our offerings below to find the perfect fit for your project.", parentId: servicesId, order: 7 },
    { key: "jsonld-description", type: "text", value: "Interior design services including tailored design packages, 3D visualizations, and project management in Cluj-Napoca, Romania.", parentId: servicesId, order: 8 },
  ]);
  console.log("  services done");

  // ── CONTACT ──
  const contactId = await insert({
    key: "contact",
    type: "section",
    parentId: pagesId,
    order: 4,
  });
  await insertMany([
    { key: "seo-title", type: "text", value: "Contact | Light Detail Studio - Interior Design Cluj-Napoca", parentId: contactId, order: 0 },
    { key: "seo-description", type: "text", value: "Contacteaza Light Detail Studio — design interior Cluj-Napoca. Programeaza o consultatie pentru amenajari interioare. Memorandumului 10, Cluj-Napoca.", parentId: contactId, order: 1 },
    { key: "seo-keywords", type: "text", value: "contact design interior Cluj, Light Detail Studio contact, design interior Cluj-Napoca", parentId: contactId, order: 2 },
    { key: "banner-img", type: "image", value: "/img/contact-new.webp", parentId: contactId, order: 3, metadata: { mobile: "/img/contact-mobile.webp" } },
    { key: "banner-title", type: "text", value: "contact|us", parentId: contactId, order: 4 },
    { key: "banner-subtitle", type: "text", value: "We design homes that mirrors and shelters each and every lifestyle.", parentId: contactId, order: 5 },
    { key: "heading", type: "text", value: "LIGHT DETAIL", parentId: contactId, order: 6 },
    { key: "cta-heading", type: "text", value: "LET`S GET TO KNOW EACH OTHER", parentId: contactId, order: 7 },
    { key: "cta-subheading", type: "text", value: "SEND US AN EMAIL", parentId: contactId, order: 8 },
  ]);
  console.log("  contact done");

  // ── TERMS OF SERVICE ──
  const tosId = await insert({
    key: "terms-of-service",
    type: "section",
    parentId: pagesId,
    order: 5,
  });
  await insertMany([
    { key: "seo-title", type: "text", value: "Terms of Service | Light Detail Studio", parentId: tosId, order: 0 },
    { key: "seo-description", type: "text", value: "Terms of Service for Light Detail Studio. Read the terms governing the use of our interior design services.", parentId: tosId, order: 1 },
    { key: "banner-img", type: "image", value: "/img/residential.jpg", parentId: tosId, order: 2 },
    { key: "banner-title", type: "text", value: "Terms of|Service", parentId: tosId, order: 3 },
    { key: "banner-subtitle", type: "text", value: `Welcome to Light Detail. These Terms of Service (\u201CTerms\u201D) govern your use of our website and services. By accessing or using our website and services, you agree to be bound by these Terms.`, parentId: tosId, order: 4 },
    {
      key: "content",
      type: "text",
      parentId: tosId,
      order: 5,
      value: JSON.stringify([
        { type: "heading", text: "Terms of Service" },
        { type: "heading", text: "Introduction" },
        { type: "paragraph", text: `Welcome to Light Detail. These Terms of Service (\u201CTerms\u201D) govern your use of our website and services. By accessing or using our website and services, you agree to be bound by these Terms.` },
        { type: "heading", text: "Services" },
        { type: "paragraph", text: "Light Detail provides interior design services, including consultations, design planning, and project management. Our services are designed to help you create aesthetically pleasing and functional spaces tailored to your needs." },
        { type: "heading", text: "Use of Services" },
        { type: "paragraph", text: "You agree to use our services for lawful purposes only. You shall not use our services in any way that could harm Light Detail, our employees, or other clients." },
        { type: "heading", text: "Fees and Payments" },
        { type: "paragraph", text: "Fees for our services will be agreed upon in a written contract before the commencement of any work. Payments are due as outlined in the contract. Late payments may incur additional charges." },
        { type: "heading", text: "Cancellation and Refund Policy" },
        { type: "paragraph", text: "If you wish to cancel our services, you must provide written notice. Refunds will be provided based on the terms outlined in your contract. Certain fees may be non-refundable." },
        { type: "heading", text: "Intellectual Property" },
        { type: "paragraph", text: "All content, including but not limited to designs, graphics, and text, provided by Light Detail is the property of Light Detail and is protected by copyright laws. You may not reproduce, distribute, or create derivative works from our content without our express written permission." },
        { type: "heading", text: "Confidentiality" },
        { type: "paragraph", text: "We respect your privacy and are committed to protecting your personal information. We will not disclose your information to third parties without your consent, except as required by law." },
        { type: "heading", text: "Limitation of Liability" },
        { type: "paragraph", text: "Light Detail is not liable for any direct, indirect, incidental, or consequential damages arising from the use of our services. Our liability is limited to the amount paid for the services provided." },
        { type: "heading", text: "Indemnification" },
        { type: "paragraph", text: "You agree to indemnify and hold Light Detail harmless from any claims, losses, or damages arising from your use of our services or your violation of these Terms." },
        { type: "heading", text: "Governing Law" },
        { type: "paragraph", text: "These Terms are governed by the laws of Romania. Any disputes arising from these Terms or our services will be resolved in the courts of Romania." },
        { type: "heading", text: "Changes to Terms" },
        { type: "paragraph", text: "We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting on our website. Your continued use of our services constitutes your acceptance of the modified Terms." },
        { type: "heading", text: "Contact Form and Data Collection" },
        { type: "paragraph", text: "When you fill out our contact form, we collect the personal information you provide, including your name, email address, and any other details you choose to include. This information is used solely for the purpose of responding to your inquiries and providing you with information about our services. We will not share your personal information with third parties without your consent, except as required by law." },
        { type: "heading", text: "Contact Us" },
        { type: "paragraph", text: "If you have any questions or concerns about these Terms, please contact us at:" },
        { type: "paragraph", text: "Light Detail\nAddress: Ludwing van Beethoven, nr.29a\nCity: Cluj-Napoca, Romania\nEmail: bianca.cimpean@lightdetail.eu\nTel: +40740488935 / +40751195354" },
        { type: "paragraph", text: "By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. Thank you for choosing Light Detail for your interior design needs." },
      ]),
    },
  ]);
  console.log("  terms-of-service done");

  // ── PRIVACY POLICY ──
  const privacyId = await insert({
    key: "privacy-policy",
    type: "section",
    parentId: pagesId,
    order: 6,
  });
  await insertMany([
    { key: "seo-title", type: "text", value: "Privacy Policy | Light Detail Studio", parentId: privacyId, order: 0 },
    { key: "seo-description", type: "text", value: "Privacy Policy for Light Detail Studio. Learn how we collect, use, and protect your personal information.", parentId: privacyId, order: 1 },
    { key: "banner-img", type: "image", value: "/img/residential.jpg", parentId: privacyId, order: 2 },
    { key: "banner-title", type: "text", value: "Privacy|Policy", parentId: privacyId, order: 3 },
    { key: "banner-subtitle", type: "text", value: "Welcome to Light Detail. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our contact form.", parentId: privacyId, order: 4 },
    {
      key: "content",
      type: "text",
      parentId: privacyId,
      order: 5,
      value: JSON.stringify([
        { type: "heading", text: "Privacy Policy" },
        { type: "heading", text: "Introduction" },
        { type: "paragraph", text: "Welcome to Light Detail. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our contact form." },
        { type: "heading", text: "Information We Collect" },
        { type: "paragraph", text: "When you use our contact form, we collect the following personal information:" },
        { type: "list", items: [
          { bold: "Name", text: ": To address you properly in our communications." },
          { bold: "Email Address", text: ": To respond to your inquiries." },
          { bold: "Phone Number", text: ": (If provided) To contact you regarding your inquiries." },
          { bold: "Message Content", text: ": Any information you choose to include in your message to us." },
        ]},
        { type: "heading", text: "Use of Information" },
        { type: "paragraph", text: "The information collected through our contact form is used solely for the following purposes:" },
        { type: "list", items: [
          { text: "To respond to your inquiries and provide information about our services." },
          { text: "To improve our website and services based on your feedback." },
        ]},
        { type: "heading", text: "Data Sharing and Disclosure" },
        { type: "paragraph", text: "We do not share, sell, or rent your personal information to third parties. Your information may only be disclosed under the following circumstances:" },
        { type: "list", items: [
          { text: "With your explicit consent." },
          { text: "As required by law, such as to comply with a subpoena or similar legal process." },
        ]},
        { type: "heading", text: "Data Security" },
        { type: "paragraph", text: "We take the security of your personal information seriously. We implement appropriate technical and organizational measures to protect your information from unauthorized access, disclosure, alteration, or destruction." },
        { type: "heading", text: "Data Retention" },
        { type: "paragraph", text: "We will retain your personal information only for as long as necessary to fulfill the purposes for which it was collected and to comply with legal obligations." },
        { type: "heading", text: "Your Rights" },
        { type: "paragraph", text: "You have the following rights regarding your personal information:" },
        { type: "list", items: [
          { bold: "Access", text: ": You have the right to request a copy of the personal information we hold about you." },
          { bold: "Correction", text: ": You have the right to request that we correct any inaccuracies in your personal information." },
          { bold: "Deletion", text: ": You have the right to request that we delete your personal information, subject to certain legal restrictions." },
        ]},
        { type: "heading", text: "Changes to This Privacy Policy" },
        { type: "paragraph", text: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Your continued use of our website and services constitutes your acceptance of the updated Privacy Policy." },
        { type: "heading", text: "Contact Us" },
        { type: "paragraph", text: "If you have any questions or concerns about these Terms, please contact us at:" },
        { type: "paragraph", text: "Light Detail\nAddress: Ludwing van Beethoven, nr.29a\nCity: Cluj-Napoca, Romania\nEmail: bianca.cimpean@lightdetail.eu\nTel: +40740488935 / +40751195354" },
        { type: "paragraph", text: "By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. Thank you for choosing Light Detail for your interior design needs." },
      ]),
    },
  ]);
  console.log("  privacy-policy done");

  // ─── WORKFLOW ───
  const workflowId = await insert({
    key: "workflow",
    type: "section",
    order: 2,
  });
  await insertMany([
    { key: "heading", type: "text", value: "HOW DO|WE WORK", parentId: workflowId, order: 0 },
    { key: "description", type: "text", value: "A strategic playground of shapes and colors chosen with care for the environment and economical sustainability, working together with local providers as much as possible. Designed homes that mirrors and shelters each and every lifestyle.", parentId: workflowId, order: 1 },
  ]);

  const workflowSteps = [
    { key: "step-1", img: "/img/space.jpg", title: "Space planning", subtitle: "Shape forming." },
    { key: "step-2", img: "/img/concept.jpg", title: "Concept development", subtitle: "Determining the best interior style for you. Developing the design concept." },
    { key: "step-3", img: "/img/product.jpg", title: "Product selection & buying", subtitle: "Selection of the appropriate items and products required." },
    { key: "step-4", img: "/img/project.jpg", title: "Project implementation", subtitle: "Managing every stage of the interior design process." },
  ];

  for (let i = 0; i < workflowSteps.length; i++) {
    const step = workflowSteps[i];
    const stepId = await insert({
      key: step.key,
      type: "section",
      parentId: workflowId,
      order: i + 2,
      metadata: { img: step.img },
    });
    await insertMany([
      { key: "title", type: "text", value: step.title, parentId: stepId, order: 0 },
      { key: "subtitle", type: "text", value: step.subtitle, parentId: stepId, order: 1 },
    ]);
  }
  console.log("  workflow done");

  // ─── COLLABORATION FLOW ───
  const collabId = await insert({
    key: "collaboration-flow",
    type: "section",
    order: 3,
  });

  const collabSteps = [
    { key: "step-1", title: "Step 1", subtitle: "CONSULTANCY", description: "Getting to know each other, learning about client's preferences and the design studio's background.", img: "/img/steps/Step1.png" },
    { key: "step-2", title: "Step 2", subtitle: "MEET THE SPACE", description: "We visit your space to measure, photograph, and understand the environment we'll be designing for.", img: "/img/steps/Step2.png" },
    { key: "step-3", title: "Step 3", subtitle: "ADMINISTRATIVE", description: "We handle all legal paperwork and contracts to ensure our collaboration is legally compliant.", img: "/img/steps/Step3.png" },
    { key: "step-4", title: "Step 4", subtitle: "PROJECT - CONCEPT", description: "We create initial sketches and mood boards that capture your vision and design preferences.", img: "/img/steps/Step4.png" },
    { key: "step-5", title: "Step 5", subtitle: "PROJECT - RENDERINGS", description: "We produce detailed 3D renderings showing your future interior from multiple perspectives.", img: "/img/steps/Step5.png" },
    { key: "step-6", title: "Step 6", subtitle: "PROJECT - ESTIMATION", description: "We provide detailed cost estimates with prices, quantities, and supplier information for all items.", img: "/img/steps/Step6.png" },
    { key: "step-7", title: "Step 7", subtitle: "PROJECT - SHOP WITH THE CLIENT", description: "We accompany you to various shops and retailers to help you find the perfect items (Premium service).", img: "/img/steps/Step7.png" },
    { key: "step-8", title: "Step 8", subtitle: "PROJECT - SITE MANAGEMENT", description: "We supervise the installation process and provide guidance to ensure everything matches our design (Premium service).", img: "/img/steps/Step8.png" },
  ];

  for (let i = 0; i < collabSteps.length; i++) {
    const step = collabSteps[i];
    const stepId = await insert({
      key: step.key,
      type: "section",
      parentId: collabId,
      order: i,
      metadata: { img: step.img },
    });
    await insertMany([
      { key: "title", type: "text", value: step.title, parentId: stepId, order: 0 },
      { key: "subtitle", type: "text", value: step.subtitle, parentId: stepId, order: 1 },
      { key: "description", type: "text", value: step.description, parentId: stepId, order: 2 },
    ]);
  }
  console.log("  collaboration-flow done");

  // ─── PROPOSALS ───
  const proposalsId = await insert({
    key: "proposals",
    type: "section",
    order: 4,
  });

  const proposals = [
    {
      key: "basic",
      title: "Basic Package",
      img: "/img/basic.webp",
      subtitle: "Design Essentials",
      description: "Ideal for clients who want a professionally designed space and prefer to manage the execution themselves.",
      descriptionFooter: null,
      isBestValue: false,
      services: [
        { type: "basic", text: "Initial consultation" },
        { type: "basic", text: "Mood boards and concept development" },
        { type: "basic", text: "Space planning and layout" },
        { type: "basic", text: "Color scheme and materials suggestions" },
        { type: "basic", text: "Basic furniture and decor recommendations" },
        { type: "premium", text: "3D renderings of key spaces" },
        { type: "premium", text: "Up to 2 office meetings to review and refine the design" },
      ],
    },
    {
      key: "basic-plus",
      title: "Basic Plus Package",
      img: "/img/basic-plus.webp",
      subtitle: "Design + Support",
      description: "Perfect for those who want a hands-on role in the process but appreciate expert guidance throughout.",
      descriptionFooter: "Includes everything in the Basic Package, plus:",
      isBestValue: false,
      services: [
        { type: "basic", text: "On-site supervision during key stages" },
        { type: "basic", text: "Shopping assistance for materials, furniture, and decor" },
        { type: "basic", text: "Ongoing email and phone support during implementation" },
        { type: "premium", text: "Additional 3D renderings for multiple perspectives or alternative layouts" },
        { type: "premium", text: "Up to 4 office meetings for deeper collaboration and updates" },
      ],
    },
    {
      key: "turnkey",
      title: "Turnkey Package",
      img: "/img/turnkey.webp",
      subtitle: "Full-Service Design",
      description: "Best for clients looking for a seamless, start-to-finish experience where every detail is taken care of.",
      descriptionFooter: "Includes everything in the Basic Plus Package, plus:",
      isBestValue: true,
      services: [
        { type: "basic", text: "Full project management and execution" },
        { type: "basic", text: "Contractor coordination and timeline management" },
        { type: "basic", text: "Procurement of furniture, materials, and accessories" },
        { type: "basic", text: "Final styling and professional staging" },
        { type: "premium", text: "Comprehensive 3D renderings of all designed areas" },
        { type: "premium", text: "Unlimited office meetings as needed throughout the project" },
      ],
    },
  ];

  for (let i = 0; i < proposals.length; i++) {
    const p = proposals[i];
    const pkgId = await insert({
      key: p.key,
      type: "section",
      parentId: proposalsId,
      order: i,
      metadata: { img: p.img, isBestValue: p.isBestValue },
    });
    await insertMany([
      { key: "title", type: "text", value: p.title, parentId: pkgId, order: 0 },
      { key: "subtitle", type: "text", value: p.subtitle, parentId: pkgId, order: 1 },
      { key: "description", type: "text", value: p.description, parentId: pkgId, order: 2 },
      ...(p.descriptionFooter
        ? [{ key: "description-footer", type: "text" as const, value: p.descriptionFooter, parentId: pkgId, order: 3 }]
        : []),
    ]);

    const servicesId = await insert({
      key: "services",
      type: "section",
      parentId: pkgId,
      order: 4,
    });
    for (let j = 0; j < p.services.length; j++) {
      await insert({
        key: `service-${j}`,
        type: "text",
        value: p.services[j].text,
        parentId: servicesId,
        order: j,
        metadata: { serviceType: p.services[j].type },
      });
    }
  }
  console.log("  proposals done");

  // ─── VISUALIZATIONS ───
  const vizId = await insert({
    key: "visualizations",
    type: "section",
    order: 5,
  });
  await insertMany([
    { key: "heading", type: "text", value: "VISUALIZATIONS", parentId: vizId, order: 0 },
    { key: "description-1", type: "text", value: "We create CG ART visualizations for residential and commercial interiors. 3D renderings are a photorealistic way of understanding an architectural plan, a construction drawing or something that does not exist yet, an idea or a concept.", parentId: vizId, order: 1 },
    { key: "description-2", type: "text", value: "Therefore, if you are looking to outsource a CG ART visualization for a client presentation or marketing purposes we are the team to partner with.", parentId: vizId, order: 2 },
    { key: "image-1", type: "image", value: "/img/visualisation1.jpg", parentId: vizId, order: 3 },
    { key: "image-2", type: "image", value: "/img/visualisation2.jpg", parentId: vizId, order: 4 },
  ]);
  console.log("  visualizations done");

  // ─── LATEST PROJECTS SECTION ───
  const latestId = await insert({
    key: "latest-projects",
    type: "section",
    order: 6,
  });
  await insertMany([
    { key: "heading", type: "text", value: "OUR LATEST|PROJECTS", parentId: latestId, order: 0 },
    { key: "description", type: "text", value: "Lightdetail's mission is to design and implement functionally-aesthetically balanced spaces tailored to the client's personality traits.", parentId: latestId, order: 1 },
    { key: "featured-1", type: "text", value: "18", parentId: latestId, order: 2 },
    { key: "featured-2", type: "text", value: "19", parentId: latestId, order: 3 },
    { key: "featured-3", type: "text", value: "20", parentId: latestId, order: 4 },
  ]);
  console.log("  latest-projects done");

  console.log("\nContent seeding complete!");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
