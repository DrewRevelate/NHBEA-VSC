import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders about section', () => {
    render(<Footer />)
    expect(screen.getByText('About NHBEA')).toBeInTheDocument()
    expect(screen.getByText('New Hampshire Business Education Association - Supporting business educators across the state.')).toBeInTheDocument()
  })

  it('renders quick links', () => {
    render(<Footer />)
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    expect(screen.getByText('Awards')).toBeInTheDocument()
    expect(screen.getByText('Hall of Fame')).toBeInTheDocument()
  })

  it('renders copyright text', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument()
  })
})