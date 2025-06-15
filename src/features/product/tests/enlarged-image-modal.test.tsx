import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import EnlargedImageModal from '../components/enlarged-image-modal'

const mockImages = [
  { url: 'https://example.com/image1.jpg', label: 'Image 1' },
  { url: 'https://example.com/image2.jpg', label: 'Image 2' },
  { url: 'https://example.com/image3.jpg' }, // no label
]

describe('EnlargedImageModal', () => {
  let onClose: () => void

  beforeEach(() => {
    onClose = vi.fn()
  })

  afterEach(() => {
    cleanup()
    document.body.style.overflow = ''
  })

  it('does not render when isOpen is false', () => {
    render(
      <EnlargedImageModal
        images={mockImages}
        isOpen={false}
        onClose={onClose}
      />,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders correctly when open', () => {
    render(
      <EnlargedImageModal
        images={mockImages}
        isOpen={true}
        onClose={onClose}
      />,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByAltText('Image 1')).toBeInTheDocument()
  })

  it('calls onClose when clicking outside the modal', () => {
    render(
      <EnlargedImageModal
        images={mockImages}
        isOpen={true}
        onClose={onClose}
      />,
    )
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalled()
  })

  it('closes when clicking the close button', () => {
    render(
      <EnlargedImageModal
        images={mockImages}
        isOpen={true}
        onClose={onClose}
      />,
    )
    fireEvent.click(screen.getByLabelText('Close modal'))
    expect(onClose).toHaveBeenCalled()
  })

  it('navigates to next and previous images', () => {
    render(
      <EnlargedImageModal
        images={mockImages}
        isOpen={true}
        onClose={onClose}
      />,
    )

    fireEvent.click(screen.getByLabelText('Next image'))
    expect(screen.getByAltText('Image 2')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Next image'))
    expect(screen.getByAltText('Product view 3')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Previous image'))
    expect(screen.getByAltText('Image 2')).toBeInTheDocument()
  })

  it('navigates using indicator buttons', () => {
    render(
      <EnlargedImageModal
        images={mockImages}
        isOpen={true}
        onClose={onClose}
      />,
    )
    const indicators = screen.getAllByRole('button', { name: /View image/i })

    fireEvent.click(indicators[2])
    expect(screen.getByAltText('Product view 3')).toBeInTheDocument()
  })

  it('disables body scroll when open and restores it on unmount', () => {
    const { unmount } = render(
      <EnlargedImageModal
        images={mockImages}
        isOpen={true}
        onClose={onClose}
      />,
    )

    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('unset')
  })
})
