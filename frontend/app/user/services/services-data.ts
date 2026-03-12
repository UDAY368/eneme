import type { LucideIcon } from 'lucide-react';
import {
  Film,
  Video,
  Briefcase,
  Calendar,
  Tv,
  Search,
  Share2,
  Palette,
  Lightbulb,
  PenTool,
  Clapperboard,
  Sparkles,
  Megaphone,
  Target,
  BarChart3,
  Zap,
  Camera,
  Mic2,
  Globe,
  Mail,
  Phone,
} from 'lucide-react';

export type SectionType = 'cards4' | 'process' | 'twoColumn' | 'cardsWithMeta' | 'eventCards' | 'ctaButtons';

export interface CardItem {
  icon: LucideIcon;
  heading: string;
  description: string;
  meta?: string;
  metaLeft?: string;
  metaRight?: string;
  metaLeftLabel?: string;
  metaRightLabel?: string;
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface TwoColumnContent {
  heading?: string;
  body: string;
  list?: string[];
  ctaButton?: { label: string; href: string };
}

export interface EventCardItem {
  title: string;
  description: string;
  image?: string;
  bullets?: string[];
}

export interface CtaButton {
  label: string;
  href: string;
}

export interface SectionCards4 {
  type: 'cards4';
  heading?: string;
  description?: string;
  cards: CardItem[];
}

export interface SectionProcess {
  type: 'process';
  heading?: string;
  description?: string;
  steps: ProcessStep[];
}

export interface SectionTwoColumn {
  type: 'twoColumn';
  heading?: string;
  left: TwoColumnContent;
  right: TwoColumnContent;
}

export interface SectionCardsWithMeta {
  type: 'cardsWithMeta';
  heading?: string;
  description?: string;
  cards: CardItem[];
}

export interface SectionEventCards {
  type: 'eventCards';
  heading?: string;
  description?: string;
  cards: EventCardItem[];
}

export interface SectionCtaButtons {
  type: 'ctaButtons';
  heading?: string;
  description?: string;
  buttons: CtaButton[];
}

export type SectionConfig =
  | SectionCards4
  | SectionProcess
  | SectionTwoColumn
  | SectionCardsWithMeta
  | SectionEventCards
  | SectionCtaButtons;

export interface ServiceBannerConfig {
  heading: string;
  description: string;
  primaryBtn: { label: string; href: string };
  secondaryBtn: { label: string; href: string };
  bgImage: string;
}

export interface ServiceData {
  title: string;
  slug: string;
  banner: ServiceBannerConfig;
  sections: SectionConfig[];
}

export const SERVICES_DATA: Record<string, ServiceData> = {
  'ad-films': {
    title: 'Ad Films',
    slug: 'ad-films',
    banner: {
      heading: 'AD FILMS',
      description: 'Create compelling advertising campaigns with the timeless elegance of classic cinema that drive results and build lasting brand connections',
      primaryBtn: { label: 'Start Your Campaign', href: '/user#contact' },
      secondaryBtn: { label: 'View Our Work', href: '/user#portfolio' },
      bgImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=80',
    },
    sections: [
      {
        type: 'cards4',
        heading: 'Why Choose Our Ad Films',
        description: 'Combining vintage cinematography with modern marketing strategies for maximum impact',
        cards: [
          { icon: Lightbulb, heading: 'Creative Concept Development', description: 'From initial brainstorming to final script, we develop compelling narratives that resonate with your target audience and drive brand engagement.' },
          { icon: Camera, heading: 'Professional Cinematography', description: 'State-of-the-art equipment and vintage-inspired techniques create visually stunning advertisements that capture attention and leave lasting impressions.' },
          { icon: Target, heading: 'Strategic Brand Positioning', description: 'Every ad film is crafted to align with your brand values and marketing objectives, ensuring maximum impact and ROI for your advertising investment.' },
          { icon: Sparkles, heading: 'Post-Production Excellence', description: 'Advanced editing, color grading, and sound design bring your vision to life with the polish and sophistication of premium commercial content.' },
        ],
      },
      {
        type: 'process',
        heading: 'Our Process',
        description: 'A proven methodology that ensures exceptional results for every advertising campaign',
        steps: [
          { stepNumber: 1, title: 'Discovery & Strategy', description: 'Understanding your brand, audience, and objectives to create a compelling advertising strategy' },
          { stepNumber: 2, title: 'Creative Development', description: 'Concept creation, scriptwriting, and storyboarding with vintage-inspired storytelling techniques' },
          { stepNumber: 3, title: 'Pre-Production', description: 'Casting, location scouting, and equipment preparation for seamless production execution' },
          { stepNumber: 4, title: 'Production', description: 'Professional filming with cinematic quality and attention to every detail' },
          { stepNumber: 5, title: 'Post-Production', description: 'Editing, color grading, sound design, and final delivery in multiple formats' },
        ],
      },
      {
        type: 'twoColumn',
        left: {
          heading: 'Drive Results',
          body: "Our ad films don't just look beautiful—they deliver measurable business results through strategic storytelling and compelling visual narratives.",
          list: [
            'Increased brand awareness and recognition',
            'Higher engagement rates across all platforms',
            'Professional quality that builds trust',
            'Memorable storytelling that drives action',
            'Multi-platform optimization for maximum reach',
            'Measurable ROI through strategic targeting',
          ],
        },
        right: {
          heading: 'Ready to Create Your Ad Film?',
          body: "Let's discuss your vision and create an advertising campaign that captures hearts and drives results with the timeless appeal of classic cinema.",
          ctaButton: { label: 'Start Your Project', href: '/user#contact' },
        },
      },
    ],
  },
  'business-videos': {
    title: 'Business Videos',
    slug: 'business-videos',
    banner: {
      heading: 'BUSINESS VIDEOS',
      description: 'Professional corporate video production that elevates your brand and communicates your message with cinematic excellence',
      primaryBtn: { label: 'Get Quote', href: '/user#contact' },
      secondaryBtn: { label: 'View Examples', href: '/user#portfolio' },
      bgImage: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1920&q=80',
    },
    sections: [
      {
        type: 'cards4',
        heading: 'Our Expertise',
        description: 'Professional corporate video solutions that transform your business communications and build lasting stakeholder trust.',
        cards: [
          { icon: Briefcase, heading: 'Corporate Storytelling', description: 'Transform your company\'s mission and values into compelling visual narratives that resonate with stakeholders and build trust.' },
          { icon: Video, heading: 'Employee Training Videos', description: 'Engaging training content that improves knowledge retention and creates consistent messaging across your organization.' },
          { icon: Tv, heading: 'Product Demonstrations', description: 'Showcase your products and services with professional cinematography that highlights features and benefits effectively.' },
          { icon: Mic2, heading: 'Executive Communications', description: 'Professional video content for leadership communications, investor relations, and corporate announcements.' },
        ],
      },
      {
        type: 'cardsWithMeta',
        heading: 'Video Types',
        description: 'Tailored video formats for every business need and platform.',
        cards: [
          { icon: Briefcase, heading: 'Company Profile Videos', description: 'Comprehensive overview of your business, culture, and capabilities', metaLeft: '2-5 minutes', metaRight: 'Website, presentations, trade shows' },
          { icon: Sparkles, heading: 'Product Launch Videos', description: 'Dynamic introductions for new products or services', metaLeft: '1-3 minutes', metaRight: 'Marketing campaigns, social media, events' },
          { icon: Video, heading: 'Training & Educational', description: 'Instructional content for employee development', metaLeft: '5-20 minutes', metaRight: 'Internal training, onboarding, compliance' },
          { icon: Mic2, heading: 'Testimonial Videos', description: 'Authentic customer stories and success cases', metaLeft: '1-2 minutes', metaRight: 'Website, sales presentations, marketing' },
        ],
      },
      {
        type: 'ctaButtons',
        heading: 'Ready to Elevate Your Business?',
        description: 'Let\'s create professional business videos that showcase your company\'s excellence and drive meaningful results.',
        buttons: [
          { label: 'Start Your Project', href: '/user#contact' },
          { label: 'View Portfolio', href: '/user#portfolio' },
        ],
      },
    ],
  },
  'films-documentaries': {
    title: 'Films & Documentaries',
    slug: 'films-documentaries',
    banner: {
      heading: 'FILMS & DOCUMENTARIES',
      description: 'Cinematic storytelling that honors the golden age of filmmaking while embracing modern innovation and authentic human experiences',
      primaryBtn: { label: 'Discuss Your Film', href: '/user#contact' },
      secondaryBtn: { label: 'Watch Our Films', href: '/user#portfolio' },
      bgImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80',
    },
    sections: [
      {
        type: 'cards4',
        heading: 'Cinematic Excellence',
        description: 'From concept to distribution, we deliver film and documentary production of the highest caliber.',
        cards: [
          { icon: PenTool, heading: 'Narrative Excellence', description: 'Masterful storytelling that captures authentic human experiences and creates emotional connections with audiences worldwide.' },
          { icon: Camera, heading: 'Cinematic Production', description: 'Professional-grade equipment and vintage-inspired techniques create visually stunning films with timeless appeal.' },
          { icon: Sparkles, heading: 'Festival-Quality Standards', description: 'Every project meets the highest industry standards for film festivals, theatrical releases, and premium distribution.' },
          { icon: Globe, heading: 'Global Distribution', description: 'Comprehensive post-production and distribution support to reach audiences across multiple platforms and territories.' },
        ],
      },
      {
        type: 'cardsWithMeta',
        heading: 'Film Categories',
        description: 'Full-spectrum film and documentary production for every format and platform.',
        cards: [
          { icon: Film, heading: 'Feature Films', description: 'Full-length narrative films with compelling stories and professional production values', metaLeft: '90-180 minutes', metaRight: 'Theatrical, streaming, festival distribution', metaRightLabel: 'Distribution' },
          { icon: Video, heading: 'Short Films', description: 'Concise storytelling that maximizes impact in minimal time', metaLeft: '5-30 minutes', metaRight: 'Film festivals, online platforms, showcases', metaRightLabel: 'Distribution' },
          { icon: Clapperboard, heading: 'Documentary Films', description: 'Real-world stories told with authenticity and cinematic beauty', metaLeft: '60-120 minutes', metaRight: 'Educational, broadcast, streaming platforms', metaRightLabel: 'Distribution' },
          { icon: Tv, heading: 'Web Series', description: 'Episodic content designed for digital platforms and streaming', metaLeft: '10-45 minutes per episode', metaRight: 'Streaming platforms, social media, websites', metaRightLabel: 'Distribution' },
        ],
      },
      {
        type: 'ctaButtons',
        heading: 'Tell Your Story',
        description: 'Whether it’s a documentary or a narrative project, we’d love to hear from you.',
        buttons: [
          { label: 'Start Your Film', href: '/user#contact' },
          { label: 'View our Films', href: '/user#portfolio' },
        ],
      },
    ],
  },
  'corporate-events': {
    title: 'Corporate Events',
    slug: 'corporate-events',
    banner: {
      heading: 'CORPORATE EVENTS',
      description: 'Professional event coverage with the grandeur of vintage film documentation and modern production excellence',
      primaryBtn: { label: 'Plan Your Coverage', href: '/user#contact' },
      secondaryBtn: { label: 'Event Portfolio', href: '/user#portfolio' },
      bgImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
    },
    sections: [
      {
        type: 'cards4',
        heading: 'Professional Coverage',
        description: 'Comprehensive event documentation with cinematic quality and broadcast-ready production values.',
        cards: [
          { icon: Camera, heading: 'Multi-Camera Coverage', description: 'Professional multi-camera setups ensure every important moment is captured from multiple angles with cinematic quality.' },
          { icon: Video, heading: 'Live Streaming', description: 'High-quality live streaming solutions that bring your event to global audiences with professional production values.' },
          { icon: Mic2, heading: 'Audio Excellence', description: 'Crystal-clear audio capture and mixing ensures every speech, presentation, and interaction is perfectly recorded.' },
          { icon: Sparkles, heading: 'Event Highlights', description: 'Professionally edited highlight reels that capture the essence and energy of your corporate events.' },
        ],
      },
      {
        type: 'eventCards',
        heading: 'Event Types',
        description: 'Complete coverage for every type of corporate event.',
        cards: [
          { title: 'Corporate Conferences', description: 'Complete coverage of keynotes, panels, and networking sessions', bullets: ['Multi-camera setup', 'Live streaming', 'Professional audio', 'Same-day highlights'] },
          { title: 'Product Launches', description: 'Dynamic coverage of product unveilings and launch events', bullets: ['Cinematic reveals', 'Audience reactions', 'Executive interviews', 'Social media content'] },
          { title: 'Annual Meetings', description: 'Professional documentation of shareholder and board meetings', bullets: ['Executive coverage', 'Presentation capture', 'Q&A sessions', 'Compliance documentation'] },
          { title: 'Team Building Events', description: 'Engaging coverage of corporate retreats and team activities', bullets: ['Activity documentation', 'Team interviews', 'Culture showcase', 'Motivational content'] },
          { title: 'Award Ceremonies', description: 'Elegant coverage of recognition events and celebrations', bullets: ['Ceremony documentation', 'Winner interviews', 'Audience reactions', 'Highlight packages'] },
          { title: 'Trade Shows', description: 'Comprehensive booth coverage and industry event documentation', bullets: ['Booth presentations', 'Product demos', 'Visitor interactions', 'Industry networking'] },
        ],
      },
      {
        type: 'ctaButtons',
        heading: 'Capture Every Moment',
        description: 'Tell us about your event and we’ll propose a package that fits.',
        buttons: [
          { label: 'Book Event Coverage', href: '/user#contact' },
          { label: 'View Event Portfolio', href: '/user#portfolio' },
        ],
      },
    ],
  },
  'commercial-videos': {
    title: 'Commercial Videos',
    slug: 'commercial-videos',
    banner: {
      heading: 'COMMERCIAL VIDEOS',
      description: 'High-impact commercial content inspired by the golden era of advertising that drives engagement and delivers results',
      primaryBtn: { label: 'Create Commercial', href: '/user#contact' },
      secondaryBtn: { label: 'View Commercials', href: '/user#portfolio' },
      bgImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1920&q=80',
    },
    sections: [
      {
        type: 'cards4',
        heading: 'Commercial Excellence',
        description: 'Strategic commercial production that drives results and builds brand recognition.',
        cards: [
          { icon: Target, heading: 'Strategic Messaging', description: 'Craft compelling commercial messages that resonate with your target audience and drive purchasing decisions through emotional storytelling.' },
          { icon: Megaphone, heading: 'Brand Amplification', description: 'Amplify your brand voice across multiple platforms with consistent, high-impact commercial content that builds recognition.' },
          { icon: Sparkles, heading: 'Festival-Quality Standards', description: 'Every project meets the highest industry standards for film festivals, theatrical releases, and premium distribution.' },
          { icon: BarChart3, heading: 'Performance Optimization', description: 'Data-driven approach to commercial video creation that maximizes engagement, conversions, and return on advertising spend.' },
        ],
      },
      {
        type: 'cardsWithMeta',
        heading: 'Commercial Formats',
        description: 'Every commercial format your campaign needs for maximum impact.',
        cards: [
          { icon: Tv, heading: 'TV Commercials', description: 'Traditional television advertising with cinematic production values', metaLeft: '15-60 seconds', metaRight: 'Theatrical, streaming, festival distribution', metaRightLabel: 'Platforms' },
          { icon: Globe, heading: 'Digital Ads', description: 'Online commercial content optimized for digital platforms', metaLeft: '6-30 seconds', metaRight: 'Social media, YouTube, display advertising', metaRightLabel: 'Platforms' },
          { icon: Megaphone, heading: 'Brand Campaigns', description: 'Comprehensive commercial campaigns across multiple touchpoints', metaLeft: '15-120 seconds', metaRight: 'Multi-platform distribution and targeting', metaRightLabel: 'Platforms' },
          { icon: Film, heading: 'Product Commercials', description: 'Focused product showcases with compelling call-to-action', metaLeft: '30-90 seconds', metaRight: 'E-commerce, retail, point-of-sale displays', metaRightLabel: 'Platforms' },
        ],
      },
      {
        type: 'ctaButtons',
        heading: 'Launch Your Campaign',
        description: 'From concept to air, we’ll make your next commercial stand out.',
        buttons: [
          { label: 'Start Your Commercial', href: '/user#contact' },
          { label: 'View our Work', href: '/user#portfolio' },
        ],
      },
    ],
  },
  'seo-services': {
    title: 'SEO Services',
    slug: 'seo-services',
    banner: {
      heading: 'SEO SERVICES',
      description: 'Boost your digital presence with video SEO strategies as refined and effective as classic film techniques',
      primaryBtn: { label: 'Boost Your Ranking', href: '/user#contact' },
      secondaryBtn: { label: 'Free SEO Audit', href: '/user#portfolio' },
      bgImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1920&q=80',
    },
    sections: [
      {
        type: 'cards4',
        heading: 'SEO Expertise',
        description: 'Comprehensive video SEO services that maximize your organic visibility and search performance.',
        cards: [
          { icon: Search, heading: 'Video SEO Optimization', description: 'Optimize your video content for search engines with strategic keyword placement, metadata optimization, and technical SEO best practices.' },
          { icon: PenTool, heading: 'Content Strategy', description: 'Develop comprehensive content strategies that align video production with SEO goals for maximum organic visibility and engagement.' },
          { icon: BarChart3, heading: 'Performance Analytics', description: 'Advanced analytics and reporting to track video performance, search rankings, and audience engagement across all platforms.' },
          { icon: Globe, heading: 'Multi-Platform Optimization', description: 'Optimize video content for YouTube, Google, social media, and website integration to maximize reach and discoverability.' },
        ],
      },
      {
        type: 'eventCards',
        heading: 'Our SEO Services',
        description: 'Full-spectrum SEO solutions for video and digital content.',
        cards: [
          { title: 'Video SEO Audit', description: 'Comprehensive analysis of your current video content and SEO performance', bullets: ['Content analysis', 'Keyword research', 'Technical audit', 'Competitor analysis'] },
          { title: 'YouTube Optimization', description: 'Complete YouTube channel and video optimization for maximum visibility', bullets: ['Channel setup', 'Video optimization', 'Playlist strategy', 'Analytics tracking'] },
          { title: 'Website Video SEO', description: 'Optimize video content for your website and search engine rankings', bullets: ['Schema markup', 'Page optimization', 'Loading speed', 'Mobile optimization'] },
          { title: 'Local SEO Videos', description: 'Location-based video content to improve local search visibility', bullets: ['Local keywords', 'Google My Business', 'Location targeting', 'Review integration'] },
          { title: 'Content Marketing', description: 'Strategic video content creation aligned with SEO objectives', bullets: ['Content calendar', 'Keyword targeting', 'Topic research', 'Distribution strategy'] },
          { title: 'Technical SEO', description: 'Technical optimization for video hosting and website performance', bullets: ['Site speed', 'Mobile optimization', 'Structured data', 'Crawlability'] },
        ],
      },
      {
        type: 'ctaButtons',
        heading: 'Dominate Search Results',
        description: 'Start with an SEO audit or a strategy call. We’ll outline a clear path to better visibility.',
        buttons: [
          { label: 'Get SEO Audit', href: '/user#contact' },
          { label: 'View Results', href: '/user#portfolio' },
        ],
      },
    ],
  },
  'digital-marketing': {
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    banner: {
      heading: 'DIGITAL MARKETING',
      description: 'Modern digital marketing strategies with the timeless appeal of vintage storytelling and cinematic excellence',
      primaryBtn: { label: 'Start Campaign', href: '/user#contact' },
      secondaryBtn: { label: 'View Results', href: '/user#portfolio' },
      bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80',
    },
    sections: [
      {
        type: 'cards4',
        heading: 'Digital Excellence',
        description: 'Strategic digital marketing that drives engagement and delivers measurable results.',
        cards: [
          { icon: Lightbulb, heading: 'Strategic Campaign Development', description: 'Create comprehensive digital marketing strategies that align with your business goals and target audience preferences for maximum impact.' },
          { icon: Share2, heading: 'Social Media Marketing', description: 'Engage your audience across all social platforms with compelling video content that drives interaction and builds community.' },
          { icon: BarChart3, heading: 'Performance Analytics', description: 'Advanced tracking and analytics to measure campaign performance, optimize strategies, and maximize return on investment.' },
          { icon: Globe, heading: 'Multi-Platform Distribution', description: 'Strategic content distribution across multiple digital channels to maximize reach and engagement with your target audience.' },
        ],
      },
      {
        type: 'eventCards',
        heading: 'Marketing Services',
        description: 'Comprehensive digital marketing solutions for every channel.',
        cards: [
          { title: 'Social Media Video Marketing', description: 'Engaging video content optimized for each social platform', bullets: ['Platform-specific content', 'Engagement strategies', 'Community management', 'Influencer partnerships'] },
          { title: 'Video Content Strategy', description: 'Comprehensive content planning and strategic development', bullets: ['Content calendar', 'Audience research', 'Competitor analysis', 'Brand positioning'] },
          { title: 'Paid Video Advertising', description: 'Strategic paid campaigns across digital platforms', bullets: ['Ad creation', 'Audience targeting', 'Budget optimization', 'Performance tracking'] },
          { title: 'Email Video Marketing', description: 'Video integration in email marketing campaigns', bullets: ['Email templates', 'Video thumbnails', 'Click tracking', 'Conversion optimization'] },
          { title: 'Website Video Integration', description: 'Strategic video placement on your website for conversions', bullets: ['Landing page videos', 'Product demos', 'Testimonials', 'About us videos'] },
          { title: 'Marketing Automation', description: 'Automated video marketing workflows and sequences', bullets: ['Drip campaigns', 'Behavioral triggers', 'Lead nurturing', 'Customer journeys'] },
        ],
      },
      {
        type: 'ctaButtons',
        heading: 'Grow Your Digital Presence',
        description: 'Let’s build a strategy that fits your goals and budget.',
        buttons: [
          { label: 'Start Marketing', href: '/user#contact' },
          { label: 'View Case Studies', href: '/user#portfolio' },
        ],
      },
    ],
  },
  'media-works': {
    title: 'Media Works',
    slug: 'media-works',
    banner: {
      heading: 'MEDIA WORKS',
      description: "Full-spectrum media production with the craftsmanship and attention to detail of cinema's golden age",
      primaryBtn: { label: 'Start Your Project', href: '/user#contact' },
      secondaryBtn: { label: 'View Our Work', href: '/user#portfolio' },
      bgImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80',
    },
    sections: [
      {
        type: 'cards4',
        heading: 'Media Excellence',
        description: 'Full-spectrum media production from strategy to execution.',
        cards: [
          { icon: Clapperboard, heading: 'Full-Service Production', description: "Complete media production services from concept development to final delivery with the craftsmanship of cinema's golden age." },
          { icon: Camera, heading: 'Professional Equipment', description: 'State-of-the-art cameras, lighting, and audio equipment combined with vintage techniques for superior production quality.' },
          { icon: Lightbulb, heading: 'Creative Direction', description: 'Expert creative direction that brings your vision to life with artistic excellence and strategic thinking.' },
          { icon: Globe, heading: 'Distribution Strategy', description: 'Comprehensive distribution planning to ensure your content reaches the right audience across all relevant platforms.' },
        ],
      },
      {
        type: 'eventCards',
        heading: 'Our Media Services',
        description: 'End-to-end media solutions for every need.',
        cards: [
          { title: 'Media Planning & Strategy', description: 'Comprehensive media planning and strategic development', bullets: ['Audience research', 'Platform selection', 'Budget allocation', 'Timeline planning'] },
          { title: 'Content Creation', description: 'Full-spectrum content creation for all media channels', bullets: ['Video production', 'Photography', 'Graphic design', 'Copywriting'] },
          { title: 'Media Buying & Placement', description: 'Strategic media buying and optimal placement strategies', bullets: ['Media negotiations', 'Placement optimization', 'Cost efficiency', 'Performance tracking'] },
          { title: 'Brand Development', description: 'Complete brand identity and positioning services', bullets: ['Brand strategy', 'Visual identity', 'Brand guidelines', 'Market positioning'] },
          { title: 'Campaign Management', description: 'End-to-end campaign management and optimization', bullets: ['Campaign setup', 'Performance monitoring', 'Optimization', 'Reporting'] },
          { title: 'Media Analytics', description: 'Advanced analytics and performance measurement', bullets: ['Data analysis', 'Performance reports', 'ROI tracking', 'Insights & recommendations'] },
        ],
      },
      {
        type: 'ctaButtons',
        heading: 'Transform Your Media Strategy',
        description: 'Let us create comprehensive media solutions that elevate your brand and drive exceptional results.',
        buttons: [
          { label: 'Start Your Media Project', href: '/user#contact' },
          { label: 'View Portfolio', href: '/user#portfolio' },
        ],
      },
    ],
  },
};

export const SERVICE_SLUGS = Object.keys(SERVICES_DATA) as string[];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return SERVICES_DATA[slug];
}
