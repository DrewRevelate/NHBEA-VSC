import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  linkToHome?: boolean;
  className?: string;
}

const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/nhbea-64cab.firebasestorage.app/o/public%2FNHBEALogo.png?alt=media&token=1baf76d5-7b58-4cf2-8023-f153330b09c1';

export default function Logo({ 
  variant = 'default',
  size = 'md',
  showText = true,
  linkToHome = true,
  className = ''
}: LogoProps) {
  // Size configurations
  const sizeConfig = {
    sm: { width: 32, height: 32, textSize: 'text-lg' },
    md: { width: 48, height: 48, textSize: 'text-xl' },
    lg: { width: 64, height: 64, textSize: 'text-2xl' },
    xl: { width: 80, height: 80, textSize: 'text-3xl' }
  };

  const { width, height, textSize } = sizeConfig[size];

  // Color configurations based on variant
  const colorConfig = {
    default: {
      textColor: 'text-[var(--nhbea-royal-blue)]',
      hoverColor: 'hover:text-[var(--nhbea-royal-blue-dark)]'
    },
    white: {
      textColor: 'text-white',
      hoverColor: 'hover:text-white/90'
    },
    dark: {
      textColor: 'text-gray-900',
      hoverColor: 'hover:text-gray-800'
    }
  };

  const { textColor, hoverColor } = colorConfig[variant];

  const LogoContent = () => (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <div className="relative flex-shrink-0">
        <Image
          src={LOGO_URL}
          alt="NHBEA Logo"
          width={width}
          height={height}
          className="object-contain"
          priority={size === 'lg' || size === 'xl'}
        />
      </div>
      
      {/* Optional Text */}
      {showText && (
        <div className={`font-bold ${textSize} ${textColor} leading-tight`}>
          <div className="tracking-tight">NHBEA</div>
          {size === 'lg' || size === 'xl' ? (
            <div className="text-sm font-medium text-current opacity-80 leading-none mt-1">
              Business Education Association
            </div>
          ) : null}
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link 
        href="/" 
        className={`inline-flex transition-colors duration-200 ${hoverColor} focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-accent-gold)]/50 focus:ring-offset-2 rounded-lg`}
        aria-label="Go to NHBEA homepage"
      >
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}

// Specialized logo variants for common use cases
export function HeaderLogo({ className }: { className?: string }) {
  return (
    <Logo
      size="md"
      showText={true}
      linkToHome={true}
      variant="default"
      className={className}
    />
  );
}

export function FooterLogo({ className }: { className?: string }) {
  return (
    <Logo
      size="lg"
      showText={true}
      linkToHome={true}
      variant="white"
      className={className}
    />
  );
}

export function HeroLogo({ className }: { className?: string }) {
  return (
    <Logo
      size="xl"
      showText={true}
      linkToHome={false}
      variant="white"
      className={className}
    />
  );
}