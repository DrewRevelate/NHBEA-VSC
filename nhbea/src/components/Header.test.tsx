import { render, screen } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  it('renders NHBEA Connect title', () => {
    render(<Header />)
    expect(screen.getByText('NHBEA Connect')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Conference')).toBeInTheDocument()
    expect(screen.getByText('Membership')).toBeInTheDocument()
  })
})