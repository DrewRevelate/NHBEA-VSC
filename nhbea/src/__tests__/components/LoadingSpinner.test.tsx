import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingSpinner, LoadingSkeleton } from '../../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-live', 'polite');
    
    const srText = screen.getByText('Loading...');
    expect(srText).toHaveClass('sr-only');
  });

  it('renders different size variants correctly', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let spinnerDiv = screen.getByRole('status').querySelector('.animate-spin');
    expect(spinnerDiv).toHaveClass('w-4', 'h-4');

    rerender(<LoadingSpinner size="md" />);
    spinnerDiv = screen.getByRole('status').querySelector('.animate-spin');
    expect(spinnerDiv).toHaveClass('w-8', 'h-8');

    rerender(<LoadingSpinner size="lg" />);
    spinnerDiv = screen.getByRole('status').querySelector('.animate-spin');
    expect(spinnerDiv).toHaveClass('w-12', 'h-12');

    rerender(<LoadingSpinner size="xl" />);
    spinnerDiv = screen.getByRole('status').querySelector('.animate-spin');
    expect(spinnerDiv).toHaveClass('w-16', 'h-16');
  });

  it('renders different variant layouts correctly', () => {
    const { rerender } = render(<LoadingSpinner variant="page" />);
    let container = screen.getByRole('status');
    expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');

    rerender(<LoadingSpinner variant="section" />);
    container = screen.getByRole('status');
    expect(container).toHaveClass('py-12', 'flex', 'items-center', 'justify-center');

    rerender(<LoadingSpinner variant="inline" />);
    container = screen.getByRole('status');
    expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'py-4');
  });

  it('renders message when provided', () => {
    render(<LoadingSpinner message="Loading data..." />);
    
    const message = screen.getByText('Loading data...');
    expect(message).toBeInTheDocument();
    expect(message).toHaveAttribute('aria-label', 'Loading data...');
    expect(message).toHaveClass('mt-4', 'text-gray-600', 'font-medium');
  });

  it('does not render message when not provided', () => {
    render(<LoadingSpinner />);
    
    // Should only have the sr-only "Loading..." text
    const messages = screen.queryAllByText(/loading/i);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toHaveClass('sr-only');
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner message="Please wait..." />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-live', 'polite');
    
    const message = screen.getByText('Please wait...');
    expect(message).toHaveAttribute('aria-label', 'Please wait...');
  });

  it('applies spinner animation and border styling', () => {
    render(<LoadingSpinner />);
    
    const spinnerDiv = screen.getByRole('status').querySelector('.animate-spin');
    expect(spinnerDiv).toHaveClass('animate-spin', 'rounded-full', 'border-b-2');
  });
});

describe('LoadingSkeleton', () => {
  it('renders hero skeleton correctly', () => {
    render(<LoadingSkeleton variant="hero" />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading hero content');
    expect(skeleton).toBeInTheDocument();
    
    // Check for animate-pulse element within the skeleton
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('renders content skeleton correctly', () => {
    render(<LoadingSkeleton variant="content" />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders grid skeleton with correct count', () => {
    render(<LoadingSkeleton variant="grid" count={6} />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading grid content');
    
    // Should render 6 grid items
    const gridItems = skeleton.querySelectorAll('.animate-pulse');
    expect(gridItems).toHaveLength(6);
  });

  it('renders grid skeleton with default count', () => {
    render(<LoadingSkeleton variant="grid" />);
    
    const skeleton = screen.getByRole('status');
    const gridItems = skeleton.querySelectorAll('.animate-pulse');
    expect(gridItems).toHaveLength(1); // Default count is 1
  });

  it('renders list skeleton with correct count', () => {
    render(<LoadingSkeleton variant="list" count={4} />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading list content');
    
    // Should render 4 list items
    const listItems = skeleton.querySelectorAll('.animate-pulse');
    expect(listItems).toHaveLength(4);
  });

  it('renders list skeleton with default count', () => {
    render(<LoadingSkeleton variant="list" />);
    
    const skeleton = screen.getByRole('status');
    const listItems = skeleton.querySelectorAll('.animate-pulse');
    expect(listItems).toHaveLength(1); // Default count is 1
  });

  it('has proper accessibility attributes for all variants', () => {
    const expectedLabels = {
      hero: 'Loading hero content',
      content: 'Loading content', 
      grid: 'Loading grid content',
      list: 'Loading list content'
    };
    
    Object.entries(expectedLabels).forEach(([variant, expectedLabel]) => {
      const { unmount } = render(<LoadingSkeleton variant={variant as 'hero' | 'content' | 'grid' | 'list'} />);
      
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveAttribute('aria-label', expectedLabel);
      
      unmount();
    });
  });

  it('applies animate-pulse class for loading animation', () => {
    render(<LoadingSkeleton variant="content" />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('renders appropriate skeleton shapes for each variant', () => {
    // Hero variant should have title, subtitle, and button placeholders
    const { rerender } = render(<LoadingSkeleton variant="hero" />);
    let skeleton = screen.getByRole('status');
    expect(skeleton.querySelector('.h-8')).toBeInTheDocument(); // Title
    expect(skeleton.querySelector('.h-16')).toBeInTheDocument(); // Content
    expect(skeleton.querySelector('.h-12')).toBeInTheDocument(); // Buttons

    // Content variant should have heading and paragraph placeholders
    rerender(<LoadingSkeleton variant="content" />);
    skeleton = screen.getByRole('status');
    expect(skeleton.querySelector('.h-6')).toBeInTheDocument(); // Heading
    expect(skeleton.querySelector('.h-4')).toBeInTheDocument(); // Paragraph

    // Grid variant should have image and text placeholders
    rerender(<LoadingSkeleton variant="grid" />);
    skeleton = screen.getByRole('status');
    expect(skeleton.querySelector('.h-48')).toBeInTheDocument(); // Image
    expect(skeleton.querySelector('.h-6')).toBeInTheDocument(); // Title

    // List variant should have avatar and text placeholders
    rerender(<LoadingSkeleton variant="list" />);
    skeleton = screen.getByRole('status');
    expect(skeleton.querySelector('.w-12.h-12')).toBeInTheDocument(); // Avatar
    expect(skeleton.querySelector('.h-4')).toBeInTheDocument(); // Text
  });
});