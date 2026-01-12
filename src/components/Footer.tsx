import Link from 'next/link';

interface FooterLink {
  title: string;
  url: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  columns?: FooterColumn[];
  copyright?: string;
}

export default function Footer({ columns, copyright }: FooterProps) {
  const defaultColumns: FooterColumn[] = [
    {
      title: 'Trading',
      links: [
        { title: 'Stocks', url: '/stocks' },
        { title: 'ETFs', url: '/etfs' },
        { title: 'Crypto', url: '/crypto' },
        { title: 'Forex', url: '/forex' },
      ],
    },
    {
      title: 'Company',
      links: [
        { title: 'About Us', url: '/about-us' },
        { title: 'Careers', url: '/careers' },
        { title: 'Press', url: '/press' },
        { title: 'Contact', url: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { title: 'Learn', url: '/learn' },
        { title: 'Blog', url: '/blog' },
        { title: 'FAQ', url: '/faq' },
        { title: 'Support', url: '/support' },
      ],
    },
  ];

  const footerColumns = columns || defaultColumns;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <span className="logo-icon">ST</span>
              StockTrade
            </Link>
            <p>
              Your trusted platform for smart investing. Trade stocks, ETFs, and
              cryptocurrencies with confidence.
            </p>
          </div>

          {footerColumns.map((column, index) => (
            <div key={index} className="footer-column">
              <h4>{column.title}</h4>
              <ul className="footer-links">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.url}>{link.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>{copyright || '© 2026 StockTrade. All rights reserved.'}</p>
          <div className="footer-social">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="YouTube">▶</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
